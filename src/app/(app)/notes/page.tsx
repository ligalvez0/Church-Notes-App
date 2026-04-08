"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Loader2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div className="mx-auto max-w-3xl p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Sermon Notes</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {notes.length} {notes.length === 1 ? "note" : "notes"}
          </p>
        </div>
        <Button
          onClick={() => router.push("/notes/new")}
          size="lg"
          className="rounded-xl shadow-md shadow-primary/20"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Note
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 rounded-xl border border-border bg-card pl-10 pr-4 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>
        {speakers.length > 0 && (
          <select
            value={speakerFilter}
            onChange={(e) => setSpeakerFilter(e.target.value)}
            className="h-10 rounded-xl border border-border bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
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

      {/* Notes List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="rounded-2xl bg-primary/10 p-5 mb-5">
            <BookOpen className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">
            {notes.length === 0 ? "Start your first note" : "No matching notes"}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm">
            {notes.length === 0
              ? "Capture your next sermon with structured notes, Bible verse linking, and more."
              : "Try adjusting your search or filter."}
          </p>
          {notes.length === 0 && (
            <Button
              onClick={() => router.push("/notes/new")}
              className="mt-6 rounded-xl"
              size="lg"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Note
            </Button>
          )}
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
