import { ArrowRight, Bot, Play, RotateCcw, Target, Users, Zap } from "lucide-react";
import { DOC_LINKS } from "../config/docLinks";
import { KPI_DEFINITIONS, LIFECYCLE_STEPS } from "../data/mockData";
import type { CreatorProfile, MetricSnapshot, TabId } from "../types";

interface Props {
  profile: CreatorProfile;
  metrics: MetricSnapshot;
  completedCount: number;
  onNavigate: (tab: TabId) => void;
  onResetProgress: () => void;
}

function formatKpiValue(key: string, val: number): string {
  if (key === "creatorSatisfaction") return `${val}/5`;
  if (key === "retention" || key === "growthConversion" || key === "aiDiagnosisEffective")
    return `${val}%`;
  return `${val}分`;
}

export function OverviewPage({
  profile,
  metrics,
  completedCount,
  onNavigate,
  onResetProgress,
}: Props) {
  const cards = [
    {
      icon: Target,
      title: "岗位对齐",
      desc: "覆盖 JD：创作者全链路 AI 能力、个性化分层、数据驱动迭代、内容合规",
      color: "from-douyin-cyan/20 to-douyin-cyan/5",
    },
    {
      icon: Bot,
      title: "AI 机制",
      desc: "按创作者阶段 × 垂类生成差异化选题、脚本、发布与复盘建议",
      color: "from-douyin-pink/20 to-douyin-pink/5",
    },
    {
      icon: Zap,
      title: "可迭代",
      desc: "L1 平台指标 + L2 产品指标（对齐 JD）+ A/B 实验，支撑数据驱动迭代",
      color: "from-purple-500/20 to-purple-500/5",
    },
    {
      icon: Users,
      title: "用户洞察",
      desc: "模拟抖音创作者真实工作流，从选题痛点到合规红线一站式解决",
      color: "from-amber-500/20 to-amber-500/5",
    },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            你好，<span className="gradient-text">{profile.name}</span>
          </h1>
          <p className="mt-1 text-sm text-fg-muted">
            创灵 · 抖音创作者 AI 运营工作台 — 让 AI 能力贯穿选题、创作、合规、发布与成长全链路
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate("topic")}
          className="btn-primary flex items-center gap-2"
        >
          <Play className="h-4 w-4" />
          开始演示
        </button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.title} className={`glass-card bg-gradient-to-br p-5 ${c.color}`}>
            <c.icon className="mb-3 h-6 w-6 text-douyin-cyan" />
            <h3 className="font-semibold">{c.title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-fg-muted">{c.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">创作者链路 · 快速开始</h2>
            <span className="text-xs text-fg-muted">
              进度 {completedCount}/5
            </span>
          </div>
          <div className="space-y-2">
            {LIFECYCLE_STEPS.map((step, i) => (
              <button
                key={step.id}
                type="button"
                onClick={() => onNavigate(step.id as TabId)}
                className="flex w-full items-center justify-between rounded-xl border border-line bg-muted/50 px-4 py-3 text-left text-sm transition hover:border-douyin-cyan/40 hover:bg-card"
              >
                <span>
                  <span className="mr-2 text-fg-muted">{i + 1}.</span>
                  AI {step.label}
                </span>
                <ArrowRight className="h-4 w-4 text-fg-muted" />
              </button>
            ))}
          </div>
          {completedCount > 0 && (
            <button
              type="button"
              onClick={onResetProgress}
              className="mt-3 flex items-center gap-1 text-xs text-fg-muted hover:text-fg"
            >
              <RotateCcw className="h-3 w-3" />
              重置演示进度
            </button>
          )}
        </div>

        <div className="glass-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">L2 产品指标快照</h2>
            <button
              type="button"
              onClick={() => onNavigate("metrics")}
              className="text-xs text-douyin-cyan hover:underline"
            >
              查看 L1+L2 详情 →
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {KPI_DEFINITIONS.map((k) => {
              const val = metrics[k.key as keyof MetricSnapshot];
              return (
                <div
                  key={k.key}
                  className="rounded-xl border border-line bg-muted/50 p-3"
                >
                  <div className="text-lg font-bold text-fg">
                    {formatKpiValue(k.key, val)}
                  </div>
                  <div className="text-xs text-fg-muted">{k.name}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="glass-card border-line-subtle bg-gradient-to-r from-douyin-cyan/5 to-douyin-pink/5 p-5 dark:from-douyin-cyan/8 dark:to-douyin-pink/8">
        <h3 className="font-semibold">面试演示建议（约 3 分钟）</h3>
        <p className="mt-2 text-sm leading-relaxed text-fg-muted">
          点击「开始演示」→ 选题 → 脚本 → 合规 → 发布 →{" "}
          <strong className="text-fg">AI 作品诊断</strong>（开始诊断）→ 指标（四段漏斗+P3）→ 产品方案。本版{" "}
          <strong className="text-fg">GitHub Pages + Mock</strong>。口述稿：{" "}
          <a
            href={DOC_LINKS.script.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-douyin-cyan underline decoration-douyin-cyan/40 underline-offset-2 hover:text-douyin-pink"
          >
            docs/面试讲稿.md
          </a>
        </p>
      </div>
    </div>
  );
}
