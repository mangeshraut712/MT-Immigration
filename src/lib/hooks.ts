/**
 * Custom React hooks for the M&T Immigration website
 */

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook for managing local storage with SSR safety
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
    const readValue = useCallback((): T => {
        if (typeof window === 'undefined') return initialValue;
        try {
            const item = window.localStorage.getItem(key);
            return item ? (JSON.parse(item) as T) : initialValue;
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    }, [key, initialValue]);

    const [storedValue, setStoredValue] = useState<T>(readValue);

    useEffect(() => {
        const handleStorage = () => {
            setStoredValue(readValue());
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, [readValue]);

    const setValue = useCallback((value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(readValue()) : value;
            setStoredValue(valueToStore);
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, readValue]);

    return [storedValue, setValue];
}

/**
 * Hook for detecting if an element is in viewport
 */
export function useInView(options?: IntersectionObserverInit) {
    const ref = useRef<HTMLElement | null>(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(([entry]) => {
            setIsInView(entry.isIntersecting);
        }, { threshold: 0.1, ...options });

        observer.observe(element);
        return () => observer.disconnect();
    }, [options]);

    return { ref, isInView };
}

/**
 * Hook for debouncing values
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}

/**
 * Hook for detecting mobile viewport
 */
export function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < breakpoint);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, [breakpoint]);

    return isMobile;
}

/**
 * Hook for keyboard shortcuts
 */
export function useKeyboardShortcut(key: string, callback: () => void, modifiers?: { ctrl?: boolean; alt?: boolean; shift?: boolean }) {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (
                e.key.toLowerCase() === key.toLowerCase() &&
                (!modifiers?.ctrl || e.ctrlKey || e.metaKey) &&
                (!modifiers?.alt || e.altKey) &&
                (!modifiers?.shift || e.shiftKey)
            ) {
                e.preventDefault();
                callback();
            }
        };

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [key, callback, modifiers]);
}

/**
 * Hook for copying text to clipboard
 */
export function useCopyToClipboard() {
    const [copied, setCopied] = useState(false);

    const copy = useCallback(async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            return true;
        } catch {
            console.error('Failed to copy to clipboard');
            return false;
        }
    }, []);

    return { copied, copy };
}

/**
 * Hook for tracking scroll progress
 */
export function useScrollProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateProgress = () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (window.scrollY / scrollHeight) * 100;
            setProgress(Math.min(100, Math.max(0, scrolled)));
        };

        window.addEventListener('scroll', updateProgress, { passive: true });
        return () => window.removeEventListener('scroll', updateProgress);
    }, []);

    return progress;
}
