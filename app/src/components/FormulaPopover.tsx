import { X } from "lucide-react";

interface Props {
  title: string;
  body: string;
  onClose: () => void;
}

/** 非 P3 指标的简易公式浮窗 */
export function FormulaPopover({ title, body, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-xl border border-line bg-card p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-amber-400">{title}</h3>
          <button type="button" onClick={onClose} className="text-fg-muted hover:text-fg">
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="text-sm leading-relaxed text-gray-300">{body}</p>
      </div>
    </div>
  );
}
