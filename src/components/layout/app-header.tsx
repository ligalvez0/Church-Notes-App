"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BookMarked, LogOut, User } from "lucide-react";

export function AppHeader({ userEmail }: { userEmail?: string }) {
  const router = useRouter();
  const supabase = createClient();

  const initials = userEmail
    ? userEmail.substring(0, 2).toUpperCase()
    : "CN";

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border/30 px-4 glass">
      <div className="flex items-center gap-3 lg:hidden">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl shadow-md shadow-primary/20" style={{ background: "var(--gradient-primary)" }}>
          <BookMarked className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm font-bold gradient-text">Church Notes</span>
      </div>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-1">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback
                  className="text-xs font-semibold text-white"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-2xl border-border/50 shadow-xl">
            <DropdownMenuItem disabled className="text-xs">
              <User className="mr-2 h-3.5 w-3.5" />
              {userEmail}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-3.5 w-3.5" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
