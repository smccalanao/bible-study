"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { TRANSLATIONS, getBook } from "@/lib/bible/books";
import { searchTranslation } from "@/lib/bible/load";
import {
  formatReference,
  looksLikeReference,
  parseReference,
} from "@/lib/bible/parseReference";
import type { SearchHit, TranslationId } from "@/lib/bible/types";
import { getPreferredTranslation } from "@/lib/storage/annotations";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [translationId, setTranslationId] = useState<TranslationId>("kjv");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    setTranslationId(getPreferredTranslation());
  }, []);

  const reference = useMemo(() => {
    if (!looksLikeReference(query)) return null;
    return parseReference(query);
  }, [query]);

  const runSearch = async () => {
    const q = query.trim();
    if (!q) return;
    setSearched(true);

    if (reference) {
      setHits([]);
      return;
    }

    setLoading(true);
    try {
      const results = await searchTranslation(translationId, q, 60);
      setHits(results);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page space-y-5">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
          Find
        </p>
        <h1 className="mt-1 font-serif text-3xl font-semibold text-ink">
          Search
        </h1>
      </header>

      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && runSearch()}
            placeholder='Try "love" or "John 3:16"'
            className="min-w-0 flex-1 rounded-xl border border-line bg-paper-elevated px-3 py-3 text-sm text-ink outline-none focus:border-accent"
          />
          <button
            type="button"
            onClick={runSearch}
            className="rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white"
          >
            Go
          </button>
        </div>
        <select
          value={translationId}
          onChange={(e) => setTranslationId(e.target.value as TranslationId)}
          className="rounded-full border border-line bg-paper-elevated px-3 py-1.5 text-sm"
        >
          {TRANSLATIONS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.shortName}
            </option>
          ))}
        </select>
      </div>

      {reference && (
        <Link
          href={`/bible/${reference.bookAbbrev}/${reference.chapter}`}
          className="block rounded-2xl border border-accent/30 bg-accent-soft px-4 py-4"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">
            Reference
          </p>
          <p className="mt-1 font-serif text-xl font-semibold text-ink">
            {formatReference(
              getBook(reference.bookAbbrev)?.name ?? reference.bookAbbrev,
              reference.chapter,
              reference.verseStart,
              reference.verseEnd,
            )}
          </p>
          <p className="mt-1 text-sm text-ink-soft">Open chapter →</p>
        </Link>
      )}

      {loading && <p className="text-sm text-ink-soft">Searching…</p>}

      {!loading && searched && !reference && hits.length === 0 && (
        <p className="text-sm text-ink-soft">No verses matched that phrase.</p>
      )}

      <ul className="space-y-2">
        {hits.map((hit) => (
          <li key={`${hit.bookAbbrev}-${hit.chapter}-${hit.verse}`}>
            <Link
              href={`/bible/${hit.bookAbbrev}/${hit.chapter}`}
              className="block rounded-xl border border-line bg-paper-elevated px-4 py-3 transition hover:border-accent/30"
            >
              <p className="text-sm font-semibold text-accent">
                {hit.bookName} {hit.chapter}:{hit.verse}
              </p>
              <p className="mt-1 font-serif text-[1.02rem] leading-relaxed text-ink">
                {hit.text}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
