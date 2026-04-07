"use client";

import { useEffect, useState } from "react";
import { Loader2, Heart, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { cn, formatDateShort } from "@/lib/utils";

interface PrayerItem {
  id: string;
  text: string;
  is_answered: boolean;
  answered_at: string | null;
  answered_note: string | null;
  created_at: string;
}

export default function PrayerPage() {
  const [items, setItems] = useState<PrayerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newText, setNewText] = useState("");

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("prayer_items")
      .select("*")
      .eq("user_id", user.id)
      .order("is_answered")
      .order("created_at", { ascending: false });

    if (data) setItems(data);
    setLoading(false);
  }

  async function addItem() {
    if (!newText.trim()) return;
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("prayer_items")
      .insert({ user_id: user.id, text: newText.trim() })
      .select()
      .single();

    if (data) {
      setItems((prev) => [data, ...prev]);
      setNewText("");
    }
  }

  async function toggleAnswered(id: string, current: boolean) {
    const supabase = createClient();
    await supabase
      .from("prayer_items")
      .update({
        is_answered: !current,
        answered_at: !current ? new Date().toISOString() : null,
      })
      .eq("id", id);

    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, is_answered: !current } : i
      )
    );
  }

  const active = items.filter((i) => !i.is_answered);
  const answered = items.filter((i) => i.is_answered);

  return (
    <div className="mx-auto max-w-3xl p-4 space-y-4">
      <h1 className="text-2xl font-bold">Prayer List</h1>

      <div className="flex gap-2">
        <Input
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Add a prayer request..."
          onKeyDown={(e) => e.key === "Enter" && addItem()}
        />
        <Button onClick={addItem} disabled={!newText.trim()}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <div className="rounded-2xl bg-muted p-6 mb-4">
            <Heart className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No prayer requests yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Add prayer requests above or from your sermon notes.
          </p>
        </div>
      ) : (
        <>
          {active.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-sm font-medium text-muted-foreground">
                Active ({active.length})
              </h2>
              {active.map((item) => (
                <Card key={item.id}>
                  <CardContent className="flex items-start gap-3 p-3">
                    <button
                      onClick={() => toggleAnswered(item.id, item.is_answered)}
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-input hover:border-primary"
                    />
                    <div className="flex-1">
                      <p className="text-sm">{item.text}</p>
                      <span className="text-xs text-muted-foreground">
                        {formatDateShort(item.created_at)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {answered.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-sm font-medium text-muted-foreground">
                Answered ({answered.length})
              </h2>
              {answered.map((item) => (
                <Card key={item.id} className="opacity-60">
                  <CardContent className="flex items-start gap-3 p-3">
                    <button
                      onClick={() => toggleAnswered(item.id, item.is_answered)}
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-primary bg-primary text-primary-foreground"
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
