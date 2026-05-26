import {
  ArrowDownUp,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  ChevronRight,
  Filter,
  Loader2,
  Play,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DiagnosisModal } from "../components/DiagnosisModal";
import { DiagnosisRadar } from "../components/DiagnosisRadar";
import {
  AI_DIAGNOSIS_GENERATE_MS,
  buildDiagnosisDimensions,
  buildPublishedWorks,
  buildWorkSummary,
  DOUYIN_FUNNEL_SEGMENTS,
} from "../data/diagnosisMock";
import type {
  CreatorProfile,
  DiagnosisDimension,
  DiagnosisPhase,
  TabId,
} from "../types";

interface Props {
  profile: CreatorProfile;
  onNavigate: (tab: TabId) => void;
  onComplete: () => void;
  initialWorkId?: string | null;
}

type WorkSortKey = "date" | "views" | "engagement";
type WorkFilterKey = "all" | "normal" | "optimizable";

function parsePublishDate(md: string): number {
  const [m, d] = md.split("-").map(Number);
  return (m || 0) * 100 + (d || 0);
}

export function DiagnosisPage({ profile, onNavigate, onComplete, initialWorkId }: Props) {
  const works = useMemo(() => buildPublishedWorks(profile), [profile]);
  const [selectedWorkId, setSelectedWorkId] = useState<string | null>(
    initialWorkId ?? works[0]?.id ?? null
  );
  const [phase, setPhase] = useState<DiagnosisPhase>("select");
  const [activeDim, setActiveDim] = useState<DiagnosisDimension | null>(null);
  const [workFilter, setWorkFilter] = useState<WorkFilterKey>("all");
  const [workSort, setWorkSort] = useState<WorkSortKey>("date");

  const filteredSortedWorks = useMemo(() => {
    let list = [...works];
    if (workFilter === "normal") {
      list = list.filter((w) => w.statusLabel === "数据正常");
    } else if (workFilter === "optimizable") {
      list = list.filter((w) => w.statusLabel === "可优化");
    }
    list.sort((a, b) => {
      if (workSort === "views") return b.views - a.views;
      if (workSort === "engagement") {
        return b.likes + b.comments - (a.likes + a.comments);
      }
      return parsePublishDate(b.publishDate) - parsePublishDate(a.publishDate);
    });
    return list;
  }, [works, workFilter, workSort]);

  const summary = useMemo(
    () => (selectedWorkId ? buildWorkSummary(profile, selectedWorkId) : null),
    [profile, selectedWorkId]
  );
  const dimensions = useMemo(
    () => (selectedWorkId ? buildDiagnosisDimensions(profile, selectedWorkId) : []),
    [profile, selectedWorkId]
  );
  const weakest = dimensions.find((d) => d.id === summary?.weakestDimensionId);

  useEffect(() => {
    if (initialWorkId) {
      setSelectedWorkId(initialWorkId);
      setPhase("select");
    }
  }, [initialWorkId]);

  useEffect(() => {
    if (phase !== "generating") return;
    const t = setTimeout(() => {
      setPhase("ready");
      onComplete();
    }, AI_DIAGNOSIS_GENERATE_MS);
    return () => clearTimeout(t);
  }, [phase, onComplete]);

  const selectWork = (workId: string) => {
    setSelectedWorkId(workId);
    setPhase("overview");
    setActiveDim(null);
  };

  const startAiDiagnosis = () => {
    setPhase("generating");
    setActiveDim(null);
  };

  const backToList = () => {
    setSelectedWorkId(null);
    setPhase("select");
    setActiveDim(null);
  };

  const openDimension = (dim: DiagnosisDimension) => {
    if (phase !== "ready") return;
    setActiveDim(dim);
  };

  return (
    <div className="animate-slide-up space-y-6">
      <header>
        <h1 className="flex items-center gap-2 text-xl font-bold">
          <Sparkles className="h-6 w-6 text-douyin-pink" />
          AI 作品诊断
        </h1>
        <p className="mt-1 text-sm text-fg-muted">
          先选已发布作品 → 查看基础数据与雷达 → 开始 AI 诊断后查看分维度解读
        </p>
      </header>

      {/* 步骤 1：作品列表 */}
      {phase === "select" && (
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-fg-muted">
            已发布作品（{filteredSortedWorks.length}/{works.length}）· 点击选择要诊断的作品
          </h2>

          <div className="glass-card space-y-3 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1 text-xs text-fg-muted">
                <Filter className="h-3.5 w-3.5" />
                筛选
              </span>
              {(
                [
                  { key: "all" as const, label: "全部" },
                  { key: "normal" as const, label: "数据正常" },
                  { key: "optimizable" as const, label: "可优化" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setWorkFilter(opt.key)}
                  className={`rounded-lg px-3 py-1.5 text-xs transition ${
                    workFilter === opt.key
                      ? "bg-douyin-cyan/20 font-medium text-douyin-cyan"
                      : "border border-line text-fg-muted hover:border-fg-subtle"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t border-line/60 pt-3">
              <span className="flex items-center gap-1 text-xs text-fg-muted">
                <ArrowDownUp className="h-3.5 w-3.5" />
                排序
              </span>
              <select
                value={workSort}
                onChange={(e) => setWorkSort(e.target.value as WorkSortKey)}
                className="input-app min-w-[140px] flex-1 text-xs outline-none focus:border-douyin-cyan/50"
              >
                <option value="date">最新发布</option>
                <option value="views">播放量从高到低</option>
                <option value="engagement">互动量从高到低</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {filteredSortedWorks.length === 0 ? (
              <div className="glass-card px-4 py-8 text-center text-sm text-fg-muted">
                当前筛选条件下暂无作品，请切换「全部」或其他筛选项
              </div>
            ) : (
              filteredSortedWorks.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => selectWork(w.id)}
                  className="glass-card group flex w-full items-center gap-4 p-4 text-left transition hover:border-douyin-cyan/50 hover:bg-douyin-cyan/5"
                >
                  <div className="flex h-16 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-douyin-cyan/30 to-douyin-pink/30 sm:h-20 sm:w-14 sm:rounded-xl">
                    <Play className="h-5 w-5 text-white/80 sm:h-6 sm:w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold leading-snug group-hover:text-douyin-cyan">
                      {w.title}
                    </h3>
                    <p className="mt-1 text-xs text-fg-muted">
                      {w.publishDate} 发布 · {w.duration} · {w.views.toLocaleString()} 播放
                    </p>
                    <p className="mt-1 text-xs">
                      {w.likes} 赞 · {w.comments} 评 ·{" "}
                      <span
                        className={
                          w.statusLabel === "可优化" ? "text-amber-400" : "text-green-400"
                        }
                      >
                        {w.statusLabel}
                      </span>
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-fg-muted group-hover:text-douyin-cyan" />
                </button>
              ))
            )}
          </div>
        </section>
      )}

      {/* 步骤 2–4：作品详情 + 诊断 */}
      {phase !== "select" && summary && (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={backToList}
              className="btn-ghost flex items-center gap-1 text-xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              返回作品列表
            </button>
            <span className="text-xs text-fg-muted">
              {phase === "overview" && "① 基础数据"}
              {phase === "generating" && "② AI 生成中"}
              {phase === "ready" && "③ 诊断完成 · 点击维度查看详解"}
            </span>
          </div>

          <div className="glass-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="text-xs text-fg-muted">当前作品</span>
                <h2 className="mt-1 font-semibold">{summary.workTitle}</h2>
                <p className="text-xs text-fg-muted">
                  {summary.workDate} · {summary.views.toLocaleString()} 播放 · {summary.likes}{" "}
                  赞 · {summary.comments} 评
                </p>
              </div>
              {phase === "ready" && weakest && (
                <span className="rounded-full bg-douyin-cyan/15 px-3 py-1 text-xs text-douyin-cyan">
                  建议优先优化「{weakest.title}」
                </span>
              )}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="glass-card p-5">
              <h2 className="mb-4 text-center text-sm font-semibold">
                四段漏斗雷达 · 基础数据
              </h2>
              <DiagnosisRadar dimensions={dimensions} workTitle={summary.workTitle} />
              {phase === "overview" && (
                <p className="mt-4 text-center text-xs text-amber-400/90">
                  以上为平台数据概览；点击下方「开始 AI 诊断」生成解读与建议
                </p>
              )}
            </div>

            <div className="flex flex-col justify-center gap-4">
              {phase === "overview" && (
                <>
                  <p className="text-sm leading-relaxed text-fg-muted">
                    借鉴小红书「笔记诊断」：先展示数据雷达，再一键生成 AI
                    对四个维度的<strong className="text-fg">现状 / 原因 / 建议</strong>
                    解读（Mock 约 1–2 分钟）。
                  </p>
                  <button
                    type="button"
                    onClick={startAiDiagnosis}
                    className="btn-primary flex w-full items-center justify-center gap-2 py-3 text-base shadow-lg shadow-douyin-pink/25"
                  >
                    <Sparkles className="h-5 w-5" />
                    开始 AI 诊断
                  </button>
                </>
              )}

              {phase === "generating" && (
                <button
                  type="button"
                  disabled
                  className="flex w-full cursor-wait items-center justify-center gap-2 rounded-xl border-2 border-douyin-cyan/50 bg-gradient-to-r from-douyin-cyan/25 to-douyin-pink/25 py-4 text-base font-semibold text-white shadow-inner"
                >
                  <Loader2 className="h-5 w-5 animate-spin text-douyin-cyan" />
                  AI 诊断生成中，预计 1–2 分钟…
                </button>
              )}

              {phase === "ready" && (
                <div className="space-y-3">
                  <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-300">
                    ✓ AI 诊断已生成 · 点击下方任意维度查看完整解读
                  </div>
                  <button
                    type="button"
                    onClick={startAiDiagnosis}
                    className="btn-ghost w-full text-xs"
                  >
                    重新生成诊断
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="glass-card p-5">
            <h2 className="mb-3 font-semibold">分维度概览</h2>
            <p className="mb-4 text-xs text-fg-muted">
              {phase === "ready"
                ? "点击卡片打开 AI 解读浮窗"
                : "完成 AI 诊断后可查看各维度解读"}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {dimensions.map((d) => {
                const locked = phase !== "ready";
                return (
                  <button
                    key={d.id}
                    type="button"
                    disabled={locked}
                    onClick={() => openDimension(d)}
                    className={`rounded-xl border p-4 text-left transition ${
                      locked
                        ? "cursor-not-allowed border-line bg-muted/30 opacity-70"
                        : "border-line bg-muted/50 hover:border-douyin-cyan/50 hover:bg-douyin-cyan/5"
                    } ${d.id === weakest?.id && phase === "ready" ? "ring-1 ring-douyin-pink/40" : ""}`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span>
                        {d.segment}. {d.title}
                      </span>
                      <span className={d.status === "good" ? "text-green-400" : "text-amber-400"}>
                        {d.status === "good" ? "较好" : "待提升"}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-fg-muted">
                      {d.metricLabel} {d.metricValue}
                    </div>
                    {phase === "ready" && (
                      <span className="mt-2 inline-block text-[10px] text-douyin-cyan">
                        查看 AI 解读 →
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {phase === "ready" && (
            <>
              <div className="space-y-4">
                {DOUYIN_FUNNEL_SEGMENTS.map((seg) => {
                  const dim = dimensions.find((d) => d.segment === seg.segment)!;
                  return (
                    <div key={seg.segment} className="glass-card overflow-hidden">
                      <div className="border-b border-line bg-muted/50 px-5 py-3">
                        <h3 className="font-semibold">
                          {seg.segment}. {seg.title}
                        </h3>
                      </div>
                      <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">
                        {dim.funnelMetrics.map((m) => (
                          <div
                            key={m.label}
                            className={`rounded-xl border p-3 ${
                              m.highlight
                                ? "border-douyin-pink/30 bg-douyin-pink/5"
                                : "border-line bg-muted/30"
                            }`}
                          >
                            <div className="text-xs text-fg-muted">{m.label}</div>
                            <div className="mt-1 font-bold">{m.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="glass-card p-5">
                  <h3 className="mb-3 flex items-center gap-2 font-semibold">
                    <BarChart3 className="h-4 w-4 text-douyin-cyan" />
                    流量来源
                  </h3>
                  <div className="space-y-2">
                    {summary.trafficSource.map((s) => (
                      <div key={s.name} className="flex items-center gap-3">
                        <span className="w-12 text-xs text-fg-muted">{s.name}</span>
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
                </div>
                <div className="glass-card p-5">
                  <h3 className="mb-2 font-semibold">观众洞察</h3>
                  <p className="text-sm text-fg-muted">{summary.audienceInsight}</p>
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
            </>
          )}
        </>
      )}

      {activeDim && <DiagnosisModal dimension={activeDim} onClose={() => setActiveDim(null)} />}
    </div>
  );
}
