"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container-wide flex min-h-[70vh] items-center justify-center py-24">
        <div className="surface-panel w-full max-w-3xl p-10 text-center md:p-14">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-border/70 bg-background/90 shadow-sm">
            <FileQuestion className="h-10 w-10 text-muted-foreground" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Page Not Found
          </p>
          <h1 className="mt-5 text-4xl font-serif font-medium tracking-tight text-foreground md:text-5xl">
            This page is not in the record.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            The page may have moved, expired, or never existed on this version of
            the site.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="rounded-full">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <Link href="/insights">Open Insights</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
