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

export type ApiSource = "bolls" | "bible-api" | "youversion" | "api-bible";

export interface TranslationInfo {
  id: string;
  name: string;
  language: string;
  apiSource: ApiSource;
  /** Numeric Bible ID for YouVersion API (only used when apiSource is "youversion") */
  youversionId?: number;
  /** String Bible ID for API.Bible (only used when apiSource is "api-bible") */
  apiBibleId?: string;
}

/**
 * Master list of available Bible translations.
 * Only includes translations verified to work with their respective APIs.
 */
export const TRANSLATIONS_LIST: TranslationInfo[] = [
  // ── English ──────────────────────────────────────────────
  { id: "kjv",   name: "King James Version",           language: "English", apiSource: "bible-api" },
  { id: "NKJV",  name: "New King James Version",       language: "English", apiSource: "bolls" },
  { id: "asv",   name: "American Standard Version",    language: "English", apiSource: "bible-api" },
  { id: "web",   name: "World English Bible",          language: "English", apiSource: "bible-api" },
  { id: "YLT",   name: "Young's Literal Translation",  language: "English", apiSource: "bolls" },
  { id: "NET",   name: "NET Bible",                    language: "English", apiSource: "bolls" },
  { id: "BSB",   name: "Berean Standard Bible",        language: "English", apiSource: "bolls" },
  { id: "NASB",  name: "New American Standard Bible",  language: "English", apiSource: "bolls" },
  { id: "ESV",   name: "English Standard Version",     language: "English", apiSource: "bolls" },
  { id: "CJB",   name: "Complete Jewish Bible",        language: "English", apiSource: "bolls" },
  { id: "TLV",   name: "Tree of Life Version",         language: "English", apiSource: "bolls" },

  // ── Spanish ──────────────────────────────────────────────
  { id: "RV1960", name: "Reina-Valera 1960",            language: "Spanish", apiSource: "bolls" },
  { id: "LBLA",  name: "La Biblia de las Americas",    language: "Spanish", apiSource: "bolls" },
  { id: "NVI",   name: "Nueva Version Internacional",  language: "Spanish", apiSource: "bolls" },

  // ── German ───────────────────────────────────────────────
  { id: "LUTH1545", name: "Luther Bible 1545",         language: "German", apiSource: "bolls" },
  { id: "ELB",   name: "Elberfelder Bibel",            language: "German", apiSource: "bolls" },

  // ── Russian ──────────────────────────────────────────────
  { id: "SYNOD", name: "Synodal Translation",          language: "Russian", apiSource: "bolls" },

  // ── Chinese ──────────────────────────────────────────────
  { id: "CUVS",  name: "Chinese Union Simplified",     language: "Chinese", apiSource: "bolls" },

  // ── Latin ────────────────────────────────────────────────
  { id: "DRB",   name: "Douay-Rheims Bible",           language: "Latin/English", apiSource: "bolls" },

  // ── YouVersion (requires YOUVERSION_APP_KEY + accepted licenses) ──
  { id: "YV-NIV",      name: "New International Version",            language: "English", apiSource: "youversion", youversionId: 111 },
  { id: "YV-NIVUK",    name: "New International Version UK",          language: "English", apiSource: "youversion", youversionId: 113 },
  { id: "YV-NIrV",     name: "New International Reader's Version",    language: "English", apiSource: "youversion", youversionId: 110 },
  { id: "YV-AMP",      name: "Amplified Bible",                       language: "English", apiSource: "youversion", youversionId: 1588 },
  { id: "YV-NASB2020", name: "New American Standard Bible 2020",      language: "English", apiSource: "youversion", youversionId: 2692 },
  { id: "YV-NASB1995", name: "New American Standard Bible 1995",      language: "English", apiSource: "youversion", youversionId: 100 },
  { id: "YV-TPT",      name: "The Passion Translation",               language: "English", apiSource: "youversion", youversionId: 1849 },
  { id: "YV-LSV",      name: "Literal Standard Version",              language: "English", apiSource: "youversion", youversionId: 2660 },
  { id: "YV-EASY",     name: "EasyEnglish Bible",                     language: "English", apiSource: "youversion", youversionId: 2079 },
  { id: "YV-FBV",      name: "Free Bible Version",                    language: "English", apiSource: "youversion", youversionId: 1932 },
  { id: "YV-CPDV",     name: "Catholic Public Domain Version",        language: "English", apiSource: "youversion", youversionId: 42 },
  { id: "YV-WMB",      name: "World Messianic Bible",                 language: "English", apiSource: "youversion", youversionId: 1209 },
  { id: "YV-OJB",      name: "Orthodox Jewish Bible",                 language: "English", apiSource: "youversion", youversionId: 130 },
  { id: "YV-GNV",      name: "Geneva Bible",                          language: "English", apiSource: "youversion", youversionId: 2163 },
  { id: "YV-PEV",      name: "Plain English Version",                 language: "English", apiSource: "youversion", youversionId: 2530 },
  { id: "YV-TCENT",    name: "Text-Critical English New Testament",   language: "English", apiSource: "youversion", youversionId: 3427 },

  // ── API.Bible (requires API_BIBLE_KEY) ──────────────────────────
  { id: "NLT",         name: "New Living Translation",                language: "English", apiSource: "api-bible", apiBibleId: "d6e14a625393b4da-01" },
  { id: "NTV",         name: "Nueva Traduccion Viviente",             language: "Spanish", apiSource: "api-bible", apiBibleId: "826f63861180e056-01" },
];

/** Quick lookup helpers */
export function getTranslation(id: string): TranslationInfo | undefined {
  return TRANSLATIONS_LIST.find((t) => t.id === id);
}

export function getTranslationLabel(id: string): string {
  const t = getTranslation(id);
  return t ? `${t.id.toUpperCase()} - ${t.name}` : id.toUpperCase();
}

/** Unique languages in the order they first appear */
export function getLanguages(): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const t of TRANSLATIONS_LIST) {
    if (!seen.has(t.language)) {
      seen.add(t.language);
      result.push(t.language);
    }
  }
  return result;
}

/** Translations grouped by language */
export function getTranslationsByLanguage(): Record<string, TranslationInfo[]> {
  const groups: Record<string, TranslationInfo[]> = {};
  for (const t of TRANSLATIONS_LIST) {
    if (!groups[t.language]) groups[t.language] = [];
    groups[t.language].push(t);
  }
  return groups;
}

// Keep the old type and TRANSLATIONS map for backward-compat with bible-api.ts
export type BibleTranslation = string;

export const TRANSLATIONS: Record<string, string> = Object.fromEntries(
  TRANSLATIONS_LIST.map((t) => [t.id, t.name])
);

export interface ChapterVerse {
  verse: number;
  text: string;
}

export interface ChapterResponse {
  reference: string;
  translation: string;
  verses: ChapterVerse[];
}
