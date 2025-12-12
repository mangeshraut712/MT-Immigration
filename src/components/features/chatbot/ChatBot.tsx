'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Loader2, ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { detectIntent, LEGAL_KNOWLEDGE_BASE } from '@/data/legalKnowledgeBase';

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

export function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Send initial greeting when chat opens
    useEffect(() => {
        const handleOpenChat = () => setIsOpen(true);
        window.addEventListener('open-chat', handleOpenChat);
        return () => window.removeEventListener('open-chat', handleOpenChat);
    }, []);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{
                id: 'welcome',
                role: 'assistant',
                content: LEGAL_KNOWLEDGE_BASE.greeting.text,
                suggestions: LEGAL_KNOWLEDGE_BASE.greeting.suggestions,
                timestamp: new Date()
            }]);
        }
    }, [isOpen, messages.length]);

    const sendMessage = async (text: string = input) => {
        if (!text.trim()) return;

        const userMessage: Message = {
            // eslint-disable-next-line react-hooks/purity
            id: Math.random().toString(36).substring(7),
            role: 'user',
            content: text,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        // Simulate typing delay for more natural feel
        await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 500));

        // Get Intelligent Response
        const intent = detectIntent(text);
        const data = LEGAL_KNOWLEDGE_BASE[intent];

        const assistantMessage: Message = {
            // eslint-disable-next-line react-hooks/purity
            id: Math.random().toString(36).substring(7),
            role: 'assistant',
            content: data.text,
            action: data.action,
            suggestions: data.suggestions,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
    };

    // Parse markdown-style formatting
    const formatMessage = (content: string) => {
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/•/g, '<br/>•')
            .replace(/\n\n/g, '<br/><br/>')
            .replace(/\n/g, '<br/>');
    };

    return (
        <>
            {/* Floating Chat Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-24 right-6 z-50 bg-foreground text-background p-4 rounded-full shadow-2xl hover:shadow-3xl transition-shadow"
                        aria-label="Open chat"
                    >
                        <MessageCircle size={28} />
                        {/* Notification dot */}
                        <span className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-background animate-pulse"></span>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-8rem)] bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-foreground text-background p-4 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-background/20 flex items-center justify-center">
                                    <Bot size={22} />
                                </div>
                                <div>
                                    <h3 className="font-semibold">M&T Immigration AI</h3>
                                    <p className="text-xs text-background/70 flex items-center gap-1">
                                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                        Virtual Legal Assistant
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-background/10 rounded-lg transition-colors"
                                aria-label="Close chat"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Legal Disclaimer Header */}
                        <div className="bg-secondary/50 p-2 text-[10px] text-center text-muted-foreground border-b border-border">
                            Not legal advice. For informational purposes only.
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide bg-zinc-50/50">
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={cn(
                                        "flex flex-col gap-2",
                                        message.role === 'user' ? 'items-end' : 'items-start'
                                    )}
                                >
                                    <div className={cn("flex gap-2 max-w-[85%]", message.role === 'user' ? 'flex-row-reverse' : 'flex-row')}>
                                        {message.role === 'assistant' && (
                                            <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center flex-shrink-0 mt-1">
                                                <Bot size={14} />
                                            </div>
                                        )}
                                        {message.role === 'user' && (
                                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mt-1">
                                                <User size={14} />
                                            </div>
                                        )}

                                        <div
                                            className={cn(
                                                "p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm",
                                                message.role === 'user'
                                                    ? 'bg-blue-600 text-white rounded-br-sm'
                                                    : 'bg-white border border-border text-foreground rounded-bl-sm'
                                            )}
                                        >
                                            <div
                                                dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                                            />

                                            {/* Action Button if present */}
                                            {message.action && (
                                                <div className="mt-3 pt-3 border-t border-border/10">
                                                    <Button asChild size="sm" variant="secondary" className="w-full text-xs h-8 bg-foreground text-background hover:bg-foreground/90">
                                                        <Link href={message.action.link} onClick={() => setIsOpen(false)}>
                                                            {message.action.label} <ExternalLink size={10} className="ml-2" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Smart Suggestions Chips */}
                                    {message.role === 'assistant' && message.suggestions && (
                                        <div className="flex flex-wrap gap-2 ml-10">
                                            {message.suggestions.map((suggestion, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => sendMessage(suggestion)}
                                                    className="text-xs px-3 py-1.5 bg-white border border-border text-zinc-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 rounded-full transition-all shadow-sm"
                                                >
                                                    {suggestion}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            ))}

                            {/* Typing indicator */}
                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex gap-2 items-center"
                                >
                                    <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center">
                                        <Bot size={14} />
                                    </div>
                                    <div className="bg-white border border-border p-3 rounded-2xl rounded-bl-sm flex gap-1 shadow-sm">
                                        <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-border bg-white shrink-0">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    sendMessage();
                                }}
                                className="flex gap-2"
                            >
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask about visas, green cards..."
                                    className="flex-1 bg-zinc-50 border-zinc-200 focus-visible:ring-blue-600"
                                    disabled={isTyping}
                                />
                                <Button
                                    type="submit"
                                    disabled={!input.trim() || isTyping}
                                    size="icon"
                                    className="rounded-xl shadow-md bg-blue-600 hover:bg-blue-700 text-white shrink-0"
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
                                    className="text-[10px] text-zinc-400 hover:text-blue-600 transition-colors inline-flex items-center gap-1"
                                >
                                    Ready to proceed? Book a Consultation <ArrowRight size={8} />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
