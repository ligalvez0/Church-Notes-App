import { NextRequest, NextResponse } from "next/server";
import type { BibleTranslation, ChapterVerse, ChapterResponse } from "@/types/bible";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const book = searchParams.get("book");
  const chapter = searchParams.get("chapter");
  const rawTranslation = searchParams.get("translation") || "kjv";

  if (!book || !chapter) {
    return NextResponse.json(
      { error: "Both 'book' and 'chapter' parameters are required" },
      { status: 400 }
    );
  }

  const isEsv = rawTranslation === "esv";
  const translation: BibleTranslation = isEsv
    ? "kjv"
    : (rawTranslation as BibleTranslation);

  try {
    const reference = `${book} ${chapter}`;
    const encodedRef = encodeURIComponent(reference);
    const url = `https://bible-api.com/${encodedRef}?translation=${translation}`;

    const response = await fetch(url, { next: { revalidate: 86400 } });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Chapter not found" },
        { status: 404 }
      );
    }

    const data = await response.json();

    if (!data.verses || !Array.isArray(data.verses)) {
      return NextResponse.json(
        { error: "Invalid response from Bible API" },
        { status: 502 }
      );
    }

    const verses: ChapterVerse[] = data.verses.map(
      (v: { verse: number; text: string }) => ({
        verse: v.verse,
        text: v.text.trim(),
      })
    );

    const result: ChapterResponse = {
      reference: data.reference || reference,
      translation: isEsv
        ? "KJV (ESV requires API key)"
        : translation.toUpperCase(),
      verses,
    };

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch chapter" },
      { status: 500 }
    );
  }
}
