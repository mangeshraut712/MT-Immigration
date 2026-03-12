"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Bot,
  Copy,
  Mic,
  MicOff,
  MessageSquare,
  Send,
  Sparkles,
  Trash2,
  User,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  assistantAgents,
  assistantAgentMap,
  isAssistantAgentId,
  type AssistantAgentId,
} from "@/lib/assistant-agents"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  responseId?: string
}

type OpenChatDetail = {
  agent?: AssistantAgentId
  message?: string
  draft?: string
}

type BrowserSpeechRecognitionAlternative = {
  transcript: string
}

type BrowserSpeechRecognitionResult = {
  isFinal: boolean
  0: BrowserSpeechRecognitionAlternative
}

type BrowserSpeechRecognitionEvent = {
  resultIndex: number
  results: ArrayLike<BrowserSpeechRecognitionResult>
}

type BrowserSpeechRecognitionErrorEvent = {
  error: string
}

type BrowserSpeechRecognition = {
  continuous: boolean
  interimResults: boolean
  lang: string
  onstart: (() => void) | null
  onend: (() => void) | null
  onresult: ((event: BrowserSpeechRecognitionEvent) => void) | null
  onerror: ((event: BrowserSpeechRecognitionErrorEvent) => void) | null
  start: () => void
  stop: () => void
  abort: () => void
}

type BrowserSpeechRecognitionConstructor = new () => BrowserSpeechRecognition

declare global {
  interface Window {
    SpeechRecognition?: BrowserSpeechRecognitionConstructor
    webkitSpeechRecognition?: BrowserSpeechRecognitionConstructor
  }
}

const orderedAgents = [...assistantAgents].sort((left, right) => left.sortOrder - right.sortOrder)

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2 rounded-full bg-primary gpu-accelerated"
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            delay: i * 0.12,
            ease: [0.4, 0, 0.2, 1],
          }}
          style={{ willChange: "transform" }}
        />
      ))}
    </div>
  )
}

function createAssistantMessage(agent: AssistantAgentId): Message {
  return {
    id: `${agent}-welcome`,
    role: "assistant",
    content: assistantAgentMap[agent].welcome,
    timestamp: new Date(),
  }
}

function isWelcomeMessage(message: Message, agent: AssistantAgentId) {
  return message.id === `${agent}-welcome`
}

function getWelcomeCapabilities(agent: AssistantAgentId) {
  return assistantAgentMap[agent].capabilityBullets.slice(0, 2)
}

function getWelcomeQuickActions(agent: AssistantAgentId) {
  return assistantAgentMap[agent].quickActions.slice(0, 3)
}

function renderMarkdown(text: string) {
  if (!text) return null
  
  // Split by bold (**text**) and links ([text](url))
  const parts = text.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g)
  
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-semibold text-foreground/90">
          {part.slice(2, -2)}
        </strong>
      )
    }
    
    const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/)
    if (linkMatch) {
      return (
        <a 
          key={index} 
          href={linkMatch[2]} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-primary hover:underline font-medium underline-offset-2"
        >
          {linkMatch[1]}
        </a>
      )
    }
    
    // For normal text strings, split by line breaks to render properly
    return <span key={index}>{part}</span>
  })
}
export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<AssistantAgentId>("portfolio")
  const [messages, setMessages] = useState<Message[]>([createAssistantMessage("portfolio")])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isDictationSupported, setIsDictationSupported] = useState(false)
  const [dictationError, setDictationError] = useState<string | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)

  const activeAgent = assistantAgentMap[selectedAgent]
  const hasOnlyWelcomeMessage =
    messages.length === 1 && isWelcomeMessage(messages[0], selectedAgent)

  useEffect(() => {
    if (hasOnlyWelcomeMessage) {
      scrollContainerRef.current?.scrollTo({ top: 0, behavior: "auto" })
      return
    }

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [hasOnlyWelcomeMessage, messages, isTyping])

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const Recognition =
      window.SpeechRecognition ?? window.webkitSpeechRecognition

    if (!Recognition) {
      return
    }

    const recognition = new Recognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.onstart = () => {
      setDictationError(null)
      setIsListening(true)
    }
    recognition.onend = () => {
      setIsListening(false)
    }
    recognition.onresult = (event) => {
      let transcript = ""

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index]

        if (result.isFinal) {
          transcript += result[0]?.transcript ?? ""
        }
      }

      const normalizedTranscript = transcript.trim()

      if (!normalizedTranscript) {
        return
      }

      setInput((previous) =>
        previous.trim() ? `${previous.trim()} ${normalizedTranscript}` : normalizedTranscript
      )
      inputRef.current?.focus()
    }
    recognition.onerror = (event) => {
      setIsListening(false)
      setDictationError(
        event.error === "not-allowed"
          ? "Microphone access is blocked. Allow mic access to use free dictation."
          : "Free browser dictation is unavailable right now."
      )
    }

    recognitionRef.current = recognition
    setIsDictationSupported(true)

    return () => {
      recognition.onstart = null
      recognition.onend = null
      recognition.onresult = null
      recognition.onerror = null
      recognition.abort()
      recognitionRef.current = null
    }
  }, [])

  const resetConversation = (agent: AssistantAgentId) => {
    setMessages([createAssistantMessage(agent)])
    setInput("")
    setIsTyping(false)
    setDictationError(null)
    setIsListening(false)
    recognitionRef.current?.stop()
  }

  const handleAgentChange = (agent: AssistantAgentId) => {
    setSelectedAgent(agent)
    resetConversation(agent)
  }

  const handleSend = useCallback(async (messageText?: string, forcedAgent?: AssistantAgentId) => {
    const text = (messageText ?? input).trim()
    if (!text) return

    const agent = forcedAgent ?? selectedAgent
    const latestMessages =
      forcedAgent && forcedAgent !== selectedAgent
        ? [createAssistantMessage(agent)]
        : messages

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    }

    setMessages((prev) =>
      forcedAgent && forcedAgent !== selectedAgent
        ? [createAssistantMessage(agent), userMessage]
        : [...prev, userMessage]
    )
    setInput("")
    setIsTyping(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agent,
          previousResponseId:
            forcedAgent && forcedAgent !== selectedAgent
              ? undefined
              : [...latestMessages].reverse().find((message) => message.role === "assistant")?.responseId,
          messages: [
            ...latestMessages.slice(-6).map((message) => ({
              role: message.role,
              content: message.content,
            })),
            { role: "user", content: text },
          ],
        }),
      })

      if (!response.ok) {
        throw new Error("API request failed")
      }

      const data = await response.json()

      const aiMessage: Message = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        content: data.response || "I’m having trouble connecting right now. Please try again.",
        timestamp: new Date(),
        responseId: typeof data.responseId === "string" ? data.responseId : undefined,
      }

      setSelectedAgent(agent)
      setMessages((prev) =>
        forcedAgent && forcedAgent !== selectedAgent
          ? [createAssistantMessage(agent), userMessage, aiMessage]
          : [...prev, aiMessage]
      )
    } catch (error) {
      console.error("Chat error:", error)

      const aiMessage: Message = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        content:
          "I’m currently having trouble connecting. Please try again later, or contact Vidya directly at vidyaraut17297@gmail.com.",
        timestamp: new Date(),
      }

      setMessages((prev) =>
        forcedAgent && forcedAgent !== selectedAgent
          ? [createAssistantMessage(agent), userMessage, aiMessage]
          : [...prev, aiMessage]
      )
    } finally {
      setIsTyping(false)
    }
  }, [input, messages, selectedAgent])

  useEffect(() => {
    const handleOpen = (event: Event) => {
      const detail = (event as CustomEvent<OpenChatDetail>).detail
      if (detail.agent && isAssistantAgentId(detail.agent)) {
        setSelectedAgent(detail.agent)
        setMessages([createAssistantMessage(detail.agent)])
        setIsTyping(false)
        setCopiedMessageId(null)
        setDictationError(null)
        setIsListening(false)
        recognitionRef.current?.stop()
      }
      setIsOpen(true)

      if (detail.draft) {
        setInput(detail.draft)
      }

      window.setTimeout(() => {
        scrollContainerRef.current?.scrollTo({ top: 0, behavior: "auto" })
        inputRef.current?.focus()
      }, 0)

      if (detail.message) {
        setTimeout(() => {
          void handleSend(
            detail.message,
            detail.agent && isAssistantAgentId(detail.agent) ? detail.agent : undefined
          )
        }, 120)
      }
    }

    window.addEventListener("portfolio-chat:open", handleOpen as EventListener)
    return () => window.removeEventListener("portfolio-chat:open", handleOpen as EventListener)
  }, [handleSend])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      void handleSend()
    }
  }

  const copyMessage = async (message: Message) => {
    await navigator.clipboard.writeText(message.content)
    setCopiedMessageId(message.id)
    window.setTimeout(() => setCopiedMessageId(null), 1500)
  }

  const toggleDictation = () => {
    const recognition = recognitionRef.current

    if (!recognition) {
      return
    }

    setDictationError(null)

    if (isListening) {
      recognition.stop()
      return
    }

    recognition.lang =
      selectedAgent === "puzzle"
        ? "mr-IN"
        : window.navigator.language || "en-IN"

    try {
      recognition.start()
    } catch {
      recognition.stop()
    }
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-4 left-3 right-3 top-20 w-auto sm:bottom-6 sm:left-auto sm:right-6 sm:top-24 sm:w-[420px] md:w-[460px]"
            style={{ position: "fixed", zIndex: 99998, isolation: "isolate" }}
          >
            <div className="surface-premium flex h-full min-h-0 flex-col overflow-hidden rounded-[2rem] shadow-sm border border-border/60 bg-background">
              <div className="border-b border-border/60 bg-foreground px-3 py-3 text-background sm:px-4 sm:py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <div className="shrink-0 rounded-2xl border border-background/20 bg-background/20 p-1.5 sm:p-2">
                      <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold leading-5 sm:text-base">AI Agent Desk</h3>
                      <p className="mt-1 max-w-[18rem] text-[11px] leading-5 text-background/78 sm:max-w-none sm:text-xs line-clamp-2">
                        {activeAgent.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl text-background hover:bg-background/20"
                      onClick={() => resetConversation(selectedAgent)}
                      title="Clear chat"
                    >
                      <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl text-background hover:bg-background/20"
                      onClick={() => setIsOpen(false)}
                      aria-label="Close chat"
                      title="Close chat"
                    >
                      <X className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5 sm:gap-2">
                  {orderedAgents.map((agent) => (
                    <button
                      key={agent.id}
                      onClick={() => handleAgentChange(agent.id)}
                      className={cn(
                        "rounded-full border px-2.5 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-medium transition-colors",
                        selectedAgent === agent.id
                          ? "border-background/40 bg-background/20 text-background"
                          : "border-background/15 bg-background/10 text-background/80 hover:bg-background/15"
                      )}
                    >
                      {agent.shortName}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex min-h-0 flex-1 flex-col">
                <div
                  ref={scrollContainerRef}
                  className="flex-1 shrink-0 space-y-4 overflow-y-auto p-3 sm:p-4"
                >
                  {hasOnlyWelcomeMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-[1.75rem] border border-border/70 bg-background px-4 py-4 shadow-sm sm:px-5 sm:py-5"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-sm sm:h-11 sm:w-11">
                          <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                            Welcome
                          </p>
                          <h4 className="mt-2 font-display text-2xl leading-none text-foreground sm:text-3xl">
                            {activeAgent.name}
                          </h4>
                          <p className="mt-3 text-[14px] leading-7 text-foreground/80 sm:text-[15px] sm:leading-8">
                            {activeAgent.welcome}
                          </p>
                          <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            {getWelcomeCapabilities(selectedAgent).map((bullet) => (
                              <div
                                key={bullet}
                                className="rounded-2xl border border-primary/10 bg-primary/5 px-4 py-3 text-sm leading-6 text-foreground/80"
                              >
                                {bullet}
                              </div>
                            ))}
                          </div>
                          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                            Choose a quick action below or type your own question.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {messages
                    .filter((message) => !isWelcomeMessage(message, selectedAgent))
                    .map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className={cn(
                        "flex w-full gap-3",
                        message.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      {message.role === "assistant" && (
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
                          <Bot className="h-5 w-5" />
                        </div>
                      )}

                      <div
                        className={cn(
                          "max-w-[85%] rounded-2xl p-3.5 text-sm shadow-sm",
                          message.role === "user"
                            ? "rounded-br-sm bg-foreground text-background"
                            : "rounded-bl-sm border border-border/60 bg-background text-foreground"
                        )}
                      >
                        <div className="whitespace-pre-wrap leading-relaxed space-y-1.5">{message.role === "user" ? message.content : renderMarkdown(message.content)}</div>
                        <p
                          className={cn(
                            "mt-2 text-[10px] opacity-60",
                            message.role === "user" ? "text-right" : "text-left"
                          )}
                        >
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        {message.role === "assistant" && (
                          <button
                            type="button"
                            onClick={() => void copyMessage(message)}
                            className="mt-2 inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-primary"
                          >
                            <Copy className="h-3 w-3" />
                            {copiedMessageId === message.id ? "Copied" : "Copy"}
                          </button>
                        )}
                      </div>

                      {message.role === "user" && (
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border/50 bg-secondary text-foreground shadow-sm">
                          <User className="h-5 w-5" />
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex w-full gap-3"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-foreground text-background shadow-sm">
                        <Bot className="h-5 w-5" />
                      </div>
                      <div className="rounded-2xl rounded-bl-sm border border-border/60 bg-background">
                        <TypingDots />
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                <AnimatePresence>
                  {hasOnlyWelcomeMessage && !isTyping && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden px-4 pb-3"
                    >
                      <p className="mb-2 text-xs font-medium text-muted-foreground">
                        Try one of these:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {getWelcomeQuickActions(selectedAgent).map((action) => (
                          <button
                            key={action}
                            onClick={() => void handleSend(action)}
                            className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs text-primary transition-all duration-200 hover:scale-105 hover:bg-primary/20"
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="border-t border-border bg-background p-4 dark:bg-background">
                  {selectedAgent === "puzzle" && (
                    <div className="mb-3 rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3 text-xs leading-6 text-foreground/80">
                      Paste a clue, puzzle text, or your guessed answer. The helper will start with
                      hints unless you explicitly ask for the direct solution.
                    </div>
                  )}
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                    <p>
                      Don&apos;t want to type? Use free browser dictation in Chrome or Edge.
                    </p>
                    {dictationError && (
                      <span className="rounded-full border border-destructive/20 bg-destructive/5 px-3 py-1 text-destructive">
                        {dictationError}
                      </span>
                    )}
                  </div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      void handleSend()
                    }}
                    className="flex gap-3"
                  >
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={activeAgent.placeholder}
                      rows={1}
                      className="flex-1 resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground/50 transition-all"
                    />
                    {isDictationSupported && (
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        disabled={isTyping}
                        onClick={toggleDictation}
                        className={cn(
                          "h-11 w-11 rounded-xl",
                          isListening && "border-primary bg-primary/10 text-primary"
                        )}
                        title="Free dictation"
                        aria-label={isListening ? "Stop dictation" : "Start dictation"}
                      >
                        {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                      </Button>
                    )}
                    <Button
                      type="submit"
                      size="default"
                      disabled={!input.trim() || isTyping}
                      className="h-11 min-w-[96px] rounded-xl bg-foreground px-4 text-background shadow-sm transition-all hover:opacity-90 disabled:opacity-50"
                      aria-label="Send message"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">Send</span>
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background shadow-lg transition-all duration-300 hover:shadow-xl sm:bottom-6 sm:right-6 sm:h-14 sm:w-14"
          style={{ position: "fixed", zIndex: 99999, isolation: "isolate" }}
          aria-label="Toggle chat"
        >
          <motion.span
            initial={false}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />
          </motion.span>
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-background bg-green-500 text-[10px] font-bold shadow-md">
            3
          </span>
        </motion.button>
      )}
    </>
  )
}
