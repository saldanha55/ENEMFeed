import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  glass?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, glass, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-3xl p-6 transition-all duration-200",
        "bg-white dark:bg-surface-800",
        "border border-surface-200/60 dark:border-white/5",
        "shadow-soft dark:shadow-none",
        glass && "bg-white/70 dark:bg-white/5 backdrop-blur-md",
        onClick && "cursor-pointer active:scale-[0.98]",
        className
      )}
    >
      {children}
    </div>
  );
}
