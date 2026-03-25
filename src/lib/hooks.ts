import { useEffect, useState } from 'react';
import { useCallback } from 'react';

// Copy to clipboard hook
export function useCopyToClipboard() {
    const [copied, setCopied] = useState(false);

    const copy = useCallback(async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            return true;
        } catch (err) {
            console.error('Failed to copy text: ', err);
            return false;
        }
    }, []);

    return { copy, copied };
}

// Local storage hook with SSR safety
export function useLocalStorage<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    const setValue = useCallback((value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, storedValue]);

    return [storedValue, setValue] as const;
}

// Keyboard shortcut hook
export function useKeyboardShortcut(
    key: string,
    callback: () => void,
    options: { ctrl?: boolean; shift?: boolean; alt?: boolean; meta?: boolean } = {}
) {
    const { ctrl = false, shift = false, alt = false, meta = false } = options;

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const isCtrlPressed = ctrl ? event.ctrlKey : !event.ctrlKey;
            const isShiftPressed = shift ? event.shiftKey : !event.shiftKey;
            const isAltPressed = alt ? event.altKey : !event.altKey;
            const isMetaPressed = meta ? event.metaKey : !event.metaKey;

            if (
                event.key.toLowerCase() === key.toLowerCase() &&
                isCtrlPressed &&
                isShiftPressed &&
                isAltPressed &&
                isMetaPressed &&
                !event.repeat
            ) {
                event.preventDefault();
                callback();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [key, callback, ctrl, shift, alt, meta]);
}
