import { ArrowRight, PenLine, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { CopyButton } from "../components/CopyButton";
import { generateScript } from "../services/aiEngine";
import type { CreatorProfile, ScriptOutline, TopicSessionContext } from "../types";

export interface ScriptDraftPayload {
  title: string;
  body: string;
  description: string;
}

interface Props {
  profile: CreatorProfile;
  session: TopicSessionContext;
  selectedTopic: string;
  onGoTopic: () => void;
  onComplete: () => void;
  onScriptDraft: (draft: ScriptDraftPayload) => void;
}

export function CreatePage({
  profile,
  session,
  selectedTopic,
  onGoTopic,
  onComplete,
  onScriptDraft,
}: Props) {
  const [topic, setTopic] = useState(selectedTopic || "");
  const [script, setScript] = useState<ScriptOutline | null>(null);
  const [loading, setLoading] = useState(false);
  const [hookPicked, setHookPicked] = useState(false);

  useEffect(() => {
    if (selectedTopic) setTopic(selectedTopic);
  }, [selectedTopic]);

  const generate = () => {
    if (!topic.trim()) return;
    setLoading(true);
    setHookPicked(false);
    setTimeout(() => {
      const outline = generateScript(topic, profile, session);
      setScript(outline);
      setLoading(false);
      onComplete();
    }, 800);
  };

  const selectHook = (index: number) => {
    if (!script) return;
    const next = {
      ...script,
      selectedHookIndex: index,
      hook: script.hookOptions[index].text,
    };
    setScript(next);
    setHookPicked(true);
    const body = [
      `【钩子】${next.hook}`,
      "",
      "【分镜结构】",
      ...next.structure.map((s, i) => `${i + 1}. ${s}`),
      "",
      `【CTA】${next.cta}`,
    ].join("\n");
    onScriptDraft({
      title: topic.slice(0, 20),
      body,
      description: session.hasCommercial
        ? `#广告 本期为品牌合作，仅代表个人体验。${session.brief.sellingPoints}`
        : `#个人观点仅供参考 ${topic}`,
    });
  };

  const activeHook = script?.hookOptions[script.selectedHookIndex]?.text ?? script?.hook ?? "";

  const fullScriptText = script
    ? [
        `【钩子 · 优化5秒完播】${activeHook}`,
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
        <p className="mt-1 text-sm text-fg-muted">
          生成脚本框架 → 三选一钩子 → 分镜结构，目标提升 5 秒完播率
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
          className="min-w-[200px] flex-1 rounded-xl border border-line bg-muted px-4 py-2.5 text-sm outline-none focus:border-douyin-cyan"
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
              生成框架
            </>
          )}
        </button>
      </div>

      {loading && (
        <div className="glass-card flex h-32 items-center justify-center">
          <div className="space-y-2 text-center">
            <Sparkles className="mx-auto h-8 w-8 animate-pulse text-douyin-cyan" />
            <p className="text-xs text-fg-muted">正在按目标与 Brief 生成钩子选项…</p>
          </div>
        </div>
      )}

      {script && !loading && (
        <div className="space-y-4">
          <div className="glass-card p-5">
            <h2 className="mb-3 font-semibold text-douyin-cyan">前 3 秒钩子 · 三选一</h2>
            <div className="grid gap-3 md:grid-cols-3">
              {script.hookOptions.map((opt, i) => (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => selectHook(i)}
                  className={`rounded-xl border p-4 text-left text-sm transition ${
                    script.selectedHookIndex === i && hookPicked
                      ? "border-douyin-cyan bg-douyin-cyan/10 ring-1 ring-douyin-cyan/40"
                      : "border-line bg-muted/50 hover:border-fg-subtle"
                  }`}
                >
                  <span className="text-[10px] font-medium uppercase text-douyin-pink">{opt.type}</span>
                  <p className="mt-2 leading-relaxed">{opt.text}</p>
                </button>
              ))}
            </div>
            {!hookPicked && (
              <p className="mt-3 text-xs text-amber-400/90">请先选择一条钩子，再查看完整分镜结构</p>
            )}
          </div>

          {hookPicked && (
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="glass-card p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="font-semibold">分镜结构</h2>
                  <CopyButton text={fullScriptText} label="复制全部" />
                </div>
                <ol className="space-y-2">
                  {script.structure.map((s, i) => (
                    <li
                      key={i}
                      className="flex gap-3 rounded-xl border border-line bg-muted/50 px-4 py-2.5 text-sm"
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
                  <p className="mt-3 text-xs text-fg-muted">
                    建议时长：<strong className="text-fg">{script.duration}</strong>
                  </p>
                </div>
                <div className="glass-card p-5">
                  <h2 className="font-semibold">拍摄 & 合规提示</h2>
                  <ul className="mt-3 space-y-2">
                    {script.tips.map((t, i) => (
                      <li key={i} className="flex gap-2 text-sm text-fg-muted">
                        <span className="text-douyin-pink">•</span>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="glass-card p-4 text-xs text-fg-muted">
        <strong className="text-gray-300">V1.0：</strong>规则引擎 Mock 框架 + 三钩子模板。V1.1 接入 LLM 生成完整口播稿。
      </div>
    </div>
  );
}
