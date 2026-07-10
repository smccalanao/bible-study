import { BOOKS, cleanVerseText, getBook, getTranslation, TRANSLATIONS } from "./books";
import type { BibleBookJson, SearchHit, TranslationId } from "./types";
import { withBase } from "../basePath";

const cache = new Map<TranslationId, BibleBookJson[]>();

export async function loadTranslation(
  id: TranslationId,
): Promise<BibleBookJson[]> {
  const hit = cache.get(id);
  if (hit) return hit;

  const meta = getTranslation(id);
  const res = await fetch(withBase(meta.file));
  if (!res.ok) throw new Error(`Failed to load ${meta.name}`);
  const data = (await res.json()) as BibleBookJson[];
  cache.set(id, data);
  return data;
}

export async function getChapterVerses(
  translationId: TranslationId,
  bookAbbrev: string,
  chapter: number,
): Promise<string[]> {
  const data = await loadTranslation(translationId);
  const book = data.find((b) => b.abbrev === bookAbbrev);
  if (!book) throw new Error(`Book not found: ${bookAbbrev}`);
  const verses = book.chapters[chapter - 1];
  if (!verses) throw new Error(`Chapter not found: ${chapter}`);
  return verses.map(cleanVerseText);
}

export async function getVerseText(
  translationId: TranslationId,
  bookAbbrev: string,
  chapter: number,
  verse: number,
): Promise<string | null> {
  const verses = await getChapterVerses(translationId, bookAbbrev, chapter);
  return verses[verse - 1] ?? null;
}

export async function searchTranslation(
  translationId: TranslationId,
  query: string,
  limit = 50,
): Promise<SearchHit[]> {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  const data = await loadTranslation(translationId);
  const hits: SearchHit[] = [];

  for (const book of data) {
    const meta = getBook(book.abbrev) ?? BOOKS.find((b) => b.abbrev === book.abbrev);
    const bookName = meta?.name ?? book.abbrev;

    for (let c = 0; c < book.chapters.length; c++) {
      const chapter = book.chapters[c];
      for (let v = 0; v < chapter.length; v++) {
        const text = cleanVerseText(chapter[v]);
        if (text.toLowerCase().includes(q)) {
          hits.push({
            bookAbbrev: book.abbrev,
            bookName,
            chapter: c + 1,
            verse: v + 1,
            text,
          });
          if (hits.length >= limit) return hits;
        }
      }
    }
  }

  return hits;
}

export async function prefetchAllTranslations() {
  await Promise.all(TRANSLATIONS.map((t) => loadTranslation(t.id)));
}
