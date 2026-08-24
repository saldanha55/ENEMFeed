"use client";
import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { formatDate, parseDateString, getTodayString } from "@/lib/utils";
import { isDateAvailableForStudy, CRONOGRAMA_START_DATE } from "@/lib/curriculum";
import type { PastNotebookItem } from "@/lib/progress";

interface MiniCalendarProps {
  notebooks: PastNotebookItem[];
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
}

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const DAY_NAMES = ["D", "S", "T", "Q", "Q", "S", "S"];

export function MiniCalendar({
  notebooks,
  selectedDate,
  onSelectDate,
}: MiniCalendarProps) {
  const todayStr = getTodayString();
  const todayDate = useMemo(() => parseDateString(todayStr), [todayStr]);

  const [currentYear, setCurrentYear] = useState(todayDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(todayDate.getMonth());

  // Map of date string -> notebook item for O(1) lookup
  const notebookMap = useMemo(() => {
    const map = new Map<string, PastNotebookItem>();
    for (const nb of notebooks) {
      map.set(nb.date, nb);
    }
    return map;
  }, [notebooks]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleResetToCurrentMonth = () => {
    setCurrentMonth(todayDate.getMonth());
    setCurrentYear(todayDate.getFullYear());
  };

  // Build grid days
  const cronogramaStart = useMemo(() => parseDateString(CRONOGRAMA_START_DATE), []);

  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sun) to 6 (Sat)
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const days: Array<{
      dayNum: number | null;
      dateStr: string | null;
      isSunday: boolean;
      isRestDay: boolean; // Sunday within cronograma period
      isToday: boolean;
      hasContent: boolean;
      notebook?: PastNotebookItem;
    }> = [];

    // Empty padding slots before 1st of month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({
        dayNum: null,
        dateStr: null,
        isSunday: false,
        isRestDay: false,
        isToday: false,
        hasContent: false,
      });
    }

    // Days in current month
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(currentYear, currentMonth, day);
      const dStr = formatDate(d);
      const isSun = d.getDay() === 0;
      const isToday = dStr === todayStr;
      // Sunday is a rest day if it's within (or at) the cronograma start
      const isRestDay = isSun && d >= cronogramaStart;
      // hasContent only matters for non-Sunday weekdays
      const hasContent = !isSun && isDateAvailableForStudy(dStr);
      const notebook = notebookMap.get(dStr);

      days.push({
        dayNum: day,
        dateStr: dStr,
        isSunday: isSun,
        isRestDay,
        isToday,
        hasContent,
        notebook,
      });
    }

    return days;
  }, [currentYear, currentMonth, todayStr, notebookMap, cronogramaStart]);


  // Statistics for this month
  const monthStats = useMemo(() => {
    let completed = 0;
    let pending = 0;
    for (const d of calendarDays) {
      if (d.hasContent && !d.isSunday) {
        if (d.notebook?.isCompleted) {
          completed++;
        } else {
          pending++;
        }
      }
    }
    return { completed, pending, total: completed + pending };
  }, [calendarDays]);

  return (
    <div className="rounded-3xl bg-surface-50 dark:bg-surface-800/80 border border-surface-200/80 dark:border-white/10 p-4 sm:p-5 space-y-4 shadow-sm">
      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-display font-bold text-gray-900 dark:text-white text-base sm:text-lg">
            {MONTH_NAMES[currentMonth]} {currentYear}
          </h2>
          {(currentMonth !== todayDate.getMonth() || currentYear !== todayDate.getFullYear()) && (
            <button
              onClick={handleResetToCurrentMonth}
              className="text-[11px] font-semibold text-matematica dark:text-matematica px-2 py-0.5 rounded-full bg-matematica-light dark:bg-matematica-dark/30 hover:opacity-80 transition-opacity"
            >
              Hoje
            </button>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handlePrevMonth}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-surface-200 dark:hover:bg-white/10 transition-colors"
            title="Mês anterior"
            aria-label="Mês anterior"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={handleNextMonth}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-surface-200 dark:hover:bg-white/10 transition-colors"
            title="Próximo mês"
            aria-label="Próximo mês"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5 text-center">
        {DAY_NAMES.map((name, i) => (
          <div
            key={i}
            className={`text-[11px] font-bold py-1 ${
              i === 0
                ? "text-amber-500 dark:text-amber-400"
                : "text-gray-400 dark:text-gray-500"
            }`}
          >
            {name}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
        {calendarDays.map((cell, index) => {
          if (!cell.dayNum || !cell.dateStr) {
            return <div key={`empty-${index}`} className="h-9 sm:h-10" />;
          }

          const isSelected = selectedDate === cell.dateStr;
          const isDone = cell.notebook?.isCompleted;
          const isPending = cell.hasContent && !isDone;

          // Determine button style
          let buttonClasses = "relative flex flex-col items-center justify-center h-9 sm:h-10 rounded-2xl text-xs font-semibold transition-all duration-150 ";

          if (cell.isRestDay) {
            // Sunday rest day within cronograma — always amber/coffee style
            if (isSelected) {
              buttonClasses += "ring-2 ring-offset-2 ring-amber-400 dark:ring-offset-surface-900 scale-105 z-10 ";
            }
            buttonClasses += "bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300/80 border border-amber-200/50 dark:border-amber-500/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 cursor-default";
            if (cell.isToday) {
              buttonClasses += " font-extrabold ring-2 ring-amber-400 dark:ring-amber-400";
            }
          } else if (!cell.hasContent) {
            // Weekday without content: muted/disabled
            buttonClasses += "bg-transparent dark:bg-transparent text-gray-300/40 dark:text-gray-700/50 cursor-not-allowed border border-transparent select-none";
          } else {
            // Study day with content
            if (isSelected) {
              buttonClasses += "ring-2 ring-offset-2 ring-primary-500 dark:ring-offset-surface-900 scale-105 z-10 ";
            }
            if (isDone) {
              // GREEN for completed
              buttonClasses += "bg-emerald-500 text-white shadow-sm shadow-emerald-500/25 hover:bg-emerald-600 active:scale-95 cursor-pointer";
            } else if (isPending) {
              // Soft pending color
              buttonClasses += "bg-white dark:bg-surface-700 text-gray-800 dark:text-gray-200 border border-surface-200 dark:border-white/10 hover:border-matematica/50 dark:hover:border-matematica/50 hover:bg-surface-100 dark:hover:bg-surface-600 shadow-2xs active:scale-95 cursor-pointer";
            }
            if (cell.isToday) {
              buttonClasses += " font-extrabold ring-2 ring-matematica dark:ring-matematica";
            }
          }

          return (
            <button
              key={cell.dateStr}
              disabled={!cell.hasContent && !cell.isRestDay}
              onClick={() => {
                // Only allow filtering/selection for non-Sunday study days
                if (cell.dateStr && cell.hasContent && !cell.isRestDay) {
                  onSelectDate(isSelected ? null : cell.dateStr);
                }
              }}
              title={
                cell.isRestDay
                  ? `${cell.dateStr}: Domingo de descanso ☕`
                  : !cell.hasContent
                  ? `${cell.dateStr}: Sem conteúdo disponível`
                  : isDone
                  ? `${cell.dateStr}: Concluído (${cell.notebook?.content.topico_principal})`
                  : `${cell.dateStr}: Pendente`
              }
              className={buttonClasses}
            >
              <span>{cell.dayNum}</span>

              {/* Status indicators */}
              {cell.hasContent && isDone && (
                <div className="absolute -bottom-0.5">
                  <Check size={9} strokeWidth={3} className="text-white" />
                </div>
              )}
              {cell.isRestDay && (
                <div className="absolute -bottom-0.5 text-[8px]">
                  ☕
                </div>
              )}
              {cell.isToday && (
                <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full animate-pulse ${cell.isRestDay ? "bg-amber-400" : "bg-matematica"}`} />
              )}
            </button>
          );

        })}
      </div>

      {/* Legend & Month Progress Bar */}
      <div className="pt-2 border-t border-surface-200 dark:border-white/5 flex flex-wrap items-center justify-between gap-3 text-[11px] text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Feito ({monthStats.completed})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-surface-200 dark:bg-surface-700 border border-gray-400 dark:border-gray-500" />
            <span>Pendente ({monthStats.pending})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px]">☕</span>
            <span>Folga</span>
          </div>
        </div>

        {selectedDate && (
          <button
            onClick={() => onSelectDate(null)}
            className="text-xs text-matematica dark:text-matematica font-semibold hover:underline"
          >
            Limpar filtro ({selectedDate})
          </button>
        )}
      </div>
    </div>
  );
}
