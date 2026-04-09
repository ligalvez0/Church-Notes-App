"use client";

import { useState } from "react";
import { Plus, Send, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useUIStore } from "@/stores/ui-store";
import { useEditorStore } from "@/stores/editor-store";
import { createClient } from "@/lib/supabase/client";

export function QuickCaptureButton() {
  const open = useUIStore((s) => s.quickCaptureOpen);
  const setOpen = useUIStore((s) => s.setQuickCaptureOpen);

  return (
    <>
      <button
        className="fixed bottom-20 right-4 z-50 h-14 w-14 rounded-2xl shadow-xl shadow-primary/30 flex items-center justify-center text-white hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 animate-pulse-glow lg:bottom-6"
        style={{ background: "var(--gradient-primary)" }}
        onClick={() => setOpen(true)}
      >
        <Plus className="h-6 w-6" />
        <span className="sr-only">Quick capture</span>
      </button>

      <QuickCaptureDialog open={open} onOpenChange={setOpen} />
    </>
  );
}

function QuickCaptureDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const currentNoteId = useEditorStore((s) => s.currentNoteId);

  async function handleSave() {
    if (!text.trim()) return;
    setSaving(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        await supabase.from("quick_captures").insert({
          user_id: user.id,
          note_id: currentNoteId,
          text: text.trim(),
        });
      }

      setText("");
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to save quick capture:", err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl border-border/40">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-400" />
            Quick Capture
          </DialogTitle>
          <DialogDescription>
            Jot down a thought quickly. Add it to your notes later.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind..."
            className="min-h-[120px] resize-none rounded-2xl border-border/40 bg-secondary/30 focus:bg-background transition-colors"
            autoFocus
          />
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={!text.trim() || saving}
              className="rounded-2xl shadow-md shadow-primary/20"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Send className="mr-2 h-4 w-4" />
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
