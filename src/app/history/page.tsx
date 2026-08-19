"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Target,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowLeft,
  TrendingUp,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DisciplineBadge } from "@/components/ui/DisciplineBadge";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { QuestionStep } from "@/app/study/components/QuestionStep";
import {
  getHistory,
  getAllWrongAnswers,
  calculateScore,
  getStreak,
  type WrongAnswer,
} from "@/lib/progress";
import {
  getDisciplinaConfig,
  formatDisplayDate,
  getTodayString,
} from "@/lib/utils";
import type { HistoryRecord, DayRecord } from "@/types";

// ─── Types ───────────────────────────────────────────────────────────────────

type TabId = "arquivo" | "erros";

interface PracticeState {
  wrongs: WrongAnswer[];
  currentIndex: number;
  localAnswers: Record<string, string>; // key: `${date}_${questionId}`
  completedIds: Set<string>;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getDayScore(record: DayRecord) {
  return calculateScore(record.answers, record.content.questoes);
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function DayCard({ dateKey, record }: { dateKey: string; record: DayRecord }) {
  const [expanded, setExpanded] = useState(false);
  const score = getDayScore(record);
  const config = getDisciplinaConfig(record.content.disciplina);
  const isToday = dateKey === getTodayString();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="space-y-0 p-0 overflow-hidden">
        {/* Header row */}
        <button
          className="w-full p-5 flex items-center gap-4 text-left"
          onClick={() => setExpanded((e) => !e)}
        >
          {/* Color dot */}
          <div
            className="w-2 h-10 rounded-full shrink-0"
            style={{ backgroundColor: config.color }}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <DisciplineBadge disciplina={record.content.disciplina} />
              {isToday && (
                <span className="text-xs bg-surface-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">
                  Hoje
                </span>
              )}
            </div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {record.content.topico_principal}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {formatDisplayDate(dateKey)}
            </p>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-lg font-display font-bold" style={{ color: config.color }}>
              {score.percentage}%
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {score.correct}/{score.total}
            </p>
          </div>

          <div className="shrink-0 text-gray-400 dark:text-gray-600">
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </button>

        {/* Expanded: palavras and context */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 space-y-4 border-t border-surface-200 dark:border-white/5 pt-4">
                {/* Palavras */}
                {record.content?.palavras_do_dia && record.content.palavras_do_dia.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      Palavras do Dia
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {record.content.palavras_do_dia.map((w) => (
                        <span
                          key={w.palavra}
                          className="text-xs px-2.5 py-1 rounded-full font-medium"
                          style={{
                            backgroundColor: config.color + "15",
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
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Contexto Visual
                  </p>
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-4">
                    {record.content?.contexto_visual}
                  </p>
                </div>

                {/* Canivete */}
                <div
                  className="rounded-2xl p-3 text-xs leading-relaxed"
                  style={{ backgroundColor: config.color + "10" }}
                >
                  <p
                    className="font-bold uppercase tracking-wider mb-1 text-[10px]"
                    style={{ color: config.color }}
                  >
                    Canivete de Repertório
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 line-clamp-3">
                    {record.content?.canivete_repertorio}
                  </p>
                </div>

                {/* Per-question results */}
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Questões
                  </p>
                  {record.content?.questoes?.map((q) => {
                    const chosen = record.answers[q.id];
                    const correct = chosen === q.gabarito;
                    return (
                      <div
                        key={q.id}
                        className="flex items-center gap-2 text-xs"
                      >
                        {correct ? (
                          <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                        ) : (
                          <XCircle size={14} className="text-red-400 shrink-0" />
                        )}
                        <span className="text-gray-600 dark:text-gray-400 line-clamp-1 flex-1">
                          {q.enunciado.slice(0, 80)}...
                        </span>
                        {!correct && chosen && (
                          <span className="text-red-400 font-semibold shrink-0">
                            {chosen} → {q.gabarito}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState<TabId>("arquivo");
  const [history, setHistory] = useState<HistoryRecord>({});
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
  const [mounted, setMounted] = useState(false);
  const [practiceState, setPracticeState] = useState<PracticeState | null>(
    null
  );

  useEffect(() => {
    setMounted(true);
    setHistory(getHistory());
    setWrongAnswers(getAllWrongAnswers());
  }, []);

  const sortedDays = Object.entries(history)
    .filter(([, r]) => r.completedAt)
    .sort(([a], [b]) => {
      // Sort descending by date
      const parse = (s: string) => {
        const [dd, mm, yyyy] = s.split("/").map(Number);
        return new Date(yyyy, mm - 1, dd).getTime();
      };
      return parse(b) - parse(a);
    });

  const streak = mounted ? getStreak() : null;
  const totalCorrect = sortedDays.reduce((acc, [, r]) => {
    const s = getDayScore(r);
    return acc + s.correct;
  }, 0);
  const totalQuestions = sortedDays.reduce((acc, [, r]) => {
    const s = getDayScore(r);
    return acc + s.total;
  }, 0);
  const overallPct =
    totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  // ─── Error practice ──────────────────────────────────────────────────────

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
    const chosen =
      practiceState.localAnswers[key] ?? current.chosenAnswer;
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
      // Refresh wrong answers
      setWrongAnswers(getAllWrongAnswers());
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

  // ─── Render: Practice mode ───────────────────────────────────────────────

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
            <Calendar size={12} style={{ color: config.color }} />
            <span className="text-gray-600 dark:text-gray-400">
              {formatDisplayDate(current.date)} —{" "}
              {current.content.topico_principal}
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

  // ─── Render: Normal tabs ──────────────────────────────────────────────────

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-6 h-6 rounded-full border-2 border-matematica border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <AnimatedPage direction="up">
      <div className="space-y-5">
        {/* Page title */}
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white tracking-tight">
            Histórico 📖
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
            {sortedDays.length} dia{sortedDays.length !== 1 ? "s" : ""}{" "}
            estudados
          </p>
        </div>

        {/* Stats bar */}
        {sortedDays.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                icon: TrendingUp,
                label: "Aproveit.",
                value: `${overallPct}%`,
                color: "#6C8EFF",
              },
              {
                icon: Target,
                label: "Acertos",
                value: `${totalCorrect}/${totalQuestions}`,
                color: "#34D399",
              },
              {
                icon: BookOpen,
                label: "Ofensiva",
                value: streak ? `${streak.longestStreak}d` : "—",
                color: "#FFA959",
              },
            ].map(({ icon: Icon, label, value, color }) => (
              <Card key={label} className="p-4 text-center">
                <Icon size={16} className="mx-auto mb-1.5" style={{ color }} />
                <p
                  className="text-lg font-display font-bold"
                  style={{ color }}
                >
                  {value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {label}
                </p>
              </Card>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-surface-100 dark:bg-white/5 rounded-2xl">
          {(
            [
              { id: "arquivo" as TabId, label: "Arquivo de Aulas" },
              { id: "erros" as TabId, label: "Caderno de Erros" },
            ] as const
          ).map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                activeTab === id
                  ? "bg-white dark:bg-surface-800 text-gray-900 dark:text-white shadow-soft"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab: Arquivo de Aulas */}
        <AnimatePresence mode="wait">
          {activeTab === "arquivo" && (
            <motion.div
              key="arquivo"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              {sortedDays.length === 0 ? (
                <Card className="text-center py-12 space-y-3">
                  <BookOpen
                    size={32}
                    className="mx-auto text-gray-300 dark:text-gray-700"
                  />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Nenhum dia concluído ainda.
                    <br />
                    Complete seu primeiro estudo!
                  </p>
                </Card>
              ) : (
                sortedDays.map(([dateKey, record]) => (
                  <DayCard key={dateKey} dateKey={dateKey} record={record} />
                ))
              )}
            </motion.div>
          )}

          {/* Tab: Caderno de Erros */}
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
                  <CheckCircle2
                    size={32}
                    className="mx-auto text-emerald-400"
                  />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Sem erros registrados ainda.
                    <br />
                    Continue assim! 🏆
                  </p>
                </Card>
              ) : (
                <>
                  {/* CTA */}
                  <div className="rounded-3xl p-5 bg-gradient-to-br from-redacao-light to-matematica-light dark:from-redacao-dark/15 dark:to-matematica-dark/15 space-y-3">
                    <div className="flex items-center gap-2">
                      <RotateCcw size={18} className="text-redacao" />
                      <p className="font-display font-bold text-gray-900 dark:text-white">
                        Treinar Erros
                      </p>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Você tem{" "}
                      <span className="font-bold text-redacao">
                        {wrongAnswers.length} questão
                        {wrongAnswers.length !== 1 ? "ões" : ""}
                      </span>{" "}
                      errada{wrongAnswers.length !== 1 ? "s" : ""} para praticar.
                      Refaça até acertar!
                    </p>
                    <Button onClick={startPractice} fullWidth>
                      <RotateCcw size={16} />
                      Começar Treino
                    </Button>
                  </div>

                  {/* List of wrong answers */}
                  <div className="space-y-2.5">
                    {wrongAnswers.map((w) => {
                      const q = w.content.questoes.find(
                        (q) => q.id === w.questionId
                      )!;
                      const config = getDisciplinaConfig(w.content.disciplina);
                      return (
                        <Card
                          key={`${w.date}_${w.questionId}`}
                          className="p-4 space-y-2"
                        >
                          <div className="flex items-center gap-2">
                            <XCircle size={14} className="text-red-400 shrink-0" />
                            <DisciplineBadge disciplina={w.content.disciplina} />
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                              {formatDisplayDate(w.date)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-2 leading-relaxed">
                            {q.enunciado.slice(0, 120)}...
                          </p>
                          <div className="flex items-center gap-3 text-xs">
                            <span className="text-red-500 font-semibold">
                              Sua resp.: {w.chosenAnswer}
                            </span>
                            <span className="text-gray-400">→</span>
                            <span
                              className="font-semibold"
                              style={{ color: config.color }}
                            >
                              Gabarito: {q.gabarito}
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
