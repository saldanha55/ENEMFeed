"use client";
import { useCallback, useState } from "react";
import type { DailyContent } from "@/types";
import { calculateScore } from "@/lib/progress";

interface UseStudyProgressResult {
  answers: Record<number, string>;
  answerQuestion: (questionId: number, answer: string) => void;
  isAnswered: (questionId: number) => boolean;
  isCorrect: (questionId: number, gabarito: string) => boolean;
  getScore: (
    questoes: DailyContent["questoes"]
  ) => ReturnType<typeof calculateScore>;
  reset: () => void;
}

export function useStudyProgress(): UseStudyProgressResult {
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const answerQuestion = useCallback((questionId: number, answer: string) => {
    setAnswers((prev) => {
      if (prev[questionId]) return prev; // already answered — immutable
      return { ...prev, [questionId]: answer };
    });
  }, []);

  const isAnswered = useCallback(
    (questionId: number) => questionId in answers,
    [answers]
  );

  const isCorrect = useCallback(
    (questionId: number, gabarito: string) =>
      answers[questionId] === gabarito,
    [answers]
  );

  const getScore = useCallback(
    (questoes: DailyContent["questoes"]) => calculateScore(answers, questoes),
    [answers]
  );

  const reset = useCallback(() => setAnswers({}), []);

  return { answers, answerQuestion, isAnswered, isCorrect, getScore, reset };
}
