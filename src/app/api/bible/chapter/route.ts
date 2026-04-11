import { NextRequest, NextResponse } from "next/server";
import type { ChapterVerse, ChapterResponse } from "@/types/bible";
import { getTranslation } from "@/types/bible";
import { BIBLE_BOOKS } from "@/lib/bible-data";
import { bookNameToUSFM, fetchPassage } from "@/lib/youversion";
import { fetchChapter as fetchApiBibleChapter } from "@/lib/api-bible";

/**
 * Map a canonical book name (e.g. "Genesis") to its 1-based book number
 * expected by the Bolls.life API. The order matches BIBLE_BOOKS which
 * follows the standard Protestant canon (Genesis=1 ... Revelation=66).
 */
function bookNameToNumber(bookName: string): number | null {
  const idx = BIBLE_BOOKS.findIndex(
    (b) => b.name.toLowerCase() === bookName.toLowerCase()
  );
  return idx >= 0 ? idx + 1 : null;
}

// ── Bolls.life fetcher ─────────────────────────────────────────────

interface BollsVerse {
  pk: number;
  verse: number;
  text: string;
  chapter?: number;
  book?: number;
}

/**
 * Clean verse text from Bolls.life API:
 * 1. Strip HTML tags
 * 2. Strip Strong's concordance numbers (digits immediately after words)
 * 3. Clean up extra whitespace
 */
function cleanBollsText(text: string): string {
  return text
    .replace(/<[^>]*>/g, "")           // strip HTML tags
    .replace(/(?<=[a-zA-Z,;:.!?'"])\d{2,5}/g, "") // strip Strong's numbers after words
    .replace(/\s{2,}/g, " ")           // collapse multiple spaces
    .trim();
}

async function fetchChapterFromBolls(
  translationCode: string,
  bookName: string,
  chapter: number
): Promise<ChapterResponse | null> {
  const bookNumber = bookNameToNumber(bookName);
  if (!bookNumber) return null;

  const url = `https://bolls.life/get-chapter/${translationCode}/${bookNumber}/${chapter}/`;
  const response = await fetch(url, { next: { revalidate: 86400 } });
  if (!response.ok) return null;

  const data: BollsVerse[] = await response.json();
  if (!Array.isArray(data) || data.length === 0) return null;

  const verses: ChapterVerse[] = data.map((v) => ({
    verse: v.verse,
    text: cleanBollsText(v.text),
  }));

  return {
    reference: `${bookName} ${chapter}`,
    translation: translationCode.toUpperCase(),
    verses,
  };
}

// ── bible-api.com fetcher ──────────────────────────────────────────

async function fetchChapterFromBibleApi(
  translationCode: string,
  bookName: string,
  chapter: number
): Promise<ChapterResponse | null> {
  const reference = `${bookName} ${chapter}`;
  const encodedRef = encodeURIComponent(reference);
  const url = `https://bible-api.com/${encodedRef}?translation=${translationCode}`;

  const response = await fetch(url, { next: { revalidate: 86400 } });
  if (!response.ok) return null;

  const data = await response.json();
  if (!data.verses || !Array.isArray(data.verses)) return null;

  const verses: ChapterVerse[] = data.verses.map(
    (v: { verse: number; text: string }) => ({
      verse: v.verse,
      text: v.text.trim(),
    })
  );

  return {
    reference: data.reference || reference,
    translation: translationCode.toUpperCase(),
    verses,
  };
}

// ── YouVersion chapter fetcher ────────────────────────────────────

async function fetchChapterFromYouVersion(
  youversionId: number,
  translationLabel: string,
  bookName: string,
  chapter: number
): Promise<ChapterResponse | null> {
  const usfm = bookNameToUSFM(bookName);
  if (!usfm) return null;

  // Fetch full chapter: GEN.1, JHN.3, etc.
  const usfmRef = `${usfm}.${chapter}`;
  const data = await fetchPassage(youversionId, usfmRef);
  if (!data || !data.content) return null;

  // YouVersion text format returns the whole chapter as a block.
  // Split into verses by detecting verse number markers like [1], [2], etc.
  const rawText = data.content;
  const versePattern = /\[(\d+)\]\s*/g;
  const verseParts: { verse: number; startIdx: number }[] = [];
  let match;

  while ((match = versePattern.exec(rawText)) !== null) {
    verseParts.push({
      verse: parseInt(match[1], 10),
      startIdx: match.index + match[0].length,
    });
  }

  if (verseParts.length === 0) {
    // Fallback: return entire content as verse 1
    return {
      reference: `${bookName} ${chapter}`,
      translation: translationLabel,
      verses: [{ verse: 1, text: rawText.trim() }],
    };
  }

  const verses: ChapterVerse[] = verseParts.map((vp, i) => {
    const endIdx =
      i < verseParts.length - 1 ? verseParts[i + 1].startIdx - `[${verseParts[i + 1].verse}] `.length : rawText.length;
    // Find the start of the next [N] marker to get the end of this verse's text
    const nextMarkerMatch = i < verseParts.length - 1
      ? rawText.lastIndexOf(`[${verseParts[i + 1].verse}]`, verseParts[i + 1].startIdx)
      : rawText.length;
    const text = rawText.slice(vp.startIdx, nextMarkerMatch).replace(/\s{2,}/g, " ").trim();
    return { verse: vp.verse, text };
  });

  return {
    reference: `${bookName} ${chapter}`,
    translation: translationLabel,
    verses,
  };
}

// ── API.Bible chapter fetcher ─────────────────────────────────────

async function fetchChapterFromApiBible(
  apiBibleId: string,
  translationLabel: string,
  bookName: string,
  chapter: number
): Promise<ChapterResponse | null> {
  const result = await fetchApiBibleChapter(apiBibleId, bookName, chapter);
  if (!result) return null;

  const verses: ChapterVerse[] = result.verses.map((v) => ({
    verse: v.verse,
    text: v.text,
  }));

  return {
    reference: result.reference,
    translation: translationLabel,
    verses,
  };
}

// ── Route handler ──────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const book = searchParams.get("book");
  const chapter = searchParams.get("chapter");
  const translationId = searchParams.get("translation") || "KJV";

  if (!book || !chapter) {
    return NextResponse.json(
      { error: "Both 'book' and 'chapter' parameters are required" },
      { status: 400 }
    );
  }

  const chapterNum = parseInt(chapter, 10);
  if (isNaN(chapterNum) || chapterNum < 1) {
    return NextResponse.json(
      { error: "Invalid chapter number" },
      { status: 400 }
    );
  }

  const info = getTranslation(translationId);
  const apiSource = info?.apiSource ?? "bolls";

  try {
    let result: ChapterResponse | null = null;

    if (apiSource === "api-bible" && info?.apiBibleId) {
      result = await fetchChapterFromApiBible(info.apiBibleId, translationId.toUpperCase(), book, chapterNum);
    } else if (apiSource === "youversion" && info?.youversionId) {
      result = await fetchChapterFromYouVersion(info.youversionId, translationId.toUpperCase(), book, chapterNum);
    } else if (apiSource === "bible-api") {
      result = await fetchChapterFromBibleApi(translationId, book, chapterNum);
    } else {
      result = await fetchChapterFromBolls(translationId, book, chapterNum);
    }

    if (!result) {
      return NextResponse.json(
        { error: "Chapter not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch chapter" },
      { status: 500 }
    );
  }
}
