export interface WordOfDay {
  palavra: string;
  significado: string;
  exemplo: string;
}

export interface Question {
  id: number;
  ano_origem: string;
  enunciado: string;
  alternativas: {
    A: string;
    B: string;
    C: string;
    D: string;
    E: string;
  };
  gabarito: "A" | "B" | "C" | "D" | "E";
  explicacao_descomplicada: string;
}

export type Disciplina =
  | "Matemática"
  | "Redação"
  | "Linguagens"
  | "Ciências Humanas";

export interface DailyContent {
  data: string; // "DD/MM/YYYY"
  semana: string; // "Semana 1"
  disciplina: Disciplina;
  topico_principal: string;
  palavras_do_dia: WordOfDay[];
  contexto_visual: string;
  canivete_repertorio: string;
  questoes: Question[];
}

// localStorage schema
export interface DayRecord {
  content: DailyContent;
  answers: Record<number, string>; // questionId -> chosen answer
  completedAt: string; // ISO string
}

export type HistoryRecord = Record<string, DayRecord>; // key: "DD/MM/YYYY"

export interface StreakData {
  current: number;
  lastCompletedDate: string | null; // "DD/MM/YYYY"
  longestStreak: number;
  catchUpUsedFor: string | null; // date (today) that used catch-up
}

export type StudyStep = "words" | "context" | "questions" | "complete";

export type AlternativeKey = "A" | "B" | "C" | "D" | "E";
