import type { StreakData } from "@/types";

export const STREAK_KEY = "enem_streak";

export function defaultStreak(): StreakData {
  return {
    current: 0,
    lastCompletedDate: null,
    longestStreak: 0,
    catchUpUsedFor: null,
  };
}

export function getStreak(): StreakData {
  try {
    if (typeof window === "undefined") return defaultStreak();
    const raw = localStorage.getItem(STREAK_KEY);
    return raw ? { ...defaultStreak(), ...JSON.parse(raw) } : defaultStreak();
  } catch {
    return defaultStreak();
  }
}

export function saveStreak(data: StreakData): void {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(STREAK_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}
