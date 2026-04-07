import { create } from "zustand";
import type { Json } from "@/types/database";

interface EditorState {
  currentNoteId: string | null;
  isDirty: boolean;
  isSaving: boolean;
  lastSavedAt: Date | null;
  content: Json;
  setCurrentNoteId: (id: string | null) => void;
  setDirty: (dirty: boolean) => void;
  setSaving: (saving: boolean) => void;
  setLastSavedAt: (date: Date) => void;
  setContent: (content: Json) => void;
  reset: () => void;
}

export const useEditorStore = create<EditorState>()((set) => ({
  currentNoteId: null,
  isDirty: false,
  isSaving: false,
  lastSavedAt: null,
  content: {},
  setCurrentNoteId: (id) => set({ currentNoteId: id }),
  setDirty: (dirty) => set({ isDirty: dirty }),
  setSaving: (saving) => set({ isSaving: saving }),
  setLastSavedAt: (date) => set({ lastSavedAt: date }),
  setContent: (content) => set({ content, isDirty: true }),
  reset: () =>
    set({
      currentNoteId: null,
      isDirty: false,
      isSaving: false,
      lastSavedAt: null,
      content: {},
    }),
}));
