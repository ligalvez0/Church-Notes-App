"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Loader2, BookOpen, Sparkles } from "lucide-react";
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
    <div className="mx-auto max-w-3xl p-4 sm:p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            <span className="gradient-text">Sermon Notes</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            {notes.length} {notes.length === 1 ? "note" : "notes"} captured
          </p>
        </div>
        <Button
          onClick={() => router.push("/notes/new")}
          className="rounded-2xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all"
          style={{ background: "var(--gradient-primary)" }}
        >
          <Plus className="mr-1.5 h-4 w-4" />
          New Note
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
          <input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 rounded-2xl border border-border/40 bg-card pl-10 pr-4 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all"
          />
        </div>
        {speakers.length > 0 && (
          <select
            value={speakerFilter}
            onChange={(e) => setSpeakerFilter(e.target.value)}
            className="h-11 rounded-2xl border border-border/40 bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
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
        <div className="flex flex-col items-center justify-center py-20">
          <div className="h-10 w-10 rounded-2xl flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
            <Loader2 className="h-5 w-5 animate-spin text-white" />
          </div>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-slide-up">
          <div className="relative">
            <div className="rounded-3xl p-7 mb-6 shadow-xl shadow-primary/10" style={{ background: "var(--gradient-primary)" }}>
              <BookOpen className="h-12 w-12 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 rounded-full p-1.5 bg-card shadow-md">
              <Sparkles className="h-4 w-4 text-amber-400" />
            </div>
          </div>
          <h3 className="text-xl font-bold">
            {notes.length === 0 ? "Start your first note" : "No matching notes"}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-xs leading-relaxed">
            {notes.length === 0
              ? "Capture your next sermon with structured notes, Bible verse linking, and more."
              : "Try adjusting your search or filter."}
          </p>
          {notes.length === 0 && (
            <Button
              onClick={() => router.push("/notes/new")}
              className="mt-6 rounded-2xl shadow-lg shadow-primary/25 hover:-translate-y-0.5 transition-all"
              style={{ background: "var(--gradient-primary)" }}
              size="lg"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Note
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotes.map((note, i) => (
            <div key={note.id} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
              <NoteCard
                note={note}
                onToggleFavorite={handleToggleFavorite}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
