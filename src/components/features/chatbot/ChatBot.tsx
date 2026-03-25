"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Loader2,
  ArrowRight,
  ExternalLink,
  Mic,
  MicOff,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { localizeHref } from "@/i18n/routing";
import {
  CHAT_MESSAGE_MAX_LENGTH,
  chatMessageSchema,
  type ChatAgentKey,
} from "@/server/schemas/chat";

import { getFallbackAssistantReply } from "@/server/ai/chatbot";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { sanitizeMultilineText } from "@/lib/sanitize";
import { cn } from "@/lib/utils";
import { chatAgentCards, chatAgentOrder } from "@/content/chatAgents";
import { benchReviewer } from "@/content/chatAgents";

const CHAT_REQUEST_TIMEOUT_MS = 20_000;

type SpeechRecognitionConstructor = new () => {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionEventLike = {
  results: ArrayLike<
    ArrayLike<{
      transcript: string;
    }>
  >;
};

type SpeechRecognitionErrorEventLike = {
  error: string;
};

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  agent?: {
    key: ChatAgentKey;
    title: string;
    description: string;
  };
  reviewedBy?: string;
  action?: {
    label: string;
    link: string;
  };
  suggestions?: string[];
  source?: string;
  model?: string;
  degraded?: boolean;
}

type ChatResponse = {
  content: string;
  agent?: ChatAgentKey;
  agentTitle?: string;
  agentDescription?: string;
  reviewedBy?: string;
  source?: string;
  model?: string;
  degraded?: boolean;
  suggestions?: string[];
  action?: {
    label: string;
    link: string;
  };
  error?: string;
};

type AgentMode = "auto" | ChatAgentKey;

function createMessageId() {
  return crypto.randomUUID();
}

function sanitizeChatDraft(value: string) {
  return sanitizeMultilineText(value, { trim: false });
}

function renderInlineContent(content: string, keyPrefix: string) {
  return content
    .split(/(\*\*.*?\*\*|\*.*?\*)/g)
    .filter(Boolean)
    .map((segment, index) => {
      if (segment.startsWith("**") && segment.endsWith("**")) {
        return (
          <strong key={`${keyPrefix}-bold-${index}`} className="font-semibold">
            {segment.slice(2, -2)}
          </strong>
        );
      }

      if (
        segment.startsWith("*") &&
        segment.endsWith("*") &&
        !segment.startsWith("**") &&
        !segment.endsWith("**")
      ) {
        return (
          <em key={`${keyPrefix}-italic-${index}`} className="italic">
            {segment.slice(1, -1)}
          </em>
        );
      }

      return <span key={`${keyPrefix}-text-${index}`}>{segment}</span>;
    });
}

function renderMessageContent(content: string) {
  return content.split("\n\n").map((paragraph, paragraphIndex) => (
    <div
      key={`paragraph-${paragraphIndex}`}
      className={paragraphIndex > 0 ? "mt-4" : undefined}
    >
      {paragraph.split("\n").map((line, lineIndex) => {
        const trimmedLine = line.trim();
        const isBullet = trimmedLine.startsWith("• ");
        const bulletText = isBullet ? trimmedLine.slice(2) : trimmedLine;

        return (
          <div
            key={`line-${paragraphIndex}-${lineIndex}`}
            className={cn(
              "leading-relaxed",
              lineIndex > 0 ? "mt-2" : undefined,
              isBullet ? "flex gap-2" : undefined,
            )}
          >
            {isBullet ? <span aria-hidden>&bull;</span> : null}
            <span>
              {renderInlineContent(
                bulletText,
                `${paragraphIndex}-${lineIndex}`,
              )}
            </span>
          </div>
        );
      })}
    </div>
  ));
}

export function ChatBot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeAgent, setActiveAgent] = useState<AgentMode>("auto");
  const [chatError, setChatError] = useState<string | null>(null);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isDictating, setIsDictating] = useState(false);
  const [dictationStatus, setDictationStatus] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const recognitionRef = useRef<InstanceType<SpeechRecognitionConstructor> | null>(
    null,
  );
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    const recognitionCtor =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    setSpeechSupported(Boolean(recognitionCtor));
  }, []);

  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener("open-chat", handleOpenChat);
    return () => window.removeEventListener("open-chat", handleOpenChat);
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = getFallbackAssistantReply("hello");
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: greeting.content,
          agent: {
            key: greeting.agent,
            title: greeting.agentCard.title,
            description: greeting.agentCard.description,
          },
          reviewedBy: benchReviewer.title,
          suggestions: greeting.suggestions,
          source: "fallback",
          degraded: true,
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    if (!isOpen) {
      setIsDictating(false);
      setDictationStatus(null);
      recognitionRef.current?.stop();
      recognitionRef.current = null;
      lastFocusedElementRef.current?.focus?.();
      return;
    }

    lastFocusedElementRef.current = document.activeElement as HTMLElement | null;

    const timeout = window.setTimeout(() => {
      composerRef.current?.focus();
    }, 20);

    return () => window.clearTimeout(timeout);
  }, [isOpen]);

  function closeChat() {
    setIsOpen(false);
  }

  function handleDialogKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeChat();
      return;
    }

    if (event.key !== "Tab" || !dialogRef.current) {
      return;
    }

    const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
      'button, [href], textarea, input, select, [tabindex]:not([tabindex="-1"])',
    );
    if (focusableElements.length === 0) {
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  function stopDictation() {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsDictating(false);
    setDictationStatus("Dictation stopped.");
  }

  function startDictation() {
    const RecognitionCtor =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!RecognitionCtor) {
      setDictationStatus("Dictation is not supported in this browser.");
      return;
    }

    if (isDictating) {
      stopDictation();
      return;
    }

    const recognition = new RecognitionCtor();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript || "")
        .join(" ");

      setInput((currentInput) =>
        sanitizeChatDraft(
          `${currentInput.trimEnd()}${currentInput.trim() ? " " : ""}${transcript}`.slice(
            0,
            CHAT_MESSAGE_MAX_LENGTH,
          ),
        ),
      );
      setDictationStatus("Dictation captured. Review the message before sending.");
    };

    recognition.onerror = (event) => {
      setDictationStatus(
        event.error === "not-allowed"
          ? "Microphone permission was denied."
          : "Dictation could not be completed.",
      );
      setIsDictating(false);
      recognitionRef.current = null;
    };

    recognition.onend = () => {
      setIsDictating(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    setIsDictating(true);
    setDictationStatus("Listening. Speak your question clearly.");
    recognition.start();
  }

  async function sendMessage(text = input) {
    if (isTyping) {
      return;
    }

    const parsedMessage = chatMessageSchema.safeParse({
      role: "user",
      content: text,
    });

    if (!parsedMessage.success) {
      setChatError(
        `Messages must be between 1 and ${CHAT_MESSAGE_MAX_LENGTH} characters.`,
      );
      return;
    }

    const sanitizedText = parsedMessage.data.content;

    const userMessage: Message = {
      id: createMessageId(),
      role: "user",
      content: sanitizedText,
      timestamp: new Date(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setIsTyping(true);
    setChatError(null);

    try {
      const controller = new AbortController();
      const timeout = window.setTimeout(
        () => controller.abort(),
        CHAT_REQUEST_TIMEOUT_MS,
      );
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          messages: nextMessages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
          agent: activeAgent === "auto" ? undefined : activeAgent,
        }),
      });
      window.clearTimeout(timeout);

      const data = (await response
        .json()
        .catch(() => null)) as ChatResponse | null;

      if (!response.ok) {
        const retryAfter = response.headers.get("Retry-After");
        const message =
          data?.error || `Chat request failed with status ${response.status}.`;
        throw new Error(
          retryAfter
            ? `${message} Please wait about ${retryAfter} seconds and try again.`
            : message,
        );
      }

      if (!data) {
        throw new Error("The assistant returned an empty response.");
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: createMessageId(),
          role: "assistant",
          content: data.content,
          agent:
            data.agent && data.agentTitle && data.agentDescription
              ? {
                  key: data.agent,
                  title: data.agentTitle,
                  description: data.agentDescription,
                }
              : undefined,
          reviewedBy: data.reviewedBy,
          action: data.action,
          suggestions: data.suggestions,
          source: data.source,
          model: data.model,
          degraded: data.degraded,
          timestamp: new Date(),
        },
      ]);

      if (data.degraded || data.source === "fallback") {
        setChatError(
          "AI is temporarily unavailable. Showing general guidance only.",
        );
      }
    } catch (error) {
      console.error("Chat widget error:", error);
      if (error instanceof DOMException && error.name === "AbortError") {
        setChatError(
          "The assistant took too long to respond. Please try again.",
        );
      } else {
        setChatError(
          error instanceof Error
            ? error.message
            : "We could not complete the chat request.",
        );
      }
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-5 right-4 z-50 rounded-full bg-foreground p-3.5 text-background shadow-2xl transition-shadow hover:shadow-3xl sm:bottom-24 sm:right-6 sm:p-4"
            aria-label="Open chat"
            aria-haspopup="dialog"
            aria-controls="mt-chat-dialog"
            ref={triggerButtonRef}
          >
            <MessageCircle size={28} />
            <span className="absolute right-0 top-0 h-4 w-4 rounded-full border-2 border-background bg-green-500 animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 20, scale: 0.95, filter: "blur(10px)" }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="fixed inset-x-3 bottom-5 z-50 flex h-[min(640px,calc(100vh-6.5rem))] flex-col overflow-hidden rounded-2xl border border-white/20 bg-background/80 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-950/80 sm:inset-x-auto sm:bottom-24 sm:right-6 sm:h-[600px] sm:w-[380px] sm:max-w-[calc(100vw-2rem)]"
            id="mt-chat-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mt-chat-title"
            aria-describedby="mt-chat-description"
            onKeyDown={handleDialogKeyDown}
            ref={dialogRef}
          >
            <div className="relative flex shrink-0 items-center justify-between border-b border-border/50 bg-gradient-to-r from-zinc-900 to-zinc-800 p-4 text-white dark:from-zinc-100 dark:to-zinc-300 dark:text-zinc-900 overflow-hidden">
              {/* Subtle ambient glow behind header */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
              <div className="relative z-10 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur-md dark:bg-black/10 dark:ring-black/20">
                  <Bot size={22} className="drop-shadow-sm" />
                </div>
                <div>
                  <h3 id="mt-chat-title" className="font-semibold tracking-tight">
                    M&amp;T Immigration AI
                  </h3>
                  <p className="flex items-center gap-1.5 text-[11px] font-medium text-white/80 dark:text-black/70">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                    </span>
                    Specialist routing + review
                  </p>
                </div>
              </div>
              <button
                onClick={closeChat}
                className="relative z-10 rounded-full p-2 text-white/70 transition-all hover:bg-white/10 hover:text-white dark:text-black/70 dark:hover:bg-black/10 dark:hover:text-black"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>

            <div className="border-b border-border/40 bg-zinc-100/50 p-2 text-center text-[10px] uppercase font-medium tracking-wide text-zinc-500 dark:bg-zinc-900/50 dark:text-zinc-400">
              <p id="mt-chat-description">
                General info only • No attorney-client relationship
              </p>
            </div>

            <div className="shrink-0 border-b border-border bg-card px-3 py-3">
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Route To
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {activeAgent === "auto"
                    ? "Auto-routing by issue"
                    : chatAgentCards[activeAgent].description}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveAgent("auto")}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs transition-all",
                    activeAgent === "auto"
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-muted-foreground hover:border-foreground hover:text-foreground",
                  )}
                >
                  Auto
                </button>
                {chatAgentOrder.map((agentKey) => (
                  <button
                    key={agentKey}
                    type="button"
                    onClick={() => setActiveAgent(agentKey)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs transition-all",
                      activeAgent === agentKey
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground hover:border-foreground hover:text-foreground",
                    )}
                  >
                    {chatAgentCards[agentKey].shortTitle}
                  </button>
                ))}
              </div>
            </div>

            <div
              className="scrollbar-hide flex-1 space-y-5 overflow-y-auto bg-gradient-to-b from-transparent to-muted/20 p-3 sm:space-y-6 sm:p-4"
              role="log"
              aria-live="polite"
              aria-relevant="additions text"
              aria-label="Chat conversation"
            >
              {messages.map((message, idx) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: idx === messages.length - 1 ? 0.1 : 0, duration: 0.3 }}
                  className={cn(
                    "flex flex-col gap-2",
                    message.role === "user" ? "items-end" : "items-start",
                  )}
                >
                  <div
                    className={cn(
                      "flex max-w-[88%] gap-2.5",
                      message.role === "user" ? "flex-row-reverse" : "flex-row",
                    )}
                  >
                    <div
                      className={cn(
                        "mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full shadow-sm ring-1 ring-border/50",
                        message.role === "assistant"
                          ? "bg-gradient-to-br from-zinc-800 to-zinc-950 text-white dark:from-zinc-200 dark:to-zinc-400 dark:text-zinc-950"
                          : "bg-primary text-primary-foreground",
                      )}
                    >
                      {message.role === "assistant" ? (
                        <Bot size={13} />
                      ) : (
                        <User size={13} />
                      )}
                    </div>

                    <div
                      className={cn(
                        "rounded-[20px] p-3.5 text-[13.5px] leading-relaxed shadow-sm",
                        message.role === "user"
                          ? "rounded-tr-sm bg-gradient-to-tr from-zinc-800 to-zinc-900 text-white dark:from-zinc-200 dark:to-zinc-300 dark:text-zinc-950"
                          : "rounded-tl-sm border border-border/40 bg-card/80 backdrop-blur-md text-card-foreground shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]",
                      )}
                    >
                      {message.role === "assistant" && message.agent ? (
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground">
                            {message.agent.title}
                          </span>
                          {message.reviewedBy ? (
                            <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                              {message.reviewedBy}
                            </span>
                          ) : null}
                          {message.degraded ? (
                            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-800">
                              General guidance only
                            </span>
                          ) : null}
                        </div>
                      ) : null}

                      {renderMessageContent(message.content)}

                      {message.role === "assistant" &&
                      (message.source || message.model) ? (
                        <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                          {message.source ? (
                            <span className="rounded-full bg-muted px-2 py-1">
                              {message.source}
                            </span>
                          ) : null}
                          {message.model ? (
                            <span className="rounded-full bg-muted px-2 py-1">
                              {message.model}
                            </span>
                          ) : null}
                        </div>
                      ) : null}

                      {message.action ? (
                        <div className="mt-3 border-t border-border/10 pt-3">
                          <Button
                            asChild
                            size="sm"
                            variant="secondary"
                            className="h-8 w-full bg-zinc-900 text-xs text-white shadow-sm transition-all hover:bg-zinc-800 hover:shadow-md dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
                          >
                            <Link
                              href={localizeHref(pathname, message.action.link)}
                              onClick={() => setIsOpen(false)}
                            >
                              {message.action.label}{" "}
                              <ExternalLink size={10} className="ml-2 opacity-70" />
                            </Link>
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {message.role === "assistant" && message.suggestions ? (
                    <div className="ml-9 flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion) => (
                        <button
                          key={`${message.id}-${suggestion}`}
                          onClick={() => sendMessage(suggestion)}
                          className="rounded-full border border-border/50 bg-card/60 px-3 py-1.5 text-[11px] font-medium text-muted-foreground shadow-sm backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-foreground/20 hover:bg-background hover:text-foreground hover:shadow-md active:translate-y-0"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </motion.div>
              ))}

              {isTyping ? (
                <motion.div
                  initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  className="flex items-end gap-2.5"
                >
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-zinc-800 to-zinc-950 text-white shadow-sm ring-1 ring-border/50 dark:from-zinc-200 dark:to-zinc-400 dark:text-zinc-950">
                    <Bot size={13} />
                  </div>
                  <div className="rounded-[20px] rounded-bl-sm border border-border/40 bg-card/80 p-3.5 shadow-sm backdrop-blur-md">
                    <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/70">
                      {activeAgent === "auto"
                        ? `Routing & Reviewing`
                        : `${chatAgentCards[activeAgent].title} responding`}
                    </div>
                    <div className="flex items-center gap-1.5 py-1">
                      <motion.span
                        animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0 }}
                        className="h-1.5 w-1.5 rounded-full bg-foreground/40"
                      />
                      <motion.span
                        animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
                        className="h-1.5 w-1.5 rounded-full bg-foreground/40"
                      />
                      <motion.span
                        animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                        className="h-1.5 w-1.5 rounded-full bg-foreground/40"
                      />
                    </div>
                  </div>
                </motion.div>
              ) : null}

              <div ref={messagesEndRef} className="h-2" />
            </div>

            <div className="shrink-0 border-t border-border/40 bg-card/60 p-4 backdrop-blur-xl">
              {chatError ? (
                <div
                  className="mb-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900"
                  role="status"
                  aria-live="polite"
                >
                  {chatError}
                </div>
              ) : null}
              {dictationStatus ? (
                <div
                  className="mb-3 rounded-xl border border-muted bg-muted/30 px-3 py-2 text-sm text-foreground backdrop-blur-sm"
                  role="status"
                  aria-live="polite"
                >
                  {dictationStatus}
                </div>
              ) : null}
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  void sendMessage();
                }}
                className="relative flex items-end gap-2 rounded-2xl border border-border/60 bg-background/50 p-1.5 shadow-sm ring-1 ring-transparent transition-all focus-within:ring-border/80 hover:border-border/80"
              >
                <label htmlFor="chat-composer" className="sr-only">
                  Ask an immigration question
                </label>
                <Textarea
                  ref={composerRef}
                  id="chat-composer"
                  value={input}
                  onChange={(event) =>
                    setInput(sanitizeChatDraft(event.target.value))
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      void sendMessage();
                    }
                  }}
                  maxLength={CHAT_MESSAGE_MAX_LENGTH}
                  placeholder="Ask about visas, green cards or deadlines..."
                  className="min-h-[44px] max-h-[120px] flex-1 resize-none border-0 bg-transparent px-3 py-2.5 text-sm shadow-none focus-visible:ring-0"
                  disabled={isTyping || isDictating}
                  aria-describedby="chat-composer-meta"
                />
                <div className="flex shrink-0 items-center gap-1.5 pb-1 pr-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={startDictation}
                    disabled={!speechSupported || isTyping}
                    aria-label={
                      isDictating
                        ? "Stop dictation"
                        : speechSupported
                          ? "Start dictation"
                          : "Dictation is not supported in this browser"
                    }
                    className="h-8 w-8 rounded-full text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  >
                    {isDictating ? (
                      <MicOff size={16} className="animate-pulse text-red-500" />
                    ) : (
                      <Mic size={16} />
                    )}
                  </Button>
                  <Button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    size="icon"
                    aria-label="Send message"
                    className={cn(
                      "h-8 w-8 rounded-full transition-all duration-300",
                      input.trim()
                        ? "bg-zinc-900 text-white shadow-md hover:scale-105 dark:bg-zinc-100 dark:text-zinc-900"
                        : "bg-muted text-muted-foreground opacity-50"
                    )}
                  >
                    {isTyping ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <Send size={14} className={cn(input.trim() && "translate-x-[1px]")} />
                    )}
                  </Button>
                </div>
              </form>
              <div
                id="chat-composer-meta"
                className="mt-2.5 flex items-center justify-between gap-3 px-1 text-[10px] text-muted-foreground/70 tracking-wide"
              >
                <span>
                  Enter to send, Shift + Enter for gap.
                </span>
                <span>{input.length}/{CHAT_MESSAGE_MAX_LENGTH}</span>
              </div>
              <div className="mt-2 text-center">
                <Link
                  href={localizeHref(pathname, "/#contact")}
                  onClick={closeChat}
                  className="inline-flex items-center gap-1 text-[10px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  Ready to proceed? Request a case review{" "}
                  <ArrowRight size={8} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
