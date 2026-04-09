"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import UnderlineExtension from "@tiptap/extension-underline";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { BibleVerseNode, BibleAutoDetect } from "./extensions";
import { Toolbar } from "./toolbar";
import { useEffect, useRef, useCallback } from "react";
import { useEditorStore } from "@/stores/editor-store";
import { createClient } from "@/lib/supabase/client";
import type { Json } from "@/types/database";

interface SermonEditorProps {
  initialContent?: Json;
  onChange: (content: Json, plainText: string) => void;
  readOnly?: boolean;
}

export function SermonEditor({
  initialContent,
  onChange,
  readOnly = false,
}: SermonEditorProps) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const currentNoteId = useEditorStore((s) => s.currentNoteId);
  const currentNoteIdRef = useRef(currentNoteId);
  currentNoteIdRef.current = currentNoteId;

  /** Save a scripture reference to Supabase when a verse is embedded. */
  const handleVerseEmbedded = useCallback(
    async (verse: {
      reference: string;
      text: string;
      translation: string;
      book: string;
      chapter: number;
      verseStart: number;
      verseEnd: number | null;
    }) => {
      const noteId = currentNoteIdRef.current;
      if (!noteId) return;

      try {
        const supabase = createClient();
        await supabase.from("scripture_references").upsert(
          {
            note_id: noteId,
            book: verse.book,
            chapter: verse.chapter,
            verse_start: verse.verseStart,
            verse_end: verse.verseEnd,
            translation: verse.translation,
            full_text: verse.text,
          },
          {
            onConflict: "note_id,book,chapter,verse_start",
            ignoreDuplicates: true,
          }
        );
      } catch (err) {
        console.error("Failed to save scripture reference:", err);
      }
    },
    []
  );

  const handleVerseEmbeddedRef = useRef(handleVerseEmbedded);
  handleVerseEmbeddedRef.current = handleVerseEmbedded;

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Highlight.configure({ multicolor: false }),
      Placeholder.configure({
        placeholder: "Start taking notes...",
      }),
      UnderlineExtension,
      TaskList,
      TaskItem.configure({ nested: true }),
      BibleVerseNode,
      BibleAutoDetect.configure({
        onVerseEmbedded: (verse) => {
          handleVerseEmbeddedRef.current(verse);
        },
      }),
    ],
    content: initialContent as Record<string, unknown> | undefined,
    editable: !readOnly,
    editorProps: {
      attributes: {
        class: "tiptap prose prose-sm max-w-none focus:outline-none min-h-[300px] px-1 py-2",
      },
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON() as Json;
      const text = editor.getText();
      onChangeRef.current(json, text);
    },
  });

  // Update content when initialContent changes (e.g. loading a different note)
  useEffect(() => {
    if (editor && initialContent && !editor.isDestroyed) {
      const currentContent = JSON.stringify(editor.getJSON());
      const newContent = JSON.stringify(initialContent);
      if (currentContent !== newContent) {
        editor.commands.setContent(initialContent as Record<string, unknown>);
      }
    }
  }, [editor, initialContent]);

  return (
    <div className="space-y-3">
      {!readOnly && <Toolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
}
