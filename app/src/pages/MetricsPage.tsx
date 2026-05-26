import { useState } from "react";
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
import { P3FormulaModal } from "../components/P3FormulaModal";
import { EXPERIMENTS, KPI_DEFINITIONS, L1_FUNNEL_SECTIONS, METRIC_HISTORY } from "../data/mockData";
import { useChartTheme } from "../hooks/useChartTheme";
import type { MetricSnapshot } from "../types";

interface Props {
  metrics: MetricSnapshot;
}

export function MetricsPage({ metrics }: Props) {
  const l2Kpis = KPI_DEFINITIONS.filter((k) => k.layer === "L2");
  const [showP3Formula, setShowP3Formula] = useState(false);
  const chart = useChartTheme();

  const tooltipProps = {
    contentStyle: {
      background: chart.tooltipBg,
      border: `1px solid ${chart.tooltipBorder}`,
      borderRadius: 8,
      color: chart.tooltipText,
    },
    labelStyle: { color: chart.tooltipText },
    itemStyle: { color: chart.tooltipText },
    cursor: { fill: chart.cursor },
  };

  const axisTick = { fill: chart.tick };

  return (
    <div className="animate-slide-up space-y-6">
      <header>
        <h1 className="text-xl font-bold">数据指标 & A/B 实验</h1>
        <p className="mt-1 text-sm text-fg-muted">
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
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-muted/50 px-4 py-3">
                <h3 className="text-sm font-semibold">
                  {sec.segment}. {sec.title}
                </h3>
                <span className="text-[10px] text-fg-muted">{sec.tip}</span>
              </div>
              <div className="grid gap-2 p-4 sm:grid-cols-3">
                {sec.metrics.map((m) => (
                  <div
                    key={m.label}
                    className={`rounded-lg border p-3 ${
                      "highlight" in m && m.highlight
                        ? "border-douyin-pink/30 bg-douyin-pink/5"
                        : "border-line bg-muted/30"
                    }`}
                  >
                    <div className="text-[10px] text-fg-muted">{m.label}</div>
                    <div className="text-base font-bold">{m.value}</div>
                    {"fanShare" in m && m.fanShare && (
                      <div className="text-[10px] text-fg-muted">{m.fanShare}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <span className="rounded bg-purple-500/15 px-2 py-0.5 text-purple-700 dark:text-purple-300">L2</span>
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
                  <span className="text-xs text-fg-muted">{k.name}</span>
                  <span className="text-lg font-bold">{display}</span>
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-fg-muted">{k.desc}</p>
                {k.formula && (
                  <p className="mt-1 text-[10px] leading-relaxed text-amber-700 dark:text-amber-400/90">
                    <span className="text-amber-600/80 dark:text-amber-400/70">公式：</span>
                    {k.formulaDetail ? (
                      <button
                        type="button"
                        className="text-left text-amber-700 underline decoration-amber-500/40 underline-offset-2 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300"
                        onClick={() => setShowP3Formula(true)}
                        title="点击查看公式详解与权重原理"
                      >
                        {k.formula}
                      </button>
                    ) : (
                      <span>{k.formula}</span>
                    )}
                    {k.formulaDetail && (
                      <span className="ml-1 text-[9px] text-fg-muted">（点击查看详解）</span>
                    )}
                  </p>
                )}
                <p className="mt-2 text-[10px] text-douyin-cyan">来源：{k.source}</p>
                <p className="mt-1 text-[10px] text-fg-muted">目标 {k.target}</p>
              </div>
            );
          })}
        </div>
      </section>

      <div className="glass-card p-5">
        <h2 className="mb-4 font-semibold">L2 趋势（近 4 周 · Mock）</h2>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={METRIC_HISTORY}>
            <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} />
            <XAxis
              dataKey="week"
              stroke={chart.axis}
              tick={{ ...axisTick, fontSize: 12 }}
              axisLine={{ stroke: chart.axis }}
              tickLine={{ stroke: chart.axis }}
            />
            <YAxis
              stroke={chart.axis}
              tick={{ ...axisTick, fontSize: 12 }}
              axisLine={{ stroke: chart.axis }}
              tickLine={{ stroke: chart.axis }}
            />
            <Tooltip {...tooltipProps} />
            <Legend wrapperStyle={{ color: chart.legend, fontSize: 12 }} />
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
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-muted/50 p-4"
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
            <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} />
            <XAxis
              dataKey="name"
              stroke={chart.axis}
              tick={{ ...axisTick, fontSize: 11 }}
              axisLine={{ stroke: chart.axis }}
              tickLine={{ stroke: chart.axis }}
              interval={0}
            />
            <YAxis
              stroke={chart.axis}
              tick={{ ...axisTick, fontSize: 12 }}
              axisLine={{ stroke: chart.axis }}
              tickLine={{ stroke: chart.axis }}
            />
            <Tooltip {...tooltipProps} />
            <Bar
              dataKey="rate"
              name="采纳率%"
              fill="url(#barGrad)"
              radius={[6, 6, 0, 0]}
              activeBar={{ fill: "url(#barGradActive)", opacity: 0.85 }}
            />
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#25F4EE" />
                <stop offset="100%" stopColor="#FE2C55" />
              </linearGradient>
              <linearGradient id="barGradActive" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1dd9d2" />
                <stop offset="100%" stopColor="#e8264d" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-center text-[10px] text-fg-muted">
        指标口径：抖音创作者中心作品数据详情；AI 诊断交互借鉴小红书笔记诊断；演示 Mock
      </p>

      {showP3Formula && <P3FormulaModal onClose={() => setShowP3Formula(false)} />}
    </div>
  );
}
