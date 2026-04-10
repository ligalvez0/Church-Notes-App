"use client";

import { useState } from "react";
import { Search, Loader2, Sparkles, Brain } from "lucide-react";
import { NoteCard } from "@/components/notes/note-card";
import { createClient } from "@/lib/supabase/client";
import type { SermonNote } from "@/types/note";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SermonNote[]>([]);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [useAI, setUseAI] = useState(true);

  async function handleSearch() {
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    setAiAnswer(null);

    if (useAI) {
      // AI-powered search
      try {
        const res = await fetch("/api/ai/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: query.trim() }),
        });
        const data = await res.json();
        setAiAnswer(data.answer || null);
        setResults(data.results || []);
      } catch {
        // Fall back to basic search
        await basicSearch();
      }
    } else {
      await basicSearch();
    }

    setLoading(false);
  }

  async function basicSearch() {
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
  }

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight gradient-text">Search</h1>
        <p className="text-sm text-muted-foreground mt-1">Find anything across your notes</p>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder='Try "forgiveness", "Romans", or "what did pastor say about faith?"'
            className="w-full h-14 rounded-2xl border border-border/40 bg-card pl-12 pr-4 text-base placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all shadow-sm"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setUseAI(!useAI)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              useAI
                ? "bg-primary/10 text-primary"
                : "bg-secondary text-muted-foreground"
            }`}
          >
            <Brain className="h-3 w-3" />
            AI Search {useAI ? "ON" : "OFF"}
          </button>

          <button
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            className="flex items-center gap-1.5 rounded-2xl px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            style={{ background: "var(--gradient-primary)" }}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Search
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="h-10 w-10 rounded-2xl flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
            <Loader2 className="h-5 w-5 animate-spin text-white" />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            {useAI ? "AI is searching your notes..." : "Searching..."}
          </p>
        </div>
      ) : searched ? (
        <div className="space-y-4 animate-fade-in">
          {/* AI Answer */}
          {aiAnswer && (
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg" style={{ background: "var(--gradient-primary)" }}>
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
                <span className="text-xs font-semibold text-primary">AI Answer</span>
              </div>
              <p className="text-sm leading-relaxed">{aiAnswer}</p>
            </div>
          )}

          {/* Results */}
          {results.length > 0 ? (
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
          )}
        </div>
      ) : (
        <div className="py-16 text-center animate-slide-up">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl opacity-15" style={{ background: "var(--gradient-primary)" }}>
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <p className="text-muted-foreground">Search across all your sermon notes</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Try asking questions like &quot;What did we learn about grace?&quot;</p>
        </div>
      )}
    </div>
  );
}
