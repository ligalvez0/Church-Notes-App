"use client";

import { Input } from "@/components/ui/input";
import { User, Calendar } from "lucide-react";

interface NoteHeaderProps {
  title: string;
  speaker: string;
  date: string;
  onTitleChange: (title: string) => void;
  onSpeakerChange: (speaker: string) => void;
  onDateChange: (date: string) => void;
}

export function NoteHeader({
  title,
  speaker,
  date,
  onTitleChange,
  onSpeakerChange,
  onDateChange,
}: NoteHeaderProps) {
  return (
    <div className="space-y-4">
      <input
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Sermon Title"
        className="w-full bg-transparent text-2xl sm:text-3xl font-bold tracking-tight placeholder:text-muted-foreground/40 focus:outline-none text-foreground"
      />
      <div className="flex flex-wrap items-center gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-1.5">
          <User className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={speaker}
            onChange={(e) => onSpeakerChange(e.target.value)}
            placeholder="Speaker name"
            className="bg-transparent text-sm placeholder:text-muted-foreground/60 focus:outline-none w-32"
          />
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-1.5">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="bg-transparent text-sm focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
