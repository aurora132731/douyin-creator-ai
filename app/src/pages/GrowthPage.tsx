import { ArrowRight, Lightbulb, Sparkles, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { generateGrowthInsights } from "../services/aiEngine";
import type { CreatorProfile, TabId } from "../types";

interface Props {
  profile: CreatorProfile;
  onNavigate: (tab: TabId) => void;
  onComplete: () => void;
}

export function GrowthPage({ profile, onNavigate, onComplete }: Props) {
  const insights = useMemo(() => generateGrowthInsights(profile), [profile]);

  return (
    <div className="animate-slide-up space-y-6">
      <header>
        <h1 className="flex items-center gap-2 text-xl font-bold">
          <TrendingUp className="h-6 w-6 text-douyin-pink" />
          成长复盘
        </h1>
        <p className="mt-1 text-sm text-fg-muted">
          结合 AI 作品诊断结果，生成下期可执行行动
        </p>
      </header>

      <div className="glass-card border-douyin-pink/30 bg-gradient-to-r from-douyin-pink/10 to-douyin-cyan/5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 font-semibold">
              <Sparkles className="h-5 w-5 text-douyin-pink" />
              先看 AI 作品诊断
            </h2>
            <p className="mt-1 text-sm text-fg-muted">
              抖音四段漏斗数据 + 小红书式分维度解读（现状/原因/建议）
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              onNavigate("diagnosis");
              onComplete();
            }}
            className="btn-primary flex items-center gap-2"
          >
            进入诊断
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "涨粉数（7日）", value: "+1,240", sub: "抖音 §内容深度", src: "L1" },
          { label: "5秒完播率", value: "35.8%", sub: "低于同类中位 44.9%", src: "待提升" },
          { label: "新用户占比", value: "12%", sub: "观众分析 · 破圈空间", src: "L1" },
        ].map((m) => (
          <div key={m.label} className="glass-card p-5 text-center">
            <div className="text-2xl font-bold gradient-text">{m.value}</div>
            <div className="mt-1 text-sm font-medium">{m.label}</div>
            <div className="text-xs text-fg-muted">
              {m.sub} · <span className="text-douyin-cyan">{m.src}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card p-5">
        <h2 className="mb-4 flex items-center gap-2 font-semibold">
          <Lightbulb className="h-5 w-5 text-amber-400" />
          下期行动建议（基于诊断 weakest 维度）
        </h2>
        <div className="space-y-3">
          {insights.map((tip, i) => (
            <div
              key={i}
              className="flex gap-3 rounded-xl border border-line bg-muted/50 px-4 py-3 text-sm"
            >
              <span className="font-mono text-douyin-cyan">{i + 1}</span>
              {tip}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            onComplete();
            onNavigate("topic");
          }}
          className="btn-primary mt-5 w-full"
        >
          完成复盘，回到选题
        </button>
      </div>
    </div>
  );
}
