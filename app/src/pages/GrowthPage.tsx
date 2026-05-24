import { Lightbulb, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { generateGrowthInsights } from "../services/aiEngine";
import type { CreatorProfile } from "../types";

interface Props {
  profile: CreatorProfile;
  onComplete: () => void;
}

export function GrowthPage({ profile, onComplete }: Props) {
  const insights = useMemo(() => generateGrowthInsights(profile), [profile]);

  return (
    <div className="animate-slide-up space-y-6">
      <header>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-douyin-pink" />
          成长复盘
        </h1>
        <p className="mt-1 text-sm text-douyin-muted">
          数据驱动的下期行动建议 — 留存、转化、内容质量综合诊断
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "涨粉量（7日）", value: "+1,240", sub: "参考抖音创作者中心", src: "L1" },
          { label: "完播率", value: "38.5%", sub: "高于垂类均值 2.1pp", src: "L1" },
          { label: "5秒完播率", value: "41%", sub: "钩子优化空间", src: "L1" },
        ].map((m) => (
          <div key={m.label} className="glass-card p-5 text-center">
            <div className="text-2xl font-bold gradient-text">{m.value}</div>
            <div className="mt-1 text-sm font-medium">{m.label}</div>
            <div className="text-xs text-douyin-muted">
              {m.sub} · <span className="text-douyin-cyan">{m.src}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card p-5">
        <h2 className="mb-4 flex items-center gap-2 font-semibold">
          <Lightbulb className="h-5 w-5 text-amber-400" />
          AI 成长建议（个性化）
        </h2>
        <div className="space-y-3">
          {insights.map((tip, i) => (
            <div
              key={i}
              className="flex gap-3 rounded-xl border border-douyin-border bg-douyin-dark/50 px-4 py-3 text-sm"
            >
              <span className="font-mono text-douyin-cyan">{i + 1}</span>
              {tip}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={onComplete}
          className="btn-primary mt-5 w-full"
        >
          标记复盘完成，回到选题
        </button>
      </div>

      <div className="glass-card p-4 text-xs text-douyin-muted">
        <strong className="text-gray-300">闭环：</strong>
        成长复盘 → 提炼下期选题方向 → 回到「AI 选题」，形成创作者增长飞轮。指标：成长转化率、创作者满意度。
      </div>
    </div>
  );
}
