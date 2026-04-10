export interface BibleVerse {
  reference: string;
  text: string;
  translation: string;
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd: number | null;
}

export interface ParsedReference {
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd: number | null;
  raw: string;
}

export type BibleTranslation = "kjv" | "asv" | "web" | "esv";

export const TRANSLATIONS: Record<BibleTranslation, string> = {
  kjv: "King James Version",
  asv: "American Standard Version",
  web: "World English Bible",
  esv: "English Standard Version",
};

export interface ChapterVerse {
  verse: number;
  text: string;
}

export interface ChapterResponse {
  reference: string;
  translation: string;
  verses: ChapterVerse[];
}
