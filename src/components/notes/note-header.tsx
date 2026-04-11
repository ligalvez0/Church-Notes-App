"use client";

import { useEffect, useState } from "react";
import { User, Calendar, Library, Plus, Loader2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface NoteHeaderProps {
  title: string;
  speaker: string;
  date: string;
  seriesId: string | null;
  onTitleChange: (title: string) => void;
  onSpeakerChange: (speaker: string) => void;
  onDateChange: (date: string) => void;
  onSeriesChange: (seriesId: string | null) => void;
}

interface SeriesOption {
  id: string;
  name: string;
}

export function NoteHeader({
  title,
  speaker,
  date,
  seriesId,
  onTitleChange,
  onSpeakerChange,
  onDateChange,
  onSeriesChange,
}: NoteHeaderProps) {
  const [seriesList, setSeriesList] = useState<SeriesOption[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newSeriesName, setNewSeriesName] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadSeries();
  }, []);

  async function loadSeries() {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const { data } = await supabase
      .from("series")
      .select("id, name")
      .eq("user_id", session.user.id)
      .order("name");

    if (data) setSeriesList(data);
  }

  async function handleCreateSeries() {
    if (!newSeriesName.trim()) return;
    setCreating(true);

    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) { setCreating(false); return; }

    const { data } = await supabase
      .from("series")
      .insert({
        user_id: session.user.id,
        name: newSeriesName.trim(),
      })
      .select("id, name")
      .single();

    if (data) {
      setSeriesList((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      onSeriesChange(data.id);
    }

    setNewSeriesName("");
    setShowCreate(false);
    setCreating(false);
  }

  function handleSeriesSelect(value: string) {
    if (value === "__create__") {
      setShowCreate(true);
    } else {
      onSeriesChange(value || null);
    }
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <input
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Sermon Title"
        className="w-full bg-transparent text-2xl sm:text-3xl font-bold tracking-tight placeholder:text-muted-foreground/30 focus:outline-none text-foreground"
      />
      <div className="flex flex-wrap items-center gap-3 pb-4 border-b border-border/30">
        <div className="flex items-center gap-2 rounded-2xl bg-secondary/40 px-3.5 py-2 transition-colors focus-within:bg-secondary/70 focus-within:ring-2 focus-within:ring-primary/20">
          <User className="h-3.5 w-3.5 text-primary/60" />
          <input
            value={speaker}
            onChange={(e) => onSpeakerChange(e.target.value)}
            placeholder="Speaker name"
            className="bg-transparent text-sm placeholder:text-muted-foreground/40 focus:outline-none w-32"
          />
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-secondary/40 px-3.5 py-2 transition-colors focus-within:bg-secondary/70 focus-within:ring-2 focus-within:ring-primary/20">
          <Calendar className="h-3.5 w-3.5 text-primary/60" />
          <input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="bg-transparent text-sm focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-secondary/40 px-3.5 py-2 transition-colors focus-within:bg-secondary/70 focus-within:ring-2 focus-within:ring-primary/20">
          <Library className="h-3.5 w-3.5 text-primary/60" />
          <select
            value={seriesId || ""}
            onChange={(e) => handleSeriesSelect(e.target.value)}
            className="bg-transparent text-sm focus:outline-none appearance-none cursor-pointer"
          >
            <option value="">No series</option>
            {seriesList.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
            <option value="__create__">+ New series...</option>
          </select>
        </div>
      </div>

      {/* Inline create series */}
      {showCreate && (
        <div className="flex items-center gap-2 animate-fade-in">
          <div className="flex items-center gap-2 flex-1 rounded-2xl border border-primary/30 bg-primary/5 px-3.5 py-2">
            <Plus className="h-3.5 w-3.5 text-primary" />
            <input
              value={newSeriesName}
              onChange={(e) => setNewSeriesName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateSeries();
                if (e.key === "Escape") { setShowCreate(false); setNewSeriesName(""); }
              }}
              placeholder="Series name (e.g. Romans Study)"
              className="bg-transparent text-sm flex-1 focus:outline-none placeholder:text-muted-foreground/40"
              autoFocus
            />
          </div>
          <button
            onClick={handleCreateSeries}
            disabled={!newSeriesName.trim() || creating}
            className="flex items-center gap-1 px-3 py-2 rounded-2xl text-xs font-medium text-white disabled:opacity-50"
            style={{ background: "var(--gradient-primary)" }}
          >
            {creating ? <Loader2 className="h-3 w-3 animate-spin" /> : "Create"}
          </button>
          <button
            onClick={() => { setShowCreate(false); setNewSeriesName(""); }}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
