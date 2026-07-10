"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getVerseText, prefetchAllTranslations } from "@/lib/bible/load";
import { getVerseOfTheDay } from "@/lib/plans/daily";
import {
  getLastReading,
  getPreferredTranslation,
  type LastReading,
} from "@/lib/storage/annotations";
import { getBook } from "@/lib/bible/books";
import { speakText } from "@/lib/audio/tts";
import { StreakCard } from "@/components/StreakCard";

export default function HomePage() {
  const [votdText, setVotdText] = useState<string>("");
  const [votdMeta, setVotdMeta] = useState(() => getVerseOfTheDay("kjv"));
  const [last, setLast] = useState<LastReading | null>(null);
  const [offlineReady, setOfflineReady] = useState(false);

  useEffect(() => {
    const translationId = getPreferredTranslation();
    const votd = getVerseOfTheDay(translationId);
    setVotdMeta(votd);
    setLast(getLastReading());

    getVerseText(
      votd.translationId,
      votd.bookAbbrev,
      votd.chapter,
      votd.verse,
    ).then((text) => setVotdText(text ?? ""));

    prefetchAllTranslations()
      .then(() => setOfflineReady(true))
      .catch(() => setOfflineReady(false));
  }, []);

  const lastBook = last ? getBook(last.bookAbbrev) : null;

  return (
    <div className="page space-y-8">
      <header className="pt-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
          Daily
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-ink">
          Bible Study
        </h1>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
          A quiet place to read, mark, and return — KJV, NKJV, and BBE, with
          offline support after the first visit.
        </p>
      </header>

      <StreakCard />

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-soft">
            Verse of the Day
          </h2>
          <button
            type="button"
            onClick={() => votdText && speakText(votdText)}
            className="text-sm font-medium text-accent"
          >
            Listen
          </button>
        </div>
        <blockquote className="rounded-2xl border border-line bg-paper-elevated/80 px-5 py-6">
          <p className="scripture text-[1.2rem]">
            {votdText || "Loading…"}
          </p>
          <footer className="mt-4">
            <Link
              href={`/bible/${votdMeta.bookAbbrev}/${votdMeta.chapter}`}
              className="text-sm font-semibold text-accent"
            >
              {votdMeta.bookName} {votdMeta.chapter}:{votdMeta.verse} →
            </Link>
          </footer>
        </blockquote>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-soft">
          Continue
        </h2>
        {last && lastBook ? (
          <Link
            href={`/bible/${last.bookAbbrev}/${last.chapter}`}
            className="block rounded-2xl border border-line bg-paper-elevated px-4 py-4 transition hover:border-accent/30"
          >
            <p className="font-serif text-xl font-semibold text-ink">
              {lastBook.name} {last.chapter}
            </p>
            <p className="mt-1 text-sm text-ink-soft">
              Pick up where you left off · {last.translationId.toUpperCase()}
            </p>
          </Link>
        ) : (
          <Link
            href="/bible/gn/1"
            className="block rounded-2xl border border-line bg-paper-elevated px-4 py-4 transition hover:border-accent/30"
          >
            <p className="font-serif text-xl font-semibold text-ink">
              Start at Genesis
            </p>
            <p className="mt-1 text-sm text-ink-soft">
              Open Genesis chapter 1 — In the beginning…
            </p>
          </Link>
        )}
      </section>

      <section className="grid grid-cols-2 gap-3">
        <Link
          href="/search"
          className="rounded-2xl border border-line bg-paper-elevated px-4 py-4"
        >
          <p className="font-semibold text-ink">Search</p>
          <p className="mt-1 text-xs text-ink-soft">Keywords or John 3:16</p>
        </Link>
        <Link
          href="/plans"
          className="rounded-2xl border border-line bg-paper-elevated px-4 py-4"
        >
          <p className="font-semibold text-ink">Plans</p>
          <p className="mt-1 text-xs text-ink-soft">Reading rhythms</p>
        </Link>
      </section>

      <p className="text-xs text-ink-soft">
        {offlineReady
          ? "Bibles cached in this browser for offline reading."
          : "Downloading Bibles for offline use…"}
      </p>
    </div>
  );
}
