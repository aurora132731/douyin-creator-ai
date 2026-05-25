import { Sparkles, X } from "lucide-react";
import type { DiagnosisDimension } from "../types";

interface Props {
  dimension: DiagnosisDimension;
  onClose: () => void;
}

export function DiagnosisModal({ dimension, onClose }: Props) {
  const isGood = dimension.status === "good";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-douyin-border bg-douyin-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-start justify-between border-b border-douyin-border bg-douyin-card p-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold">{dimension.title}</h2>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  isGood ? "bg-green-500/20 text-green-400" : "bg-amber-500/20 text-amber-400"
                }`}
              >
                {isGood ? "较好" : "待提升"}
              </span>
            </div>
            <p className="mt-1 text-xs text-douyin-muted">{dimension.segmentTip}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1 hover:bg-douyin-border">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-xl bg-douyin-dark p-3">
              <div className="text-douyin-muted">{dimension.metricLabel}</div>
              <div className="mt-1 text-lg font-bold">{dimension.metricValue}</div>
            </div>
            <div className="rounded-xl bg-douyin-dark p-3">
              <div className="text-douyin-muted">同类中位数</div>
              <div className="mt-1 text-lg font-bold text-gray-400">{dimension.median}</div>
            </div>
            <div className="rounded-xl bg-douyin-dark p-3">
              <div className="text-douyin-muted">对标</div>
              <div className="mt-1 text-sm font-medium text-douyin-cyan">{dimension.exceedPercent}</div>
            </div>
          </div>

          <section>
            <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-douyin-cyan">
              <Sparkles className="h-4 w-4" />
              指标解读 · AI
            </h3>
            <div className="space-y-3 text-sm leading-relaxed text-douyin-muted">
              <div className="rounded-xl bg-douyin-dark/80 p-3">
                <strong className="text-gray-300">现状：</strong>
                {dimension.situation}
              </div>
              <div className="rounded-xl bg-douyin-dark/80 p-3">
                <strong className="text-gray-300">原因分析：</strong>
                {dimension.cause}
              </div>
              <div className="rounded-xl bg-douyin-dark/80 p-3">
                <strong className="text-gray-300">建议：</strong>
                <ul className="mt-2 list-inside list-disc space-y-1">
                  {dimension.suggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <p className="text-center text-[10px] text-douyin-muted">
            交互借鉴小红书笔记诊断 · 指标口径抖音创作者中心 · 演示 Mock · 24h 后可重新分析
          </p>
        </div>
      </div>
    </div>
  );
}
