import { NextRequest, NextResponse } from "next/server";
import type { BibleVerse } from "@/types/bible";
import { getTranslation } from "@/types/bible";
import { BIBLE_BOOKS } from "@/lib/bible-data";

/**
 * Map a canonical book name to its 1-based Bolls.life book number.
 */
function bookNameToNumber(bookName: string): number | null {
  const idx = BIBLE_BOOKS.findIndex(
    (b) => b.name.toLowerCase() === bookName.toLowerCase()
  );
  return idx >= 0 ? idx + 1 : null;
}

/**
 * Parse a human-readable reference like "John 3:16" or "1 John 1:1-3"
 * into { book, chapter, verseStart, verseEnd? }.
 */
function parseReference(reference: string) {
  const m = reference.match(/^(.+?)\s+(\d+):(\d+)(?:\s*-\s*(\d+))?$/);
  if (!m) return null;
  return {
    book: m[1].trim(),
    chapter: parseInt(m[2], 10),
    verseStart: parseInt(m[3], 10),
    verseEnd: m[4] ? parseInt(m[4], 10) : null,
  };
}

// ── Bolls.life fetcher ─────────────────────────────────────────────

interface BollsVerse {
  pk: number;
  verse: number;
  text: string;
}

async function fetchVerseFromBolls(
  translationCode: string,
  reference: string
): Promise<BibleVerse | null> {
  const parsed = parseReference(reference);
  if (!parsed) return null;

  const bookNumber = bookNameToNumber(parsed.book);
  if (!bookNumber) return null;

  // Bolls.life doesn't have a single-verse endpoint — fetch the full chapter
  // then filter to the requested verse(s).
  const url = `https://bolls.life/get-chapter/${translationCode}/${bookNumber}/${parsed.chapter}/`;
  const response = await fetch(url, { next: { revalidate: 86400 } });
  if (!response.ok) return null;

  const data: BollsVerse[] = await response.json();
  if (!Array.isArray(data) || data.length === 0) return null;

  const end = parsed.verseEnd ?? parsed.verseStart;
  const matchingVerses = data.filter(
    (v) => v.verse >= parsed.verseStart && v.verse <= end
  );
  if (matchingVerses.length === 0) return null;

  const text = matchingVerses
    .map((v) => v.text.replace(/<[^>]*>/g, "").trim())
    .join(" ");

  const refStr = parsed.verseEnd
    ? `${parsed.book} ${parsed.chapter}:${parsed.verseStart}-${parsed.verseEnd}`
    : `${parsed.book} ${parsed.chapter}:${parsed.verseStart}`;

  return {
    reference: refStr,
    text,
    translation: translationCode.toUpperCase(),
    book: parsed.book,
    chapter: parsed.chapter,
    verseStart: parsed.verseStart,
    verseEnd: parsed.verseEnd,
  };
}

// ── bible-api.com fetcher ──────────────────────────────────────────

async function fetchVerseFromBibleApi(
  translationCode: string,
  reference: string
): Promise<BibleVerse | null> {
  try {
    const encodedRef = encodeURIComponent(reference);
    const url = `https://bible-api.com/${encodedRef}?translation=${translationCode}`;
    const response = await fetch(url, { next: { revalidate: 86400 } });
    if (!response.ok) return null;

    const data = await response.json();
    if (!data.text) return null;

    const ref = data.reference || reference;
    const bookMatch = ref.match(/^(.+?)\s+(\d+):(\d+)(?:-(\d+))?$/);

    return {
      reference: ref,
      text: data.text.trim(),
      translation: translationCode.toUpperCase(),
      book: bookMatch?.[1] || "",
      chapter: bookMatch ? parseInt(bookMatch[2], 10) : 0,
      verseStart: bookMatch ? parseInt(bookMatch[3], 10) : 0,
      verseEnd: bookMatch?.[4] ? parseInt(bookMatch[4], 10) : null,
    };
  } catch {
    return null;
  }
}

// ── Route handler ──────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const reference = searchParams.get("reference");
  const translationId = searchParams.get("translation") || "KJV";

  if (!reference) {
    return NextResponse.json(
      { error: "Reference parameter required" },
      { status: 400 }
    );
  }

  const info = getTranslation(translationId);
  const apiSource = info?.apiSource ?? "bolls";

  let verse: BibleVerse | null = null;

  if (apiSource === "bible-api") {
    verse = await fetchVerseFromBibleApi(translationId, reference);
  } else {
    verse = await fetchVerseFromBolls(translationId, reference);
  }

  if (!verse) {
    return NextResponse.json({ error: "Verse not found" }, { status: 404 });
  }

  return NextResponse.json(verse);
}
