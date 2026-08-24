import type {
  HistoryRecord,
  StreakData,
  DayRecord,
  DailyContent,
} from "@/types";
import { getTodayString, getYesterdayString, getDaysBetween, getEffectiveStudyDaysBetween, isDateSunday } from "@/lib/utils";
import { inferTopicAndDisciplina, getAllCalendarDays } from "@/lib/curriculum";

const HISTORY_KEY = "enem_history";
const STREAK_KEY = "enem_streak";

// ─── History ────────────────────────────────────────────────────────────────

export function sanitizeDayRecord(date: string, record: DayRecord): DayRecord {
  if (!record || !record.content) return record;
  // If topico_principal is generic or incorrect, fix it with inferTopicAndDisciplina
  if (
    !record.content.topico_principal ||
    record.content.topico_principal === "Decomposição de Figuras e Áreas" ||
    record.content.topico_principal === "Conteúdo do Dia"
  ) {
    const inferred = inferTopicAndDisciplina(record.content as unknown as Record<string, unknown>, date);
    record.content.topico_principal = inferred.topico_principal;
    record.content.disciplina = inferred.disciplina;
    record.content.semana = inferred.semana;
  }
  return record;
}

export function getHistory(): HistoryRecord {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return {};
    const parsed: HistoryRecord = JSON.parse(raw);
    let changed = false;
    for (const [date, record] of Object.entries(parsed)) {
      const sanitized = sanitizeDayRecord(date, record);
      if (sanitized !== record) {
        parsed[date] = sanitized;
        changed = true;
      }
    }
    if (changed) {
      saveHistory(parsed);
    }
    return parsed;
  } catch {
    return {};
  }
}

export function saveHistory(history: HistoryRecord): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {
    // ignore
  }
}

export function getDayRecord(date: string): DayRecord | null {
  const history = getHistory();
  const rec = history[date];
  return rec ? sanitizeDayRecord(date, rec) : null;
}

export function saveDayRecord(date: string, record: DayRecord): void {
  const history = getHistory();
  history[date] = record;
  saveHistory(history);
}

export function isDayCompleted(date: string): boolean {
  const record = getDayRecord(date);
  return record !== null && !!record.completedAt;
}

export function markDayCompleted(
  date: string,
  content: DailyContent,
  answers: Record<number, string>
): void {
  const record: DayRecord = {
    content,
    answers,
    completedAt: new Date().toISOString(),
  };
  saveDayRecord(date, record);
}

// ─── Streak ─────────────────────────────────────────────────────────────────

function defaultStreak(): StreakData {
  return {
    current: 0,
    lastCompletedDate: null,
    longestStreak: 0,
    catchUpUsedFor: null,
  };
}

export function getStreak(): StreakData {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    return raw ? { ...defaultStreak(), ...JSON.parse(raw) } : defaultStreak();
  } catch {
    return defaultStreak();
  }
}

export function saveStreak(data: StreakData): void {
  try {
    localStorage.setItem(STREAK_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

/**
 * Updates streak when a day is completed.
 *
 * CLT 6x1 Catch-up & Rest Day rules:
 * - Sundays are rest days (no mandatory study, no streak loss).
 * - If the student missed 1 study day and completes yesterday's date (or previous study day),
 *   the streak is preserved.
 */
export function updateStreak(completedDate: string): StreakData {
  const streak = getStreak();
  const today = getTodayString();
  const yesterday = getYesterdayString();

  if (!streak.lastCompletedDate) {
    streak.current = 1;
    streak.lastCompletedDate = completedDate;
    streak.longestStreak = 1;
    saveStreak(streak);
    return streak;
  }

  const daysDiff = getDaysBetween(streak.lastCompletedDate, completedDate);
  const effectiveDiff = getEffectiveStudyDaysBetween(streak.lastCompletedDate, completedDate);

  if (daysDiff === 0) {
    // Same day re-completion — no change
    return streak;
  }

  if (effectiveDiff === 1 || daysDiff === 1) {
    // Consecutive study days (e.g. Fri -> Sat, or Sat -> Mon across Sunday rest day)
    streak.current += 1;
    streak.lastCompletedDate = completedDate;
  } else if (
    (effectiveDiff === 2 || daysDiff === 2) &&
    (completedDate === yesterday || isDateSunday(today)) &&
    streak.catchUpUsedFor !== today
  ) {
    // Catch-up: completing previous day content after a 1-day gap
    streak.catchUpUsedFor = today;
    streak.lastCompletedDate = completedDate;
    // Gap is forgiven, keep streak active
    if (streak.current === 0) streak.current = 1;
  } else if ((effectiveDiff === 2 || daysDiff === 2) && completedDate === today) {
    // Completing today after missing 1 day
    streak.current += 1;
    streak.lastCompletedDate = completedDate;
  } else {
    // Gap > allowed study days — reset to 1
    streak.current = 1;
    streak.lastCompletedDate = completedDate;
    streak.catchUpUsedFor = null;
  }

  if (streak.current > streak.longestStreak) {
    streak.longestStreak = streak.current;
  }

  saveStreak(streak);
  return streak;
}

// ─── Error Notebook ──────────────────────────────────────────────────────────

export interface WrongAnswer {
  date: string;
  questionId: number;
  chosenAnswer: string;
  content: DailyContent;
}

export function getAllWrongAnswers(): WrongAnswer[] {
  const history = getHistory();
  const wrongs: WrongAnswer[] = [];

  for (const [date, record] of Object.entries(history)) {
    if (!record?.completedAt || !record?.content?.questoes || !Array.isArray(record.content.questoes)) continue;
    for (const question of record.content.questoes) {
      const chosen = record.answers?.[question.id];
      if (chosen && chosen !== question.gabarito) {
        wrongs.push({
          date,
          questionId: question.id,
          chosenAnswer: chosen,
          content: record.content,
        });
      }
    }
  }

  // Sort by date descending (most recent first)
  return wrongs.sort((a, b) => {
    const [ddA, mmA, yyyyA] = a.date.split("/").map(Number);
    const [ddB, mmB, yyyyB] = b.date.split("/").map(Number);
    const dateA = new Date(yyyyA, mmA - 1, ddA);
    const dateB = new Date(yyyyB, mmB - 1, ddB);
    return dateB.getTime() - dateA.getTime();
  });
}

export function calculateScore(
  answers: Record<number, string> = {},
  questoes: DailyContent["questoes"] = []
): { correct: number; total: number; percentage: number } {
  if (!Array.isArray(questoes) || questoes.length === 0) {
    return { correct: 0, total: 0, percentage: 0 };
  }
  const total = questoes.length;
  const correct = questoes.filter((q) => answers?.[q.id] === q.gabarito).length;
  return {
    correct,
    total,
    percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
  };
}

export interface PastNotebookItem {
  date: string;
  isSunday: boolean;
  isCompleted: boolean;
  content: DailyContent;
  record: DayRecord | null;
  score: { correct: number; total: number; percentage: number } | null;
}

export function getAllPastNotebooks(): PastNotebookItem[] {
  const history = getHistory();
  const calendarDays = getAllCalendarDays();

  return calendarDays.map(({ date, isSunday, content }) => {
    const record = history[date] ? sanitizeDayRecord(date, history[date]) : null;
    const isCompleted = record !== null && !!record.completedAt;
    const effectiveContent = record?.content ?? content;
    const score = isCompleted && record
      ? calculateScore(record.answers, effectiveContent.questoes)
      : null;

    return {
      date,
      isSunday,
      isCompleted,
      content: effectiveContent,
      record,
      score,
    };
  });
}



