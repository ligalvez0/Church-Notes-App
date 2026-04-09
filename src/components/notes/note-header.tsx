"use client";

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
    <div className="space-y-4 animate-fade-in">
      <input
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Sermon Title"
        className="w-full bg-transparent text-2xl sm:text-3xl font-bold tracking-tight placeholder:text-muted-foreground/30 focus:outline-none text-foreground"
      />
      <div className="flex flex-wrap items-center gap-3 pb-4 border-b border-border/30">
        <div className="flex items-center gap-2 rounded-2xl bg-secondary/40 px-3.5 py-2 transition-colors focus-within:bg-secondary/70 focus-within:ring-2 focus-within:ring-primary/20">
          <User className="h-3.5 w-3.5 text-primary/60" />
          <input
            value={speaker}
            onChange={(e) => onSpeakerChange(e.target.value)}
            placeholder="Speaker name"
            className="bg-transparent text-sm placeholder:text-muted-foreground/40 focus:outline-none w-32"
          />
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-secondary/40 px-3.5 py-2 transition-colors focus-within:bg-secondary/70 focus-within:ring-2 focus-within:ring-primary/20">
          <Calendar className="h-3.5 w-3.5 text-primary/60" />
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
