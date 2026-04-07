"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SermonEditor } from "@/components/editor/sermon-editor";
import { NoteHeader } from "@/components/notes/note-header";
import { useEditorStore } from "@/stores/editor-store";
import { SaveStatus } from "@/components/editor/save-status";
import type { Json } from "@/types/database";

export default function NewNotePage() {
  const router = useRouter();
  const [noteId, setNoteId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [speaker, setSpeaker] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const setCurrentNoteId = useEditorStore((s) => s.setCurrentNoteId);

  const handleSave = useCallback(
    async (content: Json, plainText: string) => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (noteId) {
        // Update existing
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
          .eq("id", noteId);
      } else {
        // Create new
        const { data } = await supabase
          .from("sermon_notes")
          .insert({
            user_id: user.id,
            title: title || "Untitled Sermon",
            speaker: speaker || null,
            date,
            content,
            plain_text: plainText,
          })
          .select("id")
          .single();

        if (data) {
          setNoteId(data.id);
          setCurrentNoteId(data.id);
          // Replace URL without full navigation
          window.history.replaceState(null, "", `/notes/${data.id}`);
        }
      }
    },
    [noteId, title, speaker, date, setCurrentNoteId]
  );

  return (
    <div className="mx-auto max-w-3xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/notes")}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          &larr; Back to notes
        </button>
        <SaveStatus />
      </div>

      <NoteHeader
        title={title}
        speaker={speaker}
        date={date}
        onTitleChange={setTitle}
        onSpeakerChange={setSpeaker}
        onDateChange={setDate}
      />

      <SermonEditor onSave={handleSave} />
    </div>
  );
}
