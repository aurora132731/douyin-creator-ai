import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { EXPERIMENTS, KPI_DEFINITIONS, L1_PLATFORM_METRICS, METRIC_HISTORY } from "../data/mockData";
import type { MetricSnapshot } from "../types";

interface Props {
  metrics: MetricSnapshot;
}

export function MetricsPage({ metrics }: Props) {
  const l2Kpis = KPI_DEFINITIONS.filter((k) => k.layer === "L2");

  return (
    <div className="animate-slide-up space-y-6">
      <header>
        <h1 className="text-xl font-bold">数据指标 & A/B 实验</h1>
        <p className="mt-1 text-sm text-douyin-muted">
          双层体系：L1 平台指标验证内容是否变好 · L2 产品指标（对齐 JD）验证工具是否可迭代
        </p>
      </header>

      <div className="glass-card border-douyin-cyan/20 bg-douyin-cyan/5 p-4 text-xs leading-relaxed text-douyin-muted">
        <strong className="text-douyin-cyan">指标逻辑链：</strong> AI 建议 → 采纳发布 → L1 平台指标变化 →
        反哺 P5 准确率 / P6 满意度 → 驱动功能迭代。完整定义见{" "}
        <code className="text-douyin-cyan">docs/PRD.md</code> 第 6 章。
      </div>

      <section>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <span className="rounded bg-douyin-pink/20 px-2 py-0.5 text-douyin-pink">L1</span>
          平台原生指标（内容结果层 · 演示 Mock）
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {L1_PLATFORM_METRICS.map((m) => (
            <div key={m.name} className="glass-card p-4">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-douyin-muted">{m.name}</span>
                <span className="text-lg font-bold">{m.value}</span>
              </div>
              <p className="mt-2 text-[10px] text-douyin-cyan">参考：{m.source}</p>
              <p className="mt-1 text-[11px] text-douyin-muted">{m.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <span className="rounded bg-purple-500/20 px-2 py-0.5 text-purple-300">L2</span>
          AI 产品指标（对齐岗位 JD）
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {l2Kpis.map((k) => {
            const val = metrics[k.key as keyof MetricSnapshot];
            const display =
              k.key === "creatorSatisfaction"
                ? `${val} / 5`
                : `${val}${["growthConversion", "aiAccuracy", "retention"].includes(k.key as string) ? "%" : k.key === "creativeEfficiency" ? "分" : k.key === "contentQuality" ? "分" : ""}`;

            return (
              <div key={k.key} className="glass-card p-4">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-xs text-douyin-muted">{k.name}</span>
                  <span className="text-lg font-bold">{display}</span>
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-douyin-muted">{k.desc}</p>
                {k.formula && (
                  <p className="mt-1 text-[10px] text-amber-400/90">公式：{k.formula}</p>
                )}
                <p className="mt-2 text-[10px] text-douyin-cyan">来源：{k.source}</p>
                <p className="mt-1 text-[10px] text-douyin-muted">目标 {k.target}</p>
              </div>
            );
          })}
        </div>
      </section>

      <div className="glass-card p-5">
        <h2 className="mb-4 font-semibold">L2 核心指标趋势（近 4 周 · Mock）</h2>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={METRIC_HISTORY}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
            <XAxis dataKey="week" stroke="#8b8b9a" fontSize={12} />
            <YAxis stroke="#8b8b9a" fontSize={12} />
            <Tooltip
              contentStyle={{
                background: "#1a1a22",
                border: "1px solid #2a2a35",
                borderRadius: 8,
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="retention" name="P1 留存%" stroke="#25F4EE" strokeWidth={2} />
            <Line type="monotone" dataKey="efficiency" name="P2 效率分" stroke="#FE2C55" strokeWidth={2} />
            <Line type="monotone" dataKey="quality" name="P3 质量分" stroke="#a78bfa" strokeWidth={2} />
            <Line type="monotone" dataKey="conversion" name="P4 转化%" stroke="#fbbf24" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="glass-card p-5">
        <h2 className="mb-4 font-semibold">A/B 实验看板（平台指标当裁判）</h2>
        <div className="space-y-3">
          {EXPERIMENTS.map((exp) => (
            <div
              key={exp.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-douyin-border bg-douyin-dark/50 p-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{exp.name}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] ${
                      exp.status === "running"
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {exp.status === "running" ? "进行中" : "已完成"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-douyin-muted">
                  A: {exp.variantA} vs B: {exp.variantB}
                </p>
                <p className="mt-1 text-[10px] text-douyin-cyan">主指标：{exp.metric}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-douyin-cyan">+{exp.lift}%</div>
                <div className="text-[10px] text-douyin-muted">相对提升</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-5">
        <h2 className="mb-4 font-semibold">AI 建议采纳率（按功能 · 影响 P5）</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={[
              { name: "选题 F1", rate: 62 },
              { name: "脚本 F2", rate: 55 },
              { name: "发布 F3", rate: 78 },
              { name: "合规 F4", rate: 91 },
              { name: "复盘 F5", rate: 48 },
            ]}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
            <XAxis dataKey="name" stroke="#8b8b9a" fontSize={11} />
            <YAxis stroke="#8b8b9a" fontSize={12} />
            <Tooltip
              contentStyle={{
                background: "#1a1a22",
                border: "1px solid #2a2a35",
                borderRadius: 8,
              }}
            />
            <Bar dataKey="rate" name="采纳率%" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#25F4EE" />
                <stop offset="100%" stopColor="#FE2C55" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-center text-[10px] text-douyin-muted">
        指标口径参考抖音创作者中心、小红书笔记分析、快手数据中心及岗位 JD；演示数据为模拟，非官方后台。
      </p>
    </div>
  );
}
