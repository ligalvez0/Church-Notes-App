import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const { title, speaker, content } = await request.json();

    if (!content) {
      return NextResponse.json({ error: "Note content required" }, { status: 400 });
    }

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `You are a church sermon notes assistant. Summarize the following sermon notes into a clean, structured summary.

Sermon Title: ${title || "Untitled"}
Speaker: ${speaker || "Unknown"}

Notes:
${content}

Provide your response as a JSON object with these fields:
- "summary": A 2-3 sentence overview of the sermon's main message
- "keyTakeaways": An array of 3-5 key points or takeaways (short sentences)
- "themes": An array of 2-4 one-word or short-phrase themes (e.g. "Grace", "Forgiveness", "Faith in trials")
- "applicationPrompts": An array of 2-3 personal application questions starting with "How might you..." or "This week, consider..."

Return ONLY the JSON object, no other text.`,
        },
      ],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }

    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json(result);
  } catch (err) {
    console.error("AI summarize error:", err);
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 });
  }
}
