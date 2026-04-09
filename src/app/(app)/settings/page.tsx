"use client";

import { useUIStore, type Theme } from "@/stores/ui-store";
import { Label } from "@/components/ui/label";
import { TRANSLATIONS } from "@/types/bible";
import { Sun, Moon, Lamp, BookOpen, Palette, Info } from "lucide-react";

const themes: { value: Theme; label: string; icon: React.ReactNode; desc: string }[] = [
  { value: "light", label: "Light", icon: <Sun className="h-5 w-5" />, desc: "Clean and bright" },
  { value: "dark", label: "Dark", icon: <Moon className="h-5 w-5" />, desc: "Easy on the eyes" },
  { value: "ambient", label: "Ambient", icon: <Lamp className="h-5 w-5" />, desc: "Warm candlelight" },
];

export default function SettingsPage() {
  const theme = useUIStore((s) => s.theme);
  const setTheme = useUIStore((s) => s.setTheme);
  const defaultTranslation = useUIStore((s) => s.defaultTranslation);
  const setDefaultTranslation = useUIStore((s) => s.setDefaultTranslation);

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight gradient-text">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Customize your experience</p>
      </div>

      {/* Theme */}
      <div className="rounded-2xl border border-border/40 bg-card p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Appearance</h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {themes.map((t) => (
            <button
              key={t.value}
              onClick={() => setTheme(t.value)}
              className={`relative rounded-2xl border p-4 text-center transition-all duration-200 hover:-translate-y-0.5 ${
                theme === t.value
                  ? "border-primary/50 shadow-lg shadow-primary/10"
                  : "border-border/40 hover:border-border"
              }`}
              style={theme === t.value ? { background: "linear-gradient(135deg, hsla(252, 80%, 60%, 0.05), hsla(280, 75%, 55%, 0.05))" } : undefined}
            >
              <div className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl ${
                theme === t.value ? "text-white shadow-md shadow-primary/20" : "bg-secondary text-muted-foreground"
              }`}
                style={theme === t.value ? { background: "var(--gradient-primary)" } : undefined}
              >
                {t.icon}
              </div>
              <p className="text-sm font-medium">{t.label}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Bible */}
      <div className="rounded-2xl border border-border/40 bg-card p-5 space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Bible Translation</h2>
        </div>
        <select
          value={defaultTranslation}
          onChange={(e) => setDefaultTranslation(e.target.value)}
          className="h-11 w-full rounded-2xl border border-border/40 bg-secondary/30 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
        >
          {Object.entries(TRANSLATIONS).map(([key, name]) => (
            <option key={key} value={key}>
              {key.toUpperCase()} — {name}
            </option>
          ))}
        </select>
      </div>

      {/* About */}
      <div className="rounded-2xl border border-border/40 bg-card p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Info className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">About</h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Church Notes v1.0 — A beautiful note-taking app for capturing sermons, tracking prayer requests, and growing in faith together.
        </p>
      </div>
    </div>
  );
}
