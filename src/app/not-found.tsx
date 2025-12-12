'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center p-4">
            <div className="w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
                <FileQuestion className="w-10 h-10 text-zinc-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-medium text-foreground mb-4">
                Page Not Found
            </h1>
            <p className="text-xl text-zinc-500 max-w-md mx-auto mb-8">
                Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or deleted.
            </p>
            <Button asChild size="lg" className="rounded-full">
                <Link href="/">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Link>
            </Button>
        </div>
    );
}
