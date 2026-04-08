"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import UnderlineExtension from "@tiptap/extension-underline";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { Toolbar } from "./toolbar";
import { useEditorStore } from "@/stores/editor-store";
import { useDebounce } from "@/hooks/use-debounce";
import { useCallback, useEffect } from "react";
import type { Json } from "@/types/database";

interface SermonEditorProps {
  initialContent?: Json;
  onSave: (content: Json, plainText: string) => void;
  readOnly?: boolean;
}

export function SermonEditor({
  initialContent,
  onSave,
  readOnly = false,
}: SermonEditorProps) {
  const setDirty = useEditorStore((s) => s.setDirty);
  const setSaving = useEditorStore((s) => s.setSaving);
  const setLastSavedAt = useEditorStore((s) => s.setLastSavedAt);

  const debouncedSave = useDebounce(
    useCallback(
      (content: Json, plainText: string) => {
        setSaving(true);
        onSave(content, plainText);
        setLastSavedAt(new Date());
        setDirty(false);
        setSaving(false);
      },
      [onSave, setSaving, setLastSavedAt, setDirty]
    ),
    3000
  );

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
      setDirty(true);
      debouncedSave(json, text);
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
