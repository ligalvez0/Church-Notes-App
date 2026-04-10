import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/ai";
import { SECTION_HEADINGS } from "@/lib/bible-headings";

export async function GET(request: NextRequest) {
  const book = request.nextUrl.searchParams.get("book");
  const chapter = request.nextUrl.searchParams.get("chapter");
  const verseTexts = request.nextUrl.searchParams.get("verses");

  if (!book || !chapter) {
    return NextResponse.json({ error: "book and chapter required" }, { status: 400 });
  }

  // Check manual headings first
  const key = `${book} ${chapter}`;
  if (SECTION_HEADINGS[key]) {
    return NextResponse.json({ headings: SECTION_HEADINGS[key], source: "manual" });
  }

  // No verses text provided — can't generate
  if (!verseTexts) {
    return NextResponse.json({ headings: [], source: "none" });
  }

  try {
    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: `You are a Bible study assistant. Given the following chapter text from ${book} ${chapter}, provide section headings like those found in study Bibles (e.g. NLT, ESV Study Bible).

Return ONLY a JSON array of objects with "verse" (the verse number where the heading starts) and "heading" (the heading text). Use 2-5 headings per chapter. Keep headings concise (3-8 words).

Example output:
[{"verse":1,"heading":"The Word Became Flesh"},{"verse":19,"heading":"John the Baptist's Testimony"}]

Chapter text:
${verseTexts}

Return ONLY the JSON array, no other text.`,
        },
      ],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return NextResponse.json({ headings: [], source: "ai_error" });
    }

    const headings = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ headings, source: "ai" });
  } catch (err) {
    console.error("AI headings error:", err);
    return NextResponse.json({ headings: [], source: "ai_error" });
  }
}
