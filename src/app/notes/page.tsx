"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getBook } from "@/lib/bible/books";
import type { Bookmark, Highlight, Note } from "@/lib/bible/types";
import {
  getBookmarks,
  getHighlights,
  getNotes,
} from "@/lib/storage/annotations";

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [tab, setTab] = useState<"notes" | "highlights" | "bookmarks">("notes");

  useEffect(() => {
    setNotes(
      [...getNotes()].sort(
        (a, b) => b.updatedAt.localeCompare(a.updatedAt),
      ),
    );
    setHighlights(
      [...getHighlights()].sort(
        (a, b) => b.createdAt.localeCompare(a.createdAt),
      ),
    );
    setBookmarks(
      [...getBookmarks()].sort(
        (a, b) => b.createdAt.localeCompare(a.createdAt),
      ),
    );
  }, []);

  return (
    <div className="page space-y-5">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
          Yours
        </p>
        <h1 className="mt-1 font-serif text-3xl font-semibold text-ink">
          Notes
        </h1>
      </header>

      <div className="flex gap-2">
        {(
          [
            ["notes", "Notes"],
            ["highlights", "Highlights"],
            ["bookmarks", "Saved"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${
              tab === id
                ? "bg-accent text-white"
                : "border border-line bg-paper-elevated text-ink-soft"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "notes" && (
        <ul className="space-y-2">
          {notes.length === 0 && (
            <p className="text-sm text-ink-soft">
              Tap a verse while reading to add a private note.
            </p>
          )}
          {notes.map((n) => {
            const book = getBook(n.bookAbbrev);
            return (
              <li key={n.id}>
                <Link
                  href={`/bible/${n.bookAbbrev}/${n.chapter}`}
                  className="block rounded-xl border border-line bg-paper-elevated px-4 py-3"
                >
                  <p className="text-sm font-semibold text-accent">
                    {book?.name} {n.chapter}:{n.verse}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-ink">{n.body}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {tab === "highlights" && (
        <ul className="space-y-2">
          {highlights.length === 0 && (
            <p className="text-sm text-ink-soft">
              No highlights yet. Color a verse from the reader.
            </p>
          )}
          {highlights.map((h) => {
            const book = getBook(h.bookAbbrev);
            return (
              <li key={h.id}>
                <Link
                  href={`/bible/${h.bookAbbrev}/${h.chapter}`}
                  className={`block rounded-xl border border-line px-4 py-3 hl-${h.color}`}
                >
                  <p className="text-sm font-semibold text-ink">
                    {book?.name} {h.chapter}:{h.verse}
                  </p>
                  <p className="mt-0.5 text-xs uppercase tracking-wide text-ink-soft">
                    {h.color} · {h.translationId.toUpperCase()}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {tab === "bookmarks" && (
        <ul className="space-y-2">
          {bookmarks.length === 0 && (
            <p className="text-sm text-ink-soft">
              Save chapters with the Save button in the reader.
            </p>
          )}
          {bookmarks.map((b) => {
            const book = getBook(b.bookAbbrev);
            return (
              <li key={b.id}>
                <Link
                  href={`/bible/${b.bookAbbrev}/${b.chapter}`}
                  className="block rounded-xl border border-line bg-paper-elevated px-4 py-3"
                >
                  <p className="font-serif text-lg font-semibold text-ink">
                    {b.label ?? `${book?.name} ${b.chapter}`}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
