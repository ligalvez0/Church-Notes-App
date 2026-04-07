"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  FileText,
  Search,
  Star,
  ListTodo,
  BookMarked,
  Settings,
  Library,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/notes", label: "Notes", icon: FileText },
  { href: "/series", label: "Series", icon: Library },
  { href: "/scripture", label: "Scripture", icon: BookOpen },
  { href: "/search", label: "Search", icon: Search },
  { href: "/actions", label: "Actions", icon: ListTodo },
  { href: "/prayer", label: "Prayer", icon: Star },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <BookMarked className="h-6 w-6 text-primary" />
        <span className="text-lg font-semibold">Church Notes</span>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
