'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center p-4">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-medium text-foreground mb-4">
                Something went wrong
            </h1>
            <p className="text-xl text-zinc-500 max-w-md mx-auto mb-8">
                We apologize for the inconvenience. Our team has been notified.
            </p>
            <div className="flex gap-4 push-button">
                <Button onClick={reset} size="lg" className="rounded-full">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                </Button>
            </div>
        </div>
    );
}
