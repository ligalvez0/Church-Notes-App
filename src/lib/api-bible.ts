/**
 * API.Bible helper (scripture.api.bible)
 *
 * Docs: https://docs.api.bible
 * Auth: api-key header
 * Base: https://rest.api.bible/v1
 */

import { bookNameToUSFM } from "@/lib/youversion";

const AB_BASE = "https://rest.api.bible/v1";

function getApiKey(): string {
  const key = process.env.API_BIBLE_KEY;
  if (!key) throw new Error("API_BIBLE_KEY is not set");
  return key;
}

function abHeaders(): HeadersInit {
  return {
    "api-key": getApiKey(),
    Accept: "application/json",
  };
}

// ── Types ────────────────────────────────────────────────────────

interface ABVerseResponse {
  data: {
    id: string;
    reference: string;
    content: string;
  };
}

interface ABChapterResponse {
  data: {
    id: string;
    reference: string;
    content: string;
  };
}

// ── Helpers ──────────────────────────────────────────────────────

/**
 * Strip HTML tags and clean up API.Bible text content.
 */
function cleanContent(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")       // strip HTML tags
    .replace(/¶/g, "")             // remove pilcrow marks
    .replace(/\s{2,}/g, " ")       // collapse whitespace
    .trim();
}

// ── Fetch a single verse or verse range ──────────────────────────

export async function fetchVerse(
  bibleId: string,
  bookName: string,
  chapter: number,
  verseStart: number,
  verseEnd: number | null
): Promise<{ reference: string; text: string } | null> {
  const usfm = bookNameToUSFM(bookName);
  if (!usfm) return null;

  // API.Bible passage ID format: GEN.1.1 or GEN.1.1-GEN.1.3
  const passageId = verseEnd
    ? `${usfm}.${chapter}.${verseStart}-${usfm}.${chapter}.${verseEnd}`
    : `${usfm}.${chapter}.${verseStart}`;

  const url = `${AB_BASE}/bibles/${bibleId}/passages/${encodeURIComponent(passageId)}?content-type=text&include-notes=false&include-titles=false&include-chapter-numbers=false&include-verse-numbers=false`;

  console.log("[api-bible] fetching verse:", url);
  const res = await fetch(url, {
    headers: abHeaders(),
    next: { revalidate: 86400 },
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    console.error(`[api-bible] verse fetch failed (${res.status}):`, errText);
    return null;
  }

  const json: ABVerseResponse = await res.json();
  if (!json.data?.content) return null;

  return {
    reference: json.data.reference || `${bookName} ${chapter}:${verseStart}${verseEnd ? `-${verseEnd}` : ""}`,
    text: cleanContent(json.data.content),
  };
}

// ── Fetch a full chapter ─────────────────────────────────────────

export async function fetchChapter(
  bibleId: string,
  bookName: string,
  chapter: number
): Promise<{ reference: string; verses: { verse: number; text: string }[] } | null> {
  const usfm = bookNameToUSFM(bookName);
  if (!usfm) return null;

  const chapterId = `${usfm}.${chapter}`;
  const url = `${AB_BASE}/bibles/${bibleId}/chapters/${encodeURIComponent(chapterId)}?content-type=text&include-notes=false&include-titles=false&include-chapter-numbers=false&include-verse-numbers=true`;

  console.log("[api-bible] fetching chapter:", url);
  const res = await fetch(url, {
    headers: abHeaders(),
    next: { revalidate: 86400 },
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    console.error(`[api-bible] chapter fetch failed (${res.status}):`, errText);
    return null;
  }

  const json: ABChapterResponse = await res.json();
  if (!json.data?.content) return null;

  // With include-verse-numbers=true, content has markers like [1] text [2] text ...
  const rawText = json.data.content;
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
    return {
      reference: json.data.reference || `${bookName} ${chapter}`,
      verses: [{ verse: 1, text: cleanContent(rawText) }],
    };
  }

  const verses = verseParts.map((vp, i) => {
    const endIdx = i < verseParts.length - 1
      ? rawText.lastIndexOf(`[${verseParts[i + 1].verse}]`, verseParts[i + 1].startIdx)
      : rawText.length;
    const text = cleanContent(rawText.slice(vp.startIdx, endIdx));
    return { verse: vp.verse, text };
  });

  return {
    reference: json.data.reference || `${bookName} ${chapter}`,
    verses,
  };
}
