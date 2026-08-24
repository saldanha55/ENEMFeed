"use client";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useStudyProgress } from "@/hooks/useStudyProgress";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { WordsStep } from "./components/WordsStep";
import { ContextStep } from "./components/ContextStep";
import { QuestionStep } from "./components/QuestionStep";
import { CompleteStep } from "./components/CompleteStep";
import {
  getDisciplinaConfig,
  getTodayString,
  getYesterdayString,
  formatDisplayDate,
  isSunday,
} from "@/lib/utils";
import {
  markDayCompleted,
  updateStreak,
  getStreak,
  getDayRecord,
} from "@/lib/progress";
import {
  fetchDailyContent,
  getCachedContent,
  isValidDailyContent,
} from "@/lib/api";
import { getFallbackDailyContent } from "@/lib/fallback";
import type { StudyStep, DailyContent } from "@/types";
import {
  isDateAvailableForStudy,
} from "@/lib/curriculum";
import { Lock, BookOpen } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const STEP_LABELS: Record<StudyStep, string> = {
  words: "Vocabulário",
  context: "Contexto",
  questions: "Questões",
  complete: "Concluído",
};

function StudyPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedDate = searchParams.get("date");
  
  // If today is Sunday and no explicit date is requested, default to yesterday
  const isTodaySunday = isSunday();
  const todayStr = getTodayString();
  const yesterdayStr = getYesterdayString();
  const targetDate = requestedDate ?? (isTodaySunday ? yesterdayStr : todayStr);
  const isCatchUp = targetDate !== todayStr;

  const [content, setContent] = useState<DailyContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUnavailable, setIsUnavailable] = useState(false);
  const [step, setStep] = useState<StudyStep>("words");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [streak, setStreak] = useState(getStreak().current);
  const { answers, answerQuestion } = useStudyProgress();

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setIsUnavailable(false);

    // Check if requested date is within allowed study range
    if (!isDateAvailableForStudy(targetDate)) {
      setIsUnavailable(true);
      setIsLoading(false);
      return;
    }

    // 1. Check if we already have this day stored in history (previous notebook)
    const historyRec = getDayRecord(targetDate);
    if (historyRec?.content && isValidDailyContent(historyRec.content)) {
      if (!cancelled) {
        setContent(historyRec.content);
        setIsLoading(false);
      }
      return;
    }

    // 2. Check cached content for target date
    const cached = getCachedContent(targetDate);
    if (cached && isValidDailyContent(cached)) {
      if (!cancelled) {
        setContent(cached);
        setIsLoading(false);
      }
      return;
    }

    // 3. Fetch from API or fallback
    fetchDailyContent(targetDate)
      .then((data) => {
        if (!cancelled && data && isValidDailyContent(data)) {
          setContent(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          const fallback = getFallbackDailyContent(targetDate);
          setContent(fallback);
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [targetDate]);

  if (isUnavailable) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <Card className="max-w-sm w-full p-6 space-y-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-surface-100 dark:bg-white/10 flex items-center justify-center mx-auto text-gray-500 dark:text-gray-400">
            <Lock size={26} />
          </div>
          <div>
            <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white">
              Caderno não disponível
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
              O conteúdo para o dia <strong>{formatDisplayDate(targetDate)}</strong> ainda não foi liberado. O cronograma libera o conteúdo até o dia atual e no máximo o próximo dia de estudos.
            </p>
          </div>
          <div className="space-y-2 pt-2">
            <Link href="/" className="block">
              <Button fullWidth size="md">
                <BookOpen size={16} />
                Ir para o caderno de hoje
              </Button>
            </Link>
            <Link href="/history" className="block">
              <Button variant="secondary" fullWidth size="md">
                Ver cadernos anteriores
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const config = content ? getDisciplinaConfig(content.disciplina) : null;

  // Progress: words=1/4, context=2/4, questions depends on question index, complete=4/4
  const getProgress = () => {
    if (step === "words") return 1;
    if (step === "context") return 2;
    if (step === "questions" && content?.questoes?.length)
      return 2 + ((questionIndex + 1) / content.questoes.length) * 1;
    return 4;
  };
  const totalProgress = 4;

  const handleWordsComplete = useCallback(() => setStep("context"), []);
  const handleContextComplete = useCallback(() => setStep("questions"), []);
  const handleAnswer = useCallback(
    (questionId: number, answer: string) => answerQuestion(questionId, answer),
    [answerQuestion]
  );

  const handleNextQuestion = useCallback(() => {
    if (!content || !content.questoes) return;
    if (questionIndex + 1 < content.questoes.length) {
      setQuestionIndex((i) => i + 1);
    } else {
      // All questions done — save and go to complete
      markDayCompleted(targetDate, content, answers);
      const newStreak = updateStreak(targetDate);
      setStreak(newStreak.current);
      setStep("complete");
    }
  }, [content, questionIndex, answers, targetDate]);

  if (isLoading || !content || !config || !Array.isArray(content.questoes) || content.questoes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 size={32} className="animate-spin text-matematica" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Carregando caderno de {formatDisplayDate(targetDate)}...</p>
      </div>
    );
  }

  const badgeLabel =
    targetDate === yesterdayStr
      ? "Caderno de Ontem"
      : isCatchUp
      ? `Caderno de ${formatDisplayDate(targetDate)}`
      : null;

  return (
    <div className="space-y-6">
      {/* Back + Progress */}
      <div className="flex items-center gap-3">
        {step !== "complete" && (
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-surface-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 shrink-0 hover:bg-surface-200 dark:hover:bg-white/20 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
        )}
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {STEP_LABELS[step]}
            </span>
            {badgeLabel && (
              <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full font-medium">
                {badgeLabel}
              </span>
            )}
          </div>
          <ProgressBar
            current={getProgress()}
            total={totalProgress}
            color={config.color}
          />
        </div>
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${step}-${questionIndex}`}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {step === "words" && (
            <WordsStep
              words={content.palavras_do_dia}
              onComplete={handleWordsComplete}
              accentColor={config.color}
            />
          )}
          {step === "context" && (
            <ContextStep
              content={content}
              onComplete={handleContextComplete}
              accentColor={config.color}
            />
          )}
          {step === "questions" && (
            <QuestionStep
              question={content.questoes[questionIndex]}
              questionIndex={questionIndex}
              totalQuestions={content.questoes.length}
              onAnswer={handleAnswer}
              onNext={handleNextQuestion}
              alreadyAnswered={answers[content.questoes[questionIndex].id]}
              accentColor={config.color}
            />
          )}
          {step === "complete" && (
            <CompleteStep
              content={content}
              answers={answers}
              streak={streak}
              accentColor={config.color}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function StudyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 size={32} className="animate-spin text-matematica" />
        </div>
      }
    >
      <StudyPageInner />
    </Suspense>
  );
}
