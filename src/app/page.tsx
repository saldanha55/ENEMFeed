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
  RotateCcw,
  Sparkles,
  Coffee,
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
  getAllWrongAnswers,
} from "@/lib/progress";
import {
  getTodayString,
  getYesterdayString,
  getLastStudyDayString,
  getGreeting,
  getDisciplinaConfig,
  getDailyNickname,
  isSunday,
  isDateSunday,
  formatDisplayDate,
} from "@/lib/utils";
import type { StreakData } from "@/types";

const isBirthday = () => {
  const today = new Date();
  return today.getDate() === 20 && today.getMonth() === 7; // Agosto é índice 7
};

export default function HomePage() {
  const isTodaySunday = isSunday();
  const { content, isLoading, error, refetch, loadSampleContent } = useDailyContent();
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [todayCompleted, setTodayCompleted] = useState(false);
  const [yesterdayCompleted, setYesterdayCompleted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showBirthdayPhoto, setShowBirthdayPhoto] = useState(true);
  const [wrongCount, setWrongCount] = useState(0);

  const birthdayToday = mounted && isBirthday();

  useEffect(() => {
    setMounted(true);
    const today = getTodayString();
    const yesterday = getYesterdayString();
    setStreak(getStreak());
    setTodayCompleted(isDayCompleted(today));
    setYesterdayCompleted(isDayCompleted(yesterday));
    setWrongCount(getAllWrongAnswers().length);

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
  const yesterday = getYesterdayString();
  // On Sundays, the "day before" for study purposes is Saturday (or earlier if Saturday is also a rest day)
  const lastStudyDay = isTodaySunday ? getLastStudyDayString() : yesterday;

  if (!mounted || (isLoading && !isTodaySunday)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 size={32} className="animate-spin text-matematica" />
        <p className="text-gray-500 dark:text-gray-400 text-sm">Carregando seu conteúdo...</p>
      </div>
    );
  }

  // If today is weekday and error occurred without content
  if (!isTodaySunday && error && !content) {
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

  const history = getHistory();
  const completedDays = Object.values(history).filter((r) => r.completedAt).length;
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
          ) : isTodaySunday ? (
            <>
              <p className="text-amber-500 dark:text-amber-400 font-semibold text-sm flex items-center gap-1.5">
                <Coffee size={15} /> Domingo de descanso · Relaxe e recarregue!
              </p>
              <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white tracking-tight">
                Bom descanso,{" "}
                <span className="bg-gradient-to-r from-pink-500 via-rose-400 to-fuchsia-500 bg-clip-text text-transparent font-extrabold inline-block">
                  {nickname}
                </span>
                ! 🌴✨
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Hoje não há novo conteúdo obrigatório. Aproveite seu dia de folga!
              </p>
            </>
          ) : (
            <>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{greeting}</p>
              <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white tracking-tight">
                Pronta para{" "}
                <span style={{ color: config?.color ?? "#6C8EFF" }}>10 minutos</span>,{" "}
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

        {/* Main Section: SUNDAY REST DAY */}
        {isTodaySunday && (
          <div className="space-y-4">
            <Card className="space-y-4 bg-gradient-to-br from-amber-50/50 via-white to-surface-50 dark:from-amber-950/20 dark:via-surface-800 dark:to-surface-900 border-amber-200/50 dark:border-amber-500/20">
              <div className="flex items-start justify-between gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-xs font-semibold">
                  <span>🌴 Domingo Livre</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full">
                  <Sparkles size={13} />
                  <span>Ofensiva protegida</span>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white leading-snug">
                  Dia oficial de recarregar as energias ☕
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                  A rotina CLT + estudos exige equilíbrio. Domingo não tem aula obrigatória para você descansar sem culpa!
                </p>
              </div>

              {/* Action: Fazer o do dia anterior (último dia de estudo = Sábado) */}
              <div className="pt-3 border-t border-surface-200/60 dark:border-white/10 space-y-3">
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Caderno do último dia de estudo ({formatDisplayDate(lastStudyDay)})
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {isDayCompleted(lastStudyDay)
                      ? `Você já concluiu o caderno de ${formatDisplayDate(lastStudyDay)}! Quer praticar novamente?`
                      : `Quer adiantar ou colocar em dia? Complete o caderno de ${formatDisplayDate(lastStudyDay)} agora!`}
                  </p>
                </div>

                <Link href={`/study?date=${encodeURIComponent(lastStudyDay)}`}>
                  <Button
                    fullWidth
                    variant={isDayCompleted(lastStudyDay) ? "secondary" : "primary"}
                    size="lg"
                  >
                    {isDayCompleted(lastStudyDay) ? <RotateCcw size={18} /> : <PlayCircle size={18} />}
                    {isDayCompleted(lastStudyDay) ? `Refazer caderno de ${formatDisplayDate(lastStudyDay)}` : `Fazer caderno de ${formatDisplayDate(lastStudyDay)}`}
                  </Button>
                </Link>
              </div>

              {/* Action: Caderno de Erros ou Histórico */}
              {wrongCount > 0 && (
                <div className="pt-2">
                  <Link href="/history">
                    <Button variant="secondary" size="sm" fullWidth>
                      <RotateCcw size={14} />
                      Treinar no Caderno de Erros ({wrongCount} questões)
                    </Button>
                  </Link>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Main Card — Weekday */}
        {!isTodaySunday && content && (
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
                {content.questoes?.length ?? 0} questões · {content.palavras_do_dia?.length ?? 0} palavras
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
        )}

        {/* Catch-up banner for weekdays */}
        {!isTodaySunday && canCatchUp && !isDateSunday(yesterday) && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl p-4 bg-amber-50 dark:bg-amber-900/15 border border-amber-200/60 dark:border-amber-500/20 space-y-2"
          >
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
              ⏰ Modo Recuperação disponível
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-400">
              Você perdeu o caderno de {formatDisplayDate(yesterday)}. Complete agora para preservar sua ofensiva!
            </p>
            <Link href={`/study?date=${encodeURIComponent(yesterday)}`}>
              <Button variant="secondary" size="sm" fullWidth>
                Recuperar caderno de {formatDisplayDate(yesterday)}
              </Button>
            </Link>
          </motion.div>
        )}

        {/* Quick review links on Sunday or general */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/history" className="block">
            <Card className="text-center py-4 px-3 h-full hover:border-matematica/40 transition-colors">
              <div className="text-2xl mb-1">📖</div>
              <div className="text-sm font-display font-bold text-gray-900 dark:text-white">
                Arquivo de Aulas
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {completedDays} cadernos
              </div>
            </Card>
          </Link>
          <Link href="/history" className="block">
            <Card className="text-center py-4 px-3 h-full hover:border-redacao/40 transition-colors">
              <div className="text-2xl mb-1">🎯</div>
              <div className="text-sm font-display font-bold text-gray-900 dark:text-white">
                Caderno de Erros
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {wrongCount} {wrongCount === 1 ? "questão" : "questões"}
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </AnimatedPage>
  );
}

