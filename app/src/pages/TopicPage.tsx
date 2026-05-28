import { Briefcase, Flame, Hash, RefreshCw, Sparkles, ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";
import { CONTENT_GOAL_LABELS, EMPTY_BRIEF } from "../data/mockData";
import { generateTopics } from "../services/aiEngine";
import type { ContentGoal, CreatorProfile, TopicSessionContext, TopicSuggestion } from "../types";

interface Props {
  profile: CreatorProfile;
  session: TopicSessionContext;
  onSessionChange: (ctx: TopicSessionContext) => void;
  onProfileChange: (p: CreatorProfile) => void;
  onSelectTopic: (topic: string) => void;
  onNavigateToCreate: () => void;
  onComplete: () => void;
}

export function TopicPage({
  profile,
  session,
  onSessionChange,
  onProfileChange,
  onSelectTopic,
  onNavigateToCreate,
  onComplete,
}: Props) {
  const [topics, setTopics] = useState<TopicSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const refresh = () => {
    setLoading(true);
    setTimeout(() => {
      setTopics(generateTopics(profile, session));
      setLoading(false);
    }, 600);
  };

  useEffect(() => {
    refresh();
  }, [profile.stage, profile.vertical, session.contentGoal, session.hasCommercial, session.brief.product]);

  const setGoal = (contentGoal: ContentGoal) => {
    onSessionChange({ ...session, contentGoal });
  };

  const toggleCommercial = () => {
    onSessionChange({
      ...session,
      hasCommercial: !session.hasCommercial,
      brief: session.hasCommercial ? { ...EMPTY_BRIEF } : session.brief,
    });
  };

  const updateBrief = (key: keyof TopicSessionContext["brief"], value: string) => {
    onSessionChange({
      ...session,
      brief: { ...session.brief, [key]: value },
    });
  };

  const handleAdopt = (t: TopicSuggestion) => {
    setSelected(t.id);
    onSelectTopic(t.title);
    onComplete();
    onNavigateToCreate();
  };

  return (
    <div className="animate-slide-up space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold">AI 智能选题</h1>
          <p className="mt-1 text-sm text-fg-muted">
            曝光/种草目标 × 可选商单 Brief → 推荐高匹配选题（Mock 热榜逻辑）
          </p>
        </div>
        <button type="button" onClick={refresh} className="btn-ghost flex shrink-0 items-center gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          刷新推荐
        </button>
      </header>

      <div className="glass-card space-y-4 p-5">
        <p className="text-xs leading-relaxed text-fg-muted">
          <strong className="text-fg">内容目标</strong>（曝光/种草）适用于日常分享与商单，不必先有商单；
          商单为<strong className="text-fg">可选附加</strong>，开启后叠加 Brief 与 #广告 合规要求。
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs text-fg-muted">本条内容目标</span>
          {(["exposure", "seeding", "mixed"] as ContentGoal[]).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGoal(g)}
              className={`rounded-full px-3 py-1.5 text-xs transition ${
                session.contentGoal === g
                  ? "bg-douyin-cyan/20 text-douyin-cyan ring-1 ring-douyin-cyan/40"
                  : "bg-muted text-fg-muted hover:text-fg"
              }`}
            >
              {CONTENT_GOAL_LABELS[g]}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-line-subtle pt-3">
          <span className="text-xs text-fg-muted">账号默认目标</span>
          <span className="text-[10px] text-fg-subtle">（选「混合」时本条沿用）</span>
          {(["exposure", "seeding", "mixed"] as ContentGoal[]).map((g) => (
            <button
              key={`default-${g}`}
              type="button"
              onClick={() => onProfileChange({ ...profile, contentGoalDefault: g })}
              className={`rounded-full px-2.5 py-1 text-[10px] transition ${
                (profile.contentGoalDefault ?? "mixed") === g
                  ? "bg-muted text-douyin-cyan ring-1 ring-douyin-cyan/30"
                  : "text-fg-muted hover:text-fg"
              }`}
            >
              {CONTENT_GOAL_LABELS[g]}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-line-subtle pt-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={session.hasCommercial}
              onChange={toggleCommercial}
              className="rounded border-line"
            />
            <Briefcase className="h-4 w-4 text-douyin-pink" />
            商单模式（Brief 驱动选题）
          </label>
        </div>

        {session.hasCommercial && (
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              value={session.brief.brand}
              onChange={(e) => updateBrief("brand", e.target.value)}
              placeholder="品牌名"
              className="field-text rounded-xl border border-line px-3 py-2 text-sm"
            />
            <input
              type="text"
              value={session.brief.product}
              onChange={(e) => updateBrief("product", e.target.value)}
              placeholder="产品名"
              className="field-text rounded-xl border border-line px-3 py-2 text-sm"
            />
            <input
              type="text"
              value={session.brief.sellingPoints}
              onChange={(e) => updateBrief("sellingPoints", e.target.value)}
              placeholder="核心卖点（1-2句）"
              className="field-text rounded-xl border border-line px-3 py-2 text-sm sm:col-span-2"
            />
            <input
              type="text"
              value={session.brief.mustMention}
              onChange={(e) => updateBrief("mustMention", e.target.value)}
              placeholder="必提信息"
              className="field-text rounded-xl border border-line px-3 py-2 text-sm"
            />
            <input
              type="text"
              value={session.brief.forbidden}
              onChange={(e) => updateBrief("forbidden", e.target.value)}
              placeholder="禁用表述（逗号分隔）"
              className="field-text rounded-xl border border-line px-3 py-2 text-sm"
            />
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <Sparkles className="h-8 w-8 animate-pulse text-douyin-cyan" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {topics.map((t) => (
            <div
              key={t.id}
              className={`glass-card p-5 transition ${
                selected === t.id ? "ring-2 ring-douyin-cyan" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold leading-snug">{t.title}</h3>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="rounded-full bg-douyin-cyan/15 px-2 py-0.5 text-xs font-medium text-douyin-cyan">
                    匹配 {t.fitScore}%
                  </span>
                  {t.isCommercial && (
                    <span className="rounded-full bg-douyin-pink/15 px-2 py-0.5 text-[10px] text-douyin-pink">
                      商单
                    </span>
                  )}
                </div>
              </div>

              <p className="mt-2 text-xs leading-relaxed text-fg-muted">{t.reason}</p>

              <div className="mt-4 flex flex-wrap gap-3 text-xs">
                <span className="flex items-center gap-1 text-orange-400">
                  <Flame className="h-3.5 w-3.5" />
                  热度 {t.heat}
                </span>
                <span className="text-fg-muted">
                  竞争度 <strong className="text-fg">{t.competition}</strong>
                </span>
                <span className="text-fg-muted">建议时长 {t.bestFormat}</span>
              </div>

              <div className="mt-3 flex flex-wrap gap-1">
                {t.hashtags.map((h) => (
                  <span
                    key={h}
                    className="flex items-center gap-0.5 rounded-md bg-muted px-2 py-0.5 text-[10px] text-douyin-cyan"
                  >
                    <Hash className="h-3 w-3" />
                    {h.replace("#", "")}
                  </span>
                ))}
              </div>

              <button
                type="button"
                onClick={() => handleAdopt(t)}
                className="btn-primary mt-4 flex w-full items-center justify-center gap-2"
              >
                <ThumbsUp className="h-4 w-4" />
                采纳选题，进入创作
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="glass-card p-4 text-xs text-fg-muted">
        <strong className="text-fg">产品逻辑：</strong>
        选题 = 垂类趋势 × 内容目标（曝光/种草）× 可选商单 Brief。前 3 条在商单模式下会标记合作向标签。
      </div>
    </div>
  );
}
