/**
 * YouVersion Platform API helper.
 *
 * Docs: https://developers.youversion.com
 * Auth: X-YVP-App-Key header
 * Base: https://api.youversion.com
 */

const YV_BASE = "https://api.youversion.com";

function getAppKey(): string {
  const key = process.env.YOUVERSION_APP_KEY;
  if (!key) throw new Error("YOUVERSION_APP_KEY is not set");
  return key;
}

function yvHeaders(): HeadersInit {
  return {
    "X-YVP-App-Key": getAppKey(),
    Accept: "application/json",
  };
}

// ── USFM book codes ──────────────────────────────────────────────
// Maps canonical book names (matching BIBLE_BOOKS) to standard USFM codes.

const BOOK_TO_USFM: Record<string, string> = {
  // Old Testament
  Genesis: "GEN",
  Exodus: "EXO",
  Leviticus: "LEV",
  Numbers: "NUM",
  Deuteronomy: "DEU",
  Joshua: "JOS",
  Judges: "JDG",
  Ruth: "RUT",
  "1 Samuel": "1SA",
  "2 Samuel": "2SA",
  "1 Kings": "1KI",
  "2 Kings": "2KI",
  "1 Chronicles": "1CH",
  "2 Chronicles": "2CH",
  Ezra: "EZR",
  Nehemiah: "NEH",
  Esther: "EST",
  Job: "JOB",
  Psalms: "PSA",
  Proverbs: "PRO",
  Ecclesiastes: "ECC",
  "Song of Solomon": "SNG",
  Isaiah: "ISA",
  Jeremiah: "JER",
  Lamentations: "LAM",
  Ezekiel: "EZK",
  Daniel: "DAN",
  Hosea: "HOS",
  Joel: "JOL",
  Amos: "AMO",
  Obadiah: "OBA",
  Jonah: "JON",
  Micah: "MIC",
  Nahum: "NAM",
  Habakkuk: "HAB",
  Zephaniah: "ZEP",
  Haggai: "HAG",
  Zechariah: "ZEC",
  Malachi: "MAL",
  // New Testament
  Matthew: "MAT",
  Mark: "MRK",
  Luke: "LUK",
  John: "JHN",
  Acts: "ACT",
  Romans: "ROM",
  "1 Corinthians": "1CO",
  "2 Corinthians": "2CO",
  Galatians: "GAL",
  Ephesians: "EPH",
  Philippians: "PHP",
  Colossians: "COL",
  "1 Thessalonians": "1TH",
  "2 Thessalonians": "2TH",
  "1 Timothy": "1TI",
  "2 Timothy": "2TI",
  Titus: "TIT",
  Philemon: "PHM",
  Hebrews: "HEB",
  James: "JAS",
  "1 Peter": "1PE",
  "2 Peter": "2PE",
  "1 John": "1JN",
  "2 John": "2JN",
  "3 John": "3JN",
  Jude: "JUD",
  Revelation: "REV",
};

export function bookNameToUSFM(bookName: string): string | null {
  return BOOK_TO_USFM[bookName] ?? null;
}

// ── API helpers ───────────────────────────────────────────────────

export interface YVBible {
  id: number;
  name: string;
  abbreviation: string;
  language: string;
}

/**
 * List available Bible versions from YouVersion.
 * Use `language_ranges[]=en` to filter by language, or `*` for all.
 */
export async function listBibles(languageRange = "*"): Promise<YVBible[]> {
  const url = `${YV_BASE}/v1/bibles?language_ranges[]=${encodeURIComponent(languageRange)}&page_size=100`;
  const res = await fetch(url, { headers: yvHeaders(), next: { revalidate: 86400 } });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`YouVersion listBibles failed (${res.status}): ${text}`);
  }
  const data = await res.json();
  return (data.data || data) as YVBible[];
}

export interface YVPassageResponse {
  reference: { human: string; usfm: string };
  content: string;
  verses?: { verse: number; text: string }[];
}

/**
 * Fetch a passage (verse, verse range, or full chapter) from YouVersion.
 *
 * @param bibleId  Numeric Bible version ID (e.g. 3034 for BSB)
 * @param usfmRef  USFM reference like "JHN.3.16", "GEN.1", "MAT.1.1-5"
 */
export async function fetchPassage(
  bibleId: number,
  usfmRef: string,
  includeHeadings = false
): Promise<YVPassageResponse | null> {
  const url =
    `${YV_BASE}/v1/bibles/${bibleId}/passages/${encodeURIComponent(usfmRef)}` +
    `?format=text&include_headings=${includeHeadings}`;
  const res = await fetch(url, { headers: yvHeaders(), next: { revalidate: 86400 } });
  if (!res.ok) return null;
  return res.json();
}
