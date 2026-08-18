"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Star, Flame, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { DailyContent } from "@/types";
import { Button } from "@/components/ui/Button";
import { StreakBadge } from "@/components/ui/StreakBadge";
import { calculateScore } from "@/lib/progress";
import confetti from "canvas-confetti";

interface CompleteStepProps {
  content: DailyContent;
  answers: Record<number, string>;
  streak: number;
  accentColor: string;
}

export function CompleteStep({
  content,
  answers,
  streak,
  accentColor,
}: CompleteStepProps) {
  const score = calculateScore(answers, content.questoes);

  useEffect(() => {
    const fire = () => {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
        colors: [accentColor, "#FFD700", "#FF69B4", "#34D399"],
      });
    };
    const t1 = setTimeout(fire, 300);
    const t2 = setTimeout(fire, 800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [accentColor]);

  const scoreEmoji =
    score.percentage >= 80 ? "🌟" : score.percentage >= 60 ? "💪" : "📚";
  const scoreMessage =
    score.percentage >= 80
      ? "Arrasou! Continue assim!"
      : score.percentage >= 60
      ? "Bom resultado! Vai longe!"
      : "Cada dia é uma vitória! Amanhã vai melhor!";

  return (
    <div className="space-y-6 text-center">
      {/* Trophy */}
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
        className="flex justify-center"
      >
        <div
          className="w-24 h-24 rounded-4xl flex items-center justify-center"
          style={{ backgroundColor: accentColor + "20" }}
        >
          <span className="text-5xl">{scoreEmoji}</span>
        </div>
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-2"
      >
        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
          Dia concluído! 🎉
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">{scoreMessage}</p>
      </motion.div>

      {/* Score */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="grid grid-cols-3 gap-3"
      >
        {[
          { label: "Acertos", value: `${score.correct}/${score.total}`, icon: Star },
          { label: "Aproveit.", value: `${score.percentage}%`, icon: Trophy },
          { label: "Ofensiva", value: `${streak}d`, icon: Flame },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-3xl p-4 bg-white dark:bg-surface-800 border border-surface-200/60 dark:border-white/5 shadow-soft"
          >
            <Icon size={18} className="mx-auto mb-2 text-gray-500 dark:text-gray-400" />
            <p className="text-xl font-display font-bold text-gray-900 dark:text-white">
              {value}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </motion.div>

      {/* Streak */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <StreakBadge streak={streak} />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          dias de estudo consecutivos
        </p>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="space-y-3"
      >
        <Link href="/history">
          <Button variant="secondary" fullWidth>
            Ver Caderno de Erros
          </Button>
        </Link>
        <Link href="/">
          <Button variant="ghost" fullWidth>
            <ArrowLeft size={16} />
            Voltar ao início
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}