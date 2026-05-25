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
import { P3_QUALITY_FORMULA } from "../data/diagnosisMock";
import { EXPERIMENTS, KPI_DEFINITIONS, L1_FUNNEL_SECTIONS, METRIC_HISTORY } from "../data/mockData";
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
          L1【抖音】作品数据详情四段漏斗 · L2【JD】产品指标 · 诊断交互借鉴【小红书】
        </p>
      </header>

      <section>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <span className="rounded bg-douyin-pink/20 px-2 py-0.5 text-douyin-pink">L1</span>
          抖音作品数据详情 · 四段漏斗（Mock）
        </h2>
        <div className="space-y-4">
          {L1_FUNNEL_SECTIONS.map((sec) => (
            <div key={sec.segment} className="glass-card overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-douyin-border bg-douyin-dark/50 px-4 py-3">
                <h3 className="text-sm font-semibold">
                  {sec.segment}. {sec.title}
                </h3>
                <span className="text-[10px] text-douyin-muted">{sec.tip}</span>
              </div>
              <div className="grid gap-2 p-4 sm:grid-cols-3">
                {sec.metrics.map((m) => (
                  <div
                    key={m.label}
                    className={`rounded-lg border p-3 ${
                      "highlight" in m && m.highlight
                        ? "border-douyin-pink/30 bg-douyin-pink/5"
                        : "border-douyin-border bg-douyin-dark/30"
                    }`}
                  >
                    <div className="text-[10px] text-douyin-muted">{m.label}</div>
                    <div className="text-base font-bold">{m.value}</div>
                    {"fanShare" in m && m.fanShare && (
                      <div className="text-[10px] text-douyin-muted">{m.fanShare}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="glass-card border-douyin-cyan/20 bg-douyin-cyan/5 p-5">
        <h2 className="mb-3 text-sm font-semibold text-douyin-cyan">{P3_QUALITY_FORMULA.title}</h2>
        <p className="font-mono text-xs text-gray-300">{P3_QUALITY_FORMULA.expression}</p>
        <p className="mt-2 text-[11px] text-douyin-muted">{P3_QUALITY_FORMULA.normalize}</p>
        <div className="mt-4 space-y-2">
          {P3_QUALITY_FORMULA.weights.map((w) => (
            <div
              key={w.metric}
              className="rounded-lg border border-douyin-border bg-douyin-dark/50 px-3 py-2 text-[11px]"
            >
              <strong className="text-white">{w.pct}</strong> {w.metric}
              <span className="text-douyin-cyan"> · {w.source}</span>
              <p className="mt-1 text-douyin-muted">{w.rationale}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[10px] text-douyin-muted">{P3_QUALITY_FORMULA.xhsReference}</p>
      </div>

      <section>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <span className="rounded bg-purple-500/20 px-2 py-0.5 text-purple-300">L2</span>
          AI 产品指标（对齐 JD）
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {l2Kpis.map((k) => {
            const val = metrics[k.key as keyof MetricSnapshot];
            const display =
              k.key === "creatorSatisfaction"
                ? `${val} / 5`
                : `${val}${["growthConversion", "aiDiagnosisEffective", "retention"].includes(k.key as string) ? "%" : k.key === "creativeEfficiency" || k.key === "contentQuality" ? "分" : ""}`;

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
        <h2 className="mb-4 font-semibold">L2 趋势（近 4 周 · Mock）</h2>
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
        <h2 className="mb-4 font-semibold">A/B 实验（抖音指标当裁判）</h2>
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
                <p className="mt-1 text-[10px] text-douyin-cyan">主指标：{exp.metric}</p>
              </div>
              <div className="text-lg font-bold text-douyin-cyan">+{exp.lift}%</div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-5">
        <h2 className="mb-4 font-semibold">诊断采纳率（影响 P5）</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={[
              { name: "流量转化", rate: 72 },
              { name: "开头吸引力", rate: 58 },
              { name: "互动表现", rate: 45 },
              { name: "内容深度", rate: 52 },
              { name: "合规 F4", rate: 91 },
            ]}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
            <XAxis dataKey="name" stroke="#8b8b9a" fontSize={10} />
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
        指标口径：抖音创作者中心作品数据详情；AI 诊断交互借鉴小红书笔记诊断；演示 Mock
      </p>
    </div>
  );
}
