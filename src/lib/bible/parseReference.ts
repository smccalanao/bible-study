import { BOOKS, getBookByName } from "./books";
import type { ParsedReference } from "./types";

/**
 * Parse references like:
 * - John 3:16
 * - Jn 3:16-18
 * - Genesis 1
 * - 1 John 4:8
 */
export function parseReference(input: string): ParsedReference | null {
  const raw = input.trim().replace(/\s+/g, " ");
  if (!raw) return null;

  const match = raw.match(
    /^((?:\d\s*)?[A-Za-z][A-Za-z\s.]*?)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/,
  );
  if (!match) return null;

  const [, bookPart, chapterStr, verseStartStr, verseEndStr] = match;
  const book = resolveBook(bookPart);
  if (!book) return null;

  const chapter = Number(chapterStr);
  if (chapter < 1 || chapter > book.chapters) return null;

  const verseStart = verseStartStr ? Number(verseStartStr) : undefined;
  const verseEnd = verseEndStr ? Number(verseEndStr) : verseStart;

  return {
    bookAbbrev: book.abbrev,
    chapter,
    verseStart,
    verseEnd,
  };
}

function resolveBook(bookPart: string) {
  const cleaned = bookPart.replace(/\./g, "").trim();
  const direct = getBookByName(cleaned);
  if (direct) return direct;

  const lower = cleaned.toLowerCase();
  return (
    BOOKS.find(
      (b) =>
        b.name.toLowerCase().startsWith(lower) ||
        b.abbrev.toLowerCase() === lower.replace(/\s+/g, ""),
    ) ?? undefined
  );
}

export function formatReference(
  bookName: string,
  chapter: number,
  verse?: number,
  verseEnd?: number,
): string {
  if (verse == null) return `${bookName} ${chapter}`;
  if (verseEnd != null && verseEnd !== verse) {
    return `${bookName} ${chapter}:${verse}-${verseEnd}`;
  }
  return `${bookName} ${chapter}:${verse}`;
}

export function looksLikeReference(query: string): boolean {
  return /^\s*(?:\d\s*)?[A-Za-z].+\s+\d+/i.test(query.trim());
}
