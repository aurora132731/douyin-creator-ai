import type { CreatorProfile, ContentVertical, CreatorStage } from "../types";
import { STAGE_DESC, STAGE_LABELS } from "../data/mockData";

const VERTICALS: ContentVertical[] = ["美食", "美妆", "知识", "剧情", "旅行", "健身"];
const STAGES: CreatorStage[] = ["new", "growing", "established"];

interface Props {
  profile: CreatorProfile;
  onChange: (p: CreatorProfile) => void;
}

export function ProfileBar({ profile, onChange }: Props) {
  return (
    <div className="glass-card flex flex-wrap items-center gap-4 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-douyin-cyan to-douyin-pink text-sm font-bold">
          {profile.name.slice(0, 1)}
        </div>
        <input
          type="text"
          value={profile.name}
          onChange={(e) => onChange({ ...profile, name: e.target.value })}
          className="w-28 border-b border-transparent bg-transparent text-sm font-medium outline-none focus:border-douyin-cyan"
        />
      </div>

      <div className="h-8 w-px bg-douyin-border" />

      <label className="flex flex-col gap-1">
        <span className="text-[10px] text-douyin-muted">创作者阶段</span>
        <select
          value={profile.stage}
          onChange={(e) =>
            onChange({ ...profile, stage: e.target.value as CreatorStage })
          }
          className="rounded-lg border border-douyin-border bg-douyin-dark px-2 py-1 text-xs outline-none focus:border-douyin-cyan"
        >
          {STAGES.map((s) => (
            <option key={s} value={s}>
              {STAGE_LABELS[s]}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-[10px] text-douyin-muted">内容垂类</span>
        <select
          value={profile.vertical}
          onChange={(e) =>
            onChange({ ...profile, vertical: e.target.value as ContentVertical })
          }
          className="rounded-lg border border-douyin-border bg-douyin-dark px-2 py-1 text-xs outline-none focus:border-douyin-cyan"
        >
          {VERTICALS.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </label>

      <p className="flex-1 text-xs text-douyin-muted">{STAGE_DESC[profile.stage]}</p>

      <div className="flex gap-4 text-xs">
        <span>
          粉丝 <strong className="text-douyin-cyan">{(profile.followers / 10000).toFixed(1)}万</strong>
        </span>
        <span>
          均播 <strong className="text-white">{(profile.avgViews / 1000).toFixed(1)}k</strong>
        </span>
        <span>
          周更 <strong className="text-white">{profile.postFrequency}条</strong>
        </span>
      </div>
    </div>
  );
}
