import { Flame, Hash, RefreshCw, Sparkles, ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";
import { generateTopics } from "../services/aiEngine";
import type { CreatorProfile, TopicSuggestion } from "../types";

interface Props {
  profile: CreatorProfile;
  onSelectTopic: (topic: string) => void;
  onComplete: () => void;
}

export function TopicPage({ profile, onSelectTopic, onComplete }: Props) {
  const [topics, setTopics] = useState<TopicSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const refresh = () => {
    setLoading(true);
    setTimeout(() => {
      setTopics(generateTopics(profile));
      setLoading(false);
    }, 600);
  };

  useEffect(() => {
    refresh();
  }, [profile.stage, profile.vertical]);

  const handleAdopt = (t: TopicSuggestion) => {
    setSelected(t.id);
    onSelectTopic(t.title);
    onComplete();
  };

  return (
    <div className="animate-slide-up space-y-6">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold">AI 智能选题</h1>
          <p className="mt-1 text-sm text-douyin-muted">
            基于「{profile.vertical}」×「
            {profile.stage === "new" ? "新手" : profile.stage === "growing" ? "成长期" : "头部"}
            」推荐 5 条高匹配选题（Mock 热榜逻辑）
          </p>
        </div>
        <button type="button" onClick={refresh} className="btn-ghost flex items-center gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          刷新推荐
        </button>
      </header>

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
                <span className="shrink-0 rounded-full bg-douyin-cyan/15 px-2 py-0.5 text-xs font-medium text-douyin-cyan">
                  匹配 {t.fitScore}%
                </span>
              </div>

              <p className="mt-2 text-xs leading-relaxed text-douyin-muted">{t.reason}</p>

              <div className="mt-4 flex flex-wrap gap-3 text-xs">
                <span className="flex items-center gap-1 text-orange-400">
                  <Flame className="h-3.5 w-3.5" />
                  热度 {t.heat}
                </span>
                <span className="text-douyin-muted">
                  竞争度 <strong className="text-white">{t.competition}</strong>
                </span>
                <span className="text-douyin-muted">建议时长 {t.bestFormat}</span>
              </div>

              <div className="mt-3 flex flex-wrap gap-1">
                {t.hashtags.map((h) => (
                  <span
                    key={h}
                    className="flex items-center gap-0.5 rounded-md bg-douyin-dark px-2 py-0.5 text-[10px] text-douyin-cyan"
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

      <div className="glass-card p-4 text-xs text-douyin-muted">
        <strong className="text-gray-300">产品逻辑：</strong>
        选题推荐 = 垂类趋势 × 创作者标签 × 阶段策略。新手偏「低竞争高匹配」，头部偏「IP
        延展与粉丝预期」。指标：选题采纳率、7日留存。
      </div>
    </div>
  );
}
