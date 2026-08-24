"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Target,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowLeft,
  TrendingUp,
  Search,
  X,
  PlayCircle,
  Check,
  Sparkles,
  Layers,
} from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DisciplineBadge } from "@/components/ui/DisciplineBadge";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { MiniCalendar } from "@/components/ui/MiniCalendar";
import { QuestionStep } from "@/app/study/components/QuestionStep";
import {
  getAllPastNotebooks,
  getAllWrongAnswers,
  calculateScore,
  getStreak,
  type WrongAnswer,
  type PastNotebookItem,
} from "@/lib/progress";
import {
  getDisciplinaConfig,
  formatDisplayDate,
  getTodayString,
} from "@/lib/utils";
import type { Disciplina } from "@/types";

// ─── Types ───────────────────────────────────────────────────────────────────

type TabId = "arquivo" | "erros";
type StatusFilter = "all" | "completed" | "pending";

interface PracticeState {
  wrongs: WrongAnswer[];
  currentIndex: number;
  localAnswers: Record<string, string>; // key: `${date}_${questionId}`
  completedIds: Set<string>;
}

const DISCIPLINAS: Disciplina[] = [
  "Matemática",
  "Redação",
  "Linguagens",
  "Ciências Humanas",
];

// ─── Notebook Card Component ────────────────────────────────────────────────

function NotebookCard({ item }: { item: PastNotebookItem }) {
  const [expanded, setExpanded] = useState(false);
  const isToday = item.date === getTodayString();
  const config = getDisciplinaConfig(item.content.disciplina);

  // If it is a Sunday rest day
  if (item.isSunday) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="p-4 sm:p-5 bg-gradient-to-br from-amber-50/60 via-surface-50 to-white dark:from-amber-950/20 dark:via-surface-800 dark:to-surface-900 border-amber-200/50 dark:border-amber-500/20 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm">☕</span>
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                Domingo de Descanso · {formatDisplayDate(item.date)}
              </span>
              {isToday && (
                <span className="text-[10px] font-bold bg-amber-200/60 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded-full">
                  Hoje
                </span>
              )}
            </div>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <Sparkles size={12} /> Folga CLT
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            Sem conteúdo obrigatório neste dia. Aproveite para descansar ou revisar cadernos anteriores!
          </p>
        </Card>
      </motion.div>
    );
  }

  // Completed Notebook (GREEN style)
  if (item.isCompleted && item.record) {
    const score = item.score ?? calculateScore(item.record.answers, item.content.questoes);

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="p-0 overflow-hidden border-emerald-300/60 dark:border-emerald-500/30 shadow-sm shadow-emerald-500/5">
          {/* Header row */}
          <button
            className="w-full p-4 sm:p-5 flex items-center gap-3 sm:gap-4 text-left transition-colors hover:bg-surface-50/50 dark:hover:bg-white/2"
            onClick={() => setExpanded((e) => !e)}
          >
            {/* Green indicator bar */}
            <div className="w-2.5 h-12 rounded-full bg-emerald-500 shrink-0 shadow-sm shadow-emerald-500/30" />

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <DisciplineBadge disciplina={item.content.disciplina} />
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                  <Check size={11} strokeWidth={3} /> Concluído
                </span>
                {isToday && (
                  <span className="text-[11px] bg-surface-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 font-semibold px-2 py-0.5 rounded-full">
                    Hoje
                  </span>
                )}
              </div>
              <h3 className="text-sm sm:text-base font-display font-bold text-gray-900 dark:text-white truncate">
                {item.content.topico_principal}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {formatDisplayDate(item.date)} · {item.content.semana}
              </p>
            </div>

            {/* Score */}
            <div className="shrink-0 text-right">
              <p className="text-base sm:text-lg font-display font-extrabold text-emerald-600 dark:text-emerald-400">
                {score.percentage}%
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {score.correct}/{score.total} acertos
              </p>
            </div>

            <div className="shrink-0 text-gray-400 dark:text-gray-500">
              {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
          </button>

          {/* Expanded details */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="px-4 sm:px-5 pb-5 space-y-4 border-t border-surface-200 dark:border-white/5 pt-4 bg-surface-50/30 dark:bg-surface-800/30">
                  {/* Palavras */}
                  {item.content.palavras_do_dia && item.content.palavras_do_dia.length > 0 && (
                    <div>
                      <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                        Palavras do Dia
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {item.content.palavras_do_dia.map((w) => (
                          <span
                            key={w.palavra}
                            className="text-xs px-2.5 py-1 rounded-full font-medium"
                            style={{
                              backgroundColor: config.color + "18",
                              color: config.color,
                            }}
                          >
                            {w.palavra}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Contexto preview */}
                  {item.content.contexto_visual && (
                    <div>
                      <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                        Contexto Visual
                      </p>
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3">
                        {item.content.contexto_visual}
                      </p>
                    </div>
                  )}

                  {/* Canivete de Repertório */}
                  {item.content.canivete_repertorio && (
                    <div
                      className="rounded-2xl p-3 text-xs leading-relaxed"
                      style={{ backgroundColor: config.color + "12" }}
                    >
                      <p
                        className="font-bold uppercase tracking-wider mb-1 text-[10px]"
                        style={{ color: config.color }}
                      >
                        Canivete de Repertório
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        {item.content.canivete_repertorio}
                      </p>
                    </div>
                  )}

                  {/* Per-question answers */}
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Resoluções
                    </p>
                    {item.content.questoes?.map((q) => {
                      const chosen = item.record?.answers?.[q.id];
                      const isCorrect = chosen === q.gabarito;
                      return (
                        <div
                          key={q.id}
                          className="flex items-start gap-2.5 text-xs bg-white dark:bg-surface-800/80 p-2.5 rounded-xl border border-surface-200/60 dark:border-white/5"
                        >
                          {isCorrect ? (
                            <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle size={15} className="text-rose-400 shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-800 dark:text-gray-200 line-clamp-2">
                              {q.enunciado}
                            </p>
                            <div className="flex items-center gap-2 mt-1 font-medium">
                              <span className={isCorrect ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500"}>
                                Sua resposta: {chosen ?? "—"}
                              </span>
                              {!isCorrect && (
                                <span className="text-gray-500 dark:text-gray-400">
                                  · Gabarito: <strong className="text-emerald-600 dark:text-emerald-400">{q.gabarito}</strong>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Redo notebook button */}
                  <div className="pt-2">
                    <Link href={`/study?date=${encodeURIComponent(item.date)}`}>
                      <Button variant="secondary" size="sm" fullWidth>
                        <RotateCcw size={14} />
                        Refazer este caderno ({formatDisplayDate(item.date)})
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    );
  }

  // Pending / Uncompleted Notebook (Harmonious App theme style)
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-4 sm:p-5 space-y-3.5 border-surface-200/90 dark:border-white/10 hover:border-matematica/40 dark:hover:border-matematica/40 transition-colors">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <DisciplineBadge disciplina={item.content.disciplina} />
              <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 bg-surface-100 dark:bg-white/10 px-2.5 py-0.5 rounded-full">
                Pendente · 10 min
              </span>
              {isToday && (
                <span className="text-[11px] font-bold bg-matematica-light dark:bg-matematica-dark/30 text-matematica dark:text-matematica px-2 py-0.5 rounded-full">
                  Hoje ✨
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-display font-bold text-gray-900 dark:text-white pt-0.5">
              {item.content.topico_principal}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatDisplayDate(item.date)} · {item.content.semana}
            </p>
          </div>
        </div>

        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2">
          {item.content.contexto_visual || "Conteúdo rápido de 10 minutos para dominar conceitos e questões no padrão ENEM."}
        </p>

        <div className="flex items-center justify-between gap-3 pt-1 border-t border-surface-200/60 dark:border-white/5">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            {item.content.questoes?.length ?? 0} questões · {item.content.palavras_do_dia?.length ?? 0} palavras
          </span>

          <Link href={`/study?date=${encodeURIComponent(item.date)}`}>
            <Button size="sm" variant={isToday ? "primary" : "secondary"}>
              <PlayCircle size={15} />
              Fazer Caderno
            </Button>
          </Link>
        </div>
      </Card>
    </motion.div>
  );
}

import { syncSpreadsheetDates, getCachedContent, isValidDailyContent } from "@/lib/api";

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState<TabId>("arquivo");
  const [notebooks, setNotebooks] = useState<PastNotebookItem[]>([]);
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
  const [mounted, setMounted] = useState(false);
  const [practiceState, setPracticeState] = useState<PracticeState | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDisciplina, setSelectedDisciplina] = useState<Disciplina | "all">("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(true);

  useEffect(() => {
    setMounted(true);
    setWrongAnswers(getAllWrongAnswers());

    // Helper: enrich notebook list with real planilha content from cache
    // (getAllPastNotebooks uses getCurriculumForDate for pending notebooks, which is the local
    // curriculum and may not match the spreadsheet. We override with the cached planilha content.)
    function enrichWithCachedContent(nbs: PastNotebookItem[]): PastNotebookItem[] {
      return nbs.map((nb) => {
        if (nb.isSunday) return nb;
        const planilhaContent = getCachedContent(nb.date);
        if (planilhaContent && isValidDailyContent(planilhaContent)) {
          return { ...nb, content: planilhaContent };
        }
        return nb;
      });
    }

    const initial = getAllPastNotebooks();
    setNotebooks(enrichWithCachedContent(initial));

    syncSpreadsheetDates().then(() => {
      const updated = getAllPastNotebooks();
      setNotebooks(enrichWithCachedContent(updated));
      setWrongAnswers(getAllWrongAnswers());
    });
  }, []);

  // Filtered notebooks
  const filteredNotebooks = useMemo(() => {
    return notebooks.filter((nb) => {
      // 1. Calendar date filter
      if (selectedCalendarDate && nb.date !== selectedCalendarDate) {
        return false;
      }

      // 2. Disciplina filter
      if (
        selectedDisciplina !== "all" &&
        !nb.isSunday &&
        nb.content.disciplina !== selectedDisciplina
      ) {
        return false;
      }

      // 3. Status filter
      if (statusFilter === "completed" && (!nb.isCompleted || nb.isSunday)) {
        return false;
      }
      if (statusFilter === "pending" && (nb.isCompleted || nb.isSunday)) {
        return false;
      }

      // 4. Search query
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchTitle = nb.content.topico_principal?.toLowerCase().includes(query);
        const matchDisciplina = nb.content.disciplina?.toLowerCase().includes(query);
        const matchDate = nb.date.includes(query) || formatDisplayDate(nb.date).toLowerCase().includes(query);
        const matchWords = nb.content.palavras_do_dia?.some((w) =>
          w.palavra.toLowerCase().includes(query)
        );
        return matchTitle || matchDisciplina || matchDate || matchWords;
      }

      return true;
    });
  }, [notebooks, selectedCalendarDate, selectedDisciplina, statusFilter, searchQuery]);

  // Overall stats
  const completedNotebooks = useMemo(() => notebooks.filter((n) => n.isCompleted), [notebooks]);
  const streak = mounted ? getStreak() : null;

  const totalCorrect = useMemo(() => {
    return completedNotebooks.reduce((acc, n) => acc + (n.score?.correct ?? 0), 0);
  }, [completedNotebooks]);

  const totalQuestions = useMemo(() => {
    return completedNotebooks.reduce((acc, n) => acc + (n.score?.total ?? 0), 0);
  }, [completedNotebooks]);

  const overallPct = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  // ─── Error practice Handlers ──────────────────────────────────────────────

  const startPractice = useCallback(() => {
    if (wrongAnswers.length === 0) return;
    setPracticeState({
      wrongs: wrongAnswers,
      currentIndex: 0,
      localAnswers: {},
      completedIds: new Set(),
    });
  }, [wrongAnswers]);

  const handlePracticeAnswer = useCallback(
    (questionId: number, answer: string) => {
      if (!practiceState) return;
      const current = practiceState.wrongs[practiceState.currentIndex];
      const key = `${current.date}_${questionId}`;
      setPracticeState((prev) =>
        prev
          ? {
              ...prev,
              localAnswers: { ...prev.localAnswers, [key]: answer },
            }
          : null
      );
    },
    [practiceState]
  );

  const handlePracticeNext = useCallback(() => {
    if (!practiceState) return;
    const current = practiceState.wrongs[practiceState.currentIndex];
    const key = `${current.date}_${current.questionId}`;
    const chosen = practiceState.localAnswers[key] ?? current.chosenAnswer;
    const question = current.content.questoes.find(
      (q) => q.id === current.questionId
    )!;
    const isCorrect = chosen === question.gabarito;

    const newCompleted = new Set(practiceState.completedIds);
    if (isCorrect) newCompleted.add(key);

    const nextIndex = practiceState.currentIndex + 1;
    if (nextIndex >= practiceState.wrongs.length) {
      // Done practicing
      setPracticeState(null);
      setWrongAnswers(getAllWrongAnswers());
      setNotebooks(getAllPastNotebooks());
    } else {
      setPracticeState((prev) =>
        prev
          ? {
              ...prev,
              currentIndex: nextIndex,
              completedIds: newCompleted,
            }
          : null
      );
    }
  }, [practiceState]);

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedDisciplina("all");
    setStatusFilter("all");
    setSelectedCalendarDate(null);
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedDisciplina !== "all" ||
    statusFilter !== "all" ||
    selectedCalendarDate !== null;

  // ─── Render: Error Practice Mode ──────────────────────────────────────────

  if (practiceState) {
    const { wrongs, currentIndex, localAnswers } = practiceState;
    const current = wrongs[currentIndex];
    const question = current.content.questoes.find(
      (q) => q.id === current.questionId
    )!;
    const config = getDisciplinaConfig(current.content.disciplina);
    const localKey = `${current.date}_${question.id}`;

    return (
      <AnimatedPage direction="left">
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPracticeState(null)}
              className="w-9 h-9 rounded-xl flex items-center justify-center bg-surface-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 shrink-0"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Caderno de Erros
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {currentIndex + 1} / {wrongs.length} questões
              </p>
            </div>
            <DisciplineBadge disciplina={current.content.disciplina} />
          </div>

          {/* Origin info */}
          <div
            className="rounded-2xl px-4 py-2.5 text-xs flex items-center gap-2"
            style={{ backgroundColor: config.color + "12" }}
          >
            <CalendarIcon size={12} style={{ color: config.color }} />
            <span className="text-gray-600 dark:text-gray-400 truncate">
              {formatDisplayDate(current.date)} — {current.content.topico_principal}
            </span>
          </div>

          <QuestionStep
            key={localKey}
            question={question}
            questionIndex={currentIndex}
            totalQuestions={wrongs.length}
            onAnswer={handlePracticeAnswer}
            onNext={handlePracticeNext}
            alreadyAnswered={localAnswers[localKey]}
            accentColor={config.color}
          />
        </div>
      </AnimatedPage>
    );
  }

  // ─── Render: Normal Archive / Erros View ──────────────────────────────────

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-6 h-6 rounded-full border-2 border-matematica border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <AnimatedPage direction="up">
      <div className="space-y-6">
        {/* Page Title & Overview */}
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white tracking-tight">
            Cadernos & Histórico 📖
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
            Acesse, filtre e pratique cadernos de todas as datas do cronograma.
          </p>
        </div>

        {/* Global Stats Overview */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              icon: TrendingUp,
              label: "Aproveitamento",
              value: `${overallPct}%`,
              color: "#6C8EFF",
            },
            {
              icon: Target,
              label: "Concluídos",
              value: `${completedNotebooks.length}`,
              color: "#34D399",
            },
            {
              icon: BookOpen,
              label: "Ofensiva",
              value: streak ? `${streak.longestStreak}d` : "0d",
              color: "#FFA959",
            },
          ].map(({ icon: Icon, label, value, color }) => (
            <Card key={label} className="p-3.5 sm:p-4 text-center">
              <Icon size={16} className="mx-auto mb-1.5" style={{ color }} />
              <p className="text-base sm:text-lg font-display font-bold" style={{ color }}>
                {value}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                {label}
              </p>
            </Card>
          ))}
        </div>

        {/* Main Tabs */}
        <div className="flex gap-1 p-1 bg-surface-100 dark:bg-white/5 rounded-2xl">
          {[
            { id: "arquivo" as TabId, label: "Cadernos Anteriores" },
            { id: "erros" as TabId, label: `Caderno de Erros (${wrongAnswers.length})` },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 ${
                activeTab === id
                  ? "bg-white dark:bg-surface-800 text-gray-900 dark:text-white shadow-soft"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ─── TAB: ARQUIVO DE AULAS / CADERNOS ANTERIORES ───────────────── */}
        <AnimatePresence mode="wait">
          {activeTab === "arquivo" && (
            <motion.div
              key="arquivo"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              {/* Mini Calendar Toggle / View */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                    <CalendarIcon size={14} className="text-matematica" />
                    Calendário do Cronograma
                  </span>
                  <button
                    onClick={() => setShowCalendar((v) => !v)}
                    className="text-xs text-matematica dark:text-matematica font-semibold hover:underline"
                  >
                    {showCalendar ? "Ocultar calendário" : "Exibir calendário"}
                  </button>
                </div>

                {showCalendar && (
                  <MiniCalendar
                    notebooks={notebooks}
                    selectedDate={selectedCalendarDate}
                    onSelectDate={setSelectedCalendarDate}
                  />
                )}
              </div>

              {/* Filter Controls Bar */}
              <div className="space-y-3 bg-surface-50 dark:bg-surface-800/50 p-4 rounded-3xl border border-surface-200/80 dark:border-white/5">
                {/* Search Input */}
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Buscar por tema, palavra ou data..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-9 py-2.5 rounded-2xl text-xs sm:text-sm bg-white dark:bg-surface-700 border border-surface-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-matematica/40"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Status Filter Tabs */}
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar pt-1">
                  {[
                    { id: "all" as StatusFilter, label: "Todos os Cadernos" },
                    { id: "completed" as StatusFilter, label: "🟢 Concluídos (Feitos)" },
                    { id: "pending" as StatusFilter, label: "⏳ Pendentes (A fazer)" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setStatusFilter(s.id)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full shrink-0 transition-colors ${
                        statusFilter === s.id
                          ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-xs"
                          : "bg-white dark:bg-surface-700 text-gray-600 dark:text-gray-300 border border-surface-200 dark:border-white/10 hover:bg-surface-100"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                {/* Disciplina Chips */}
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar pt-1">
                  <button
                    onClick={() => setSelectedDisciplina("all")}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full shrink-0 transition-colors ${
                      selectedDisciplina === "all"
                        ? "bg-matematica text-white shadow-xs"
                        : "bg-white dark:bg-surface-700 text-gray-600 dark:text-gray-300 border border-surface-200 dark:border-white/10"
                    }`}
                  >
                    Todas Disciplinas
                  </button>

                  {DISCIPLINAS.map((disc) => {
                    const cfg = getDisciplinaConfig(disc);
                    const isSelected = selectedDisciplina === disc;
                    return (
                      <button
                        key={disc}
                        onClick={() => setSelectedDisciplina(disc)}
                        style={
                          isSelected
                            ? { backgroundColor: cfg.color, color: "#FFFFFF" }
                            : {}
                        }
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full shrink-0 transition-colors ${
                          isSelected
                            ? "shadow-xs"
                            : "bg-white dark:bg-surface-700 text-gray-600 dark:text-gray-300 border border-surface-200 dark:border-white/10"
                        }`}
                      >
                        {cfg.emoji} {disc}
                      </button>
                    );
                  })}
                </div>

                {/* Reset Filters Bar */}
                {hasActiveFilters && (
                  <div className="flex items-center justify-between pt-2 border-t border-surface-200 dark:border-white/5 text-xs">
                    <span className="text-gray-500 dark:text-gray-400">
                      {filteredNotebooks.length} resultado{filteredNotebooks.length !== 1 ? "s" : ""} encontrado{filteredNotebooks.length !== 1 ? "s" : ""}
                    </span>
                    <button
                      onClick={resetFilters}
                      className="text-matematica dark:text-matematica font-semibold hover:underline flex items-center gap-1"
                    >
                      <RotateCcw size={12} /> Limpar todos os filtros
                    </button>
                  </div>
                )}
              </div>

              {/* Notebooks List */}
              <div className="space-y-3">
                {filteredNotebooks.length === 0 ? (
                  <Card className="text-center py-12 space-y-3">
                    <Layers size={32} className="mx-auto text-gray-300 dark:text-gray-600" />
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                      Nenhum caderno corresponde aos filtros selecionados.
                    </p>
                    <Button variant="secondary" size="sm" onClick={resetFilters}>
                      Ver todos os cadernos
                    </Button>
                  </Card>
                ) : (
                  filteredNotebooks.map((item) => (
                    <NotebookCard key={item.date} item={item} />
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* ─── TAB: CADERNO DE ERROS ─────────────────────────────────────── */}
          {activeTab === "erros" && (
            <motion.div
              key="erros"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {wrongAnswers.length === 0 ? (
                <Card className="text-center py-12 space-y-3">
                  <CheckCircle2 size={36} className="mx-auto text-emerald-400" />
                  <h3 className="font-display font-bold text-gray-900 dark:text-white text-base">
                    Nenhum erro registrado! 🎉
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm max-w-xs mx-auto">
                    Você acertou todas as questões praticadas até agora. Continue com esse foco incrível!
                  </p>
                </Card>
              ) : (
                <>
                  {/* CTA Banner */}
                  <div className="rounded-3xl p-5 bg-gradient-to-br from-redacao-light/80 via-white to-matematica-light/60 dark:from-redacao-dark/20 dark:via-surface-800 dark:to-matematica-dark/20 border border-redacao/20 space-y-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <RotateCcw size={18} className="text-redacao" />
                      <p className="font-display font-bold text-gray-900 dark:text-white">
                        Treino Inteligente de Erros
                      </p>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      Você tem{" "}
                      <span className="font-bold text-redacao">
                        {wrongAnswers.length} questão{wrongAnswers.length !== 1 ? "ões" : ""}
                      </span>{" "}
                      salva{wrongAnswers.length !== 1 ? "s" : ""} para revisão. Refaça no seu ritmo até fixar os conceitos!
                    </p>
                    <Button onClick={startPractice} fullWidth size="lg">
                      <RotateCcw size={16} />
                      Começar Treino de Erros
                    </Button>
                  </div>

                  {/* List of wrong answers */}
                  <div className="space-y-2.5">
                    {wrongAnswers.map((w) => {
                      const q = w.content.questoes.find((q) => q.id === w.questionId);
                      if (!q) return null;
                      const config = getDisciplinaConfig(w.content.disciplina);

                      return (
                        <Card
                          key={`${w.date}_${w.questionId}`}
                          className="p-4 space-y-2.5 border-rose-200/50 dark:border-rose-500/20"
                        >
                          <div className="flex items-center gap-2">
                            <XCircle size={15} className="text-rose-500 shrink-0" />
                            <DisciplineBadge disciplina={w.content.disciplina} />
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                              {formatDisplayDate(w.date)}
                            </span>
                          </div>

                          <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 line-clamp-2 leading-relaxed">
                            {q.enunciado}
                          </p>

                          <div className="flex items-center gap-3 text-xs pt-1 border-t border-surface-200 dark:border-white/5 font-medium">
                            <span className="text-rose-500">
                              Sua resp.: {w.chosenAnswer}
                            </span>
                            <span className="text-gray-400">→</span>
                            <span style={{ color: config.color }}>
                              Gabarito: <strong>{q.gabarito}</strong>
                            </span>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatedPage>
  );
}
