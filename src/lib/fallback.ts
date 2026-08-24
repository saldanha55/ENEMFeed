import type { DailyContent } from "@/types";
import { getTodayString } from "@/lib/utils";
import { getCurriculumForDate } from "@/lib/curriculum";

export function getFallbackDailyContent(customDate?: string): DailyContent {
  const date = customDate ?? getTodayString();
  return getCurriculumForDate(date);
}
