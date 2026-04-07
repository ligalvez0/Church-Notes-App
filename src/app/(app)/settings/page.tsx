"use client";

import { useUIStore, type Theme } from "@/stores/ui-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { TRANSLATIONS, type BibleTranslation } from "@/types/bible";

export default function SettingsPage() {
  const theme = useUIStore((s) => s.theme);
  const setTheme = useUIStore((s) => s.setTheme);
  const defaultTranslation = useUIStore((s) => s.defaultTranslation);
  const setDefaultTranslation = useUIStore((s) => s.setDefaultTranslation);

  return (
    <div className="mx-auto max-w-3xl p-4 space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm">Theme</Label>
            <div className="mt-2 flex gap-2">
              {(["light", "dark", "ambient"] as Theme[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium capitalize transition-colors ${
                    theme === t
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:bg-accent"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Ambient mode uses warm, dim tones for low-light environments like a sanctuary.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Bible</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm">Default Translation</Label>
            <select
              value={defaultTranslation}
              onChange={(e) => setDefaultTranslation(e.target.value)}
              className="mt-2 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
            >
              {Object.entries(TRANSLATIONS).map(([key, name]) => (
                <option key={key} value={key}>
                  {key.toUpperCase()} - {name}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">About</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Church Notes App v1.0.0
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            A beautiful note-taking app for capturing sermons, tracking prayer requests, and growing in faith.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
