"use client";

import { useEffect, useState } from "react";
import { Loader2, ListTodo, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ActionItem {
  id: string;
  text: string;
  is_completed: boolean;
  note_id: string | null;
  created_at: string;
  note_title?: string;
}

export default function ActionsPage() {
  const [items, setItems] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("action_items")
      .select("*, sermon_notes(title)")
      .eq("user_id", user.id)
      .order("is_completed")
      .order("created_at", { ascending: false });

    if (data) {
      setItems(
        data.map((item) => {
          const { sermon_notes, ...rest } = item as Record<string, unknown>;
          return {
            id: rest.id as string,
            text: rest.text as string,
            is_completed: rest.is_completed as boolean,
            note_id: rest.note_id as string | null,
            created_at: rest.created_at as string,
            note_title: (sermon_notes as { title: string } | null)?.title,
          };
        })
      );
    }
    setLoading(false);
  }

  async function toggleItem(id: string, current: boolean) {
    const supabase = createClient();
    await supabase
      .from("action_items")
      .update({
        is_completed: !current,
        completed_at: !current ? new Date().toISOString() : null,
      })
      .eq("id", id);

    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, is_completed: !current } : i
      )
    );
  }

  const pending = items.filter((i) => !i.is_completed);
  const completed = items.filter((i) => i.is_completed);

  return (
    <div className="mx-auto max-w-3xl p-4 space-y-4">
      <h1 className="text-2xl font-bold">Action Items</h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <div className="rounded-2xl bg-muted p-6 mb-4">
            <ListTodo className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No action items yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Add task items in your sermon notes to track them here.
          </p>
        </div>
      ) : (
        <>
          {pending.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-sm font-medium text-muted-foreground">To Do ({pending.length})</h2>
              {pending.map((item) => (
                <Card key={item.id}>
                  <CardContent className="flex items-start gap-3 p-3">
                    <button
                      onClick={() => toggleItem(item.id, item.is_completed)}
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-input hover:border-primary"
                    >
                      {item.is_completed && <Check className="h-3 w-3" />}
                    </button>
                    <div className="flex-1">
                      <p className="text-sm">{item.text}</p>
                      {item.note_title && (
                        <Link
                          href={`/notes/${item.note_id}`}
                          className="text-xs text-muted-foreground hover:text-primary"
                        >
                          From: {item.note_title}
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {completed.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-sm font-medium text-muted-foreground">
                Completed ({completed.length})
              </h2>
              {completed.map((item) => (
                <Card key={item.id} className="opacity-60">
                  <CardContent className="flex items-start gap-3 p-3">
                    <button
                      onClick={() => toggleItem(item.id, item.is_completed)}
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-primary bg-primary text-primary-foreground"
                    >
                      <Check className="h-3 w-3" />
                    </button>
                    <p className="text-sm line-through">{item.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
