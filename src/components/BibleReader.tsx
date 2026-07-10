"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BOOKS, TRANSLATIONS } from "@/lib/bible/books";
import { getChapterVerses } from "@/lib/bible/load";
import type { HighlightColor, TranslationId } from "@/lib/bible/types";
import { speakText, stopSpeaking } from "@/lib/audio/tts";
import {
  getBookmarks,
  getHighlights,
  getNotes,
  getParallelEnabled,
  getPreferredTranslation,
  removeHighlight,
  removeNote,
  setLastReading,
  setParallelEnabled,
  setPreferredTranslation,
  toggleBookmark,
  upsertHighlight,
  upsertNote,
} from "@/lib/storage/annotations";
import { recordChapterRead } from "@/lib/storage/progress";

const COLORS: HighlightColor[] = [
  "yellow",
  "green",
  "blue",
  "pink",
  "orange",
];

type Props = {
  bookAbbrev: string;
  chapter: number;
};

export function BibleReader({ bookAbbrev, chapter }: Props) {
  const book = BOOKS.find((b) => b.abbrev === bookAbbrev) ?? BOOKS[0];
  const [translationId, setTranslationId] = useState<TranslationId>("kjv");
  const [parallel, setParallel] = useState(false);
  const [verses, setVerses] = useState<string[]>([]);
  const [parallelVerses, setParallelVerses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [highlightMap, setHighlightMap] = useState<Record<number, HighlightColor>>(
    {},
  );
  const [noteMap, setNoteMap] = useState<Record<number, string>>({});
  const [bookmarked, setBookmarked] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const otherTranslation: TranslationId =
    translationId === "nkjv"
      ? "kjv"
      : translationId === "kjv"
        ? "nkjv"
        : "kjv";

  const refreshAnnotations = (tid: TranslationId) => {
    const highlights = getHighlights().filter(
      (h) =>
        h.translationId === tid &&
        h.bookAbbrev === book.abbrev &&
        h.chapter === chapter,
    );
    const notes = getNotes().filter(
      (n) =>
        n.translationId === tid &&
        n.bookAbbrev === book.abbrev &&
        n.chapter === chapter,
    );
    const hl: Record<number, HighlightColor> = {};
    for (const h of highlights) hl[h.verse] = h.color;
    const nm: Record<number, string> = {};
    for (const n of notes) nm[n.verse] = n.body;
    setHighlightMap(hl);
    setNoteMap(nm);
    setBookmarked(
      getBookmarks().some(
        (b) =>
          b.translationId === tid &&
          b.bookAbbrev === book.abbrev &&
          b.chapter === chapter &&
          b.verse == null,
      ),
    );
  };

  useEffect(() => {
    setTranslationId(getPreferredTranslation());
    setParallel(getParallelEnabled());
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const primary = await getChapterVerses(
          translationId,
          book.abbrev,
          chapter,
        );
        if (cancelled) return;
        setVerses(primary);
        if (parallel) {
          const secondary = await getChapterVerses(
            otherTranslation,
            book.abbrev,
            chapter,
          );
          if (!cancelled) setParallelVerses(secondary);
        } else {
          setParallelVerses([]);
        }
        setLastReading({
          bookAbbrev: book.abbrev,
          chapter,
          translationId,
        });
        recordChapterRead(book.abbrev, chapter);
        refreshAnnotations(translationId);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load chapter");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
      stopSpeaking();
    };
  }, [book.abbrev, chapter, translationId, parallel, otherTranslation]);

  useEffect(() => {
    if (selectedVerse == null) {
      setNoteDraft("");
      return;
    }
    setNoteDraft(noteMap[selectedVerse] ?? "");
  }, [selectedVerse, noteMap]);

  const prev = useMemo(() => adjacentChapter(book.abbrev, chapter, -1), [book.abbrev, chapter]);
  const next = useMemo(() => adjacentChapter(book.abbrev, chapter, 1), [book.abbrev, chapter]);

  const onTranslationChange = (id: TranslationId) => {
    setTranslationId(id);
    setPreferredTranslation(id);
  };

  const onParallelToggle = () => {
    const nextVal = !parallel;
    setParallel(nextVal);
    setParallelEnabled(nextVal);
  };

  const applyHighlight = (color: HighlightColor) => {
    if (selectedVerse == null) return;
    upsertHighlight({
      translationId,
      bookAbbrev: book.abbrev,
      chapter,
      verse: selectedVerse,
      color,
    });
    refreshAnnotations(translationId);
  };

  const clearHighlight = () => {
    if (selectedVerse == null) return;
    removeHighlight(translationId, book.abbrev, chapter, selectedVerse);
    refreshAnnotations(translationId);
  };

  const saveNote = () => {
    if (selectedVerse == null) return;
    const body = noteDraft.trim();
    if (!body) {
      removeNote(translationId, book.abbrev, chapter, selectedVerse);
    } else {
      upsertNote({
        translationId,
        bookAbbrev: book.abbrev,
        chapter,
        verse: selectedVerse,
        body,
      });
    }
    refreshAnnotations(translationId);
  };

  const onBookmark = () => {
    const added = toggleBookmark({
      translationId,
      bookAbbrev: book.abbrev,
      chapter,
      label: `${book.name} ${chapter}`,
    });
    setBookmarked(added);
  };

  const onListen = () => {
    if (selectedVerse != null) {
      speakText(`Verse ${selectedVerse}. ${verses[selectedVerse - 1]}`);
      return;
    }
    const full = verses
      .map((t, i) => `Verse ${i + 1}. ${t}`)
      .join(" ");
    speakText(`${book.name} chapter ${chapter}. ${full}`);
  };

  return (
    <div className="page space-y-4">
      <header className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="text-left"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
              Bible Study
            </p>
            <h1 className="mt-1 font-serif text-3xl font-semibold tracking-tight text-ink">
              {book.name} {chapter}
            </h1>
          </button>
          <button
            type="button"
            onClick={onBookmark}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
              bookmarked
                ? "border-accent bg-accent-soft text-accent"
                : "border-line bg-paper-elevated text-ink-soft"
            }`}
            aria-pressed={bookmarked}
          >
            {bookmarked ? "Saved" : "Save"}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor="translation">
            Translation
          </label>
          <select
            id="translation"
            value={translationId}
            onChange={(e) => onTranslationChange(e.target.value as TranslationId)}
            className="rounded-full border border-line bg-paper-elevated px-3 py-1.5 text-sm font-medium text-ink"
          >
            {TRANSLATIONS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.shortName}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={onParallelToggle}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
              parallel
                ? "border-accent bg-accent-soft text-accent"
                : "border-line bg-paper-elevated text-ink-soft"
            }`}
          >
            Parallel {parallel ? "on" : "off"}
          </button>
          <button
            type="button"
            onClick={onListen}
            className="rounded-full border border-line bg-paper-elevated px-3 py-1.5 text-sm font-medium text-ink-soft"
          >
            Listen
          </button>
        </div>
        {translationId === "nkjv" && (
          <p className="text-[0.7rem] leading-relaxed text-ink-soft">
            NKJV® text © Thomas Nelson. For personal use with your licensed
            copy.
          </p>
        )}
      </header>

      {loading && (
        <p className="text-sm text-ink-soft">Loading chapter…</p>
      )}
      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}

      {!loading && !error && (
        <div className="space-y-1">
          {verses.map((text, i) => {
            const verse = i + 1;
            const color = highlightMap[verse];
            const hasNote = Boolean(noteMap[verse]);
            const selected = selectedVerse === verse;
            return (
              <button
                key={verse}
                type="button"
                onClick={() =>
                  setSelectedVerse((v) => (v === verse ? null : verse))
                }
                className={`w-full rounded-xl px-3 py-2.5 text-left transition ${
                  selected ? "ring-2 ring-accent/40" : "hover:bg-paper-elevated/80"
                } ${color ? `hl-${color}` : ""}`}
              >
                <p className="scripture">
                  <sup className="mr-1.5 text-[0.7rem] font-sans font-semibold text-accent">
                    {verse}
                  </sup>
                  {text}
                  {hasNote && (
                    <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle" />
                  )}
                </p>
                {parallel && parallelVerses[i] && (
                  <p className="mt-2 border-l-2 border-accent/30 pl-3 font-serif text-[0.95rem] leading-relaxed text-ink-soft">
                    <span className="mr-2 font-sans text-[0.65rem] font-semibold uppercase tracking-wide text-accent">
                      {otherTranslation.toUpperCase()}
                    </span>
                    {parallelVerses[i]}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-between gap-3 pt-2">
        {prev ? (
          <Link
            href={`/bible/${prev.abbrev}/${prev.chapter}`}
            className="rounded-full border border-line bg-paper-elevated px-4 py-2 text-sm font-medium text-ink"
          >
            ← {prev.name} {prev.chapter}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/bible/${next.abbrev}/${next.chapter}`}
            className="rounded-full border border-line bg-paper-elevated px-4 py-2 text-sm font-medium text-ink"
          >
            {next.name} {next.chapter} →
          </Link>
        ) : (
          <span />
        )}
      </div>

      {selectedVerse != null && (
        <div className="fixed inset-x-0 bottom-[calc(var(--nav-height)+0.5rem)] z-40 mx-auto w-full max-w-2xl px-3">
          <div className="rounded-2xl border border-line bg-paper-elevated p-3 shadow-[0_12px_40px_rgba(20,32,51,0.12)]">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-ink">
                {book.name} {chapter}:{selectedVerse}
              </p>
              <button
                type="button"
                className="text-sm text-ink-soft"
                onClick={() => setSelectedVerse(null)}
              >
                Close
              </button>
            </div>
            <div className="mb-2 flex flex-wrap gap-1.5">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={`Highlight ${c}`}
                  onClick={() => applyHighlight(c)}
                  className={`h-7 w-7 rounded-full border border-black/10 hl-${c}`}
                />
              ))}
              <button
                type="button"
                onClick={clearHighlight}
                className="rounded-full border border-line px-2.5 text-xs font-medium text-ink-soft"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() =>
                  speakText(
                    `Verse ${selectedVerse}. ${verses[selectedVerse - 1]}`,
                  )
                }
                className="rounded-full border border-line px-2.5 text-xs font-medium text-ink-soft"
              >
                Speak
              </button>
            </div>
            <textarea
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              placeholder="Private note…"
              rows={2}
              className="w-full resize-none rounded-xl border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-accent"
            />
            <button
              type="button"
              onClick={saveNote}
              className="mt-2 w-full rounded-xl bg-accent px-3 py-2 text-sm font-semibold text-white"
            >
              Save note
            </button>
          </div>
        </div>
      )}

      {pickerOpen && (
        <BookPicker
          currentAbbrev={book.abbrev}
          currentChapter={chapter}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
}

function adjacentChapter(
  abbrev: string,
  chapter: number,
  delta: number,
): { abbrev: string; name: string; chapter: number } | null {
  const idx = BOOKS.findIndex((b) => b.abbrev === abbrev);
  if (idx < 0) return null;
  const book = BOOKS[idx];
  const nextChapter = chapter + delta;
  if (nextChapter >= 1 && nextChapter <= book.chapters) {
    return { abbrev: book.abbrev, name: book.name, chapter: nextChapter };
  }
  const neighbor = BOOKS[idx + delta];
  if (!neighbor) return null;
  return {
    abbrev: neighbor.abbrev,
    name: neighbor.name,
    chapter: delta > 0 ? 1 : neighbor.chapters,
  };
}

function BookPicker({
  currentAbbrev,
  currentChapter,
  onClose,
}: {
  currentAbbrev: string;
  currentChapter: number;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState(currentAbbrev);
  const book = BOOKS.find((b) => b.abbrev === selected)!;
  const ot = BOOKS.filter((b) => b.testament === "OT");
  const nt = BOOKS.filter((b) => b.testament === "NT");

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-3 sm:items-center">
      <div className="max-h-[85dvh] w-full max-w-lg overflow-hidden rounded-2xl border border-line bg-paper-elevated shadow-xl">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <h2 className="font-semibold text-ink">Choose passage</h2>
          <button type="button" onClick={onClose} className="text-sm text-ink-soft">
            Close
          </button>
        </div>
        <div className="grid max-h-[70dvh] grid-cols-2 gap-0 overflow-hidden">
          <div className="overflow-y-auto border-r border-line p-2">
            <p className="px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-ink-soft">
              Old Testament
            </p>
            {ot.map((b) => (
              <button
                key={b.abbrev}
                type="button"
                onClick={() => setSelected(b.abbrev)}
                className={`block w-full rounded-lg px-2 py-1.5 text-left text-sm ${
                  selected === b.abbrev
                    ? "bg-accent-soft font-semibold text-accent"
                    : "text-ink hover:bg-paper"
                }`}
              >
                {b.name}
              </button>
            ))}
            <p className="mt-2 px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-ink-soft">
              New Testament
            </p>
            {nt.map((b) => (
              <button
                key={b.abbrev}
                type="button"
                onClick={() => setSelected(b.abbrev)}
                className={`block w-full rounded-lg px-2 py-1.5 text-left text-sm ${
                  selected === b.abbrev
                    ? "bg-accent-soft font-semibold text-accent"
                    : "text-ink hover:bg-paper"
                }`}
              >
                {b.name}
              </button>
            ))}
          </div>
          <div className="overflow-y-auto p-3">
            <p className="mb-2 text-sm font-semibold text-ink">{book.name}</p>
            <div className="grid grid-cols-4 gap-1.5">
              {Array.from({ length: book.chapters }, (_, i) => i + 1).map(
                (ch) => (
                  <Link
                    key={ch}
                    href={`/bible/${book.abbrev}/${ch}`}
                    onClick={onClose}
                    className={`rounded-lg border px-1 py-2 text-center text-sm font-medium ${
                      book.abbrev === currentAbbrev && ch === currentChapter
                        ? "border-accent bg-accent text-white"
                        : "border-line bg-paper text-ink hover:border-accent/40"
                    }`}
                  >
                    {ch}
                  </Link>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
