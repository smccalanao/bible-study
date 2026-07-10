import type { TranslationId } from "../bible/types";

export type VerseOfTheDay = {
  bookAbbrev: string;
  bookName: string;
  chapter: number;
  verse: number;
  translationId: TranslationId;
};

const ROTATION: Omit<VerseOfTheDay, "translationId">[] = [
  { bookAbbrev: "jo", bookName: "John", chapter: 3, verse: 16 },
  { bookAbbrev: "ps", bookName: "Psalms", chapter: 23, verse: 1 },
  { bookAbbrev: "ph", bookName: "Philippians", chapter: 4, verse: 13 },
  { bookAbbrev: "jr", bookName: "Jeremiah", chapter: 29, verse: 11 },
  { bookAbbrev: "rm", bookName: "Romans", chapter: 8, verse: 28 },
  { bookAbbrev: "prv", bookName: "Proverbs", chapter: 3, verse: 5 },
  { bookAbbrev: "is", bookName: "Isaiah", chapter: 41, verse: 10 },
  { bookAbbrev: "mt", bookName: "Matthew", chapter: 11, verse: 28 },
  { bookAbbrev: "2tm", bookName: "2 Timothy", chapter: 1, verse: 7 },
  { bookAbbrev: "ps", bookName: "Psalms", chapter: 46, verse: 1 },
  { bookAbbrev: "hb", bookName: "Hebrews", chapter: 11, verse: 1 },
  { bookAbbrev: "jm", bookName: "James", chapter: 1, verse: 2 },
  { bookAbbrev: "1pe", bookName: "1 Peter", chapter: 5, verse: 7 },
  { bookAbbrev: "gl", bookName: "Galatians", chapter: 5, verse: 22 },
];

export function getVerseOfTheDay(
  translationId: TranslationId = "kjv",
  date = new Date(),
): VerseOfTheDay {
  const start = new Date(date.getFullYear(), 0, 0);
  const day = Math.floor((date.getTime() - start.getTime()) / 86_400_000);
  const pick = ROTATION[day % ROTATION.length];
  return { ...pick, translationId };
}
