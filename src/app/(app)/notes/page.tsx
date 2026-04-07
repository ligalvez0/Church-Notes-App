"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Filter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NoteCard } from "@/components/notes/note-card";
import { createClient } from "@/lib/supabase/client";
import type { SermonNote } from "@/types/note";

export default function NotesPage() {
  const router = useRouter();
  const [notes, setNotes] = useState<SermonNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [speakerFilter, setSpeakerFilter] = useState("");
  const [speakers, setSpeakers] = useState<string[]>([]);

  useEffect(() => {
    loadNotes();
  }, []);

  async function loadNotes() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("sermon_notes")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_archived", false)
      .order("date", { ascending: false });

    if (data) {
      setNotes(data);
      const uniqueSpeakers = [...new Set(data.map((n) => n.speaker).filter(Boolean))] as string[];
      setSpeakers(uniqueSpeakers);
    }
    setLoading(false);
  }

  async function handleToggleFavorite(id: string, current: boolean) {
    const supabase = createClient();
    await supabase
      .from("sermon_notes")
      .update({ is_favorite: !current })
      .eq("id", id);

    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_favorite: !current } : n))
    );
  }

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      !searchQuery ||
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.plain_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.speaker && note.speaker.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSpeaker = !speakerFilter || note.speaker === speakerFilter;

    return matchesSearch && matchesSpeaker;
  });

  return (
    <div className="mx-auto max-w-3xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sermon Notes</h1>
        <Button onClick={() => router.push("/notes/new")}>
          <Plus className="mr-2 h-4 w-4" />
          New Note
        </Button>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        {speakers.length > 0 && (
          <select
            value={speakerFilter}
            onChange={(e) => setSpeakerFilter(e.target.value)}
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
          >
            <option value="">All speakers</option>
            {speakers.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-2xl bg-muted p-6 mb-4">
            <Filter className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">
            {notes.length === 0 ? "No notes yet" : "No matching notes"}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {notes.length === 0
              ? "Tap the + button to start your first sermon note."
              : "Try adjusting your search or filter."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
