"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
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

    // Full-text search across title, plain_text, and speaker
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
    <div className="mx-auto max-w-3xl p-4 space-y-4">
      <h1 className="text-2xl font-bold">Search</h1>

      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Search your notes... e.g. "forgiveness"'
          className="flex-1"
        />
        <button
          type="submit"
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground"
        >
          <Search className="h-4 w-4" />
        </button>
      </form>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
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
          <div className="py-12 text-center">
            <p className="text-muted-foreground">
              No results found for &quot;{query}&quot;
            </p>
          </div>
        )
      ) : (
        <div className="py-12 text-center text-muted-foreground">
          <Search className="mx-auto h-8 w-8 mb-2 opacity-50" />
          <p>Search across all your sermon notes</p>
        </div>
      )}
    </div>
  );
}
