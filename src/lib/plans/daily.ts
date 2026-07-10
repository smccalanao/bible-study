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

export type ReadingPlan = {
  id: string;
  title: string;
  description: string;
  days: number;
  readings: { day: number; label: string; bookAbbrev: string; chapter: number }[];
};

export const READING_PLANS: ReadingPlan[] = [
  {
    id: "gospel-of-john",
    title: "Gospel of John",
    description: "Read John in 21 days — one chapter a day.",
    days: 21,
    readings: Array.from({ length: 21 }, (_, i) => ({
      day: i + 1,
      label: `John ${i + 1}`,
      bookAbbrev: "jo",
      chapter: i + 1,
    })),
  },
  {
    id: "psalms-30",
    title: "Psalms in 30 Days",
    description: "A month of worship through selected Psalms.",
    days: 30,
    readings: Array.from({ length: 30 }, (_, i) => {
      const chapter = ((i * 5) % 150) + 1;
      return {
        day: i + 1,
        label: `Psalm ${chapter}`,
        bookAbbrev: "ps",
        chapter,
      };
    }),
  },
  {
    id: "nt-overview",
    title: "New Testament Overview",
    description: "Sample key chapters across the New Testament.",
    days: 14,
    readings: [
      { day: 1, label: "Matthew 5", bookAbbrev: "mt", chapter: 5 },
      { day: 2, label: "Mark 1", bookAbbrev: "mk", chapter: 1 },
      { day: 3, label: "Luke 15", bookAbbrev: "lk", chapter: 15 },
      { day: 4, label: "John 1", bookAbbrev: "jo", chapter: 1 },
      { day: 5, label: "Acts 2", bookAbbrev: "act", chapter: 2 },
      { day: 6, label: "Romans 8", bookAbbrev: "rm", chapter: 8 },
      { day: 7, label: "1 Corinthians 13", bookAbbrev: "1co", chapter: 13 },
      { day: 8, label: "Ephesians 2", bookAbbrev: "eph", chapter: 2 },
      { day: 9, label: "Philippians 2", bookAbbrev: "ph", chapter: 2 },
      { day: 10, label: "Colossians 3", bookAbbrev: "cl", chapter: 3 },
      { day: 11, label: "Hebrews 11", bookAbbrev: "hb", chapter: 11 },
      { day: 12, label: "James 1", bookAbbrev: "jm", chapter: 1 },
      { day: 13, label: "1 John 4", bookAbbrev: "1jo", chapter: 4 },
      { day: 14, label: "Revelation 21", bookAbbrev: "re", chapter: 21 },
    ],
  },
];
