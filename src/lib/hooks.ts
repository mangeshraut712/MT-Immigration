// PWA and Service Worker Hook
import { useEffect, useState } from 'react';

export function usePWA() {
    const [isInstallable, setIsInstallable] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isOffline, setIsOffline] = useState(() => typeof navigator !== 'undefined' ? !navigator.onLine : false);

    useEffect(() => {
        // Register service worker
        if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
            navigator.serviceWorker
                .register('/sw.js')
                .then((registration) => {
                    console.log('SW registered: ', registration);
                })
                .catch((registrationError) => {
                    console.log('SW registration failed: ', registrationError);
                });
        }

        // Handle install prompt
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsInstallable(true);
        };

        // Handle app installed
        const handleAppInstalled = () => {
            setIsInstallable(false);
            setDeferredPrompt(null);
        };

        // Handle online/offline status
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const installPWA = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            setIsInstallable(false);
        }
    };

    return {
        isInstallable,
        isOffline,
        installPWA
    };
}

// Enhanced error boundary hook
import { useCallback } from 'react';
import type { ErrorInfo } from 'react';

export function useErrorHandler() {
    const [error, setError] = useState<Error | null>(null);
    const [errorInfo, setErrorInfo] = useState<ErrorInfo | null>(null);

    const handleError = useCallback((error: Error, errorInfo?: ErrorInfo) => {
        setError(error);
        setErrorInfo(errorInfo || null);

        // Log to external service in production
        if (process.env.NODE_ENV === 'production') {
            console.error('Application Error:', error, errorInfo);

            // Could integrate with error tracking service like Sentry
            // Sentry.captureException(error, { contexts: { react: errorInfo } });
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
        setErrorInfo(null);
    }, []);

    return {
        error,
        errorInfo,
        handleError,
        clearError,
        hasError: error !== null
    };
}

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
