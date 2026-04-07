import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark" | "ambient";

interface UIState {
  theme: Theme;
  sidebarOpen: boolean;
  distractionFree: boolean;
  quickCaptureOpen: boolean;
  defaultTranslation: string;
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleDistractionFree: () => void;
  setQuickCaptureOpen: (open: boolean) => void;
  setDefaultTranslation: (translation: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: "light",
      sidebarOpen: true,
      distractionFree: false,
      quickCaptureOpen: false,
      defaultTranslation: "kjv",
      setTheme: (theme) => {
        set({ theme });
        // Apply theme class to document
        if (typeof document !== "undefined") {
          document.documentElement.classList.remove("dark", "ambient");
          if (theme !== "light") {
            document.documentElement.classList.add(theme);
          }
        }
      },
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleDistractionFree: () => set((state) => ({ distractionFree: !state.distractionFree })),
      setQuickCaptureOpen: (open) => set({ quickCaptureOpen: open }),
      setDefaultTranslation: (translation) => set({ defaultTranslation: translation }),
    }),
    {
      name: "church-notes-ui",
      partialize: (state) => ({
        theme: state.theme,
        defaultTranslation: state.defaultTranslation,
      }),
    }
  )
);
