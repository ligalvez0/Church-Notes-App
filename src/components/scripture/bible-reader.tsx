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

// Known paragraph break points for common chapters (verse numbers where a new paragraph starts)
// For chapters not listed, we'll insert visual breaks every 4-5 verses
function getVerseGroups(verses: ChapterVerse[]): ChapterVerse[][] {
  if (verses.length === 0) return [];

  const groups: ChapterVerse[][] = [];
  let currentGroup: ChapterVerse[] = [];

  for (let i = 0; i < verses.length; i++) {
    currentGroup.push(verses[i]);

    // Check if we should start a new paragraph:
    // - After every 4-5 verses for readability
    // - When a verse ends with a period followed by a sentence that starts with a capital
    const isLastVerse = i === verses.length - 1;
    const versesInGroup = currentGroup.length;

    if (!isLastVerse && versesInGroup >= 4) {
      const currentText = verses[i].text;
      // Break after sentences that end definitively
      if (
        currentText.endsWith(".") ||
        currentText.endsWith("?") ||
        currentText.endsWith("!") ||
        currentText.endsWith('."') ||
        currentText.endsWith(".'")
      ) {
        groups.push(currentGroup);
        currentGroup = [];
      } else if (versesInGroup >= 6) {
        // Force break if group is getting too long
        groups.push(currentGroup);
        currentGroup = [];
      }
    }
  }

  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  return groups;
}

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
        if (!res.ok) throw new Error("Failed to load chapter");
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

  const verseGroups = getVerseGroups(verses);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Controls row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <select
          value={selectedBook}
          onChange={(e) => handleBookChange(e.target.value)}
          className="h-11 flex-1 rounded-2xl border border-border/40 bg-card px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
        >
          <optgroup label="Old Testament">
            {BIBLE_BOOKS.filter((b) => b.testament === "OT").map((b) => (
              <option key={b.name} value={b.name}>{b.name}</option>
            ))}
          </optgroup>
          <optgroup label="New Testament">
            {BIBLE_BOOKS.filter((b) => b.testament === "NT").map((b) => (
              <option key={b.name} value={b.name}>{b.name}</option>
            ))}
          </optgroup>
        </select>

        <select
          value={selectedChapter}
          onChange={(e) => setSelectedChapter(Number(e.target.value))}
          className="h-11 w-24 rounded-2xl border border-border/40 bg-card px-3 text-sm font-medium text-center focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
        >
          {Array.from({ length: maxChapters }, (_, i) => i + 1).map((ch) => (
            <option key={ch} value={ch}>Ch. {ch}</option>
          ))}
        </select>

        <select
          value={translation}
          onChange={(e) => setTranslation(e.target.value as Translation)}
          className="h-11 w-24 rounded-2xl border border-border/40 bg-card px-3 text-sm font-medium text-center focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
        >
          {(Object.keys(TRANSLATION_LABELS) as Translation[]).map((t) => (
            <option key={t} value={t}>{TRANSLATION_LABELS[t]}</option>
          ))}
        </select>
      </div>

      {/* Chapter content */}
      <div className="rounded-2xl border border-border/40 bg-card shadow-sm overflow-hidden">
        {/* Chapter header */}
        <div className="px-5 py-5 border-b border-border/30 text-center" style={{ background: "var(--gradient-card)" }}>
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevChapter}
              disabled={!canGoPrev}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all disabled:opacity-30"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-2xl font-bold gradient-text">
                {selectedBook}
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Chapter {selectedChapter}
                <span className="mx-1.5 opacity-40">·</span>
                <span className="uppercase tracking-wider text-[11px] font-medium">
                  {TRANSLATION_LABELS[translation]}
                </span>
              </p>
            </div>
            <button
              onClick={handleNextChapter}
              disabled={!canGoNext}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all disabled:opacity-30"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Verses */}
        <div className="px-5 sm:px-8 py-6 sm:py-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div
                className="h-10 w-10 rounded-2xl flex items-center justify-center"
                style={{ background: "var(--gradient-primary)" }}
              >
                <Loader2 className="h-5 w-5 animate-spin text-white" />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">Loading chapter...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-2xl bg-destructive/10 p-5 mb-4">
                <BookOpen className="h-8 w-8 text-destructive" />
              </div>
              <p className="text-sm text-destructive font-medium">{error}</p>
              <button
                onClick={() => fetchChapter(selectedBook, selectedChapter, translation)}
                className="mt-3 text-sm text-primary hover:underline"
              >
                Try again
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Drop cap first verse */}
              {verseGroups.map((group, groupIdx) => (
                <p key={groupIdx} className="leading-[2] text-[15px] sm:text-base text-foreground/90">
                  {group.map((v, vIdx) => (
                    <span key={v.verse} className="group">
                      {groupIdx === 0 && vIdx === 0 ? (
                        // First verse of the chapter — drop cap style
                        <>
                          <sup className="text-[10px] font-bold text-primary mr-0.5 select-none">
                            {v.verse}
                          </sup>
                          <span className="float-left text-5xl font-serif font-bold leading-[0.85] mr-1.5 mt-1 gradient-text select-text">
                            {v.text.charAt(0)}
                          </span>
                          <span className="hover:bg-highlight/40 rounded-sm transition-colors selection:bg-primary/20">
                            {v.text.slice(1)}
                          </span>{" "}
                        </>
                      ) : (
                        <>
                          <sup className="text-[10px] font-bold text-primary/60 mr-0.5 select-none">
                            {v.verse}
                          </sup>
                          <span className="hover:bg-highlight/40 rounded-sm transition-colors selection:bg-primary/20">
                            {v.text}
                          </span>{" "}
                        </>
                      )}
                    </span>
                  ))}
                </p>
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
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-card border border-border/40 transition-all disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>
        <span className="text-xs text-muted-foreground">
          {selectedChapter} of {maxChapters}
        </span>
        <button
          onClick={handleNextChapter}
          disabled={!canGoNext}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-card border border-border/40 transition-all disabled:opacity-30"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
