"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SermonEditor } from "@/components/editor/sermon-editor";
import { NoteHeader } from "@/components/notes/note-header";
import { SaveStatus } from "@/components/editor/save-status";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/stores/editor-store";
import { Trash2, Loader2, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import type { SermonNote } from "@/types/note";
import type { Json } from "@/types/database";

export default function NoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [note, setNote] = useState<SermonNote | null>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [speaker, setSpeaker] = useState("");
  const [date, setDate] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const setCurrentNoteId = useEditorStore((s) => s.setCurrentNoteId);

  useEffect(() => {
    loadNote();
    setCurrentNoteId(id);
    return () => setCurrentNoteId(null);
  }, [id, setCurrentNoteId]);

  async function loadNote() {
    const supabase = createClient();
    const { data } = await supabase
      .from("sermon_notes")
      .select("*")
      .eq("id", id)
      .single();

    if (data) {
      setNote(data);
      setTitle(data.title);
      setSpeaker(data.speaker || "");
      setDate(data.date.split("T")[0]);
    }
    setLoading(false);
  }

  const handleSave = useCallback(
    async (content: Json, plainText: string) => {
      const supabase = createClient();
      await supabase
        .from("sermon_notes")
        .update({
          title: title || "Untitled Sermon",
          speaker: speaker || null,
          date,
          content,
          plain_text: plainText,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
    },
    [id, title, speaker, date]
  );

  async function handleDelete() {
    const supabase = createClient();
    await supabase.from("sermon_notes").delete().eq("id", id);
    router.push("/notes");
  }

  async function handleToggleFavorite() {
    if (!note) return;
    const supabase = createClient();
    const newValue = !note.is_favorite;
    await supabase
      .from("sermon_notes")
      .update({ is_favorite: newValue })
      .eq("id", id);
    setNote({ ...note, is_favorite: newValue });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!note) {
    return (
      <div className="mx-auto max-w-3xl p-4 text-center py-20">
        <p className="text-muted-foreground">Note not found.</p>
        <Button variant="link" onClick={() => router.push("/notes")}>
          Back to notes
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/notes")}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          &larr; Back to notes
        </button>
        <div className="flex items-center gap-2">
          <SaveStatus />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleFavorite}
          >
            <Star
              className={cn(
                "h-5 w-5",
                note.is_favorite
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground"
              )}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="h-5 w-5 text-destructive" />
          </Button>
        </div>
      </div>

      <NoteHeader
        title={title}
        speaker={speaker}
        date={date}
        onTitleChange={setTitle}
        onSpeakerChange={setSpeaker}
        onDateChange={setDate}
      />

      <SermonEditor
        initialContent={note.content}
        onSave={handleSave}
      />

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete note?</DialogTitle>
            <DialogDescription>
              This will permanently delete &quot;{note.title}&quot;. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
