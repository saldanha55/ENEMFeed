"use client";

import React, { useState, useMemo } from "react";
import { ZoomIn, X, Image as ImageIcon, AlertCircle } from "lucide-react";
import type { VisualContent } from "@/types";
import { cn } from "@/lib/utils";

interface VisualRendererProps {
  visual?: VisualContent | null;
  accentColor?: string;
  className?: string;
  compact?: boolean;
}

/**
 * Sanitiza e normaliza código SVG para exibição segura e responsiva.
 */
function sanitizeSvg(rawSvg: string): string {
  let cleaned = rawSvg.trim();

  // Remove eventuais tags de script ou handlers js inline
  cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  cleaned = cleaned.replace(/on\w+="[^"]*"/gi, "");
  cleaned = cleaned.replace(/on\w+='[^']*'/gi, "");

  // Se não tiver viewBox, tenta adicionar para ser responsivo
  if (!cleaned.includes("viewBox=") && cleaned.includes("<svg")) {
    cleaned = cleaned.replace(
      "<svg",
      '<svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid meet"'
    );
  }

  return cleaned;
}

export function VisualRenderer({
  visual,
  accentColor = "#3b82f6",
  className,
  compact = false,
}: VisualRendererProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isSvg = visual?.tipo === "svg";
  const isImage = visual?.tipo === "imagem";

  // Prepara o SVG limpo sempre na mesma ordem de hooks
  const sanitizedSvg = useMemo(() => {
    if (!isSvg || !visual?.conteudo) return "";
    return sanitizeSvg(visual.conteudo);
  }, [isSvg, visual?.conteudo]);

  // Se não houver visual ou for definido como "nenhum"
  if (!visual || visual.tipo === "nenhum" || !visual.conteudo) {
    return null;
  }

  return (
    <>
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border transition-all duration-200",
          "bg-white/80 dark:bg-white/5 border-surface-200 dark:border-white/10 shadow-sm",
          className
        )}
      >
        {/* Visual Content Display */}
        <div
          className={cn(
            "relative flex items-center justify-center p-3 cursor-pointer group select-none",
            compact ? "min-h-[140px] max-h-[220px]" : "min-h-[180px] max-h-[320px]"
          )}
          onClick={() => setIsZoomed(true)}
          title="Clique para ampliar a figura"
        >
          {isSvg && (
            <div
              className="w-full h-full flex items-center justify-center overflow-hidden [&>svg]:w-full [&>svg]:h-auto [&>svg]:max-h-64 [&>svg]:object-contain"
              dangerouslySetInnerHTML={{ __html: sanitizedSvg }}
            />
          )}

          {isImage && !imageError && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={visual.conteudo}
              alt={visual.legenda || "Figura ilustrativa do ENEM"}
              loading="lazy"
              onError={() => setImageError(true)}
              className="w-full h-auto max-h-64 object-contain rounded-lg"
            />
          )}

          {isImage && imageError && (
            <div className="flex flex-col items-center justify-center py-6 px-4 text-center text-gray-500 dark:text-gray-400 space-y-2">
              <AlertCircle size={24} className="text-amber-500" />
              <p className="text-xs">Não foi possível carregar a imagem externa.</p>
              {visual.legenda && (
                <p className="text-xs italic text-gray-600 dark:text-gray-300">
                  &ldquo;{visual.legenda}&rdquo;
                </p>
              )}
            </div>
          )}

          {/* Hint de zoom ao passar o mouse ou tocar */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/60 text-white rounded-full p-1.5 backdrop-blur-sm">
            <ZoomIn size={14} />
          </div>
        </div>

        {/* Legenda opcional */}
        {visual.legenda && (
          <div className="border-t border-surface-200 dark:border-white/10 px-3.5 py-2 bg-surface-50 dark:bg-white/[0.02] flex items-center gap-2">
            <ImageIcon size={13} className="shrink-0 text-gray-400" />
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-snug line-clamp-2">
              {visual.legenda}
            </p>
          </div>
        )}
      </div>

      {/* Modal de Zoom em Tela Cheia (ótimo para telas pequenas no celular) */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="relative max-w-2xl w-full bg-white dark:bg-[#1a1b26] rounded-3xl p-5 shadow-2xl border border-white/20 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-surface-200 dark:border-white/10">
              <span
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: accentColor }}
              >
                Visualização Detalhada
              </span>
              <button
                onClick={() => setIsZoomed(false)}
                className="p-1.5 rounded-full hover:bg-surface-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex items-center justify-center min-h-[220px] max-h-[70vh] overflow-auto p-2">
              {isSvg && (
                <div
                  className="w-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-auto [&>svg]:max-h-[60vh]"
                  dangerouslySetInnerHTML={{ __html: sanitizedSvg }}
                />
              )}

              {isImage && !imageError && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={visual.conteudo}
                  alt={visual.legenda || "Figura ampliada"}
                  className="max-w-full max-h-[60vh] object-contain rounded-xl"
                />
              )}
            </div>

            {visual.legenda && (
              <p className="text-xs text-center text-gray-600 dark:text-gray-300 italic pt-1">
                {visual.legenda}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
