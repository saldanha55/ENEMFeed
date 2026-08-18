import { cn, getDisciplinaConfig } from "@/lib/utils";
import type { Disciplina } from "@/types";

interface DisciplineBadgeProps {
  disciplina: Disciplina;
  className?: string;
}

export function DisciplineBadge({
  disciplina,
  className,
}: DisciplineBadgeProps) {
  const config = getDisciplinaConfig(disciplina);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-display font-semibold px-3 py-1.5 rounded-full",
        config.badge,
        className
      )}
    >
      <span>{config.emoji}</span>
      {disciplina}
    </span>
  );
}
