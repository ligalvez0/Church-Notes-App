import { createClient } from "@/lib/supabase/client";
import type { SermonNote, NoteFormData } from "@/types/note";
import type { Json } from "@/types/database";

const supabase = createClient();

export async function getNotes(userId: string): Promise<SermonNote[]> {
  const { data, error } = await supabase
    .from("sermon_notes")
    .select("*")
    .eq("user_id", userId)
    .eq("is_archived", false)
    .order("date", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getNote(id: string): Promise<SermonNote | null> {
  const { data, error } = await supabase
    .from("sermon_notes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

export async function createNote(
  userId: string,
  formData: Partial<NoteFormData>
): Promise<SermonNote> {
  const { data, error } = await supabase
    .from("sermon_notes")
    .insert({
      user_id: userId,
      title: formData.title || "Untitled Sermon",
      date: formData.date || new Date().toISOString(),
      speaker: formData.speaker || null,
      content: (formData.content as Json) || {},
      plain_text: formData.plain_text || "",
      series_id: formData.series_id || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateNote(
  id: string,
  updates: Partial<NoteFormData & { is_favorite: boolean }>
): Promise<SermonNote> {
  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.speaker !== undefined) updateData.speaker = updates.speaker;
  if (updates.date !== undefined) updateData.date = updates.date;
  if (updates.content !== undefined) updateData.content = updates.content;
  if (updates.plain_text !== undefined) updateData.plain_text = updates.plain_text;
  if (updates.series_id !== undefined) updateData.series_id = updates.series_id;
  if (updates.is_favorite !== undefined) updateData.is_favorite = updates.is_favorite;

  const { data, error } = await supabase
    .from("sermon_notes")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteNote(id: string): Promise<void> {
  const { error } = await supabase
    .from("sermon_notes")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function toggleFavorite(id: string, currentValue: boolean): Promise<void> {
  const { error } = await supabase
    .from("sermon_notes")
    .update({ is_favorite: !currentValue })
    .eq("id", id);

  if (error) throw error;
}

export async function getSpeakers(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("sermon_notes")
    .select("speaker")
    .eq("user_id", userId)
    .not("speaker", "is", null)
    .order("speaker");

  if (error) return [];

  const speakers = [...new Set(data.map((n) => n.speaker).filter(Boolean))] as string[];
  return speakers;
}
