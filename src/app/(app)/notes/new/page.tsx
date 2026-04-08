"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SermonEditor } from "@/components/editor/sermon-editor";
import { NoteHeader } from "@/components/notes/note-header";
import { useEditorStore } from "@/stores/editor-store";
import { SaveStatus } from "@/components/editor/save-status";
import type { Json } from "@/types/database";

export default function NewNotePage() {
  const router = useRouter();
  const noteIdRef = useRef<string | null>(null);
  const [title, setTitle] = useState("");
  const [speaker, setSpeaker] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const contentRef = useRef<Json>({});
  const plainTextRef = useRef("");
  const setCurrentNoteId = useEditorStore((s) => s.setCurrentNoteId);
  const setDirty = useEditorStore((s) => s.setDirty);
  const setSaving = useEditorStore((s) => s.setSaving);
  const setLastSavedAt = useEditorStore((s) => s.setLastSavedAt);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Save function that uses latest values via refs
  const save = useCallback(async () => {
    setSaving(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const noteData = {
        title: title || "Untitled Sermon",
        speaker: speaker || null,
        date,
        content: contentRef.current,
        plain_text: plainTextRef.current,
        updated_at: new Date().toISOString(),
      };

      if (noteIdRef.current) {
        await supabase
          .from("sermon_notes")
          .update(noteData)
          .eq("id", noteIdRef.current);
      } else {
        const { data } = await supabase
          .from("sermon_notes")
          .insert({ ...noteData, user_id: user.id })
          .select("id")
          .single();

        if (data) {
          noteIdRef.current = data.id;
          setCurrentNoteId(data.id);
          window.history.replaceState(null, "", `/notes/${data.id}`);
        }
      }

      setLastSavedAt(new Date());
      setDirty(false);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  }, [title, speaker, date, setCurrentNoteId, setDirty, setSaving, setLastSavedAt]);

  // Trigger save with short debounce (500ms) on any change
  const triggerSave = useCallback(() => {
    setDirty(true);
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => save(), 500);
  }, [save, setDirty]);

  // Save on title/speaker/date change
  useEffect(() => {
    // Don't save on initial mount
    if (noteIdRef.current || title || speaker) {
      triggerSave();
    }
  }, [title, speaker, date, triggerSave]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, []);

  const handleEditorChange = useCallback(
    (content: Json, plainText: string) => {
      contentRef.current = content;
      plainTextRef.current = plainText;
      triggerSave();
    },
    [triggerSave]
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

      <SermonEditor onChange={handleEditorChange} />
    </div>
  );
}
