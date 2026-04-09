"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { BookOpen } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn() {
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

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
    } catch {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  }

  return (
    <div>
      <div className="text-center mb-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary mb-4">
          <BookOpen className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold">Church Notes</h1>
        <p className="text-muted-foreground mt-1 text-sm">Sign in to your notes</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            placeholder="you@church.org"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 rounded-xl border border-border bg-background px-4 text-base"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-12 rounded-xl border border-border bg-background px-4 text-base"
          />
        </div>

        <button
          type="button"
          onClick={handleSignIn}
          disabled={loading}
          className="w-full h-12 rounded-xl bg-primary text-white text-base font-semibold active:opacity-80 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        <Link href="/forgot-password" className="block text-center py-2 text-sm text-muted-foreground underline">
          Forgot password?
        </Link>

        <Link href="/signup" className="block text-center py-2 text-sm text-primary underline">
          Need an account? Sign up
        </Link>
      </div>
    </div>
  );
}
