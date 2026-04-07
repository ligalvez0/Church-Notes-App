"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NoteCard } from "@/components/notes/note-card";
import { createClient } from "@/lib/supabase/client";
import type { SermonNote } from "@/types/note";

export default function SeriesDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [series, setSeries] = useState<{ name: string; description: string | null } | null>(null);
  const [notes, setNotes] = useState<SermonNote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    const supabase = createClient();

    const { data: seriesData } = await supabase
      .from("series")
      .select("name, description")
      .eq("id", id)
      .single();

    if (seriesData) setSeries(seriesData);

    const { data: notesData } = await supabase
      .from("sermon_notes")
      .select("*")
      .eq("series_id", id)
      .order("date", { ascending: true });

    if (notesData) setNotes(notesData);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-4 space-y-4">
      <button
        onClick={() => router.push("/series")}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        &larr; Back to series
      </button>

      <div>
        <h1 className="text-2xl font-bold">{series?.name}</h1>
        {series?.description && (
          <p className="mt-1 text-muted-foreground">{series.description}</p>
        )}
        <p className="mt-2 text-sm text-muted-foreground">
          {notes.length} {notes.length === 1 ? "sermon" : "sermons"}
        </p>
      </div>

      {notes.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">
          No notes in this series yet. Assign notes from the editor.
        </p>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}
