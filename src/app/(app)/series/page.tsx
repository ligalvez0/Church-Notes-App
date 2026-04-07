"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Library, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { formatDateShort } from "@/lib/utils";

interface Series {
  id: string;
  name: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  note_count?: number;
}

export default function SeriesPage() {
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  useEffect(() => {
    loadSeries();
  }, []);

  async function loadSeries() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("series")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) {
      // Get note counts
      const withCounts = await Promise.all(
        data.map(async (s) => {
          const { count } = await supabase
            .from("sermon_notes")
            .select("*", { count: "exact", head: true })
            .eq("series_id", s.id);
          return { ...s, note_count: count || 0 };
        })
      );
      setSeriesList(withCounts);
    }
    setLoading(false);
  }

  async function handleCreate() {
    if (!newName.trim()) return;
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("series").insert({
      user_id: user.id,
      name: newName.trim(),
      description: newDesc.trim() || null,
    });

    setNewName("");
    setNewDesc("");
    setCreateOpen(false);
    loadSeries();
  }

  return (
    <div className="mx-auto max-w-3xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Series</h1>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Series
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : seriesList.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <div className="rounded-2xl bg-muted p-6 mb-4">
            <Library className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No series yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Group related sermons together into a series.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {seriesList.map((s) => (
            <Link key={s.id} href={`/series/${s.id}`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{s.name}</h3>
                      {s.description && (
                        <p className="text-sm text-muted-foreground mt-1">{s.description}</p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {s.note_count} {s.note_count === 1 ? "note" : "notes"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Series</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Name</Label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Romans Study, Fall 2025"
              />
            </div>
            <div>
              <Label>Description (optional)</Label>
              <Textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="What is this series about?"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleCreate} disabled={!newName.trim()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
