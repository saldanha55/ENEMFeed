"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, BookOpen } from "lucide-react";
import type { WordOfDay } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface WordsStepProps {
  words: WordOfDay[];
  onComplete: () => void;
  accentColor: string;
}

export function WordsStep({ words, onComplete, accentColor }: WordsStepProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("left");

  const current = words[currentIndex];
  const isLast = currentIndex === words.length - 1;

  const go = (dir: number) => {
    setDirection(dir > 0 ? "left" : "right");
    setCurrentIndex((i) => Math.max(0, Math.min(words.length - 1, i + dir)));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: accentColor + "20" }}
        >
          <BookOpen size={20} style={{ color: accentColor }} />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest">
            Palavras do Dia
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
            {currentIndex + 1} de {words.length}
          </p>
        </div>
      </div>

      {/* Word card */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          initial={{ x: direction === "left" ? 60 : -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction === "left" ? -60 : 60, opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Card className="space-y-5">
            {/* Palavra */}
            <div>
              <div
                className="inline-block text-xs font-semibold uppercase tracking-widest px-2 py-1 rounded-lg mb-3"
                style={{
                  backgroundColor: accentColor + "15",
                  color: accentColor,
                }}
              >
                Palavra
              </div>
              <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white tracking-tight">
                {current.palavra}
              </h2>
            </div>

            {/* Significado */}
            <div className="border-t border-surface-200 dark:border-white/5 pt-4">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Significado
              </p>
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                {current.significado}
              </p>
            </div>

            {/* Exemplo */}
            <div
              className="rounded-2xl p-4"
              style={{ backgroundColor: accentColor + "08" }}
            >
              <p
                className="text-xs font-semibold mb-2 uppercase tracking-wider"
                style={{ color: accentColor }}
              >
                Exemplo
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic text-sm">
                &ldquo;{current.exemplo}&rdquo;
              </p>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          onClick={() => go(-1)}
          disabled={currentIndex === 0}
          className="flex-1"
        >
          <ChevronLeft size={18} />
          Anterior
        </Button>

        {isLast ? (
          <Button onClick={onComplete} className="flex-1">
            Continuar
            <ChevronRight size={18} />
          </Button>
        ) : (
          <Button onClick={() => go(1)} className="flex-1">
            Próxima
            <ChevronRight size={18} />
          </Button>
        )}
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5">
        {words.map((_, i) => (
          <motion.div
            key={i}
            animate={{
              width: i === currentIndex ? 20 : 6,
              opacity: i === currentIndex ? 1 : 0.3,
            }}
            className="h-1.5 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
        ))}
      </div>
    </div>
  );
}