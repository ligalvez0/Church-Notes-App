"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

interface ScriptureGroup {
  book: string;
  references: {
    id: string;
    chapter: number;
    verse_start: number;
    verse_end: number | null;
    note_id: string;
    note_title: string;
  }[];
}

export default function ScripturePage() {
  const [groups, setGroups] = useState<ScriptureGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScriptures();
  }, []);

  async function loadScriptures() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get all scripture references for user's notes
    const { data } = await supabase
      .from("scripture_references")
      .select(`
        id, book, chapter, verse_start, verse_end, note_id,
        sermon_notes!inner(title, user_id)
      `)
      .eq("sermon_notes.user_id", user.id)
      .order("book")
      .order("chapter")
      .order("verse_start");

    if (data) {
      const grouped: Record<string, ScriptureGroup> = {};
      for (const ref of data) {
        if (!grouped[ref.book]) {
          grouped[ref.book] = { book: ref.book, references: [] };
        }
        const noteData = ref.sermon_notes as unknown as { title: string };
        grouped[ref.book].references.push({
          id: ref.id,
          chapter: ref.chapter,
          verse_start: ref.verse_start,
          verse_end: ref.verse_end,
          note_id: ref.note_id,
          note_title: noteData?.title || "Untitled",
        });
      }
      setGroups(Object.values(grouped));
    }
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-3xl p-4 space-y-4">
      <h1 className="text-2xl font-bold">Scripture Index</h1>
      <p className="text-sm text-muted-foreground">
        Every passage referenced across your sermon notes.
      </p>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : groups.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <div className="rounded-2xl bg-muted p-6 mb-4">
            <BookOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No scripture references yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Scripture references will appear here as you add them to your notes.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <Card key={group.book}>
              <CardContent className="p-4">
                <h3 className="font-semibold text-primary mb-2">{group.book}</h3>
                <div className="space-y-1">
                  {group.references.map((ref) => (
                    <Link
                      key={ref.id}
                      href={`/notes/${ref.note_id}`}
                      className="flex items-center justify-between py-1 text-sm hover:text-primary"
                    >
                      <span>
                        {ref.chapter}:{ref.verse_start}
                        {ref.verse_end ? `-${ref.verse_end}` : ""}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {ref.note_title}
                      </span>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
