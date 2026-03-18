'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock3, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

type ArticleData = {
  title: string;
  content: string;
  recommendations: { title: string; slug: string }[];
};

export function ArticlePageClient({ slug }: { slug: string }) {
  const [data, setData] = useState<ArticleData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadArticle() {
      try {
        const res = await fetch(`/api/insights/${slug}`);
        if (!res.ok) throw new Error('Failed to load article');
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    }
    loadArticle();
  }, [slug]);

  if (error) {
    return (
      <div className="container-wide py-32 text-center">
        <h1 className="font-serif text-3xl font-medium text-zinc-900">Article could not be loaded</h1>
        <p className="mt-4 text-zinc-600">{error}</p>
        <Button asChild className="mt-8 rounded-full bg-black text-white hover:bg-zinc-800">
          <Link href="/insights">Return to Hub</Link>
        </Button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container-wide flex min-h-[60vh] flex-col items-center justify-center py-32">
        <Spinner className="h-8 w-8 text-zinc-400" />
        <p className="mt-6 animate-pulse text-sm font-medium uppercase tracking-widest text-zinc-500">
          Generating AI Article...
        </p>
      </div>
    );
  }

  return (
    <article className="bg-[#fcfbf9]">
      {/* Hero */}
      <header className="relative overflow-hidden border-b border-black/5 bg-white pt-32 sm:pt-40">
        <div className="container-wide relative z-10 pb-16 sm:pb-24">
          <div className="mx-auto max-w-3xl">
            <Link
              href="/insights"
              className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-black mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Insights Hub
            </Link>
            <div className="mb-6 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
              <span className="rounded-full bg-zinc-100 px-3 py-1">Legal Analysis</span>
              <span className="flex items-center gap-1.5">
                <Clock3 className="h-3.5 w-3.5" /> 5 min read
              </span>
            </div>
            <h1 className="font-serif text-4xl leading-[1.15] tracking-tight text-zinc-950 sm:text-5xl md:text-6xl">
              {data.title}
            </h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container-wide py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[minmax(0,1fr)_20rem]">
          {/* Main Reading area */}
          <div className="prose prose-zinc prose-a:text-black prose-a:underline hover:prose-a:text-zinc-600 max-w-none text-lg leading-relaxed text-zinc-700">
            <div dangerouslySetInnerHTML={{ __html: data.content }} />

            <div className="mt-16 flex items-center justify-between border-t border-black/10 pt-8">
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="rounded-full">
                  <Share2 className="mr-2 h-4 w-4" /> Share
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar / Recommendations */}
          <aside className="space-y-8">
            <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-2 font-serif text-xl font-medium tracking-tight text-zinc-900 border-b border-black/5 pb-4">
                <BookOpen className="h-5 w-5" /> Related Content
              </div>
              <ul className="space-y-6">
                {data.recommendations.map((rec, i) => (
                  <li key={i}>
                    <Link
                      href={`/insights/${rec.slug}`}
                      className="group block"
                    >
                      <h4 className="text-base font-medium leading-tight text-zinc-800 transition-colors group-hover:text-black group-hover:underline">
                        {rec.title}
                      </h4>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[2rem] bg-zinc-950 p-6 text-white shadow-xl">
              <h3 className="font-serif text-2xl tracking-tight">Need specific counsel?</h3>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                Book a consultation to discuss your specific immigration matter with our lead attorney.
              </p>
              <Button asChild className="mt-6 w-full rounded-full bg-white text-black hover:bg-zinc-200">
                <Link href="/#contact">Book Consultation</Link>
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
