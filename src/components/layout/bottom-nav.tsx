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
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-border/30 lg:hidden">
      <div className="flex items-center">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-all",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-xl transition-all",
                isActive && "shadow-md shadow-primary/20"
              )}
                style={isActive ? { background: "var(--gradient-primary)" } : undefined}
              >
                <item.icon className={cn("h-[18px] w-[18px]", isActive ? "text-white" : "")} />
              </div>
              <span className={isActive ? "font-semibold" : ""}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
