"use client";

import Link from "next/link";
import { Star, Calendar, User, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn, formatDateShort } from "@/lib/utils";
import type { SermonNote } from "@/types/note";

interface NoteCardProps {
  note: SermonNote;
  onToggleFavorite?: (id: string, current: boolean) => void;
}

export function NoteCard({ note, onToggleFavorite }: NoteCardProps) {
  const preview = note.plain_text
    ? note.plain_text.substring(0, 120) + (note.plain_text.length > 120 ? "..." : "")
    : "No content yet";

  return (
    <Card className="group transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/notes/${note.id}`} className="flex-1 space-y-2">
            <h3 className="font-semibold leading-tight group-hover:text-primary transition-colors">
              {note.title || "Untitled Sermon"}
            </h3>

            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDateShort(note.date)}
              </span>
              {note.speaker && (
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {note.speaker}
                </span>
              )}
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2">
              {preview}
            </p>
          </Link>

          {onToggleFavorite && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={(e) => {
                e.preventDefault();
                onToggleFavorite(note.id, note.is_favorite);
              }}
            >
              <Star
                className={cn(
                  "h-4 w-4",
                  note.is_favorite
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground"
                )}
              />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
