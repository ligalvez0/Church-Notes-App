"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Loader2, LogIn, UserPlus, KeyRound, ArrowLeft } from "lucide-react";

type Mode = "signin" | "signup" | "forgot";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<Mode>("signin");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  function switchMode(newMode: Mode) {
    setMode(newMode);
    setError(null);
    setMessage(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (mode === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/settings`,
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage("Check your email for a password reset link!");
      }
      setLoading(false);
      return;
    }

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        // If user already exists, tell them to sign in or reset password
        if (error.message.includes("already") || error.message.includes("exists")) {
          setError("An account with this email already exists. Try signing in, or use Forgot Password to set a new password.");
        } else {
          setError(error.message);
        }
        setLoading(false);
        return;
      }

      // Auto sign in after sign up
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!signInError) {
        router.push("/notes");
        router.refresh();
      } else {
        setMessage("Account created! You can now sign in.");
        setMode("signin");
      }
    } else {
      // Sign in
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message === "Invalid login credentials") {
          setError("Invalid email or password. Try Forgot Password if you signed up with a magic link before.");
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
            {mode === "signup" ? "Create your account" : mode === "forgot" ? "Reset password" : "Welcome back"}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "signup" ? "Start capturing sermons today" : mode === "forgot" ? "We'll send you a reset link" : "Sign in to your notes"}
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

          {mode !== "forgot" && (
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder={mode === "signup" ? "Create a password (6+ characters)" : "Your password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="h-12 rounded-2xl text-base border-border/50 bg-secondary/30 focus:bg-background transition-colors"
              />
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-12 rounded-2xl text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5"
            style={{ background: "var(--gradient-primary)" }}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : mode === "signup" ? (
              <UserPlus className="mr-2 h-4 w-4" />
            ) : mode === "forgot" ? (
              <KeyRound className="mr-2 h-4 w-4" />
            ) : (
              <LogIn className="mr-2 h-4 w-4" />
            )}
            {mode === "signup" ? "Create Account" : mode === "forgot" ? "Send Reset Link" : "Sign In"}
          </Button>
        </form>

        {/* Links */}
        <div className="flex flex-col gap-2 pt-1">
          {mode === "signin" && (
            <Button
              type="button"
              variant="ghost"
              onPointerDown={() => switchMode("forgot")}
              className="w-full h-11 rounded-2xl text-sm text-muted-foreground"
            >
              Forgot password?
            </Button>
          )}

          {mode === "forgot" ? (
            <Button
              type="button"
              variant="ghost"
              onPointerDown={() => switchMode("signin")}
              className="w-full h-11 rounded-2xl text-sm text-primary font-medium"
            >
              <ArrowLeft className="mr-1 h-3 w-3" />
              Back to sign in
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              onPointerDown={() => switchMode(mode === "signup" ? "signin" : "signup")}
              className="w-full h-11 rounded-2xl text-sm text-primary font-medium"
            >
              {mode === "signup" ? "Already have an account? Sign in" : "Need an account? Sign up"}
            </Button>
          )}
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
