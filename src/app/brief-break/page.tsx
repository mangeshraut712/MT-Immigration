import type { Metadata } from 'next';

import { DocketZipGame } from '@/components/features/game/DocketZipGame';

export const metadata: Metadata = {
  title: 'Brief Break',
  description:
    'A playful law-themed puzzle room for moments of reset between serious immigration work.',
};

export default function BriefBreakPage() {
  return (
    <div className="min-h-screen bg-[#f6efe7]">
      <div className="container-wide py-28 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
            Brief Break
          </p>
          <h1 className="mt-6 font-serif text-5xl leading-[0.98] tracking-tight text-zinc-950 md:text-7xl">
            Reset your head,
            <br />
            not your standards.
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-zinc-600 md:text-xl">
            A small puzzle room built into the site for the moments when the filings are done,
            the coffee is cold, and you want two minutes of playful concentration before the next
            case.
          </p>
        </div>

        <div className="mt-14">
          <DocketZipGame />
        </div>
      </div>
    </div>
  );
}
