import type { DailyContent, Disciplina } from "@/types";
import { getTodayString, isDateSunday, formatDate } from "@/lib/utils";
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

import { inferTopicAndDisciplina, getCurriculumForDate } from "@/lib/curriculum";

export function normalizeDailyContent(raw: Record<string, unknown>, fallbackDate: string): DailyContent {
  const explicitTopico =
    (raw.topico_principal as string) ||
    (raw.topico as string) ||
    (raw.tema as string) ||
    (raw.titulo as string) ||
    "";
  const explicitDisciplina = (raw.disciplina as Disciplina) || (raw.materia as Disciplina);
  const explicitSemana = (raw.semana as string) || "";

  const scheduled = getCurriculumForDate(fallbackDate);
  const inferred = inferTopicAndDisciplina(raw, fallbackDate);

  const finalTopico = explicitTopico.trim() !== "" ? explicitTopico : inferred.topico_principal;
  const finalDisciplina = explicitDisciplina || inferred.disciplina;
  const finalSemana = explicitSemana.trim() !== "" ? explicitSemana : inferred.semana;

  const rawQuestoes = Array.isArray(raw.questoes) && raw.questoes.length > 0
    ? raw.questoes
    : scheduled.questoes;

  const rawPalavras = Array.isArray(raw.palavras_do_dia) && raw.palavras_do_dia.length > 0
    ? raw.palavras_do_dia
    : scheduled.palavras_do_dia;

  return {
    data: (raw.data as string) || fallbackDate,
    semana: finalSemana,
    disciplina: finalDisciplina,
    topico_principal: finalTopico,
    contexto_visual: (raw.contexto_visual as string) || scheduled.contexto_visual,
    canivete_repertorio: (raw.canivete_repertorio as string) || scheduled.canivete_repertorio,
    palavras_do_dia: rawPalavras,
    questoes: rawQuestoes,
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

const AVAILABLE_DATES_KEY = "enem_available_dates";

export function getStoredAvailableDates(): string[] {
  try {
    const raw = localStorage.getItem(AVAILABLE_DATES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return [];
}

export function saveAvailableDates(dates: string[]): void {
  try {
    const existing = new Set(getStoredAvailableDates());
    for (const d of dates) {
      if (d && typeof d === "string" && d.trim() !== "") {
        existing.add(d.trim());
      }
    }
    localStorage.setItem(AVAILABLE_DATES_KEY, JSON.stringify(Array.from(existing)));
  } catch {
    // ignore
  }
}

export async function syncSpreadsheetDates(): Promise<string[]> {
  try {
    // 1. Try querying with ?all=true
    const res = await fetch(`${API_URL}?all=true`, { method: "GET", cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      const discoveredDates: string[] = [];

      if (Array.isArray(data)) {
        for (const item of data) {
          if (item?.data && typeof item.data === "string") {
            const d = item.data.trim();
            discoveredDates.push(d);
            const normalized = normalizeDailyContent(item, d);
            saveCachedContent(d, normalized);
          }
        }
      } else if (data && typeof data === "object") {
        const rows = (data.rows || data.items || data.cadernos || data.datas) as Record<string, unknown>[] | undefined;
        if (Array.isArray(rows)) {
          for (const item of rows) {
            if (typeof item === "string" && item.trim() !== "") {
              discoveredDates.push(item.trim());
            } else if (item?.data && typeof item.data === "string") {
              const d = item.data.trim();
              discoveredDates.push(d);
              const normalized = normalizeDailyContent(item, d);
              saveCachedContent(d, normalized);
            }
          }
        } else if (typeof data.data === "string") {
          const d = data.data.trim();
          discoveredDates.push(d);
          const normalized = normalizeDailyContent(data, d);
          saveCachedContent(d, normalized);
        }
      }

      if (discoveredDates.length > 0) {
        saveAvailableDates(discoveredDates);
        return Array.from(new Set([...getStoredAvailableDates(), ...discoveredDates]));
      }
    }
  } catch {
    // ignore
  }

  // 2. Also try fetching default endpoint without params to discover today's entry
  try {
    const todayRes = await fetch(API_URL, { method: "GET", cache: "no-store" });
    if (todayRes.ok) {
      const todayData = await todayRes.json();
      if (isValidDailyContent(todayData)) {
        const dateKey = (todayData.data as string) || getTodayString();
        saveCachedContent(dateKey, normalizeDailyContent(todayData, dateKey));
        saveAvailableDates([dateKey]);
      }
    }
  } catch {
    // ignore
  }

  return getStoredAvailableDates();
}

export function setSampleCachedContent(customDate?: string): DailyContent {
  const date = customDate ?? getTodayString();
  const sample = getFallbackDailyContent(date);
  saveCachedContent(date, sample);
  saveAvailableDates([date]);
  return sample;
}


