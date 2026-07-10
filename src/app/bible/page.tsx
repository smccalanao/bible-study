"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BOOKS, TRANSLATIONS, getBook } from "@/lib/bible/books";
import type { TranslationId } from "@/lib/bible/types";
import {
  getLastReading,
  getPreferredTranslation,
  setPreferredTranslation,
  type LastReading,
} from "@/lib/storage/annotations";

type TestamentFilter = "all" | "OT" | "NT";

const FILTERS: { id: TestamentFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "OT", label: "Old Testament" },
  { id: "NT", label: "New Testament" },
];

export default function BibleIndexPage() {
  const [last, setLast] = useState<LastReading | null>(null);
  const [filter, setFilter] = useState<TestamentFilter>("all");
  const [translationId, setTranslationId] = useState<TranslationId>("nkjv");

  useEffect(() => {
    setLast(getLastReading());
    setTranslationId(getPreferredTranslation());
  }, []);

  const lastBook = last ? getBook(last.bookAbbrev) : null;
  const selected = TRANSLATIONS.find((t) => t.id === translationId);

  const visibleBooks = useMemo(() => {
    if (filter === "all") return BOOKS;
    return BOOKS.filter((b) => b.testament === filter);
  }, [filter]);

  const sectionTitle =
    filter === "OT"
      ? "Old Testament"
      : filter === "NT"
        ? "New Testament"
        : "All books";

  const onPickTranslation = (id: TranslationId) => {
    setTranslationId(id);
    setPreferredTranslation(id);
  };

  return (
    <div className="page space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
          Scripture
        </p>
        <h1 className="mt-1 font-serif text-3xl font-semibold tracking-tight text-ink">
          The Bible
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          All 66 books — Genesis through Revelation.
        </p>
      </header>

      <section className="space-y-2">
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-soft">
          Choose translation
        </h2>
        <div className="overflow-hidden rounded-2xl border border-line bg-paper-elevated">
          {TRANSLATIONS.map((t, i) => {
            const active = translationId === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onPickTranslation(t.id)}
                className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-paper ${
                  i > 0 ? "border-t border-line" : ""
                } ${active ? "bg-accent-soft/60" : ""}`}
              >
                <div>
                  <p className={`font-medium ${active ? "text-accent" : "text-ink"}`}>
                    {t.name}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-soft">
                    {t.shortName}
                    {t.publicDomain ? " · Public domain" : " · Licensed copy"}
                  </p>
                </div>
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[0.65rem] font-bold ${
                    active
                      ? "border-accent bg-accent text-white"
                      : "border-line bg-paper text-transparent"
                  }`}
                  aria-hidden
                >
                  ✓
                </span>
              </button>
            );
          })}
        </div>
        {selected && (
          <p className="px-0.5 text-xs text-ink-soft">
            Reading in <span className="font-semibold text-ink">{selected.shortName}</span>
            {" — "}this applies when you open any book.
          </p>
        )}
      </section>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/bible/gn/1"
          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          Start at Genesis 1
        </Link>
        {last && lastBook && (
          <Link
            href={`/bible/${last.bookAbbrev}/${last.chapter}`}
            className="rounded-full border border-line bg-paper-elevated px-4 py-2 text-sm font-medium text-ink"
          >
            Continue {lastBook.name} {last.chapter}
          </Link>
        )}
      </div>

      <div
        className="flex gap-1 rounded-full border border-line bg-paper-elevated p-1"
        role="tablist"
        aria-label="Testament filter"
      >
        {FILTERS.map(({ id, label }) => {
          const active = filter === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(id)}
              className={`flex-1 rounded-full px-2 py-2 text-center text-xs font-semibold transition sm:text-sm ${
                active
                  ? "bg-accent text-white"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <section className="space-y-2">
        <div className="flex items-center justify-between px-0.5">
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-soft">
            {sectionTitle}
          </h2>
          <p className="text-xs text-ink-soft">
            {visibleBooks.length}{" "}
            {visibleBooks.length === 1 ? "book" : "books"}
          </p>
        </div>
        <ul className="overflow-hidden rounded-2xl border border-line bg-paper-elevated">
          {visibleBooks.map((book, i) => (
            <li key={book.abbrev}>
              <Link
                href={`/bible/${book.abbrev}/1`}
                className={`flex items-center justify-between px-4 py-3 transition hover:bg-paper ${
                  i > 0 ? "border-t border-line" : ""
                }`}
              >
                <div>
                  <span className="font-medium text-ink">{book.name}</span>
                  {filter === "all" && (
                    <span className="ml-2 text-[0.65rem] font-semibold uppercase tracking-wide text-ink-soft">
                      {book.testament}
                    </span>
                  )}
                </div>
                <span className="text-xs text-ink-soft">
                  {book.chapters} ch
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
