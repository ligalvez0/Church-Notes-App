"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Loader2, LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  async function handleSignIn() {
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError("Invalid email or password.");
      } else {
        router.push("/notes");
        router.refresh();
      }
    } catch (err) {
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
          <p className="text-muted-foreground mt-2 text-sm">
            Capture every sermon. Never miss a moment.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-border/50 bg-card/80 backdrop-blur-xl p-7 shadow-2xl shadow-black/5 space-y-5">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Welcome back</h2>
          <p className="text-sm text-muted-foreground mt-1">Sign in to your notes</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@church.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-2xl text-base border-border/50 bg-secondary/30 focus:bg-background transition-colors"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 rounded-2xl text-base border-border/50 bg-secondary/30 focus:bg-background transition-colors"
            />
          </div>
          <button
            onClick={handleSignIn}
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full h-12 rounded-2xl text-base font-semibold text-white shadow-lg disabled:opacity-50"
            style={{ background: "var(--gradient-primary)" }}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>

        <div className="flex flex-col items-center gap-1 pt-2">
          <Link href="/forgot-password" className="block w-full text-center py-3 text-sm text-muted-foreground underline">
            Forgot password?
          </Link>
          <Link href="/signup" className="block w-full text-center py-3 text-sm text-primary font-medium underline">
            Need an account? Sign up
          </Link>
        </div>

        {error && (
          <div className="rounded-2xl bg-destructive/10 border border-destructive/20 p-4 text-center text-sm text-destructive animate-fade-in">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
