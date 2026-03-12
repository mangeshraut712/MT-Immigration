'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Scale, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';

const previewCells = [
  [1, 0, 0, 0],
  [0, 0, -1, 2],
  [0, -1, 0, 0],
  [3, 0, 0, 4],
];

export function BriefBreakSection() {
  return (
    <section className="border-t border-black/5 bg-[#f6efe7] py-20">
      <div className="container-wide grid gap-12 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-center">
        <div>
          <div className="mb-6 flex items-center gap-3">
            <div className="h-px w-12 bg-blue-600" />
            <span className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
              Brief Break
            </span>
          </div>
          <h2 className="font-serif text-4xl leading-[1.05] tracking-tight text-zinc-950 md:text-5xl">
            A quiet puzzle room
            <br />
            for the moments between the heavy work.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600">
            The firm site stays serious where it matters. This is the one intentional detour:
            a small legal-themed puzzle page built for focus, reset, and a little stress relief.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild className="rounded-full bg-black text-white hover:bg-zinc-800">
              <Link href="/brief-break">
                Enter The Puzzle Room
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm text-zinc-700">
              <Sparkles className="h-4 w-4 text-blue-600" />
              Daily chamber puzzle with streaks, hints, and zero legal pressure
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-[2rem] border border-black/5 bg-white/80 p-6 shadow-soft backdrop-blur-sm"
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-600">
                Docket Zip
              </p>
              <p className="mt-2 text-sm text-zinc-500">Connect the facts. Fill the record.</p>
            </div>
            <Scale className="h-6 w-6 text-zinc-900" />
          </div>

          <div className="grid grid-cols-4 gap-2 rounded-[1.5rem] bg-[#f7f3ec] p-4">
            {previewCells.flatMap((row, rowIndex) =>
              row.map((cell, colIndex) => {
                const key = `${rowIndex}-${colIndex}`;
                if (cell === -1) {
                  return (
                    <div
                      key={key}
                      className="aspect-square rounded-2xl bg-zinc-900/90 shadow-inner"
                    />
                  );
                }

                return (
                  <div
                    key={key}
                    className="relative aspect-square rounded-2xl border border-black/5 bg-white shadow-sm"
                  >
                    {cell > 0 ? (
                      <div className="absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                        {cell}
                      </div>
                    ) : null}
                  </div>
                );
              }),
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
