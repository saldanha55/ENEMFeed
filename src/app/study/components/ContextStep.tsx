"use client";
import { Lightbulb, Swords, ChevronRight } from "lucide-react";
import type { DailyContent } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AnimatedPage } from "@/components/ui/AnimatedPage";

interface ContextStepProps {
  content: DailyContent;
  onComplete: () => void;
  accentColor: string;
}

export function ContextStep({
  content,
  onComplete,
  accentColor,
}: ContextStepProps) {
  return (
    <AnimatedPage>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: accentColor + "20" }}
          >
            <Lightbulb size={20} style={{ color: accentColor }} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest">
              Contexto Visual
            </p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {content.topico_principal}
            </p>
          </div>
        </div>

        {/* Main context */}
        <Card>
          <div className="text-gray-800 dark:text-gray-200 leading-relaxed text-sm space-y-3 whitespace-pre-wrap">
            {content.contexto_visual}
          </div>
        </Card>

        {/* Canivete do Repertório */}
        <div
          className="rounded-3xl p-5 space-y-3"
          style={{
            background: `linear-gradient(135deg, ${accentColor}15, ${accentColor}08)`,
            borderLeft: `3px solid ${accentColor}`,
          }}
        >
          <div className="flex items-center gap-2">
            <Swords size={16} style={{ color: accentColor }} />
            <p
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: accentColor }}
            >
              Canivete de Repertório
            </p>
          </div>
          <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
            {content.canivete_repertorio}
          </p>
        </div>

        <Button onClick={onComplete} fullWidth size="lg">
          Partir para as Questões
          <ChevronRight size={20} />
        </Button>
      </div>
    </AnimatedPage>
  );
}