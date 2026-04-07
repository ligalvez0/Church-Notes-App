"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    <div className="space-y-3 border-b border-border pb-4">
      <div>
        <Input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Sermon Title"
          className="border-none text-xl font-bold placeholder:text-muted-foreground/50 focus-visible:ring-0 px-0 h-auto text-foreground"
        />
      </div>
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Label htmlFor="speaker" className="text-xs text-muted-foreground whitespace-nowrap">
            Speaker
          </Label>
          <Input
            id="speaker"
            value={speaker}
            onChange={(e) => onSpeakerChange(e.target.value)}
            placeholder="Pastor name"
            className="h-8 w-40 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="date" className="text-xs text-muted-foreground whitespace-nowrap">
            Date
          </Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="h-8 w-40 text-sm"
          />
        </div>
      </div>
    </div>
  );
}
