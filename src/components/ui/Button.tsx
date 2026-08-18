"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  type?: "button" | "submit";
}

export function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className,
  disabled,
  fullWidth,
  type = "button",
}: ButtonProps) {
  return (
    <motion.button
      type={type}
      whileTap={{ scale: disabled ? 1 : 0.96 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "font-display font-semibold rounded-2xl transition-all duration-200 inline-flex items-center justify-center gap-2",
        size === "sm" && "text-sm px-4 py-2",
        size === "md" && "text-base px-6 py-3.5",
        size === "lg" && "text-lg px-8 py-4",
        variant === "primary" &&
          "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-soft-lg",
        variant === "secondary" &&
          "bg-surface-100 dark:bg-white/10 text-gray-800 dark:text-white border border-surface-200 dark:border-white/10",
        variant === "ghost" &&
          "text-gray-600 dark:text-gray-400 hover:bg-surface-100 dark:hover:bg-white/5",
        fullWidth && "w-full",
        disabled && "opacity-40 cursor-not-allowed",
        className
      )}
    >
      {children}
    </motion.button>
  );
}
