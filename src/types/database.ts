export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          preferences: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          preferences?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          preferences?: Json;
          updated_at?: string;
        };
      };
      sermon_notes: {
        Row: {
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
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          date?: string;
          speaker?: string | null;
          content?: Json;
          plain_text?: string;
          series_id?: string | null;
          series_order?: number | null;
          is_favorite?: boolean;
          is_archived?: boolean;
          client_id?: string | null;
          sync_version?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          date?: string;
          speaker?: string | null;
          content?: Json;
          plain_text?: string;
          series_id?: string | null;
          series_order?: number | null;
          is_favorite?: boolean;
          is_archived?: boolean;
          client_id?: string | null;
          sync_version?: number;
          updated_at?: string;
        };
      };
      scripture_references: {
        Row: {
          id: string;
          note_id: string;
          book: string;
          chapter: number;
          verse_start: number;
          verse_end: number | null;
          translation: string;
          full_text: string | null;
        };
        Insert: {
          id?: string;
          note_id: string;
          book: string;
          chapter: number;
          verse_start: number;
          verse_end?: number | null;
          translation?: string;
          full_text?: string | null;
        };
        Update: {
          note_id?: string;
          book?: string;
          chapter?: number;
          verse_start?: number;
          verse_end?: number | null;
          translation?: string;
          full_text?: string | null;
        };
      };
      quick_captures: {
        Row: {
          id: string;
          user_id: string;
          note_id: string | null;
          text: string;
          is_processed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          note_id?: string | null;
          text: string;
          is_processed?: boolean;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          note_id?: string | null;
          text?: string;
          is_processed?: boolean;
        };
      };
      series: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          start_date: string | null;
          end_date: string | null;
          cover_image: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          cover_image?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          name?: string;
          description?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          cover_image?: string | null;
          updated_at?: string;
        };
      };
      note_summaries: {
        Row: {
          id: string;
          note_id: string;
          summary: string;
          key_takeaways: Json;
          themes: Json;
          application_prompts: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          note_id: string;
          summary: string;
          key_takeaways?: Json;
          themes?: Json;
          application_prompts?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          note_id?: string;
          summary?: string;
          key_takeaways?: Json;
          themes?: Json;
          application_prompts?: Json;
          updated_at?: string;
        };
      };
      action_items: {
        Row: {
          id: string;
          user_id: string;
          note_id: string | null;
          text: string;
          is_completed: boolean;
          completed_at: string | null;
          due_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          note_id?: string | null;
          text: string;
          is_completed?: boolean;
          completed_at?: string | null;
          due_date?: string | null;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          note_id?: string | null;
          text?: string;
          is_completed?: boolean;
          completed_at?: string | null;
          due_date?: string | null;
        };
      };
      prayer_items: {
        Row: {
          id: string;
          user_id: string;
          note_id: string | null;
          text: string;
          is_answered: boolean;
          answered_at: string | null;
          answered_note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          note_id?: string | null;
          text: string;
          is_answered?: boolean;
          answered_at?: string | null;
          answered_note?: string | null;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          note_id?: string | null;
          text?: string;
          is_answered?: boolean;
          answered_at?: string | null;
          answered_note?: string | null;
        };
      };
      memory_verses: {
        Row: {
          id: string;
          user_id: string;
          reference: string;
          text: string;
          translation: string;
          reminder_time: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          reference: string;
          text: string;
          translation?: string;
          reminder_time?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          reference?: string;
          text?: string;
          translation?: string;
          reminder_time?: string | null;
          is_active?: boolean;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
