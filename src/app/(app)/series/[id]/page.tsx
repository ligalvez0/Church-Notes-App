"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2, Edit3, FileText } from "lucide-react";
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
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);

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

    if (seriesData) {
      setSeries(seriesData);
      setEditName(seriesData.name);
      setEditDesc(seriesData.description || "");
    }

    const { data: notesData } = await supabase
      .from("sermon_notes")
      .select("*")
      .eq("series_id", id)
      .order("date", { ascending: true });

    if (notesData) setNotes(notesData);
    setLoading(false);
  }

  async function handleSaveEdit() {
    const supabase = createClient();
    await supabase
      .from("series")
      .update({ name: editName.trim(), description: editDesc.trim() || null })
      .eq("id", id);
    setSeries({ name: editName.trim(), description: editDesc.trim() || null });
    setEditing(false);
  }

  async function handleDelete() {
    const supabase = createClient();
    // Unlink notes from this series first
    await supabase
      .from("sermon_notes")
      .update({ series_id: null })
      .eq("series_id", id);
    // Delete the series
    await supabase.from("series").delete().eq("id", id);
    router.push("/series");
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-10 w-10 rounded-2xl flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
          <Loader2 className="h-5 w-5 animate-spin text-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6 space-y-6 animate-fade-in">
      <button
        onClick={() => router.push("/series")}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        &larr; Back to series
      </button>

      {/* Series header */}
      {editing ? (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-3">
          <input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="w-full h-11 rounded-2xl border border-border/40 bg-card px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <input
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            placeholder="Description (optional)"
            className="w-full h-11 rounded-2xl border border-border/40 bg-card px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <div className="flex gap-2 justify-end">
            <button onClick={() => setEditing(false)} className="px-4 py-2 rounded-2xl text-sm text-muted-foreground hover:bg-secondary">
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              disabled={!editName.trim()}
              className="px-4 py-2 rounded-2xl text-sm font-medium text-white disabled:opacity-50"
              style={{ background: "var(--gradient-primary)" }}
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight gradient-text">{series?.name}</h1>
            {series?.description && (
              <p className="mt-1.5 text-muted-foreground">{series.description}</p>
            )}
            <p className="mt-2 text-sm text-muted-foreground flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              {notes.length} {notes.length === 1 ? "sermon" : "sermons"}
            </p>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setEditing(true)}
              className="p-2 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setDeleteConfirm(true)}
              className="p-2 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 space-y-3 animate-fade-in">
          <p className="text-sm">Delete &quot;{series?.name}&quot;? Notes in this series won&apos;t be deleted, just unlinked.</p>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setDeleteConfirm(false)} className="px-4 py-2 rounded-2xl text-sm text-muted-foreground hover:bg-secondary">
              Cancel
            </button>
            <button onClick={handleDelete} className="px-4 py-2 rounded-2xl text-sm font-medium text-white bg-destructive">
              Delete Series
            </button>
          </div>
        </div>
      )}

      {/* Notes */}
      {notes.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No notes in this series yet.</p>
          <p className="text-sm text-muted-foreground/60 mt-1">Assign notes from the editor using the series picker.</p>
        </div>
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
