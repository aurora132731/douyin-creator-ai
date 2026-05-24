import { ArrowRight, PenLine, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { CopyButton } from "../components/CopyButton";
import { generateScript } from "../services/aiEngine";
import type { CreatorProfile, ScriptOutline } from "../types";

interface Props {
  profile: CreatorProfile;
  selectedTopic: string;
  onGoTopic: () => void;
  onComplete: () => void;
}

export function CreatePage({ profile, selectedTopic, onGoTopic, onComplete }: Props) {
  const [topic, setTopic] = useState(selectedTopic || "");
  const [script, setScript] = useState<ScriptOutline | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedTopic) setTopic(selectedTopic);
  }, [selectedTopic]);

  const generate = () => {
    if (!topic.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setScript(generateScript(topic, profile));
      setLoading(false);
      onComplete();
    }, 800);
  };

  const fullScriptText = script
    ? [
        `【钩子 · 优化5秒完播】${script.hook}`,
        "",
        "【分镜结构】",
        ...script.structure.map((s, i) => `${i + 1}. ${s}`),
        "",
        `【CTA】${script.cta}`,
        `【建议时长】${script.duration}`,
        "",
        "【拍摄提示】",
        ...script.tips.map((t) => `• ${t}`),
        "",
        "— 以上内容由 AI 生成，仅供参考 —",
      ].join("\n")
    : "";

  return (
    <div className="animate-slide-up space-y-6">
      <header>
        <h1 className="text-xl font-bold">AI 创作助手</h1>
        <p className="mt-1 text-sm text-douyin-muted">
          生成短视频脚本：钩子 → 分镜 → CTA，目标提升 5 秒完播率（抖音作品分析口径）
        </p>
      </header>

      {!selectedTopic && (
        <div className="glass-card flex flex-wrap items-center justify-between gap-3 border-amber-500/20 bg-amber-500/5 p-4">
          <p className="text-sm text-amber-200/90">尚未从选题页采纳选题，可先手动输入或去选题页选择。</p>
          <button type="button" onClick={onGoTopic} className="btn-ghost flex items-center gap-1 text-xs">
            去选题 <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="glass-card flex flex-wrap gap-3 p-4">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="输入选题，或从选题页采纳…"
          className="min-w-[200px] flex-1 rounded-xl border border-douyin-border bg-douyin-dark px-4 py-2.5 text-sm outline-none focus:border-douyin-cyan"
        />
        <button
          type="button"
          onClick={generate}
          disabled={!topic.trim() || loading}
          className="btn-primary flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Sparkles className="h-4 w-4 animate-spin" />
              AI 生成中…
            </>
          ) : (
            <>
              <PenLine className="h-4 w-4" />
              生成脚本
            </>
          )}
        </button>
      </div>

      {loading && (
        <div className="glass-card flex h-32 items-center justify-center">
          <div className="space-y-2 text-center">
            <Sparkles className="mx-auto h-8 w-8 animate-pulse text-douyin-cyan" />
            <p className="text-xs text-douyin-muted">正在按「{profile.vertical}」×「{profile.stage}」生成脚本…</p>
          </div>
        </div>
      )}

      {script && !loading && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="glass-card p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold text-douyin-cyan">前 3 秒钩子</h2>
              <CopyButton text={fullScriptText} label="复制全部" />
            </div>
            <p className="rounded-xl bg-douyin-dark p-4 text-sm leading-relaxed">{script.hook}</p>

            <h2 className="mb-2 mt-5 font-semibold">分镜结构</h2>
            <ol className="space-y-2">
              {script.structure.map((s, i) => (
                <li
                  key={i}
                  className="flex gap-3 rounded-xl border border-douyin-border bg-douyin-dark/50 px-4 py-2.5 text-sm"
                >
                  <span className="font-mono text-douyin-cyan">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>

          <div className="space-y-4">
            <div className="glass-card p-5">
              <h2 className="font-semibold">结尾 CTA</h2>
              <p className="mt-2 text-sm text-gray-300">{script.cta}</p>
              <p className="mt-3 text-xs text-douyin-muted">
                建议时长：<strong className="text-white">{script.duration}</strong>
              </p>
            </div>
            <div className="glass-card p-5">
              <h2 className="font-semibold">拍摄 & 合规提示</h2>
              <ul className="mt-3 space-y-2">
                {script.tips.map((t, i) => (
                  <li key={i} className="flex gap-2 text-sm text-douyin-muted">
                    <span className="text-douyin-pink">•</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="glass-card p-4 text-xs text-douyin-muted">
        <strong className="text-gray-300">V1.0：</strong>规则引擎模拟 LLM（Mock）。观测指标：P2 创作效率、5
        秒完播率（L1）。V1.1 规划接入豆包/通义 API。
      </div>
    </div>
  );
}
