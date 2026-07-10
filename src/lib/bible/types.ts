export type TranslationId = "kjv" | "bbe" | "nkjv";

export type BibleBookJson = {
  abbrev: string;
  chapters: string[][];
};

export type TranslationMeta = {
  id: TranslationId;
  name: string;
  shortName: string;
  file: string;
  publicDomain: boolean;
};

export type BookMeta = {
  abbrev: string;
  name: string;
  testament: "OT" | "NT";
  chapters: number;
};

export type VerseRef = {
  bookAbbrev: string;
  chapter: number;
  verse: number;
};

export type ParsedReference = {
  bookAbbrev: string;
  chapter: number;
  verseStart?: number;
  verseEnd?: number;
};

export type HighlightColor = "yellow" | "green" | "blue" | "pink" | "orange";

export type Highlight = {
  id: string;
  translationId: TranslationId;
  bookAbbrev: string;
  chapter: number;
  verse: number;
  color: HighlightColor;
  createdAt: string;
};

export type Note = {
  id: string;
  translationId: TranslationId;
  bookAbbrev: string;
  chapter: number;
  verse: number;
  body: string;
  updatedAt: string;
};

export type Bookmark = {
  id: string;
  translationId: TranslationId;
  bookAbbrev: string;
  chapter: number;
  verse?: number;
  label?: string;
  createdAt: string;
};

export type SearchHit = {
  bookAbbrev: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
};
