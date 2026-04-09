"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { BookOpen, Loader2, KeyRound, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleReset() {
    if (!email) {
      setError("Please enter your email.");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/settings`,
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage("Check your email for a password reset link!");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-5">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl shadow-2xl shadow-primary/30 animate-pulse-glow" style={{ background: "var(--gradient-hero)" }}>
          <BookOpen className="h-10 w-10 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight gradient-text">Church Notes</h1>
          <p className="text-muted-foreground mt-2 text-sm">Capture every sermon. Never miss a moment.</p>
        </div>
      </div>

      <div className="rounded-3xl border border-border/50 bg-card/80 backdrop-blur-xl p-7 shadow-2xl shadow-black/5 space-y-5">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Reset password</h2>
          <p className="text-sm text-muted-foreground mt-1">We&apos;ll send you a reset link</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="you@church.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 rounded-2xl border border-border/50 bg-secondary/30 px-4 text-base focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
            />
          </div>
          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full h-12 rounded-2xl text-base font-semibold text-white shadow-lg shadow-primary/25 active:opacity-80 disabled:opacity-50 transition-all"
            style={{ background: "var(--gradient-primary)" }}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </div>

        <div className="pt-2">
          <Link href="/login" className="flex items-center justify-center gap-1 w-full py-3 text-sm text-primary font-medium underline">
            <ArrowLeft className="h-3 w-3" />
            Back to sign in
          </Link>
        </div>

        {message && (
          <div className="rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-200/50 dark:border-green-800/50 p-4 text-center text-sm text-green-700 dark:text-green-400 animate-fade-in">
            {message}
          </div>
        )}

        {error && (
          <div className="rounded-2xl bg-destructive/10 border border-destructive/20 p-4 text-center text-sm text-destructive animate-fade-in">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
