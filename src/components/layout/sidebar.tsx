"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  FileText,
  Search,
  ListTodo,
  Heart,
  Settings,
  Library,
  BookMarked,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/notes", label: "Notes", icon: FileText },
  { href: "/series", label: "Series", icon: Library },
  { href: "/scripture", label: "Scripture", icon: BookOpen },
  { href: "/search", label: "Search", icon: Search },
  { href: "/actions", label: "Actions", icon: ListTodo },
  { href: "/prayer", label: "Prayer", icon: Heart },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-border/50 bg-card/50 backdrop-blur-sm">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl shadow-lg shadow-primary/20" style={{ background: "var(--gradient-primary)" }}>
          <BookMarked className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight gradient-text">Church Notes</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 p-3 mt-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200",
                isActive
                  ? "text-primary-foreground shadow-lg shadow-primary/25"
                  : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
              )}
              style={isActive ? { background: "var(--gradient-primary)" } : undefined}
            >
              <item.icon className={cn("h-[18px] w-[18px]", isActive && "text-white")} />
              <span className={isActive ? "text-white" : ""}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Settings at bottom */}
      <div className="p-3 border-t border-border/50">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all",
            pathname.startsWith("/settings")
              ? "bg-secondary text-foreground"
              : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
          )}
        >
          <Settings className="h-[18px] w-[18px]" />
          Settings
        </Link>
      </div>
    </aside>
  );
}
