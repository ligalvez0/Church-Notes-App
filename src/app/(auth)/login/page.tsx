"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Loader2, Sparkles, LogIn, UserPlus } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (isSignUp) {
      // Sign up with email + password
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage("Account created! Signing you in...");
        // Auto sign in after sign up
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (!signInError) {
          router.push("/notes");
          router.refresh();
        }
      }
    } else {
      // Sign in with email + password
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message === "Invalid login credentials") {
          setError("Invalid email or password. Need an account? Click Sign Up below.");
        } else {
          setError(error.message);
        }
      } else {
        router.push("/notes");
        router.refresh();
      }
    }

    setLoading(false);
  }

  return (
    <div className="space-y-8">
      {/* Logo & Branding */}
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

      {/* Sign In Card */}
      <div className="rounded-3xl border border-border/50 bg-card/80 backdrop-blur-xl p-7 shadow-2xl shadow-black/5 space-y-5">
        <div className="text-center">
          <h2 className="text-lg font-semibold">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {isSignUp ? "Start capturing sermons today" : "Sign in to your notes"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@church.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 rounded-2xl text-base border-border/50 bg-secondary/30 focus:bg-background transition-colors"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder={isSignUp ? "Create a password (6+ characters)" : "Your password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="h-12 rounded-2xl text-base border-border/50 bg-secondary/30 focus:bg-background transition-colors"
            />
          </div>
          <Button
            type="submit"
            className="w-full h-12 rounded-2xl text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5"
            style={{ background: "var(--gradient-primary)" }}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : isSignUp ? (
              <UserPlus className="mr-2 h-4 w-4" />
            ) : (
              <LogIn className="mr-2 h-4 w-4" />
            )}
            {isSignUp ? "Create Account" : "Sign In"}
          </Button>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
              setMessage(null);
            }}
            className="text-sm text-primary hover:underline font-medium"
          >
            {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
          </button>
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

      <p className="text-center text-xs text-muted-foreground/50">
        By signing in, you agree to take better sermon notes.
      </p>
    </div>
  );
}
