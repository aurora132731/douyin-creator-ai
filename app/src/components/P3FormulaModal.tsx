import { Info, X } from "lucide-react";
import { P3_QUALITY_FORMULA } from "../data/diagnosisMock";

interface Props {
  onClose: () => void;
}

export function P3FormulaModal({ onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl border border-line bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-start justify-between border-b border-line bg-card p-5">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-amber-400" />
            <h2 className="text-lg font-bold">{P3_QUALITY_FORMULA.title}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-fg-muted hover:bg-muted hover:text-fg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
            <p className="font-mono text-sm leading-relaxed text-fg">
              {P3_QUALITY_FORMULA.expression}
            </p>
          </div>

          <p className="text-[11px] leading-relaxed text-fg-muted">
            {P3_QUALITY_FORMULA.normalize}
          </p>

          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-douyin-cyan">权重原理</h3>
            {P3_QUALITY_FORMULA.weights.map((w) => (
              <div
                key={w.metric}
                className="rounded-lg border border-line bg-muted/50 px-3 py-2 text-[11px]"
              >
                <strong className="text-fg">{w.pct}</strong> {w.metric}
                <span className="text-douyin-cyan"> · {w.source}</span>
                <p className="mt-1 text-fg-muted">{w.rationale}</p>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-fg-muted">{P3_QUALITY_FORMULA.xhsReference}</p>
        </div>
      </div>
    </div>
  );
}
