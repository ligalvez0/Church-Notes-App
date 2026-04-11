"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Library, Loader2, ChevronRight, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Series {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  note_count?: number;
}

export default function SeriesPage() {
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadSeries();
  }, []);

  async function loadSeries() {
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { setLoading(false); return; }

      const { data } = await supabase
        .from("series")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (data) {
        const withCounts = await Promise.all(
          data.map(async (s) => {
            const { count } = await supabase
              .from("sermon_notes")
              .select("*", { count: "exact", head: true })
              .eq("series_id", s.id);
            return { ...s, note_count: count || 0 };
          })
        );
        setSeriesList(withCounts);
      }
    } catch {}
    setLoading(false);
  }

  async function handleCreate() {
    if (!newName.trim()) return;
    setCreating(true);
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    await supabase.from("series").insert({
      user_id: session.user.id,
      name: newName.trim(),
      description: newDesc.trim() || null,
    });

    setNewName("");
    setNewDesc("");
    setCreateOpen(false);
    setCreating(false);
    loadSeries();
  }

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6 space-y-6 animate-fade-in">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            <span className="gradient-text">Series</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            {seriesList.length} {seriesList.length === 1 ? "series" : "series"} created
          </p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-1.5 rounded-2xl px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25"
          style={{ background: "var(--gradient-primary)" }}
        >
          <Plus className="h-4 w-4" />
          New Series
        </button>
      </div>

      {/* Create Series Inline Form */}
      {createOpen && (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-3 animate-fade-in">
          <h3 className="text-sm font-semibold">Create New Series</h3>
          <input
            placeholder="Series name (e.g. Romans Study, Fall 2025)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full h-11 rounded-2xl border border-border/40 bg-card px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            autoFocus
          />
          <input
            placeholder="Description (optional)"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            className="w-full h-11 rounded-2xl border border-border/40 bg-card px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => { setCreateOpen(false); setNewName(""); setNewDesc(""); }}
              className="px-4 py-2 rounded-2xl text-sm text-muted-foreground hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!newName.trim() || creating}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-medium text-white disabled:opacity-50"
              style={{ background: "var(--gradient-primary)" }}
            >
              {creating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              Create
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-10 w-10 rounded-2xl flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
            <Loader2 className="h-5 w-5 animate-spin text-white" />
          </div>
        </div>
      ) : seriesList.length === 0 && !createOpen ? (
        <div className="flex flex-col items-center py-20 text-center animate-slide-up">
          <div className="rounded-3xl p-7 mb-6 shadow-xl shadow-primary/10" style={{ background: "var(--gradient-primary)" }}>
            <Library className="h-12 w-12 text-white" />
          </div>
          <h3 className="text-xl font-bold">Create your first series</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-xs">
            Group related sermons together — like a book study, seasonal series, or guest speaker lineup.
          </p>
          <button
            onClick={() => setCreateOpen(true)}
            className="mt-6 flex items-center gap-1.5 rounded-2xl px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Plus className="h-4 w-4" />
            Create Series
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {seriesList.map((s, i) => (
            <Link key={s.id} href={`/series/${s.id}`}>
              <div
                className="group relative rounded-2xl border border-border/40 bg-card p-5 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1.5">
                    <h3 className="font-semibold text-[15px] group-hover:text-primary transition-colors">
                      {s.name}
                    </h3>
                    {s.description && (
                      <p className="text-sm text-muted-foreground/70 line-clamp-1">{s.description}</p>
                    )}
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <FileText className="h-3 w-3" />
                      {s.note_count} {s.note_count === 1 ? "sermon" : "sermons"}
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/20 group-hover:text-primary/40 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
