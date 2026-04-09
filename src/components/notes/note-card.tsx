"use client";

import Link from "next/link";
import { Star, Calendar, User, ChevronRight } from "lucide-react";
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
      <div className="relative rounded-2xl border border-border/40 bg-card p-5 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 hover:-translate-y-1 active:translate-y-0">
        {/* Subtle gradient overlay on hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ background: "linear-gradient(135deg, hsla(252, 80%, 60%, 0.03), hsla(280, 75%, 55%, 0.03))" }} />

        {/* Favorite button */}
        {onToggleFavorite && (
          <button
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-secondary/80 transition-colors z-10"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite(note.id, note.is_favorite);
            }}
          >
            <Star
              className={cn(
                "h-4 w-4 transition-all duration-300",
                note.is_favorite
                  ? "fill-amber-400 text-amber-400 drop-shadow-sm"
                  : "text-muted-foreground/30 hover:text-amber-400"
              )}
            />
          </button>
        )}

        <div className="space-y-3 pr-10 relative">
          <h3 className="font-semibold text-[15px] leading-snug group-hover:text-primary transition-colors duration-200">
            {note.title || "Untitled Sermon"}
          </h3>

          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/60 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {formatDateShort(note.date)}
            </span>
            {note.speaker && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                <User className="h-3 w-3" />
                {note.speaker}
              </span>
            )}
          </div>

          <p className="text-[13px] text-muted-foreground/70 line-clamp-2 leading-relaxed">
            {preview}
          </p>
        </div>

        {/* Arrow indicator */}
        <ChevronRight className="absolute right-4 bottom-5 h-4 w-4 text-muted-foreground/20 group-hover:text-primary/40 transition-all duration-200 group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
