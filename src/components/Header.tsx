"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, History, BookOpen } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { StreakBadge } from "@/components/ui/StreakBadge";
import { getStreak } from "@/lib/progress";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { StreakData } from "@/types";

export function Header() {
  const pathname = usePathname();
  const [streak, setStreak] = useState<StreakData | null>(null);

  useEffect(() => {
    setStreak(getStreak());
  }, [pathname]); // refresh streak display on every navigation

  const navItems = [
    { href: "/", icon: Home, label: "Início" },
    { href: "/history", icon: History, label: "Histórico" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-surface-50/80 dark:bg-surface-900/80 backdrop-blur-md border-b border-surface-200/60 dark:border-white/5">
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-matematica to-redacao flex items-center justify-center">
            <BookOpen size={14} className="text-white" />
          </div>
          <span className="font-display font-bold text-gray-900 dark:text-white text-sm tracking-tight">
            ENEMFeed
          </span>
        </Link>

        {/* Right side: nav + streak + theme toggle */}
        <div className="flex items-center gap-2">
          <nav className="flex items-center gap-1 mr-1">
            {navItems.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                aria-label={label}
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150",
                  pathname === href
                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                    : "text-gray-500 dark:text-gray-400 hover:bg-surface-100 dark:hover:bg-white/10"
                )}
              >
                <Icon size={16} />
              </Link>
            ))}
          </nav>

          {streak !== null && streak.current > 0 && (
            <StreakBadge streak={streak.current} size="sm" />
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
