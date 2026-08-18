import type { DailyContent, Disciplina } from "@/types";
import { getTodayString } from "@/lib/utils";
import { getFallbackDailyContent } from "@/lib/fallback";

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

export async function fetchDailyContent(): Promise<DailyContent> {
  const today = getTodayString();

  // Return cached content if it's from today and valid
  try {
    const cachedDate = localStorage.getItem(CACHE_DATE_KEY);
    if (cachedDate === today) {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const cached: CachedData = JSON.parse(raw);
        if (isValidDailyContent(cached?.content)) {
          return cached.content;
        } else {
          // Clear corrupted cache
          localStorage.removeItem(CACHE_KEY);
          localStorage.removeItem(CACHE_DATE_KEY);
        }
      }
    }
  } catch {
    // localStorage not available
  }

  // Fetch from API
  const response = await fetch(API_URL, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Erro na API (${response.status})`);
  }

  const rawData = await response.json();

  if (!isValidDailyContent(rawData)) {
    const errorMsg =
      (rawData && typeof rawData === "object" && (rawData.erro || rawData.error)) ||
      "Conteúdo do dia não encontrado na planilha";
    throw new Error(String(errorMsg));
  }

  const data = normalizeDailyContent(rawData as Record<string, unknown>, today);

  // Cache the valid result
  try {
    const cached: CachedData = { content: data, cachedAt: today };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
    localStorage.setItem(CACHE_DATE_KEY, today);
  } catch {
    // ignore storage errors
  }

  return data;
}

export function getCachedContent(): DailyContent | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const cached: CachedData = JSON.parse(raw);
      if (isValidDailyContent(cached?.content)) {
        return cached.content;
      } else {
        localStorage.removeItem(CACHE_KEY);
        localStorage.removeItem(CACHE_DATE_KEY);
      }
    }
  } catch {
    // ignore
  }
  return null;
}

export function setSampleCachedContent(customDate?: string): DailyContent {
  const sample = getFallbackDailyContent(customDate);
  try {
    const today = customDate ?? getTodayString();
    const cached: CachedData = { content: sample, cachedAt: today };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
    localStorage.setItem(CACHE_DATE_KEY, today);
  } catch {
    // ignore
  }
  return sample;
}

