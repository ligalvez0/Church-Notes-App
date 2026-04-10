"use client";

import { useState } from "react";
import { BookOpen, Library } from "lucide-react";
import { cn } from "@/lib/utils";
import { BibleReader } from "@/components/scripture/bible-reader";
import { MyReferences } from "@/components/scripture/my-references";

type Tab = "browse" | "references";

export default function ScripturePage() {
  const [activeTab, setActiveTab] = useState<Tab>("browse");

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          <span className="gradient-text">Bible</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Read Scripture and explore your references.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex rounded-2xl border border-border/40 bg-card p-1 shadow-sm">
        <button
          onClick={() => setActiveTab("browse")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-all",
            activeTab === "browse"
              ? "text-white shadow-md shadow-primary/25"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
          )}
          style={
            activeTab === "browse"
              ? { background: "var(--gradient-primary)" }
              : undefined
          }
        >
          <BookOpen className="h-4 w-4" />
          Browse Bible
        </button>
        <button
          onClick={() => setActiveTab("references")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-all",
            activeTab === "references"
              ? "text-white shadow-md shadow-primary/25"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
          )}
          style={
            activeTab === "references"
              ? { background: "var(--gradient-primary)" }
              : undefined
          }
        >
          <Library className="h-4 w-4" />
          My References
        </button>
      </div>

      {/* Tab content */}
      {activeTab === "browse" ? <BibleReader /> : <MyReferences />}
    </div>
  );
}
