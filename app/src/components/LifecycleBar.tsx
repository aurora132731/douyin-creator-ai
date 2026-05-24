import { Check, ChevronRight } from "lucide-react";
import { LIFECYCLE_STEPS } from "../data/mockData";
import type { TabId } from "../types";

interface Props {
  activeTab: TabId;
  completed: Set<string>;
  onNavigate: (tab: TabId) => void;
}

const TAB_MAP: Record<string, TabId> = {
  topic: "topic",
  create: "create",
  publish: "publish",
  compliance: "compliance",
  growth: "growth",
};

export function LifecycleBar({ activeTab, completed, onNavigate }: Props) {
  return (
    <div className="glass-card flex items-center justify-between gap-2 p-4">
      <span className="shrink-0 text-xs font-medium text-douyin-muted">创作者链路</span>
      <div className="flex flex-1 flex-wrap items-center justify-center gap-1">
        {LIFECYCLE_STEPS.map((step, i) => {
          const tab = TAB_MAP[step.id];
          const isActive = activeTab === tab;
          const isDone = completed.has(step.id);

          return (
            <div key={step.id} className="flex items-center">
              <button
                type="button"
                onClick={() => onNavigate(tab)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition ${
                  isActive
                    ? "bg-gradient-to-r from-douyin-cyan/20 to-douyin-pink/20 font-medium text-white ring-1 ring-douyin-cyan/40"
                    : isDone
                      ? "text-douyin-cyan"
                      : "text-douyin-muted hover:text-gray-300"
                }`}
              >
                {isDone ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-douyin-border text-[10px]">
                    {i + 1}
                  </span>
                )}
                {step.label}
              </button>
              {i < LIFECYCLE_STEPS.length - 1 && (
                <ChevronRight className="mx-0.5 h-3.5 w-3.5 text-douyin-border" />
              )}
            </div>
          );
        })}
      </div>
      <span className="shrink-0 text-[10px] text-douyin-muted">选题 → 创作 → 发布 → 审核 → 成长</span>
    </div>
  );
}
