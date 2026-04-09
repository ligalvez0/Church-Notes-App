"use client";

import { NodeViewWrapper } from "@tiptap/react";
import type { ReactNodeViewProps } from "@tiptap/react";
import { BookOpen, X } from "lucide-react";

export function BibleVerseComponent({
  node,
  deleteNode,
  selected,
}: ReactNodeViewProps) {
  const { reference, text, translation } = node.attrs as {
    reference: string;
    text: string;
    translation: string;
  };

  return (
    <NodeViewWrapper className="bible-verse-node my-3" data-type="bibleVerse">
      <div
        className={`relative rounded-xl border bg-card p-4 transition-all ${
          selected
            ? "border-primary/50 ring-2 ring-primary/20"
            : "border-border/50"
        }`}
      >
        {/* Delete button */}
        <button
          type="button"
          className="absolute top-2 right-2 p-1 rounded-md text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-colors"
          onClick={deleteNode}
          title="Remove verse"
        >
          <X className="h-3.5 w-3.5" />
        </button>

        {/* Verse icon + text */}
        <div className="flex gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <div className="rounded-lg bg-primary/10 p-1.5">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
          </div>
          <div className="flex-1 min-w-0 pr-6">
            <p className="text-sm italic leading-relaxed text-foreground/90">
              &ldquo;{text}&rdquo;
            </p>
            <p className="mt-2 text-xs font-medium text-muted-foreground">
              {reference}{" "}
              <span className="text-muted-foreground/60">({translation})</span>
            </p>
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
}
