"use client";

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
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolbarProps {
  editor: Editor | null;
}

interface ToolButton {
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  active: boolean;
  label: string;
}

export function Toolbar({ editor }: ToolbarProps) {
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
    <div className="sticky top-14 z-20 -mx-4 px-4 py-2.5 glass border-b border-border/30">
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
        <ToolGroup tools={formatTools} />
        <div className="w-px h-6 bg-border/40 mx-1.5 shrink-0" />
        <ToolGroup tools={structureTools} />
        <div className="w-px h-6 bg-border/40 mx-1.5 shrink-0" />
        <ToolGroup tools={historyTools} />
      </div>
    </div>
  );
}
