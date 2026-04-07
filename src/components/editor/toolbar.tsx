"use client";

import type { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
  Indent,
  Outdent,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolbarProps {
  editor: Editor | null;
}

export function Toolbar({ editor }: ToolbarProps) {
  if (!editor) return null;

  const tools = [
    {
      icon: Bold,
      action: () => editor.chain().focus().toggleBold().run(),
      active: editor.isActive("bold"),
      label: "Bold",
    },
    {
      icon: Italic,
      action: () => editor.chain().focus().toggleItalic().run(),
      active: editor.isActive("italic"),
      label: "Italic",
    },
    {
      icon: Underline,
      action: () => editor.chain().focus().toggleUnderline().run(),
      active: editor.isActive("underline"),
      label: "Underline",
    },
    {
      icon: Highlighter,
      action: () => editor.chain().focus().toggleHighlight().run(),
      active: editor.isActive("highlight"),
      label: "Highlight",
    },
    "separator",
    {
      icon: Heading2,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      active: editor.isActive("heading", { level: 2 }),
      label: "Heading 2",
    },
    {
      icon: Heading3,
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      active: editor.isActive("heading", { level: 3 }),
      label: "Heading 3",
    },
    "separator",
    {
      icon: List,
      action: () => editor.chain().focus().toggleBulletList().run(),
      active: editor.isActive("bulletList"),
      label: "Bullet list",
    },
    {
      icon: ListOrdered,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      active: editor.isActive("orderedList"),
      label: "Numbered list",
    },
    {
      icon: CheckSquare,
      action: () => editor.chain().focus().toggleTaskList().run(),
      active: editor.isActive("taskList"),
      label: "Task list",
    },
    {
      icon: Quote,
      action: () => editor.chain().focus().toggleBlockquote().run(),
      active: editor.isActive("blockquote"),
      label: "Quote",
    },
    "separator",
    {
      icon: Indent,
      action: () => editor.chain().focus().sinkListItem("listItem").run(),
      active: false,
      label: "Indent",
    },
    {
      icon: Outdent,
      action: () => editor.chain().focus().liftListItem("listItem").run(),
      active: false,
      label: "Outdent",
    },
    "separator",
    {
      icon: Undo2,
      action: () => editor.chain().focus().undo().run(),
      active: false,
      label: "Undo",
    },
    {
      icon: Redo2,
      action: () => editor.chain().focus().redo().run(),
      active: false,
      label: "Redo",
    },
  ] as const;

  return (
    <div className="flex flex-wrap items-center gap-0.5 rounded-lg border border-border bg-card p-1 overflow-x-auto">
      {tools.map((tool, i) => {
        if (tool === "separator") {
          return <Separator key={`sep-${i}`} orientation="vertical" className="mx-1 h-6" />;
        }
        const Tool = tool;
        return (
          <Button
            key={Tool.label}
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 shrink-0",
              Tool.active && "bg-accent text-accent-foreground"
            )}
            onClick={Tool.action}
            title={Tool.label}
            type="button"
          >
            <Tool.icon className="h-4 w-4" />
          </Button>
        );
      })}
    </div>
  );
}
