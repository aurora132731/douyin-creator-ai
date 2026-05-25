import { ArrowRight, BarChart3, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { DiagnosisModal } from "../components/DiagnosisModal";
import {
  buildDiagnosisDimensions,
  buildWorkSummary,
  DOUYIN_FUNNEL_SEGMENTS,
} from "../data/diagnosisMock";
import type { CreatorProfile, DiagnosisDimension, TabId } from "../types";

interface Props {
  profile: CreatorProfile;
  onNavigate: (tab: TabId) => void;
  onComplete: () => void;
}

export function DiagnosisPage({ profile, onNavigate, onComplete }: Props) {
  const [activeDim, setActiveDim] = useState<DiagnosisDimension | null>(null);
  const [diagnosed, setDiagnosed] = useState(false);

  const summary = useMemo(() => buildWorkSummary(profile), [profile]);
  const dimensions = useMemo(() => buildDiagnosisDimensions(profile), [profile]);
  const weakest = dimensions.find((d) => d.id === summary.weakestDimensionId) ?? dimensions[1];

  const runDiagnosis = () => {
    setDiagnosed(true);
    setActiveDim(weakest);
    onComplete();
  };

  return (
    <div className="animate-slide-up space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold">
            <Sparkles className="h-6 w-6 text-douyin-pink" />
            AI 作品诊断
          </h1>
          <p className="mt-1 text-sm text-douyin-muted">
            指标【抖音】作品数据详情四段漏斗 · 诊断交互【小红书】笔记诊断（现状/原因/建议）
          </p>
        </div>
        <button type="button" onClick={runDiagnosis} className="btn-primary flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          开始诊断
        </button>
      </header>

      <div className="glass-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs text-douyin-muted">诊断作品 · Mock</span>
            <h2 className="mt-1 font-semibold">{summary.workTitle}</h2>
            <p className="text-xs text-douyin-muted">
              {summary.workDate} · {summary.views.toLocaleString()} 播放 · {summary.likes} 赞 ·{" "}
              {summary.comments} 评
            </p>
          </div>
          {diagnosed && (
            <span className="rounded-full bg-douyin-cyan/15 px-3 py-1 text-xs text-douyin-cyan">
              已生成 · 优先优化「{weakest.title}」
            </span>
          )}
        </div>
      </div>

      <div className="glass-card p-5">
        <h2 className="mb-4 font-semibold">四段漏斗雷达（对标同类）</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {dimensions.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setActiveDim(d)}
              className={`rounded-xl border p-4 text-left transition hover:border-douyin-cyan/50 ${
                d.id === weakest.id ? "border-douyin-pink/40 bg-douyin-pink/5" : "border-douyin-border bg-douyin-dark/50"
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="text-douyin-muted">
                  {d.segment}. {d.title}
                </span>
                <span
                  className={
                    d.status === "good" ? "text-green-400" : "text-amber-400"
                  }
                >
                  {d.status === "good" ? "较好" : "待提升"}
                </span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-douyin-border">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-douyin-cyan to-douyin-pink"
                  style={{ width: `${d.radarScore}%` }}
                />
              </div>
              <div className="mt-2 text-lg font-bold">{d.radarScore}</div>
              <div className="text-[10px] text-douyin-muted">{d.metricLabel} {d.metricValue}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {DOUYIN_FUNNEL_SEGMENTS.map((seg) => {
          const dim = dimensions.find((d) => d.segment === seg.segment)!;
          return (
            <div key={seg.segment} className="glass-card overflow-hidden">
              <div className="border-b border-douyin-border bg-douyin-dark/50 px-5 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold">
                    {seg.segment}. {seg.title}
                  </h3>
                  <span className="text-xs text-douyin-muted">{seg.tip}</span>
                </div>
              </div>
              <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">
                {dim.funnelMetrics.map((m) => (
                  <div
                    key={m.label}
                    className={`rounded-xl border p-3 ${
                      m.highlight
                        ? "border-douyin-pink/30 bg-douyin-pink/5"
                        : "border-douyin-border bg-douyin-dark/30"
                    }`}
                  >
                    <div className="text-xs text-douyin-muted">{m.label}</div>
                    <div className="mt-1 text-lg font-bold">{m.value}</div>
                    {m.fanShare && (
                      <div className="mt-1 text-[10px] text-douyin-muted">{m.fanShare}</div>
                    )}
                  </div>
                ))}
              </div>
              <div className="border-t border-douyin-border px-5 py-3">
                <button
                  type="button"
                  onClick={() => setActiveDim(dim)}
                  className="text-xs text-douyin-cyan hover:underline"
                >
                  查看「{dim.title}」AI 解读 →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass-card p-5">
          <h3 className="mb-3 flex items-center gap-2 font-semibold">
            <BarChart3 className="h-4 w-4 text-douyin-cyan" />
            流量来源【抖音 · 流量分析】
          </h3>
          <div className="space-y-2">
            {summary.trafficSource.map((s) => (
              <div key={s.name} className="flex items-center gap-3">
                <span className="w-12 text-xs text-douyin-muted">{s.name}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-douyin-border">
                  <div
                    className="h-full bg-douyin-cyan/80"
                    style={{ width: `${s.percent}%` }}
                  />
                </div>
                <span className="w-10 text-right text-xs">{s.percent}%</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[10px] text-douyin-muted">
            借鉴小红书：可对主推渠道做「开始诊断」深度分析（V1.2）
          </p>
        </div>
        <div className="glass-card p-5">
          <h3 className="mb-2 font-semibold">观众洞察【抖音 · 观众分析】</h3>
          <p className="text-sm leading-relaxed text-douyin-muted">{summary.audienceInsight}</p>
          <button
            type="button"
            onClick={() => onNavigate("create")}
            className="btn-primary mt-4 flex w-full items-center justify-center gap-2"
          >
            根据诊断优化脚本
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {activeDim && <DiagnosisModal dimension={activeDim} onClose={() => setActiveDim(null)} />}
    </div>
  );
}
