import type { DailyContent, Disciplina, Question, VisualContent } from "@/types";
import { getTodayString, isDateSunday } from "@/lib/utils";
import { getFallbackDailyContent } from "@/lib/fallback";

const API_URL =
  "https://script.google.com/macros/s/AKfycbyucNEaUN1uBd18Fea-qomNGjCqD9RJjlRIKBxyNYSMKWlA3YEYVbNEV9F1Nep8Hcu_/exec";

// Bump this version whenever normalization logic changes, to force cache invalidation.
const CACHE_VERSION = "v4";
const CACHE_KEY = `enem_cached_content_${CACHE_VERSION}`;
const CACHE_DATE_KEY = `enem_cached_date_${CACHE_VERSION}`;

interface CachedData {
  content: DailyContent;
  cachedAt: string;
}

import { getCurriculumForDate } from "@/lib/curriculum";

export function normalizeVisual(rawVisual: unknown): VisualContent | null {
  if (!rawVisual) return null;

  if (typeof rawVisual === "object") {
    const v = rawVisual as Record<string, unknown>;
    const tipo = String(v.tipo || v.type || "").toLowerCase().trim();
    const conteudo = String(v.conteudo || v.content || v.url || v.svg || "").trim();
    const legenda = String(v.legenda || v.caption || v.descricao || "").trim();

    if (tipo === "svg" || tipo === "imagem") {
      if (!conteudo) return null;
      return {
        tipo: tipo as "svg" | "imagem",
        conteudo,
        legenda: legenda || undefined,
      };
    }
  }

  if (typeof rawVisual === "string") {
    const str = rawVisual.trim();
    if (str.startsWith("<svg") || str.includes("<svg")) {
      return { tipo: "svg", conteudo: str };
    }
    if (str.startsWith("http://") || str.startsWith("https://") || str.startsWith("data:image/")) {
      return { tipo: "imagem", conteudo: str };
    }
  }

  return null;
}

export function normalizeDailyContent(raw: Record<string, unknown>, fallbackDate: string): DailyContent {
  // Explicit fields from the spreadsheet are ALWAYS the source of truth.
  // We only fall back to local curriculum inference when the API fields are absent or empty.
  const explicitTopico = (
    (raw.topico_principal as string) ||
    (raw.topico as string) ||
    (raw.tema as string) ||
    (raw.titulo as string) ||
    ""
  ).trim();

  const explicitDisciplina = (raw.disciplina as Disciplina) || (raw.materia as Disciplina) || null;
  const explicitSemana = ((raw.semana as string) || "").trim();

  // Only use local fallbacks when the API genuinely didn't provide these fields
  const hasExplicitMeta = explicitTopico !== "" && explicitDisciplina !== null && explicitSemana !== "";

  let finalTopico: string;
  let finalDisciplina: Disciplina;
  let finalSemana: string;

  if (hasExplicitMeta) {
    // Trust the spreadsheet completely — no inference
    finalTopico = explicitTopico;
    finalDisciplina = explicitDisciplina!;
    finalSemana = explicitSemana;
  } else {
    // API didn't return full metadata — use local curriculum as fallback
    const scheduled = getCurriculumForDate(fallbackDate);
    finalTopico = explicitTopico !== "" ? explicitTopico : scheduled.topico_principal;
    finalDisciplina = explicitDisciplina ?? scheduled.disciplina;
    finalSemana = explicitSemana !== "" ? explicitSemana : scheduled.semana;
  }

  const scheduled = getCurriculumForDate(fallbackDate);

  const rawQuestoes = Array.isArray(raw.questoes) && raw.questoes.length > 0
    ? raw.questoes
    : scheduled.questoes;

  const rawPalavras = Array.isArray(raw.palavras_do_dia) && raw.palavras_do_dia.length > 0
    ? raw.palavras_do_dia
    : scheduled.palavras_do_dia;

  const normalizedQuestoes: Question[] = (rawQuestoes as Record<string, unknown>[]).map((q, idx) => {
    const rawQVisual = q.visual || q.imagem_url || q.imagem || null;
    const visual = normalizeVisual(rawQVisual);

    return {
      id: typeof q.id === "number" ? q.id : idx + 1,
      ano_origem: (q.ano_origem as string) || "ENEM",
      enunciado: (q.enunciado as string) || "",
      visual,
      alternativas: (q.alternativas as Question["alternativas"]) || {
        A: "",
        B: "",
        C: "",
        D: "",
        E: "",
      },
      gabarito: (q.gabarito as Question["gabarito"]) || "A",
      explicacao_descomplicada: (q.explicacao_descomplicada as string) || "",
    };
  });

  const rawContextVisual = raw.visual || raw.contexto_visual_grafico || null;
  const contextVisual = normalizeVisual(rawContextVisual);

  return {
    data: (raw.data as string) || fallbackDate,
    semana: finalSemana,
    disciplina: finalDisciplina,
    topico_principal: finalTopico,
    contexto_visual: (raw.contexto_visual as string) || scheduled.contexto_visual,
    visual: contextVisual,
    canivete_repertorio: (raw.canivete_repertorio as string) || scheduled.canivete_repertorio,
    palavras_do_dia: rawPalavras,
    questoes: normalizedQuestoes,
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
    // 1. Check date-specific versioned cache
    const rawSpecific = localStorage.getItem(`enem_content_${CACHE_VERSION}_${date}`);
    if (rawSpecific) {
      const cached = JSON.parse(rawSpecific) as Record<string, unknown>;
      if (isValidDailyContent(cached)) {
        // Always re-normalize to ensure cover metadata is correct
        return normalizeDailyContent(cached, date);
      }
    }

    // 2. Check general versioned cache if date matches today
    const cachedDate = localStorage.getItem(CACHE_DATE_KEY);
    if (cachedDate === date) {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const cached: CachedData = JSON.parse(raw);
        if (isValidDailyContent(cached?.content)) {
          // Always re-normalize to ensure cover metadata is correct
          return normalizeDailyContent(cached.content as unknown as Record<string, unknown>, date);
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
    localStorage.setItem(`enem_content_${CACHE_VERSION}_${date}`, JSON.stringify(content));
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

  // Se for domingo, domingo não possui novo conteúdo obrigatório
  if (isDateSunday(date)) {
    throw new Error("Domingo é dia de descanso. Sem novo conteúdo.");
  }

  // 1. Tenta buscar da API primeiro para garantir que alterações na planilha apareçam imediatamente
  try {
    const url = `${API_URL}?data=${encodeURIComponent(date)}`;
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });

    if (response.ok) {
      const rawData = await response.json();
      if (isValidDailyContent(rawData)) {
        const data = normalizeDailyContent(rawData as Record<string, unknown>, date);
        saveCachedContent(date, data);
        saveAvailableDates([date]);
        return data;
      }
    }
  } catch {
    // Falha de rede / offline
  }

  // 2. Se a rede falhar (ex: offline ou erro temporário), usa o cache local
  const localCached = getCachedContent(date);
  if (localCached) {
    return localCached;
  }

  throw new Error("Conteúdo não encontrado para esta data na planilha.");
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
        const rows = (data.rows || data.items || data.cadernos || data.datas) as
          | (Record<string, unknown> | string)[]
          | undefined;
        if (Array.isArray(rows)) {
          for (const item of rows) {
            if (typeof item === "string" && item.trim() !== "") {
              discoveredDates.push(item.trim());
            } else if (item && typeof item === "object" && typeof item.data === "string") {
              const d = item.data.trim();
              discoveredDates.push(d);
              const normalized = normalizeDailyContent(item as Record<string, unknown>, d);
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


