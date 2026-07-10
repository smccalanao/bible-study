"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { BibleStory } from "@/lib/stories/stories";
import { getChapterVerses } from "@/lib/bible/load";
import { getPreferredTranslation } from "@/lib/storage/annotations";
import { recordChapterRead } from "@/lib/storage/progress";
import type { TranslationId } from "@/lib/bible/types";
import { getTranslation } from "@/lib/bible/books";

export function StoryDetail({ story }: { story: BibleStory }) {
  const [preview, setPreview] = useState<string[]>([]);
  const [translationId, setTranslationId] = useState<TranslationId>("nkjv");

  useEffect(() => {
    const tid = getPreferredTranslation();
    setTranslationId(tid);
    const first = story.passages[0];
    getChapterVerses(tid, first.bookAbbrev, first.chapter)
      .then((verses) => {
        const start = (first.verseStart ?? 1) - 1;
        const end = first.verseEnd ?? Math.min(verses.length, start + 6);
        setPreview(verses.slice(start, end));
        recordChapterRead(first.bookAbbrev, first.chapter);
      })
      .catch(() => setPreview([]));
  }, [story]);

  const translation = getTranslation(translationId);

  return (
    <div className="page space-y-6">
      <div>
        <Link href="/stories" className="text-sm font-medium text-accent">
          ← Stories
        </Link>
        <p className="mt-3 text-[0.65rem] font-semibold uppercase tracking-wide text-accent">
          {story.theme} ·{" "}
          {story.testament === "OT" ? "Old Testament" : "New Testament"}
        </p>
        <h1 className="mt-1 font-serif text-3xl font-semibold tracking-tight text-ink">
          {story.title}
        </h1>
      </div>

      <p className="scripture text-[1.15rem] leading-relaxed text-ink">
        {story.summary}
      </p>

      {preview.length > 0 && (
        <section className="rounded-2xl border border-line bg-paper-elevated px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
            Preview · {translation.shortName}
          </p>
          <div className="mt-3 space-y-2">
            {preview.map((text, i) => {
              const verseNum = (story.passages[0].verseStart ?? 1) + i;
              return (
                <p key={verseNum} className="scripture text-[1.05rem]">
                  <sup className="mr-1.5 font-sans text-[0.7rem] font-semibold text-accent">
                    {verseNum}
                  </sup>
                  {text}
                </p>
              );
            })}
          </div>
        </section>
      )}

      <section className="space-y-2">
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-soft">
          Read in Scripture
        </h2>
        <ul className="overflow-hidden rounded-2xl border border-line bg-paper-elevated">
          {story.passages.map((p, i) => (
            <li key={`${p.bookAbbrev}-${p.chapter}-${p.label}`}>
              <Link
                href={`/bible/${p.bookAbbrev}/${p.chapter}`}
                className={`flex items-center justify-between px-4 py-3 transition hover:bg-paper ${
                  i > 0 ? "border-t border-line" : ""
                }`}
              >
                <span className="font-medium text-ink">{p.label}</span>
                <span className="text-sm text-accent">Open →</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
