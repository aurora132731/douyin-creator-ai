import {
  ArrowRight,
  BarChart3,
  ChevronRight,
  Lightbulb,
  Play,
  Sparkles,
  TrendingUp,
  User,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  DOUYIN_FUNNEL_SEGMENTS,
  buildPublishedWorks,
  buildWorkSummary,
} from "../data/diagnosisMock";
import { CONTENT_GOAL_LABELS, STAGE_DESC, STAGE_LABELS } from "../data/mockData";
import { generateGrowthInsights } from "../services/aiEngine";
import type { CreatorProfile, MetricSnapshot, TabId } from "../types";

interface Props {
  profile: CreatorProfile;
  metrics: MetricSnapshot;
  onNavigate: (tab: TabId) => void;
  onStartDiagnosis: (workId: string) => void;
  onComplete: () => void;
}

function accountFunnel(profile: CreatorProfile) {
  const hook =
    profile.stage === "new" ? 28.5 : profile.stage === "growing" ? 35.8 : 48.2;
  const completion =
    profile.stage === "new" ? 22.1 : profile.stage === "growing" ? 31.4 : 42.6;
  return [
    { id: "traffic", label: "流量转化", value: profile.stage === "established" ? 68 : 58, unit: "分" },
    { id: "hook", label: "开头吸引力", value: hook, unit: "%", warn: hook < 40 },
    { id: "engage", label: "互动表现", value: profile.stage === "new" ? 4.2 : 6.8, unit: "%" },
    { id: "depth", label: "内容深度", value: completion, unit: "%" },
  ];
}

export function GrowthPage({
  profile,
  metrics,
  onNavigate,
  onStartDiagnosis,
  onComplete,
}: Props) {
  const insights = useMemo(() => generateGrowthInsights(profile), [profile]);
  const works = useMemo(() => buildPublishedWorks(profile), [profile]);
  const [pickedWorkId, setPickedWorkId] = useState<string | null>(works[0]?.id ?? null);
  const funnel = useMemo(() => accountFunnel(profile), [profile]);
  const pickedSummary = useMemo(
    () => (pickedWorkId ? buildWorkSummary(profile, pickedWorkId) : null),
    [profile, pickedWorkId]
  );

  const fanGrowth7d = profile.stage === "new" ? "+218" : profile.stage === "growing" ? "+1,240" : "+3,860";

  return (
    <div className="animate-slide-up space-y-6">
      <header>
        <h1 className="flex items-center gap-2 text-xl font-bold">
          <TrendingUp className="h-6 w-6 text-douyin-pink" />
          成长复盘
        </h1>
        <p className="mt-1 text-sm text-fg-muted">
          账号概况 → 选择作品诊断 → 生成下期行动，形成发布闭环
        </p>
      </header>

      {/* 账号概况 */}
      <div className="glass-card p-5">
        <h2 className="mb-4 flex items-center gap-2 font-semibold">
          <User className="h-5 w-5 text-douyin-cyan" />
          账号概况
          <span className="text-xs font-normal text-fg-muted">（Mock · 对齐抖音创作者中心口径）</span>
        </h2>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-line bg-muted/40 p-4 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-douyin-cyan to-douyin-pink text-lg font-bold">
                {profile.name.slice(0, 1)}
              </div>
              <div>
                <div className="font-medium">{profile.name}</div>
                <div className="text-xs text-fg-muted">
                  {STAGE_LABELS[profile.stage]} · {profile.vertical}
                </div>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-fg-muted">{STAGE_DESC[profile.stage]}</p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
              <div className="rounded-lg bg-muted/80 px-2 py-2">
                <div className="font-bold text-douyin-cyan">{(profile.followers / 10000).toFixed(1)}万</div>
                <div className="text-fg-muted">粉丝</div>
              </div>
              <div className="rounded-lg bg-muted/80 px-2 py-2">
                <div className="font-bold">{fanGrowth7d}</div>
                <div className="text-fg-muted">7日涨粉</div>
              </div>
              <div className="rounded-lg bg-muted/80 px-2 py-2">
                <div className="font-bold">{(profile.avgViews / 1000).toFixed(1)}k</div>
                <div className="text-fg-muted">均播</div>
              </div>
              <div className="rounded-lg bg-muted/80 px-2 py-2">
                <div className="font-bold">{profile.postFrequency} 条</div>
                <div className="text-fg-muted">周更</div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-line bg-muted/40 p-4 lg:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium">近 7 日 · 四段漏斗概览</span>
              <button
                type="button"
                onClick={() => onNavigate("metrics")}
                className="flex items-center gap-1 text-xs text-douyin-cyan hover:underline"
              >
                查看指标详情 <ChevronRight className="h-3 w-3" />
              </button>
            </div>
            <div className="space-y-3">
              {funnel.map((f, i) => (
                <div key={f.id}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-fg-muted">
                      {i + 1}. {f.label}
                      <span className="ml-1 text-[10px] text-fg-subtle">
                        {DOUYIN_FUNNEL_SEGMENTS[i]?.tip.slice(0, 12)}…
                      </span>
                    </span>
                    <span className={f.warn ? "text-amber-400" : "text-fg"}>
                      {f.value}
                      {f.unit}
                      {f.warn && " · 待提升"}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${f.warn ? "bg-amber-500/80" : "bg-gradient-to-r from-douyin-cyan to-douyin-pink"}`}
                      style={{ width: `${Math.min(100, f.unit === "%" ? f.value : f.value)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-3 border-t border-line-subtle pt-4 text-xs">
              <span className="rounded-full bg-muted px-3 py-1">
                P3 质量分 <strong className="text-douyin-cyan">{metrics.contentQuality}</strong>
              </span>
              <span className="rounded-full bg-muted px-3 py-1">
                P5 诊断有效率 <strong>{metrics.aiDiagnosisEffective}%</strong>
              </span>
              <span className="rounded-full bg-muted px-3 py-1">
                选题采纳率 <strong>62%</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 选择作品诊断 */}
      <div className="glass-card border-douyin-pink/20 p-5">
        <h2 className="mb-1 flex items-center gap-2 font-semibold">
          <Sparkles className="h-5 w-5 text-douyin-pink" />
          选择作品 · AI 诊断
        </h2>
        <p className="mb-4 text-xs text-fg-muted">
          从近期已发布作品中选一条，进入分维度解读（现状 → 原因 → 建议）
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          {works.map((w) => {
            const selected = pickedWorkId === w.id;
            return (
              <button
                key={w.id}
                type="button"
                onClick={() => setPickedWorkId(w.id)}
                className={`rounded-xl border p-4 text-left transition ${
                  selected
                    ? "border-douyin-pink/50 bg-douyin-pink/10 ring-1 ring-douyin-pink/30"
                    : "border-line bg-muted/40 hover:border-fg-subtle"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-medium leading-snug">{w.title}</span>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] ${
                      w.statusLabel === "可优化"
                        ? "bg-amber-500/15 text-amber-400"
                        : "bg-green-500/15 text-green-400"
                    }`}
                  >
                    {w.statusLabel}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-fg-muted">
                  <span>{w.publishDate} 发布</span>
                  <span>{w.duration}</span>
                  <span>{w.views.toLocaleString()} 播放</span>
                  <span>{w.likes} 赞 · {w.comments} 评</span>
                </div>
              </button>
            );
          })}
        </div>

        {pickedSummary && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-muted/30 px-4 py-3">
            <div className="flex items-center gap-2 text-sm">
              <BarChart3 className="h-4 w-4 text-douyin-cyan" />
              已选：<strong>{pickedSummary.workTitle}</strong>
              <span className="text-xs text-fg-muted">· 待优先优化维度将带入下方行动建议</span>
            </div>
            <button
              type="button"
              onClick={() => {
                if (pickedWorkId) {
                  onStartDiagnosis(pickedWorkId);
                  onComplete();
                }
              }}
              disabled={!pickedWorkId}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              <Play className="h-4 w-4" />
              开始 AI 诊断
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* 下期行动 */}
      <div className="glass-card p-5">
        <h2 className="mb-4 flex items-center gap-2 font-semibold">
          <Lightbulb className="h-5 w-5 text-amber-400" />
          下期行动建议
          <span className="text-xs font-normal text-fg-muted">（结合账号数据 + 诊断 weakest 维度）</span>
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
