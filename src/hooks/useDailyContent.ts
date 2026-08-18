"use client";
import { useEffect, useState } from "react";
import type { DailyContent } from "@/types";
import { fetchDailyContent, getCachedContent, setSampleCachedContent } from "@/lib/api";

interface UseDailyContentResult {
  content: DailyContent | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  loadSampleContent: () => void;
}

export function useDailyContent(): UseDailyContentResult {
  const [content, setContent] = useState<DailyContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    // Show cached content immediately while fetching
    const cached = getCachedContent();
    if (cached) {
      setContent(cached);
    }

    fetchDailyContent()
      .then((data) => {
        if (!cancelled) {
          setContent(data);
          setIsLoading(false);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message ?? "Erro ao carregar conteúdo");
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  const refetch = () => setTrigger((t) => t + 1);

  const loadSampleContent = () => {
    const sample = setSampleCachedContent();
    setContent(sample);
    setError(null);
    setIsLoading(false);
  };

  return { content, isLoading, error, refetch, loadSampleContent };
}

