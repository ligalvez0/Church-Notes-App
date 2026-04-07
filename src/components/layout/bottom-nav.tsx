"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Search, BookOpen, Settings, Library } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/notes", label: "Notes", icon: FileText },
  { href: "/series", label: "Series", icon: Library },
  { href: "/scripture", label: "Bible", icon: BookOpen },
  { href: "/search", label: "Search", icon: Search },
  { href: "/settings", label: "More", icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-border bg-card lg:hidden">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium transition-colors",
              isActive
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
