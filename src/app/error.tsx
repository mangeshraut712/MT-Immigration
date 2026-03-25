"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

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
    <div className="min-h-screen bg-background">
      <div className="container-wide flex min-h-[70vh] items-center justify-center py-24">
        <div className="surface-panel w-full max-w-3xl p-10 text-center md:p-14">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-border/70 bg-background/90 shadow-sm">
            <AlertTriangle className="h-10 w-10 text-red-500" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Unexpected Error
          </p>
          <h1 className="mt-5 text-4xl font-serif font-medium tracking-tight text-foreground md:text-5xl">
            Something interrupted the page.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Please try again. If the issue continues, contact the office directly
            so the problem can be reviewed.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button onClick={reset} size="lg" className="rounded-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <Link href="/#contact">Contact Office</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
