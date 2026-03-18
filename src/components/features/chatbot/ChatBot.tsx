'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Loader2,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import {
  CHAT_MESSAGE_MAX_LENGTH,
  chatMessageSchema,
  type ChatAgentKey,
} from '@/server/schemas/chat';

import { getFallbackAssistantReply } from '@/server/ai/chatbot';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { sanitizeSingleLineText } from '@/lib/sanitize';
import { cn } from '@/lib/utils';
import { chatAgentCards, chatAgentOrder } from '@/content/chatAgents';
import { benchReviewer } from '@/content/chatAgents';

const CHAT_REQUEST_TIMEOUT_MS = 20_000;

interface Message {
  id: string;
  role: 'user' | 'assistant';
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

type AgentMode = 'auto' | ChatAgentKey;

function createMessageId() {
  return crypto.randomUUID();
}

function sanitizeChatDraft(value: string) {
  return sanitizeSingleLineText(value, { trim: false });
}

function renderInlineContent(content: string, keyPrefix: string) {
  return content
    .split(/(\*\*.*?\*\*|\*.*?\*)/g)
    .filter(Boolean)
    .map((segment, index) => {
      if (segment.startsWith('**') && segment.endsWith('**')) {
        return (
          <strong key={`${keyPrefix}-bold-${index}`} className="font-semibold">
            {segment.slice(2, -2)}
          </strong>
        );
      }

      if (
        segment.startsWith('*') &&
        segment.endsWith('*') &&
        !segment.startsWith('**') &&
        !segment.endsWith('**')
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
  return content.split('\n\n').map((paragraph, paragraphIndex) => (
    <div key={`paragraph-${paragraphIndex}`} className={paragraphIndex > 0 ? 'mt-4' : undefined}>
      {paragraph.split('\n').map((line, lineIndex) => {
        const trimmedLine = line.trim();
        const isBullet = trimmedLine.startsWith('• ');
        const bulletText = isBullet ? trimmedLine.slice(2) : trimmedLine;

        return (
          <div
            key={`line-${paragraphIndex}-${lineIndex}`}
            className={cn(
              'leading-relaxed',
              lineIndex > 0 ? 'mt-2' : undefined,
              isBullet ? 'flex gap-2' : undefined,
            )}
          >
            {isBullet ? <span aria-hidden>&bull;</span> : null}
            <span>{renderInlineContent(bulletText, `${paragraphIndex}-${lineIndex}`)}</span>
          </div>
        );
      })}
    </div>
  ));
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeAgent, setActiveAgent] = useState<AgentMode>('auto');
  const [chatError, setChatError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener('open-chat', handleOpenChat);
    return () => window.removeEventListener('open-chat', handleOpenChat);
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = getFallbackAssistantReply('hello');
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: greeting.content,
          agent: {
            key: greeting.agent,
            title: greeting.agentCard.title,
            description: greeting.agentCard.description,
          },
          reviewedBy: benchReviewer.title,
          suggestions: greeting.suggestions,
          source: 'fallback',
          degraded: true,
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, messages.length]);

  async function sendMessage(text = input) {
    if (isTyping) {
      return;
    }

    const parsedMessage = chatMessageSchema.safeParse({
      role: 'user',
      content: text,
    });

    if (!parsedMessage.success) {
      setChatError(`Messages must be between 1 and ${CHAT_MESSAGE_MAX_LENGTH} characters.`);
      return;
    }

    const sanitizedText = parsedMessage.data.content;

    const userMessage: Message = {
      id: createMessageId(),
      role: 'user',
      content: sanitizedText,
      timestamp: new Date(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setIsTyping(true);
    setChatError(null);

    try {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), CHAT_REQUEST_TIMEOUT_MS);
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          messages: nextMessages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
          agent: activeAgent === 'auto' ? undefined : activeAgent,
        }),
      });
      window.clearTimeout(timeout);

      const data = (await response.json().catch(() => null)) as ChatResponse | null;

      if (!response.ok) {
        const retryAfter = response.headers.get('Retry-After');
        const message = data?.error || `Chat request failed with status ${response.status}.`;
        throw new Error(
          retryAfter ? `${message} Please wait about ${retryAfter} seconds and try again.` : message,
        );
      }

      if (!data) {
        throw new Error('The assistant returned an empty response.');
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: createMessageId(),
          role: 'assistant',
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

      if (data.degraded || data.source === 'fallback') {
        setChatError('AI is temporarily unavailable. Showing general guidance only.');
      }
    } catch (error) {
      console.error('Chat widget error:', error);
      if (error instanceof DOMException && error.name === 'AbortError') {
        setChatError('The assistant took too long to respond. Please try again.');
      } else {
        setChatError(
          error instanceof Error ? error.message : 'We could not complete the chat request.',
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
          >
            <MessageCircle size={28} />
            <span className="absolute right-0 top-0 h-4 w-4 rounded-full border-2 border-background bg-green-500 animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed inset-x-3 bottom-5 z-50 flex h-[min(640px,calc(100vh-6.5rem))] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl sm:inset-x-auto sm:bottom-24 sm:right-6 sm:h-[600px] sm:w-[380px] sm:max-w-[calc(100vw-2rem)]"
          >
            <div className="flex shrink-0 items-center justify-between bg-foreground p-4 text-background">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background/20">
                  <Bot size={22} />
                </div>
                <div>
                  <h3 className="font-semibold">M&amp;T Immigration AI</h3>
                  <p className="flex items-center gap-1 text-xs text-background/70">
                    <span className="h-2 w-2 rounded-full bg-green-400" />
                    Specialist routing + review
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-2 transition-colors hover:bg-background/10"
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>

            <div className="border-b border-border bg-secondary/50 p-2 text-center text-[10px] text-muted-foreground">
              General information only. No attorney-client relationship is created in chat.
            </div>

            <div className="shrink-0 border-b border-border bg-white px-3 py-3">
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Route To
                </p>
                <p className="text-[11px] text-zinc-400">
                  {activeAgent === 'auto'
                    ? 'Auto-routing by issue'
                    : chatAgentCards[activeAgent].description}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveAgent('auto')}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-xs transition-all',
                    activeAgent === 'auto'
                      ? 'border-zinc-900 bg-zinc-900 text-white'
                      : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400 hover:text-black',
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
                      'rounded-full border px-3 py-1.5 text-xs transition-all',
                      activeAgent === agentKey
                        ? 'border-zinc-900 bg-zinc-900 text-white'
                        : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400 hover:text-black',
                    )}
                  >
                    {chatAgentCards[agentKey].shortTitle}
                  </button>
                ))}
              </div>
            </div>

            <div className="scrollbar-hide flex-1 space-y-5 overflow-y-auto bg-zinc-50/50 p-3 sm:space-y-6 sm:p-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'flex flex-col gap-2',
                    message.role === 'user' ? 'items-end' : 'items-start',
                  )}
                >
                  <div
                    className={cn(
                      'flex max-w-[85%] gap-2',
                      message.role === 'user' ? 'flex-row-reverse' : 'flex-row',
                    )}
                  >
                    <div
                      className={cn(
                        'mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full',
                        message.role === 'assistant'
                          ? 'bg-foreground text-background'
                          : 'bg-black text-white',
                      )}
                    >
                      {message.role === 'assistant' ? <Bot size={14} /> : <User size={14} />}
                    </div>

                    <div
                      className={cn(
                        'rounded-2xl p-3.5 text-sm leading-relaxed shadow-sm',
                        message.role === 'user'
                          ? 'rounded-br-sm bg-black text-white'
                          : 'rounded-bl-sm border border-border bg-white text-foreground',
                      )}
                    >
                      {message.role === 'assistant' && message.agent ? (
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-900">
                            {message.agent.title}
                          </span>
                          {message.reviewedBy ? (
                            <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
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

                      {message.role === 'assistant' && (message.source || message.model) ? (
                        <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-zinc-400">
                          {message.source ? (
                            <span className="rounded-full bg-zinc-100 px-2 py-1">
                              {message.source}
                            </span>
                          ) : null}
                          {message.model ? (
                            <span className="rounded-full bg-zinc-100 px-2 py-1">
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
                            className="h-8 w-full bg-foreground text-xs text-background hover:bg-foreground/90"
                          >
                            <Link href={message.action.link} onClick={() => setIsOpen(false)}>
                              {message.action.label}{' '}
                              <ExternalLink size={10} className="ml-2" />
                            </Link>
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {message.role === 'assistant' && message.suggestions ? (
                    <div className="ml-10 flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion) => (
                        <button
                          key={`${message.id}-${suggestion}`}
                          onClick={() => sendMessage(suggestion)}
                          className="rounded-full border border-border bg-white px-3 py-1.5 text-xs text-zinc-600 shadow-sm transition-all hover:border-zinc-400 hover:bg-zinc-100 hover:text-black"
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
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background">
                    <Bot size={14} />
                  </div>
                  <div className="rounded-2xl rounded-bl-sm border border-border bg-white p-3 shadow-sm">
                    <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                      {activeAgent === 'auto'
                        ? `Routing to the best specialist, then ${benchReviewer.title}`
                        : `${chatAgentCards[activeAgent].title} responding`}
                    </div>
                    <div className="flex gap-1">
                      <span
                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400"
                        style={{ animationDelay: '0ms' }}
                      />
                      <span
                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400"
                        style={{ animationDelay: '150ms' }}
                      />
                      <span
                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400"
                        style={{ animationDelay: '300ms' }}
                      />
                    </div>
                  </div>
                </motion.div>
              ) : null}

              <div ref={messagesEndRef} />
            </div>

            <div className="shrink-0 border-t border-border bg-white p-4">
              {chatError ? (
                <div
                  className="mb-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900"
                  role="status"
                  aria-live="polite"
                >
                  {chatError}
                </div>
              ) : null}
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  void sendMessage();
                }}
                className="flex gap-2"
              >
                <label htmlFor="chat-composer" className="sr-only">
                  Ask an immigration question
                </label>
                <Input
                  id="chat-composer"
                  value={input}
                  onChange={(event) => setInput(sanitizeChatDraft(event.target.value))}
                  maxLength={CHAT_MESSAGE_MAX_LENGTH}
                  placeholder="Ask about visas, green cards, or urgent deadlines..."
                  className="flex-1 border-zinc-200 bg-zinc-50 focus-visible:ring-zinc-600"
                  disabled={isTyping}
                />
                <Button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  size="icon"
                  aria-label="Send message"
                  className="shrink-0 rounded-xl bg-black text-white shadow-md hover:bg-zinc-800"
                >
                  {isTyping ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
                </Button>
              </form>
              <div className="mt-2 text-center">
                <Link
                  href="/#contact"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center gap-1 text-[10px] text-zinc-400 transition-colors hover:text-black"
                >
                  Ready to proceed? Request a case review <ArrowRight size={8} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
