import { NextRequest, NextResponse } from "next/server";
import type { BibleVerse, BibleTranslation } from "@/types/bible";

// bible-api.com supports: kjv, asv, web, and more
// Free, no API key needed
async function fetchFromBibleApi(
  reference: string,
  translation: BibleTranslation
): Promise<BibleVerse | null> {
  try {
    const encodedRef = encodeURIComponent(reference);
    const url = `https://bible-api.com/${encodedRef}?translation=${translation}`;
    const response = await fetch(url, { next: { revalidate: 86400 } }); // Cache 24h

    if (!response.ok) return null;

    const data = await response.json();

    if (!data.text) return null;

    // Parse the reference from the response
    const ref = data.reference || reference;
    const bookMatch = ref.match(/^(.+?)\s+(\d+):(\d+)(?:-(\d+))?$/);

    return {
      reference: data.reference || reference,
      text: data.text.trim(),
      translation: translation.toUpperCase(),
      book: bookMatch?.[1] || "",
      chapter: bookMatch ? parseInt(bookMatch[2], 10) : 0,
      verseStart: bookMatch ? parseInt(bookMatch[3], 10) : 0,
      verseEnd: bookMatch?.[4] ? parseInt(bookMatch[4], 10) : null,
    };
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const reference = searchParams.get("reference");
  const rawTranslation = searchParams.get("translation") || "kjv";

  if (!reference) {
    return NextResponse.json({ error: "Reference parameter required" }, { status: 400 });
  }

  // For ESV, we'd need the ESV API key — fall back to KJV for now
  const isEsv = rawTranslation === "esv";
  const translation: BibleTranslation = isEsv ? "kjv" : (rawTranslation as BibleTranslation);

  const verse = await fetchFromBibleApi(reference, translation);

  if (!verse) {
    return NextResponse.json({ error: "Verse not found" }, { status: 404 });
  }

  if (isEsv) {
    verse.translation = "KJV (ESV requires API key)";
  }

  return NextResponse.json(verse);
}
