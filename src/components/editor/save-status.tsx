"use client";

import { useEditorStore } from "@/stores/editor-store";
import { Check, Loader2, Cloud } from "lucide-react";

export function SaveStatus() {
  const isDirty = useEditorStore((s) => s.isDirty);
  const isSaving = useEditorStore((s) => s.isSaving);
  const lastSavedAt = useEditorStore((s) => s.lastSavedAt);

  if (isSaving) {
    return (
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground rounded-full bg-secondary/50 px-3 py-1">
        <Loader2 className="h-3 w-3 animate-spin" />
        Saving...
      </span>
    );
  }

  if (isDirty) {
    return (
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground rounded-full bg-secondary/50 px-3 py-1">
        <Cloud className="h-3 w-3" />
        Unsaved
      </span>
    );
  }

  if (lastSavedAt) {
    return (
      <span className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 rounded-full bg-green-50 dark:bg-green-900/20 px-3 py-1">
        <Check className="h-3 w-3" />
        Saved
      </span>
    );
  }

  return null;
}
