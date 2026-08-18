"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, ChevronRight } from "lucide-react";
import type { Question } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { AlternativeKey } from "@/types";

interface QuestionStepProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  onAnswer: (questionId: number, answer: string) => void;
  onNext: () => void;
  alreadyAnswered?: string;
  accentColor: string;
}

const ALTERNATIVES: AlternativeKey[] = ["A", "B", "C", "D", "E"];

export function QuestionStep({
  question,
  questionIndex,
  totalQuestions,
  onAnswer,
  onNext,
  alreadyAnswered,
  accentColor,
}: QuestionStepProps) {
  const [selected, setSelected] = useState<AlternativeKey | null>(
    (alreadyAnswered as AlternativeKey) ?? null
  );
  const [showExplanation, setShowExplanation] = useState(!!alreadyAnswered);

  const answered = selected !== null;
  const isCorrect = selected === question.gabarito;

  const handleSelect = (key: AlternativeKey) => {
    if (answered) return;
    setSelected(key);
    onAnswer(question.id, key);
    setTimeout(() => setShowExplanation(true), 400);
  };

  const getAltStyle = (key: AlternativeKey) => {
    if (!answered)
      return "border-surface-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-800 dark:text-gray-200 hover:border-gray-400 dark:hover:border-white/30 cursor-pointer";
    if (key === question.gabarito)
      return "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300";
    if (key === selected && key !== question.gabarito)
      return "border-red-400 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300";
    return "border-surface-200 dark:border-white/10 bg-surface-50 dark:bg-white/5 text-gray-400 dark:text-gray-600 opacity-50";
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest">
            Questão
          </p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {questionIndex + 1} / {totalQuestions}
          </p>
        </div>
        <span className="text-xs bg-surface-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 px-3 py-1.5 rounded-full font-medium">
          ENEM {question.ano_origem}
        </span>
      </div>

      {/* Enunciado */}
      <Card>
        <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-sm whitespace-pre-wrap">
          {question.enunciado}
        </p>
      </Card>

      {/* Alternativas */}
      <div className="space-y-2.5">
        {ALTERNATIVES.map((key) => (
          <motion.button
            key={key}
            whileTap={{ scale: answered ? 1 : 0.98 }}
            onClick={() => handleSelect(key)}
            className={cn(
              "w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 flex items-start gap-3",
              getAltStyle(key)
            )}
          >
            <span className="font-display font-bold text-sm shrink-0 w-5">{key}</span>
            <span className="text-sm leading-relaxed">{question.alternativas[key]}</span>
            {answered && key === question.gabarito && (
              <CheckCircle2 size={18} className="shrink-0 ml-auto text-emerald-500" />
            )}
            {answered && key === selected && key !== question.gabarito && (
              <XCircle size={18} className="shrink-0 ml-auto text-red-500" />
            )}
          </motion.button>
        ))}
      </div>

      {/* Explanation */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl p-4 space-y-2"
            style={{ background: `${accentColor}12`, borderLeft: `3px solid ${accentColor}` }}
          >
            <div className="flex items-center gap-2">
              {isCorrect ? (
                <CheckCircle2 size={16} className="text-emerald-500" />
              ) : (
                <XCircle size={16} className="text-red-500" />
              )}
              <p className="text-xs font-bold uppercase tracking-wider"
                style={{ color: accentColor }}
              >
                {isCorrect ? "Correto! Excelente!" : `Gabarito: Alternativa ${question.gabarito}`}
              </p>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              {question.explicacao_descomplicada}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Next */}
      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button onClick={onNext} fullWidth size="lg">
              {questionIndex + 1 < totalQuestions ? "Próxima Questão" : "Ver Resultado"}
              <ChevronRight size={20} />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}