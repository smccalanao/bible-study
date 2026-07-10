import type { Bookmark, Highlight, HighlightColor, Note, TranslationId } from "../bible/types";

const KEYS = {
  highlights: "bs:highlights",
  notes: "bs:notes",
  bookmarks: "bs:bookmarks",
  lastReading: "bs:lastReading",
  preferredTranslation: "bs:translation",
  parallelEnabled: "bs:parallel",
} as const;

export type LastReading = {
  bookAbbrev: string;
  chapter: number;
  translationId: TranslationId;
};

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getHighlights(): Highlight[] {
  return readJson(KEYS.highlights, []);
}

export function upsertHighlight(input: {
  translationId: TranslationId;
  bookAbbrev: string;
  chapter: number;
  verse: number;
  color: HighlightColor;
}): Highlight {
  const all = getHighlights();
  const existing = all.findIndex(
    (h) =>
      h.translationId === input.translationId &&
      h.bookAbbrev === input.bookAbbrev &&
      h.chapter === input.chapter &&
      h.verse === input.verse,
  );

  const next: Highlight = {
    id: existing >= 0 ? all[existing].id : uid(),
    ...input,
    createdAt: existing >= 0 ? all[existing].createdAt : new Date().toISOString(),
  };

  if (existing >= 0) all[existing] = next;
  else all.push(next);
  writeJson(KEYS.highlights, all);
  return next;
}

export function removeHighlight(
  translationId: TranslationId,
  bookAbbrev: string,
  chapter: number,
  verse: number,
) {
  writeJson(
    KEYS.highlights,
    getHighlights().filter(
      (h) =>
        !(
          h.translationId === translationId &&
          h.bookAbbrev === bookAbbrev &&
          h.chapter === chapter &&
          h.verse === verse
        ),
    ),
  );
}

export function getNotes(): Note[] {
  return readJson(KEYS.notes, []);
}

export function upsertNote(input: {
  translationId: TranslationId;
  bookAbbrev: string;
  chapter: number;
  verse: number;
  body: string;
}): Note {
  const all = getNotes();
  const existing = all.findIndex(
    (n) =>
      n.translationId === input.translationId &&
      n.bookAbbrev === input.bookAbbrev &&
      n.chapter === input.chapter &&
      n.verse === input.verse,
  );

  const next: Note = {
    id: existing >= 0 ? all[existing].id : uid(),
    ...input,
    updatedAt: new Date().toISOString(),
  };

  if (existing >= 0) all[existing] = next;
  else all.push(next);
  writeJson(KEYS.notes, all);
  return next;
}

export function removeNote(
  translationId: TranslationId,
  bookAbbrev: string,
  chapter: number,
  verse: number,
) {
  writeJson(
    KEYS.notes,
    getNotes().filter(
      (n) =>
        !(
          n.translationId === translationId &&
          n.bookAbbrev === bookAbbrev &&
          n.chapter === chapter &&
          n.verse === verse
        ),
    ),
  );
}

export function getBookmarks(): Bookmark[] {
  return readJson(KEYS.bookmarks, []);
}

export function toggleBookmark(input: {
  translationId: TranslationId;
  bookAbbrev: string;
  chapter: number;
  verse?: number;
  label?: string;
}): boolean {
  const all = getBookmarks();
  const idx = all.findIndex(
    (b) =>
      b.translationId === input.translationId &&
      b.bookAbbrev === input.bookAbbrev &&
      b.chapter === input.chapter &&
      (b.verse ?? null) === (input.verse ?? null),
  );

  if (idx >= 0) {
    all.splice(idx, 1);
    writeJson(KEYS.bookmarks, all);
    return false;
  }

  all.push({
    id: uid(),
    ...input,
    createdAt: new Date().toISOString(),
  });
  writeJson(KEYS.bookmarks, all);
  return true;
}

export function getLastReading(): LastReading | null {
  return readJson<LastReading | null>(KEYS.lastReading, null);
}

export function setLastReading(reading: LastReading) {
  writeJson(KEYS.lastReading, reading);
}

export function getPreferredTranslation(): TranslationId {
  return readJson<TranslationId>(KEYS.preferredTranslation, "kjv");
}

export function setPreferredTranslation(id: TranslationId) {
  writeJson(KEYS.preferredTranslation, id);
}

export function getParallelEnabled(): boolean {
  return readJson(KEYS.parallelEnabled, false);
}

export function setParallelEnabled(enabled: boolean) {
  writeJson(KEYS.parallelEnabled, enabled);
}
