"use client";

import { useState } from "react";
import { Plus, Send } from "lucide-react";
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
      <Button
        size="icon"
        className="fixed bottom-20 right-4 z-50 h-14 w-14 rounded-full shadow-lg lg:bottom-6"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-6 w-6" />
        <span className="sr-only">Quick capture</span>
      </Button>

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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Quick Capture</DialogTitle>
          <DialogDescription>
            Jot down a thought quickly. You can add it to your notes later.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your thought..."
            className="min-h-[100px] resize-none"
            autoFocus
          />
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={!text.trim() || saving}>
              <Send className="mr-2 h-4 w-4" />
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
