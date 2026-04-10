"use client";

import { useCallback, useEffect, useState } from "react";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { BIBLE_BOOKS } from "@/lib/bible-data";
import type { ChapterVerse, ChapterResponse } from "@/types/bible";

type Translation = "kjv" | "asv" | "web";

const TRANSLATION_LABELS: Record<Translation, string> = {
  kjv: "KJV",
  asv: "ASV",
  web: "WEB",
};

export function BibleReader() {
  const [selectedBook, setSelectedBook] = useState("John");
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [translation, setTranslation] = useState<Translation>("kjv");
  const [verses, setVerses] = useState<ChapterVerse[]>([]);
  const [chapterRef, setChapterRef] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bookData = BIBLE_BOOKS.find((b) => b.name === selectedBook);
  const maxChapters = bookData?.chapters ?? 1;

  const fetchChapter = useCallback(
    async (book: string, chapter: number, trans: Translation) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          book,
          chapter: String(chapter),
          translation: trans,
        });
        const res = await fetch(`/api/bible/chapter?${params}`);
        if (!res.ok) {
          throw new Error("Failed to load chapter");
        }
        const data: ChapterResponse = await res.json();
        setVerses(data.verses);
        setChapterRef(data.reference);
      } catch {
        setError("Could not load this chapter. Please try again.");
        setVerses([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchChapter(selectedBook, selectedChapter, translation);
  }, [selectedBook, selectedChapter, translation, fetchChapter]);

  function handleBookChange(bookName: string) {
    setSelectedBook(bookName);
    setSelectedChapter(1);
  }

  function handlePrevChapter() {
    if (selectedChapter > 1) {
      setSelectedChapter((c) => c - 1);
    } else {
      // Go to previous book's last chapter
      const idx = BIBLE_BOOKS.findIndex((b) => b.name === selectedBook);
      if (idx > 0) {
        const prevBook = BIBLE_BOOKS[idx - 1];
        setSelectedBook(prevBook.name);
        setSelectedChapter(prevBook.chapters);
      }
    }
  }

  function handleNextChapter() {
    if (selectedChapter < maxChapters) {
      setSelectedChapter((c) => c + 1);
    } else {
      // Go to next book's first chapter
      const idx = BIBLE_BOOKS.findIndex((b) => b.name === selectedBook);
      if (idx < BIBLE_BOOKS.length - 1) {
        const nextBook = BIBLE_BOOKS[idx + 1];
        setSelectedBook(nextBook.name);
        setSelectedChapter(1);
      }
    }
  }

  const canGoPrev =
    selectedChapter > 1 ||
    BIBLE_BOOKS.findIndex((b) => b.name === selectedBook) > 0;
  const canGoNext =
    selectedChapter < maxChapters ||
    BIBLE_BOOKS.findIndex((b) => b.name === selectedBook) <
      BIBLE_BOOKS.length - 1;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Controls row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Book selector */}
        <select
          value={selectedBook}
          onChange={(e) => handleBookChange(e.target.value)}
          className="h-11 flex-1 rounded-2xl border border-border/40 bg-card px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all appearance-none"
        >
          <optgroup label="Old Testament">
            {BIBLE_BOOKS.filter((b) => b.testament === "OT").map((b) => (
              <option key={b.name} value={b.name}>
                {b.name}
              </option>
            ))}
          </optgroup>
          <optgroup label="New Testament">
            {BIBLE_BOOKS.filter((b) => b.testament === "NT").map((b) => (
              <option key={b.name} value={b.name}>
                {b.name}
              </option>
            ))}
          </optgroup>
        </select>

        {/* Chapter selector */}
        <select
          value={selectedChapter}
          onChange={(e) => setSelectedChapter(Number(e.target.value))}
          className="h-11 w-24 rounded-2xl border border-border/40 bg-card px-3 text-sm font-medium text-center focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all appearance-none"
        >
          {Array.from({ length: maxChapters }, (_, i) => i + 1).map((ch) => (
            <option key={ch} value={ch}>
              Ch. {ch}
            </option>
          ))}
        </select>

        {/* Translation selector */}
        <select
          value={translation}
          onChange={(e) => setTranslation(e.target.value as Translation)}
          className="h-11 w-24 rounded-2xl border border-border/40 bg-card px-3 text-sm font-medium text-center focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all appearance-none"
        >
          {(Object.keys(TRANSLATION_LABELS) as Translation[]).map((t) => (
            <option key={t} value={t}>
              {TRANSLATION_LABELS[t]}
            </option>
          ))}
        </select>
      </div>

      {/* Chapter content */}
      <div className="rounded-2xl border border-border/40 bg-card shadow-sm overflow-hidden">
        {/* Chapter header */}
        <div
          className="px-5 py-4 border-b border-border/30"
          style={{ background: "var(--gradient-card)" }}
        >
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevChapter}
              disabled={!canGoPrev}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="text-center">
              <h2 className="text-lg font-bold gradient-text">
                {chapterRef || `${selectedBook} ${selectedChapter}`}
              </h2>
              <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                {TRANSLATION_LABELS[translation]}
              </span>
            </div>
            <button
              onClick={handleNextChapter}
              disabled={!canGoNext}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Verses */}
        <div className="px-5 py-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div
                className="h-10 w-10 rounded-2xl flex items-center justify-center"
                style={{ background: "var(--gradient-primary)" }}
              >
                <Loader2 className="h-5 w-5 animate-spin text-white" />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Loading chapter...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-2xl bg-destructive/10 p-5 mb-4">
                <BookOpen className="h-8 w-8 text-destructive" />
              </div>
              <p className="text-sm text-destructive font-medium">{error}</p>
              <button
                onClick={() =>
                  fetchChapter(selectedBook, selectedChapter, translation)
                }
                className="mt-3 text-sm text-primary hover:underline"
              >
                Try again
              </button>
            </div>
          ) : (
            <div className="space-y-0 leading-[1.9] text-[15px]">
              {verses.map((v) => (
                <span
                  key={v.verse}
                  className="group cursor-text inline"
                >
                  <sup className="text-[10px] font-bold text-primary/70 mr-0.5 select-none">
                    {v.verse}
                  </sup>
                  <span className="hover:bg-highlight/60 rounded-sm transition-colors selection:bg-primary/20">
                    {v.text}{" "}
                  </span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevChapter}
          disabled={!canGoPrev}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-card border border-border/40 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>
        <span className="text-xs text-muted-foreground">
          {selectedBook} {selectedChapter} of {maxChapters}
        </span>
        <button
          onClick={handleNextChapter}
          disabled={!canGoNext}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-card border border-border/40 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
