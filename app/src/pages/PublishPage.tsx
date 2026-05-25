import { AlertCircle, Calendar, CheckCircle2, Clock, Copy, Image, Tag } from "lucide-react";
import { useMemo, useState } from "react";
import { generatePublishDraft } from "../services/aiEngine";
import { CopyButton } from "../components/CopyButton";
import type { CreatorProfile } from "../types";

interface Props {
  profile: CreatorProfile;
  selectedTopic: string;
  onComplete: () => void;
}

const BEST_TIMES: Record<string, string[]> = {
  美食: ["11:30-13:00", "17:30-19:30", "21:00-22:00"],
  美妆: ["07:30-09:00", "12:00-13:00", "20:00-22:00"],
  知识: ["12:00-14:00", "20:00-23:00"],
  剧情: ["18:00-23:00"],
  旅行: ["10:00-12:00", "19:00-21:00"],
  健身: ["06:30-08:00", "18:00-20:00"],
};

const CHECKLIST = [
  { id: "cover", label: "封面：人脸/产品清晰，3:4 竖版，标题 ≤ 8 字", icon: Image },
  { id: "title", label: "标题含核心关键词，避免标题党", icon: Tag },
  { id: "time", label: "选择垂类最佳发布时段", icon: Clock },
  { id: "tags", label: "添加 3-5 个精准话题标签", icon: Tag },
  { id: "desc", label: "简介含免责声明（知识/健康类）", icon: Copy },
  { id: "schedule", label: "确认已通过合规预检", icon: Calendar },
];

export function PublishPage({ profile, selectedTopic, onComplete }: Props) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const times = BEST_TIMES[profile.vertical] ?? BEST_TIMES["知识"];
  const topic = selectedTopic || `${profile.vertical}日常分享`;
  const draft = useMemo(
    () => generatePublishDraft(topic, profile),
    [topic, profile.vertical, profile.stage]
  );

  const allDone = checked.size === CHECKLIST.length;
  const tagsText = draft.tags.join(" ");

  const toggle = (id: string) => {
    const next = new Set(checked);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setChecked(next);
    if (next.size === CHECKLIST.length) onComplete();
  };

  return (
    <div className="animate-slide-up space-y-6">
      <header>
        <h1 className="text-xl font-bold">发布助手</h1>
        <p className="mt-1 text-sm text-douyin-muted">
          发布前检查清单 + 垂类最佳时段 + AI 标题/标签草稿（优化 §1 封面点击率）
        </p>
      </header>

      {!selectedTopic && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200/90">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <span>建议先在「AI 选题」采纳一条选题，标题与标签会更精准。</span>
        </div>
      )}

      {selectedTopic && (
        <div className="glass-card border-douyin-cyan/30 bg-douyin-cyan/5 p-4">
          <span className="text-xs text-douyin-muted">待发布选题</span>
          <p className="mt-1 font-medium">{selectedTopic}</p>
        </div>
      )}

      <div className="glass-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">AI 发布文案草稿</h2>
          <span className="text-[10px] text-douyin-muted">Mock · 可一键复制</span>
        </div>
        <div className="space-y-4">
          <div className="rounded-xl border border-douyin-border bg-douyin-dark/50 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs text-douyin-muted">推荐标题</span>
              <CopyButton text={draft.title} label="复制标题" />
            </div>
            <p className="text-sm font-medium">{draft.title}</p>
          </div>
          <div className="rounded-xl border border-douyin-border bg-douyin-dark/50 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs text-douyin-muted">视频简介</span>
              <CopyButton text={draft.description} label="复制简介" />
            </div>
            <p className="text-sm text-gray-300">{draft.description}</p>
          </div>
          <div className="rounded-xl border border-douyin-border bg-douyin-dark/50 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs text-douyin-muted">话题标签</span>
              <CopyButton text={tagsText} label="复制全部标签" />
            </div>
            <div className="flex flex-wrap gap-2">
              {draft.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg border border-douyin-border px-3 py-1.5 text-xs text-douyin-cyan"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card p-5">
          <h2 className="mb-4 font-semibold">发布检查清单</h2>
          <div className="space-y-2">
            {CHECKLIST.map((item) => {
              const Icon = item.icon;
              const done = checked.has(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggle(item.id)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${
                    done
                      ? "border-douyin-cyan/40 bg-douyin-cyan/10"
                      : "border-douyin-border bg-douyin-dark/50 hover:border-douyin-muted"
                  }`}
                >
                  <CheckCircle2
                    className={`h-5 w-5 shrink-0 ${done ? "text-douyin-cyan" : "text-douyin-border"}`}
                  />
                  <Icon className="h-4 w-4 shrink-0 text-douyin-muted" />
                  {item.label}
                </button>
              );
            })}
          </div>
          <p className="mt-4 text-center text-xs text-douyin-muted">
            已完成 {checked.size}/{CHECKLIST.length}
            {!allDone && " · 全部勾选后标记本步骤完成"}
          </p>
        </div>

        <div className="space-y-4">
          <div className="glass-card p-5">
            <h2 className="font-semibold">「{profile.vertical}」最佳发布时段</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {times.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-gradient-to-r from-douyin-cyan/20 to-douyin-pink/20 px-4 py-2 text-sm font-medium"
                >
                  {t}
                </span>
              ))}
            </div>
            <p className="mt-4 text-xs text-douyin-muted">
              按垂类播放高峰统计（演示 Mock · 抖音发布策略）
            </p>
          </div>

          {allDone && (
            <div className="glass-card border-green-500/30 bg-green-500/10 p-4 text-center text-sm text-green-300">
              ✓ 发布准备已完成，建议前往「合规预检」后再发布
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
