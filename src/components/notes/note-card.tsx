"use client";

import Link from "next/link";
import { Star, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatDateShort } from "@/lib/utils";
import type { SermonNote } from "@/types/note";

interface NoteCardProps {
  note: SermonNote;
  onToggleFavorite?: (id: string, current: boolean) => void;
}

export function NoteCard({ note, onToggleFavorite }: NoteCardProps) {
  const preview = note.plain_text
    ? note.plain_text.substring(0, 140) + (note.plain_text.length > 140 ? "..." : "")
    : "No content yet";

  return (
    <Link href={`/notes/${note.id}`} className="block group">
      <div className="relative rounded-xl border border-border bg-card p-5 transition-all hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-0.5 active:translate-y-0">
        {/* Favorite button */}
        {onToggleFavorite && (
          <button
            className="absolute top-4 right-4 p-1"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite(note.id, note.is_favorite);
            }}
          >
            <Star
              className={cn(
                "h-4 w-4 transition-colors",
                note.is_favorite
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground/40 hover:text-yellow-400"
              )}
            />
          </button>
        )}

        <div className="space-y-2.5 pr-8">
          <h3 className="font-semibold text-base leading-tight group-hover:text-primary transition-colors">
            {note.title || "Untitled Sermon"}
          </h3>

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {formatDateShort(note.date)}
            </span>
            {note.speaker && (
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                {note.speaker}
              </span>
            )}
          </div>

          <p className="text-sm text-muted-foreground/80 line-clamp-2 leading-relaxed">
            {preview}
          </p>
        </div>
      </div>
    </Link>
  );
}
