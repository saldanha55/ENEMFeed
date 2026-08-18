"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StreakBadgeProps {
  streak: number;
  className?: string;
  size?: "sm" | "md";
}

export function StreakBadge({
  streak,
  className,
  size = "md",
}: StreakBadgeProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        "inline-flex items-center gap-1 font-display font-bold rounded-full",
        "bg-orange-50 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400",
        "border border-orange-200/60 dark:border-orange-500/20",
        size === "sm" ? "text-xs px-2.5 py-1" : "text-sm px-3 py-1.5",
        className
      )}
    >
      <span>🔥</span>
      <span>{streak}</span>
    </motion.div>
  );
}
