import type { BookMeta, TranslationId, TranslationMeta } from "./types";

export const TRANSLATIONS: TranslationMeta[] = [
  {
    id: "kjv",
    name: "King James Version",
    shortName: "KJV",
    file: "/data/bibles/kjv.json",
    publicDomain: true,
  },
  {
    id: "bbe",
    name: "Bible in Basic English",
    shortName: "BBE",
    file: "/data/bibles/bbe.json",
    publicDomain: true,
  },
];

/** Protestant canon order matching thiagobodruk/bible JSON files */
export const BOOKS: BookMeta[] = [
  { abbrev: "gn", name: "Genesis", testament: "OT", chapters: 50 },
  { abbrev: "ex", name: "Exodus", testament: "OT", chapters: 40 },
  { abbrev: "lv", name: "Leviticus", testament: "OT", chapters: 27 },
  { abbrev: "nm", name: "Numbers", testament: "OT", chapters: 36 },
  { abbrev: "dt", name: "Deuteronomy", testament: "OT", chapters: 34 },
  { abbrev: "js", name: "Joshua", testament: "OT", chapters: 24 },
  { abbrev: "jud", name: "Judges", testament: "OT", chapters: 21 },
  { abbrev: "rt", name: "Ruth", testament: "OT", chapters: 4 },
  { abbrev: "1sm", name: "1 Samuel", testament: "OT", chapters: 31 },
  { abbrev: "2sm", name: "2 Samuel", testament: "OT", chapters: 24 },
  { abbrev: "1kgs", name: "1 Kings", testament: "OT", chapters: 22 },
  { abbrev: "2kgs", name: "2 Kings", testament: "OT", chapters: 25 },
  { abbrev: "1ch", name: "1 Chronicles", testament: "OT", chapters: 29 },
  { abbrev: "2ch", name: "2 Chronicles", testament: "OT", chapters: 36 },
  { abbrev: "ezr", name: "Ezra", testament: "OT", chapters: 10 },
  { abbrev: "ne", name: "Nehemiah", testament: "OT", chapters: 13 },
  { abbrev: "et", name: "Esther", testament: "OT", chapters: 10 },
  { abbrev: "job", name: "Job", testament: "OT", chapters: 42 },
  { abbrev: "ps", name: "Psalms", testament: "OT", chapters: 150 },
  { abbrev: "prv", name: "Proverbs", testament: "OT", chapters: 31 },
  { abbrev: "ec", name: "Ecclesiastes", testament: "OT", chapters: 12 },
  { abbrev: "so", name: "Song of Solomon", testament: "OT", chapters: 8 },
  { abbrev: "is", name: "Isaiah", testament: "OT", chapters: 66 },
  { abbrev: "jr", name: "Jeremiah", testament: "OT", chapters: 52 },
  { abbrev: "lm", name: "Lamentations", testament: "OT", chapters: 5 },
  { abbrev: "ez", name: "Ezekiel", testament: "OT", chapters: 48 },
  { abbrev: "dn", name: "Daniel", testament: "OT", chapters: 12 },
  { abbrev: "ho", name: "Hosea", testament: "OT", chapters: 14 },
  { abbrev: "jl", name: "Joel", testament: "OT", chapters: 3 },
  { abbrev: "am", name: "Amos", testament: "OT", chapters: 9 },
  { abbrev: "ob", name: "Obadiah", testament: "OT", chapters: 1 },
  { abbrev: "jn", name: "Jonah", testament: "OT", chapters: 4 },
  { abbrev: "mi", name: "Micah", testament: "OT", chapters: 7 },
  { abbrev: "na", name: "Nahum", testament: "OT", chapters: 3 },
  { abbrev: "hk", name: "Habakkuk", testament: "OT", chapters: 3 },
  { abbrev: "zp", name: "Zephaniah", testament: "OT", chapters: 3 },
  { abbrev: "hg", name: "Haggai", testament: "OT", chapters: 2 },
  { abbrev: "zc", name: "Zechariah", testament: "OT", chapters: 14 },
  { abbrev: "ml", name: "Malachi", testament: "OT", chapters: 4 },
  { abbrev: "mt", name: "Matthew", testament: "NT", chapters: 28 },
  { abbrev: "mk", name: "Mark", testament: "NT", chapters: 16 },
  { abbrev: "lk", name: "Luke", testament: "NT", chapters: 24 },
  { abbrev: "jo", name: "John", testament: "NT", chapters: 21 },
  { abbrev: "act", name: "Acts", testament: "NT", chapters: 28 },
  { abbrev: "rm", name: "Romans", testament: "NT", chapters: 16 },
  { abbrev: "1co", name: "1 Corinthians", testament: "NT", chapters: 16 },
  { abbrev: "2co", name: "2 Corinthians", testament: "NT", chapters: 13 },
  { abbrev: "gl", name: "Galatians", testament: "NT", chapters: 6 },
  { abbrev: "eph", name: "Ephesians", testament: "NT", chapters: 6 },
  { abbrev: "ph", name: "Philippians", testament: "NT", chapters: 4 },
  { abbrev: "cl", name: "Colossians", testament: "NT", chapters: 4 },
  { abbrev: "1ts", name: "1 Thessalonians", testament: "NT", chapters: 5 },
  { abbrev: "2ts", name: "2 Thessalonians", testament: "NT", chapters: 3 },
  { abbrev: "1tm", name: "1 Timothy", testament: "NT", chapters: 6 },
  { abbrev: "2tm", name: "2 Timothy", testament: "NT", chapters: 4 },
  { abbrev: "tt", name: "Titus", testament: "NT", chapters: 3 },
  { abbrev: "phm", name: "Philemon", testament: "NT", chapters: 1 },
  { abbrev: "hb", name: "Hebrews", testament: "NT", chapters: 13 },
  { abbrev: "jm", name: "James", testament: "NT", chapters: 5 },
  { abbrev: "1pe", name: "1 Peter", testament: "NT", chapters: 5 },
  { abbrev: "2pe", name: "2 Peter", testament: "NT", chapters: 3 },
  { abbrev: "1jo", name: "1 John", testament: "NT", chapters: 5 },
  { abbrev: "2jo", name: "2 John", testament: "NT", chapters: 1 },
  { abbrev: "3jo", name: "3 John", testament: "NT", chapters: 1 },
  { abbrev: "jd", name: "Jude", testament: "NT", chapters: 1 },
  { abbrev: "re", name: "Revelation", testament: "NT", chapters: 22 },
];

const BOOK_BY_ABBREV = new Map(BOOKS.map((b) => [b.abbrev, b]));
const BOOK_BY_NAME = new Map(
  BOOKS.flatMap((b) => {
    const keys = [
      b.name.toLowerCase(),
      b.name.toLowerCase().replace(/\s+/g, ""),
      b.abbrev.toLowerCase(),
    ];
    // Common aliases
    if (b.abbrev === "ps") keys.push("psalm", "psalms");
    if (b.abbrev === "so") keys.push("song of songs", "canticles", "sos");
    if (b.abbrev === "jo") keys.push("joh", "jhn", "jn");
    if (b.abbrev === "jn") keys.push("jon", "jona");
    if (b.abbrev === "jud") keys.push("jg", "judg", "judges");
    if (b.abbrev === "jd") keys.push("jude");
    if (b.abbrev === "1ts") keys.push("1 th", "1 thess", "1 thessalonians", "1th");
    if (b.abbrev === "2ts") keys.push("2 th", "2 thess", "2 thessalonians", "2th");
    return keys.map((k) => [k, b] as const);
  }),
);

export function getBook(abbrev: string): BookMeta | undefined {
  return BOOK_BY_ABBREV.get(abbrev);
}

export function getBookByName(name: string): BookMeta | undefined {
  return BOOK_BY_NAME.get(name.trim().toLowerCase());
}

export function getTranslation(id: TranslationId) {
  return TRANSLATIONS.find((t) => t.id === id)!;
}

export function cleanVerseText(text: string): string {
  return text
    .replace(/\{[^}]*\}/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
