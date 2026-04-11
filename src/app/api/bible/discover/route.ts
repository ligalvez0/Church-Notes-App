import { NextRequest, NextResponse } from "next/server";
import { listBibles } from "@/lib/youversion";

/**
 * GET /api/bible/discover?lang=en
 *
 * Lists Bible versions available from YouVersion for a given language.
 * Use this to find the numeric Bible IDs needed for the translations list.
 * Defaults to all languages (*).
 */
export async function GET(request: NextRequest) {
  const lang = request.nextUrl.searchParams.get("lang") || "*";

  try {
    const bibles = await listBibles(lang);
    return NextResponse.json({
      count: bibles.length,
      bibles: bibles.map((b) => ({
        id: b.id,
        name: b.name,
        abbreviation: b.abbreviation,
        language: b.language,
      })),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
