"use client";

import { useState } from "react";
import { Search, Loader2, Sparkles } from "lucide-react";
import { NoteCard } from "@/components/notes/note-card";
import { createClient } from "@/lib/supabase/client";
import type { SermonNote } from "@/types/note";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SermonNote[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("sermon_notes")
      .select("*")
      .eq("user_id", user.id)
      .or(
        `title.ilike.%${query}%,plain_text.ilike.%${query}%,speaker.ilike.%${query}%`
      )
      .order("date", { ascending: false })
      .limit(20);

    setResults(data || []);
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight gradient-text">Search</h1>
        <p className="text-sm text-muted-foreground mt-1">Find anything across your notes</p>
      </div>

      <form onSubmit={handleSearch}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Try "forgiveness", "Romans", or a speaker name...'
            className="w-full h-14 rounded-2xl border border-border/40 bg-card pl-12 pr-4 text-base placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all shadow-sm"
          />
        </div>
      </form>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-10 w-10 rounded-2xl flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
            <Loader2 className="h-5 w-5 animate-spin text-white" />
          </div>
        </div>
      ) : searched ? (
        results.length > 0 ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {results.length} result{results.length !== 1 && "s"} for &quot;{query}&quot;
            </p>
            {results.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-muted-foreground">
              No results found for &quot;{query}&quot;
            </p>
          </div>
        )
      ) : (
        <div className="py-16 text-center animate-slide-up">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl" style={{ background: "var(--gradient-primary)", opacity: 0.15 }}>
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <p className="text-muted-foreground">Search across all your sermon notes</p>
        </div>
      )}
    </div>
  );
}
