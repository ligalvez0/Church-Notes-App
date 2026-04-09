"use client";

import { useState, useRef, useEffect } from "react";
import type { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  Highlighter,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Quote,
  Undo2,
  Redo2,
  CheckSquare,
  BookOpen,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchVerse } from "@/lib/bible-api";

interface ToolbarProps {
  editor: Editor | null;
}

interface ToolButton {
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  active: boolean;
  label: string;
}

function VerseInsertPopover({
  editor,
  onClose,
}: {
  editor: Editor;
  onClose: () => void;
}) {
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleInsert() {
    if (!reference.trim()) return;

    setLoading(true);
    setError("");

    const verse = await fetchVerse(reference.trim());

    if (!verse || !verse.text) {
      setError("Verse not found. Try e.g. \"John 3:16\"");
      setLoading(false);
      return;
    }

    editor
      .chain()
      .focus()
      .insertBibleVerse({
        reference: verse.reference,
        text: verse.text,
        translation: verse.translation,
      })
      .run();

    setLoading(false);
    onClose();
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-1 z-30 rounded-xl border border-border/50 bg-popover p-3 shadow-lg">
      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
        Insert Bible Verse
      </label>
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={reference}
          onChange={(e) => {
            setReference(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleInsert();
            if (e.key === "Escape") onClose();
          }}
          placeholder="e.g. John 3:16 or Romans 8:28-30"
          className="flex-1 rounded-lg border border-border/50 bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <button
          type="button"
          onClick={handleInsert}
          disabled={loading || !reference.trim()}
          className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Insert"}
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function Toolbar({ editor }: ToolbarProps) {
  const [versePopoverOpen, setVersePopoverOpen] = useState(false);

  if (!editor) return null;

  const formatTools: ToolButton[] = [
    { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold"), label: "Bold" },
    { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic"), label: "Italic" },
    { icon: Underline, action: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive("underline"), label: "Underline" },
    { icon: Highlighter, action: () => editor.chain().focus().toggleHighlight().run(), active: editor.isActive("highlight"), label: "Highlight" },
  ];

  const structureTools: ToolButton[] = [
    { icon: Heading2, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }), label: "Heading" },
    { icon: Heading3, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive("heading", { level: 3 }), label: "Subheading" },
    { icon: List, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive("bulletList"), label: "Bullets" },
    { icon: ListOrdered, action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive("orderedList"), label: "Numbers" },
    { icon: CheckSquare, action: () => editor.chain().focus().toggleTaskList().run(), active: editor.isActive("taskList"), label: "Tasks" },
    { icon: Quote, action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive("blockquote"), label: "Quote" },
  ];

  const historyTools: ToolButton[] = [
    { icon: Undo2, action: () => editor.chain().focus().undo().run(), active: false, label: "Undo" },
    { icon: Redo2, action: () => editor.chain().focus().redo().run(), active: false, label: "Redo" },
  ];

  function ToolGroup({ tools }: { tools: ToolButton[] }) {
    return (
      <div className="flex items-center gap-0.5">
        {tools.map((tool) => (
          <button
            key={tool.label}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground",
              tool.active && "text-white shadow-md shadow-primary/20"
            )}
            style={tool.active ? { background: "var(--gradient-primary)" } : undefined}
            onClick={tool.action}
            title={tool.label}
            type="button"
          >
            <tool.icon className="h-4 w-4" />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="relative sticky top-14 z-20 -mx-4 px-4 py-2.5 glass border-b border-border/30">
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
        <ToolGroup tools={formatTools} />
        <div className="w-px h-6 bg-border/40 mx-1.5 shrink-0" />
        <ToolGroup tools={structureTools} />
        <div className="w-px h-6 bg-border/40 mx-1.5 shrink-0" />
        <ToolGroup tools={historyTools} />
        <div className="w-px h-6 bg-border/40 mx-1.5 shrink-0" />
        {/* Bible verse insert button */}
        <button
          type="button"
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground",
            versePopoverOpen && "text-white shadow-md shadow-primary/20"
          )}
          style={versePopoverOpen ? { background: "var(--gradient-primary)" } : undefined}
          onClick={() => setVersePopoverOpen(!versePopoverOpen)}
          title="Insert Bible Verse"
        >
          <BookOpen className="h-4 w-4" />
        </button>
      </div>
      {versePopoverOpen && (
        <VerseInsertPopover
          editor={editor}
          onClose={() => setVersePopoverOpen(false)}
        />
      )}
    </div>
  );
}
