import type { Json } from "./database";

export interface SermonNote {
  id: string;
  user_id: string;
  title: string;
  date: string;
  speaker: string | null;
  content: Json;
  plain_text: string;
  series_id: string | null;
  series_order: number | null;
  is_favorite: boolean;
  is_archived: boolean;
  client_id: string | null;
  sync_version: number;
  created_at: string;
  updated_at: string;
}

export interface SermonNoteWithScriptures extends SermonNote {
  scripture_references: ScriptureReference[];
}

export interface ScriptureReference {
  id: string;
  note_id: string;
  book: string;
  chapter: number;
  verse_start: number;
  verse_end: number | null;
  translation: string;
  full_text: string | null;
}

export interface QuickCapture {
  id: string;
  user_id: string;
  note_id: string | null;
  text: string;
  is_processed: boolean;
  created_at: string;
}

export interface NoteFormData {
  title: string;
  speaker: string;
  date: string;
  content: Json;
  plain_text: string;
  series_id: string | null;
}
