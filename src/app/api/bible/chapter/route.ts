import { NextRequest, NextResponse } from "next/server";
import type { ChapterVerse, ChapterResponse } from "@/types/bible";
import { getTranslation } from "@/types/bible";
import { BIBLE_BOOKS } from "@/lib/bible-data";

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
    text: v.text.replace(/<[^>]*>/g, "").trim(), // strip any HTML tags
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

    if (apiSource === "bible-api") {
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
