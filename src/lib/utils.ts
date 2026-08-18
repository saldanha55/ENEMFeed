import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Disciplina } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDisciplinaConfig(disciplina: Disciplina) {
  const configs = {
    "Matemática": {
      color: "#6C8EFF",
      bg: "bg-matematica-light dark:bg-matematica-dark/20",
      badge:
        "bg-matematica-light text-matematica-dark dark:bg-matematica-dark/30 dark:text-matematica",
      accent: "text-matematica dark:text-matematica",
      border: "border-matematica/30",
      glow: "shadow-[0_0_20px_rgba(108,142,255,0.25)]",
      emoji: "📐",
    },
    "Redação": {
      color: "#D67BFF",
      bg: "bg-redacao-light dark:bg-redacao-dark/20",
      badge:
        "bg-redacao-light text-redacao-dark dark:bg-redacao-dark/30 dark:text-redacao",
      accent: "text-redacao dark:text-redacao",
      border: "border-redacao/30",
      glow: "shadow-[0_0_20px_rgba(214,123,255,0.25)]",
      emoji: "✍️",
    },
    "Linguagens": {
      color: "#34D399",
      bg: "bg-linguagens-light dark:bg-linguagens-dark/20",
      badge:
        "bg-linguagens-light text-linguagens-dark dark:bg-linguagens-dark/30 dark:text-linguagens",
      accent: "text-linguagens dark:text-linguagens",
      border: "border-linguagens/30",
      glow: "shadow-[0_0_20px_rgba(52,211,153,0.25)]",
      emoji: "📚",
    },
    "Ciências Humanas": {
      color: "#FFA959",
      bg: "bg-humanas-light dark:bg-humanas-dark/20",
      badge:
        "bg-humanas-light text-humanas-dark dark:bg-humanas-dark/30 dark:text-humanas",
      accent: "text-humanas dark:text-humanas",
      border: "border-humanas/30",
      glow: "shadow-[0_0_20px_rgba(255,169,89,0.25)]",
      emoji: "🌍",
    },
  };
  return configs[disciplina] ?? configs["Matemática"];
}

export function formatDate(date: Date): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export function getTodayString(): string {
  return formatDate(new Date());
}

export function getYesterdayString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return formatDate(d);
}

export function parseDateString(dateStr: string): Date {
  const [dd, mm, yyyy] = dateStr.split("/").map(Number);
  return new Date(yyyy, mm - 1, dd);
}

export function getDaysBetween(d1: string, d2: string): number {
  const date1 = parseDateString(d1);
  const date2 = parseDateString(d2);
  const diff = Math.abs(date2.getTime() - date1.getTime());
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Bom dia ☀️";
  if (hour >= 12 && hour < 18) return "Boa tarde 🌤️";
  return "Boa noite 🌙";
}

export function formatDisplayDate(dateStr: string): string {
  // "DD/MM/YYYY" -> "18 de agosto"
  try {
    const date = parseDateString(dateStr);
    return date.toLocaleDateString("pt-BR", { day: "numeric", month: "long" });
  } catch {
    return dateStr;
  }
}

export const NICKNAMES = ["Luana", "Lounaz", "Fumiga", "Princesa", "Amor"] as const;

export function getDailyNickname(date: Date = new Date()): string {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const diff = date.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return NICKNAMES[Math.abs(dayOfYear) % NICKNAMES.length];
}

