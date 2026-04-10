import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/ai";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json({ error: "Query required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get all user's notes
    const { data: notes } = await supabase
      .from("sermon_notes")
      .select("id, title, speaker, date, plain_text")
      .eq("user_id", user.id)
      .eq("is_archived", false)
      .order("date", { ascending: false })
      .limit(50);

    if (!notes || notes.length === 0) {
      return NextResponse.json({ results: [], answer: "You don't have any notes yet." });
    }

    // Build notes context (truncate each to keep within token limits)
    const notesContext = notes
      .map((n, i) => `[Note ${i + 1}] "${n.title}" by ${n.speaker || "Unknown"} (${n.date?.split("T")[0]})\n${n.plain_text?.substring(0, 500) || "No content"}`)
      .join("\n\n---\n\n");

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 800,
      messages: [
        {
          role: "user",
          content: `You are a church sermon notes search assistant. A user is searching their sermon notes with this query: "${query}"

Here are their sermon notes:

${notesContext}

Respond with a JSON object:
- "answer": A helpful 1-3 sentence answer to their query based on their notes
- "matchingNoteIndexes": An array of note numbers (1-based) that are most relevant to the query (max 5)

Return ONLY the JSON object, no other text.`,
        },
      ],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ results: [], answer: "Could not process search." });
    }

    const result = JSON.parse(jsonMatch[0]);
    const matchingNotes = (result.matchingNoteIndexes || [])
      .map((idx: number) => notes[idx - 1])
      .filter(Boolean);

    return NextResponse.json({
      answer: result.answer,
      results: matchingNotes,
    });
  } catch (err) {
    console.error("AI search error:", err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
