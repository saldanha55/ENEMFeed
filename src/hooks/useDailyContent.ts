"use client";
import { useEffect, useState } from "react";
import type { DailyContent } from "@/types";
import { fetchDailyContent, getCachedContent, setSampleCachedContent } from "@/lib/api";
import { getTodayString, isDateSunday } from "@/lib/utils";

interface UseDailyContentResult {
  content: DailyContent | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  loadSampleContent: () => void;
  isSunday: boolean;
}

export function useDailyContent(targetDate?: string): UseDailyContentResult {
  const [content, setContent] = useState<DailyContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);

  const date = targetDate ?? getTodayString();
  const isTargetSunday = isDateSunday(date);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    // If today is Sunday and no explicit targetDate is provided, Sunday is rest day
    if (isTargetSunday && !targetDate) {
      setContent(null);
      setIsLoading(false);
      return;
    }

    // Check cached content first
    const cached = getCachedContent(date);
    if (cached) {
      setContent(cached);
      setIsLoading(false);
    }

    fetchDailyContent(date)
      .then((data) => {
        if (!cancelled) {
          setContent(data);
          setIsLoading(false);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          if (isTargetSunday) {
            setContent(null);
            setIsLoading(false);
          } else {
            setError(err.message ?? "Erro ao carregar conteúdo");
            setIsLoading(false);
          }
        }
      });

    return () => {
      cancelled = true;
    };
  }, [date, isTargetSunday, trigger, targetDate]);

  const refetch = () => setTrigger((t) => t + 1);

  const loadSampleContent = () => {
    const sample = setSampleCachedContent(date);
    setContent(sample);
    setError(null);
    setIsLoading(false);
  };

  return { content, isLoading, error, refetch, loadSampleContent, isSunday: isTargetSunday };
}

