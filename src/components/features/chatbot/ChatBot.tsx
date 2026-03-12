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

import { getFallbackAssistantReply } from '@/server/ai/chatbot';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  action?: {
    label: string;
    link: string;
  };
  suggestions?: string[];
}

type ChatResponse = {
  content: string;
  suggestions?: string[];
  action?: {
    label: string;
    link: string;
  };
};

function createMessageId() {
  return crypto.randomUUID();
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
          suggestions: greeting.suggestions,
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, messages.length]);

  async function sendMessage(text = input) {
    const trimmedText = text.trim();
    if (!trimmedText || isTyping) {
      return;
    }

    const userMessage: Message = {
      id: createMessageId(),
      role: 'user',
      content: trimmedText,
      timestamp: new Date(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: nextMessages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Chat request failed with status ${response.status}`);
      }

      const data = (await response.json()) as ChatResponse;

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: createMessageId(),
          role: 'assistant',
          content: data.content,
          action: data.action,
          suggestions: data.suggestions,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error('Chat widget error:', error);

      const fallback = getFallbackAssistantReply(trimmedText);
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: createMessageId(),
          role: 'assistant',
          content: fallback.content,
          action: fallback.action,
          suggestions: fallback.suggestions,
          timestamp: new Date(),
        },
      ]);
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
            className="fixed bottom-24 right-6 z-50 rounded-full bg-foreground p-4 text-background shadow-2xl transition-shadow hover:shadow-3xl"
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
            className="fixed bottom-24 right-6 z-50 flex h-[600px] max-h-[calc(100vh-8rem)] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
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
                    Secure legal intake assistant
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

            <div className="scrollbar-hide flex-1 space-y-6 overflow-y-auto bg-zinc-50/50 p-4">
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
                          : 'bg-blue-600 text-white',
                      )}
                    >
                      {message.role === 'assistant' ? <Bot size={14} /> : <User size={14} />}
                    </div>

                    <div
                      className={cn(
                        'rounded-2xl p-3.5 text-sm leading-relaxed shadow-sm',
                        message.role === 'user'
                          ? 'rounded-br-sm bg-blue-600 text-white'
                          : 'rounded-bl-sm border border-border bg-white text-foreground',
                      )}
                    >
                      {renderMessageContent(message.content)}

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
                          className="rounded-full border border-border bg-white px-3 py-1.5 text-xs text-zinc-600 shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
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
                  <div className="flex gap-1 rounded-2xl rounded-bl-sm border border-border bg-white p-3 shadow-sm">
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
                </motion.div>
              ) : null}

              <div ref={messagesEndRef} />
            </div>

            <div className="shrink-0 border-t border-border bg-white p-4">
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  void sendMessage();
                }}
                className="flex gap-2"
              >
                <Input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask about visas, green cards, or urgent deadlines..."
                  className="flex-1 border-zinc-200 bg-zinc-50 focus-visible:ring-blue-600"
                  disabled={isTyping}
                />
                <Button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  size="icon"
                  className="shrink-0 rounded-xl bg-blue-600 text-white shadow-md hover:bg-blue-700"
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
                  href="#contact"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center gap-1 text-[10px] text-zinc-400 transition-colors hover:text-blue-600"
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
