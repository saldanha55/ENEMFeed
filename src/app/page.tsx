"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  PlayCircle,
  Calendar,
  CheckCircle2,
  Loader2,
  AlertCircle,
  RefreshCw,
  BookOpen,
  X,
  Heart,
} from "lucide-react";
import { useDailyContent } from "@/hooks/useDailyContent";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StreakBadge } from "@/components/ui/StreakBadge";
import { DisciplineBadge } from "@/components/ui/DisciplineBadge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { fireHeartBurst } from "@/lib/confetti";
import {
  getStreak,
  isDayCompleted,
  getHistory,
} from "@/lib/progress";
import { getTodayString, getYesterdayString, getGreeting, getDisciplinaConfig, getDailyNickname } from "@/lib/utils";
import type { StreakData } from "@/types";

const isBirthday = () => {
  const today = new Date();
  return today.getDate() === 20 && today.getMonth() === 7; // Agosto é índice 7
};

export default function HomePage() {
  const { content, isLoading, error, refetch, loadSampleContent } = useDailyContent();
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [todayCompleted, setTodayCompleted] = useState(false);
  const [yesterdayCompleted, setYesterdayCompleted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showBirthdayPhoto, setShowBirthdayPhoto] = useState(true);

  const birthdayToday = mounted && isBirthday();

  useEffect(() => {
    setMounted(true);
    const today = getTodayString();
    const yesterday = getYesterdayString();
    setStreak(getStreak());
    setTodayCompleted(isDayCompleted(today));
    setYesterdayCompleted(isDayCompleted(yesterday));

    if (isBirthday()) {
      const timer = setTimeout(() => {
        fireHeartBurst();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const greeting = mounted ? getGreeting() : "Olá 👋";
  const nickname = mounted ? getDailyNickname() : "Luana";
  const config = content ? getDisciplinaConfig(content.disciplina) : null;

  if (!mounted || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 size={32} className="animate-spin text-matematica" />
        <p className="text-gray-500 dark:text-gray-400 text-sm">Carregando seu conteúdo...</p>
      </div>
    );
  }

  if (error && !content) {
    return (
      <AnimatedPage>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 text-center px-4">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
            <AlertCircle size={28} className="text-amber-500" />
          </div>
          <div>
            <h2 className="font-display font-bold text-gray-900 dark:text-white text-lg mb-1">
              Conteúdo de hoje
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mx-auto">
              {error}
            </p>
          </div>
          <div className="flex flex-col gap-2.5 w-full max-w-xs">
            <Button onClick={loadSampleContent} fullWidth>
              <BookOpen size={16} />
              Praticar com conteúdo demo
            </Button>
            <Button variant="secondary" onClick={refetch} fullWidth>
              <RefreshCw size={16} />
              Tentar novamente
            </Button>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  if (!content) return null;

  const numQuestoes = content.questoes?.length ?? 0;
  const numPalavras = content.palavras_do_dia?.length ?? 0;

  const history = getHistory();
  const completedDays = Object.values(history).filter((r) => r.completedAt).length;
  const yesterday = getYesterdayString();
  const canCatchUp = !yesterdayCompleted && streak && streak.current > 0;

  return (
    <AnimatedPage direction="up">
      <div className="space-y-6">
        {/* Birthday Photo Card Modal/Container */}
        <AnimatePresence>
          {birthdayToday && showBirthdayPhoto && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -8 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-pink-50 via-rose-50/60 to-white dark:from-pink-950/40 dark:via-purple-950/20 dark:to-gray-900/60 p-4 border border-pink-200/70 dark:border-pink-500/30 shadow-lg shadow-pink-500/10 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-pink-600 dark:text-pink-300">
                  <Heart size={14} className="fill-pink-500 text-pink-500 animate-pulse" />
                  <span>20 de Agosto · Feliz Aniversário!</span>
                </div>
                <button
                  onClick={() => setShowBirthdayPhoto(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-pink-100/60 dark:hover:bg-pink-900/30 transition-colors"
                  aria-label="Fechar foto"
                  title="Fechar e ir para os estudos"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex justify-center">
                <img
                  src="/nois.jpg"
                  alt="Nós"
                  onError={(e) => {
                    if (e.currentTarget.src.endsWith(".jpg")) {
                      e.currentTarget.src = "/nois.jpeg";
                    }
                  }}
                  className="w-full max-w-[280px] h-auto rounded-2xl mx-auto object-cover shadow-sm"
                />
              </div>

              <p className="text-center text-xs text-rose-600 dark:text-rose-300 font-medium">
                Com todo o meu amor, para a pessoa mais incrível do mundo! 💖
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Greeting */}
        <div className="space-y-1">
          {birthdayToday ? (
            <>
              <p className="text-pink-500 dark:text-pink-400 font-semibold text-sm flex items-center gap-1.5">
                Feliz aniversário, minha princesa! 💖
              </p>
              <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white tracking-tight">
                Hoje o dia é todo seu,{" "}
                <span className="bg-gradient-to-r from-pink-500 via-rose-400 to-fuchsia-500 bg-clip-text text-transparent font-extrabold inline-block">
                  {nickname}
                </span>
                ! ✨🎂
              </h1>
              <p className="text-xs text-rose-500/90 dark:text-rose-300/90 font-medium">
                Que o seu dia seja tão doce e especial quanto você é para mim. Te amo! 💕
              </p>
            </>
          ) : (
            <>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{greeting}</p>
              <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white tracking-tight">
                Pronta para{" "}
                <span style={{ color: config?.color }}>10 minutos</span>,{" "}
                <span className="bg-gradient-to-r from-pink-500 via-rose-400 to-fuchsia-500 bg-clip-text text-transparent font-extrabold inline-block">
                  {nickname}
                </span>
                ?
              </h1>
            </>
          )}
        </div>

        {/* Streak + Stats row */}
        {streak && (
          <div className="flex items-center gap-3">
            <StreakBadge streak={streak.current} />
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <Calendar size={12} />
              <span>{completedDays} dia{completedDays !== 1 ? "s" : ""} estudados</span>
            </div>
          </div>
        )}

        {/* Main Card — Today */}
        <Card className="space-y-4">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <DisciplineBadge disciplina={content.disciplina} />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{content.semana}</p>
            </div>
            {todayCompleted && (
              <div className="flex items-center gap-1 text-emerald-500 text-xs font-semibold">
                <CheckCircle2 size={14} />
                Concluído
              </div>
            )}
          </div>

          <div>
            <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white leading-snug">
              {content.topico_principal}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {numQuestoes} questões · {numPalavras} palavras
            </p>
          </div>

          {!todayCompleted && (
            <ProgressBar
              current={0}
              total={1}
              color={config?.color}
            />
          )}

          {todayCompleted ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Você já completou o conteúdo de hoje 🎉 Volte amanhã!
              </p>
              <Link href="/history">
                <Button variant="secondary" fullWidth>
                  Ver Histórico e Caderno de Erros
                </Button>
              </Link>
            </div>
          ) : (
            <Link href="/study">
              <Button fullWidth size="lg">
                <PlayCircle size={20} />
                Começar estudo
              </Button>
            </Link>
          )}
        </Card>

        {/* Catch-up banner */}
        {canCatchUp && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl p-4 bg-amber-50 dark:bg-amber-900/15 border border-amber-200/60 dark:border-amber-500/20"
          >
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">
              ⏰ Modo Recuperação disponível
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-400 mb-3">
              Você perdeu ontem ({yesterday}). Complete o conteúdo agora para preservar sua ofensiva!
            </p>
            <Link href={`/study?date=${encodeURIComponent(yesterday)}`}>
              <Button variant="secondary" size="sm" fullWidth>
                Recuperar dia de ontem
              </Button>
            </Link>
          </motion.div>
        )}

        {/* Info cards */}
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              emoji: "📚",
              label: "Palavras do dia",
              value: numPalavras,
              sub: "para vocabulário",
            },
            {
              emoji: "🎯",
              label: "Questões ENEM",
              value: numQuestoes,
              sub: "para praticar",
            },
          ].map(({ emoji, label, value, sub }) => (
            <Card key={label} className="text-center py-4 px-3">
              <div className="text-2xl mb-1">{emoji}</div>
              <div className="text-xl font-display font-bold text-gray-900 dark:text-white">
                {value}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{sub}</div>
            </Card>
          ))}
        </div>
      </div>
    </AnimatedPage>
  );
}

