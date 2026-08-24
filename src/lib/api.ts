import type { DailyContent, Disciplina } from "@/types";
import { getTodayString, isDateSunday } from "@/lib/utils";
import { getFallbackDailyContent } from "@/lib/fallback";
import { getDayRecord } from "@/lib/progress";

const API_URL =
  "https://script.google.com/macros/s/AKfycbyucNEaUN1uBd18Fea-qomNGjCqD9RJjlRIKBxyNYSMKWlA3YEYVbNEV9F1Nep8Hcu_/exec";

const CACHE_KEY = "enem_cached_content";
const CACHE_DATE_KEY = "enem_cached_date";

interface CachedData {
  content: DailyContent;
  cachedAt: string;
}

export function normalizeDailyContent(raw: Record<string, unknown>, fallbackDate: string): DailyContent {
  const disciplina = (raw.disciplina as Disciplina) || "Matemática";
  return {
    data: (raw.data as string) || fallbackDate,
    semana: (raw.semana as string) || "Conteúdo do Dia",
    disciplina,
    topico_principal:
      (raw.topico_principal as string) ||
      (raw.topico as string) ||
      (raw.tema as string) ||
      "Decomposição de Figuras e Áreas",
    contexto_visual: (raw.contexto_visual as string) || "",
    canivete_repertorio: (raw.canivete_repertorio as string) || "",
    palavras_do_dia: Array.isArray(raw.palavras_do_dia) ? raw.palavras_do_dia : [],
    questoes: Array.isArray(raw.questoes) ? raw.questoes : [],
  };
}

export function isValidDailyContent(data: unknown): boolean {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  if (d.erro || d.error) return false;
  return (
    (Array.isArray(d.questoes) && d.questoes.length > 0) ||
    (Array.isArray(d.palavras_do_dia) && d.palavras_do_dia.length > 0)
  );
}

export function getCachedContent(targetDate?: string): DailyContent | null {
  const date = targetDate ?? getTodayString();
  try {
    // 1. Check history first
    const fromHistory = getDayRecord(date);
    if (fromHistory?.content && isValidDailyContent(fromHistory.content)) {
      return fromHistory.content;
    }

    // 2. Check date-specific cache
    const rawSpecific = localStorage.getItem(`enem_content_${date}`);
    if (rawSpecific) {
      const cached = JSON.parse(rawSpecific);
      if (isValidDailyContent(cached)) return cached;
    }

    // 3. Check general cache if date matches today
    const cachedDate = localStorage.getItem(CACHE_DATE_KEY);
    if (cachedDate === date) {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const cached: CachedData = JSON.parse(raw);
        if (isValidDailyContent(cached?.content)) {
          return cached.content;
        }
      }
    }
  } catch {
    // ignore
  }
  return null;
}

export function saveCachedContent(date: string, content: DailyContent): void {
  try {
    localStorage.setItem(`enem_content_${date}`, JSON.stringify(content));
    if (date === getTodayString()) {
      const cached: CachedData = { content, cachedAt: date };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
      localStorage.setItem(CACHE_DATE_KEY, date);
    }
  } catch {
    // ignore
  }
}

export async function fetchDailyContent(targetDate?: string): Promise<DailyContent> {
  const date = targetDate ?? getTodayString();

  // Return cached or history content if valid
  const localCached = getCachedContent(date);
  if (localCached) {
    return localCached;
  }

  // If target date is Sunday, Sunday has no mandatory API content
  if (isDateSunday(date)) {
    throw new Error("Domingo é dia de descanso. Sem novo conteúdo.");
  }

  // Fetch from API
  try {
    const isToday = date === getTodayString();
    const url = isToday ? API_URL : `${API_URL}?data=${encodeURIComponent(date)}`;
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Erro na API (${response.status})`);
    }

    const rawData = await response.json();

    if (isValidDailyContent(rawData)) {
      const data = normalizeDailyContent(rawData as Record<string, unknown>, date);
      saveCachedContent(date, data);
      return data;
    }
  } catch {
    // API failed or returned error message
  }

  // If API didn't return content, generate/retrieve fallback for that specific date
  const fallback = getFallbackDailyContent(date);
  saveCachedContent(date, fallback);
  return fallback;
}

export function setSampleCachedContent(customDate?: string): DailyContent {
  const date = customDate ?? getTodayString();
  const sample = getFallbackDailyContent(date);
  saveCachedContent(date, sample);
  return sample;
}

