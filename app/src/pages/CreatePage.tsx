import { ArrowRight, PenLine, RefreshCw, Shield, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CopyButton } from "../components/CopyButton";
import {
  assembleScriptBody,
  generateFullScriptBeats,
  generateScript,
  refreshSingleBeat,
} from "../services/aiEngine";
import type { CreatorProfile, ScriptBeatDraft, ScriptOutline, TopicSessionContext } from "../types";

export interface ScriptDraftPayload {
  topic: string;
  title: string;
  hook: string;
  hookType: string;
  beats: ScriptBeatDraft[];
  ctaOptions: string[];
  ctaSelectedIndex: number;
  duration: string;
  tips: string[];
  body: string;
  description: string;
}

interface Props {
  profile: CreatorProfile;
  session: TopicSessionContext;
  selectedTopic: string;
  onGoTopic: () => void;
  onGoCompliance: () => void;
  onComplete: () => void;
  onScriptDraft: (draft: ScriptDraftPayload) => void;
}

function buildDescription(topic: string, session: TopicSessionContext): string {
  return session.hasCommercial
    ? `#广告 本期为品牌合作，仅代表个人体验。${session.brief.sellingPoints}`
    : `#个人观点仅供参考 ${topic}`;
}

export function CreatePage({
  profile,
  session,
  selectedTopic,
  onGoTopic,
  onGoCompliance,
  onComplete,
  onScriptDraft,
}: Props) {
  const [topic, setTopic] = useState(selectedTopic || "");
  const [script, setScript] = useState<ScriptOutline | null>(null);
  const [loading, setLoading] = useState(false);
  const [hookPicked, setHookPicked] = useState(false);
  const [scriptLoading, setScriptLoading] = useState(false);
  const [beats, setBeats] = useState<ScriptBeatDraft[]>([]);
  const [ctaOptions, setCtaOptions] = useState<string[]>([]);
  const [ctaSelectedIndex, setCtaSelectedIndex] = useState(0);
  const [scriptReady, setScriptReady] = useState(false);
  const [beatRefreshSeeds, setBeatRefreshSeeds] = useState<number[]>([]);
  const [ctaRefreshSeed, setCtaRefreshSeed] = useState(0);

  useEffect(() => {
    if (selectedTopic) setTopic(selectedTopic);
  }, [selectedTopic]);

  const activeHook = script?.hookOptions[script.selectedHookIndex]?.text ?? script?.hook ?? "";
  const activeHookType = script?.hookOptions[script.selectedHookIndex]?.type ?? "";

  const selectedCta = ctaOptions[ctaSelectedIndex] ?? script?.cta ?? "";

  const previewBody = useMemo(() => {
    if (!scriptReady || beats.length === 0) return "";
    return assembleScriptBody(activeHook, beats, selectedCta);
  }, [scriptReady, beats, activeHook, selectedCta]);

  const generate = () => {
    if (!topic.trim()) return;
    setLoading(true);
    setHookPicked(false);
    setScriptReady(false);
    setBeats([]);
    setTimeout(() => {
      setScript(generateScript(topic, profile, session));
      setLoading(false);
      onComplete();
    }, 800);
  };

  const selectHook = (index: number) => {
    if (!script) return;
    setScript({
      ...script,
      selectedHookIndex: index,
      hook: script.hookOptions[index].text,
    });
    setHookPicked(true);
    setScriptReady(false);
    setBeats([]);
  };

  const generateScriptContent = () => {
    if (!script || !hookPicked) return;
    setScriptLoading(true);
    setTimeout(() => {
      const hook = script.hookOptions[script.selectedHookIndex].text;
      const generated = generateFullScriptBeats(topic, hook, script, profile, session, 0);
      setBeats(
        generated.beats.map((b) => ({
          framework: b.framework,
          options: b.options,
          selectedIndex: 0,
        }))
      );
      setCtaOptions(generated.ctaOptions);
      setCtaSelectedIndex(0);
      setBeatRefreshSeeds(generated.beats.map(() => 0));
      setCtaRefreshSeed(0);
      setScriptReady(true);
      setScriptLoading(false);
    }, 900);
  };

  const refreshBeat = (beatIndex: number) => {
    if (!script) return;
    const hook = script.hookOptions[script.selectedHookIndex].text;
    const nextSeed = (beatRefreshSeeds[beatIndex] ?? 0) + 1;
    const options = refreshSingleBeat(
      topic,
      hook,
      beats[beatIndex].framework,
      profile,
      session,
      beatIndex,
      nextSeed
    );
    setBeatRefreshSeeds((prev) => {
      const next = [...prev];
      next[beatIndex] = nextSeed;
      return next;
    });
    setBeats((prev) =>
      prev.map((b, i) =>
        i === beatIndex ? { ...b, options, selectedIndex: 0 } : b
      )
    );
  };

  const refreshCta = () => {
    if (!script) return;
    const hook = script.hookOptions[script.selectedHookIndex].text;
    const nextSeed = ctaRefreshSeed + 1;
    const generated = generateFullScriptBeats(topic, hook, script, profile, session, nextSeed);
    setCtaOptions(generated.ctaOptions);
    setCtaSelectedIndex(0);
    setCtaRefreshSeed(nextSeed);
  };

  const allBeatsSelected = beats.length > 0 && beats.every((b) => b.selectedIndex >= 0);
  const canGoCompliance = scriptReady && allBeatsSelected && ctaOptions.length > 0;

  const confirmToCompliance = () => {
    if (!script || !canGoCompliance) return;
    const hook = script.hookOptions[script.selectedHookIndex].text;
    const hookType = script.hookOptions[script.selectedHookIndex].type;
    const body = assembleScriptBody(hook, beats, selectedCta);
    const draft: ScriptDraftPayload = {
      topic,
      title: topic.slice(0, 24),
      hook,
      hookType,
      beats,
      ctaOptions,
      ctaSelectedIndex,
      duration: script.duration,
      tips: script.tips,
      body,
      description: buildDescription(topic, session),
    };
    onScriptDraft(draft);
    onGoCompliance();
  };

  const fullScriptText = script
    ? scriptReady
      ? `${previewBody}\n\n【建议时长】${script.duration}\n\n【拍摄提示】\n${script.tips.map((t) => `• ${t}`).join("\n")}`
      : [
          `【钩子】${activeHook}`,
          "",
          "【分镜框架】",
          ...script.structure.map((s, i) => `${i + 1}. ${s}`),
          "",
          `【CTA 框架】${script.cta}`,
        ].join("\n")
    : "";

  return (
    <div className="animate-slide-up space-y-6">
      <header>
        <h1 className="text-xl font-bold">AI 创作助手</h1>
        <p className="mt-1 text-sm text-fg-muted">
          框架 → 三选一钩子 → 生成口播脚本（每环节三版可刷新）→ 合规预检
        </p>
      </header>

      {selectedTopic && (
        <div className="glass-card border-douyin-cyan/25 bg-douyin-cyan/10 p-4">
          <p className="text-sm text-fg">
            已采纳选题：<strong className="text-douyin-cyan">{selectedTopic}</strong>
            <span className="text-fg-muted"> · 可点击下方「生成框架」开始创作</span>
          </p>
        </div>
      )}

      {!selectedTopic && (
        <div className="glass-card flex flex-wrap items-center justify-between gap-3 border-amber-500/30 bg-amber-500/10 p-4 dark:border-amber-500/20 dark:bg-amber-500/5">
          <p className="text-sm text-amber-800 dark:text-amber-200/90">
            尚未从选题页采纳选题，可先手动输入或去选题页选择。
          </p>
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
          <Sparkles className="mx-auto h-8 w-8 animate-pulse text-douyin-cyan" />
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
                  className={`rounded-xl border p-4 text-left text-sm text-fg transition ${
                    script.selectedHookIndex === i && hookPicked
                      ? "border-douyin-cyan bg-douyin-cyan/10 ring-1 ring-douyin-cyan/40"
                      : "border-line bg-muted hover:border-fg-subtle hover:bg-inset"
                  }`}
                >
                  <span className="text-[10px] font-medium uppercase text-douyin-pink">{opt.type}</span>
                  <p className="mt-2 leading-relaxed">{opt.text}</p>
                </button>
              ))}
            </div>
          </div>

          {hookPicked && (
            <>
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="glass-card p-5">
                  <h2 className="mb-3 font-semibold">分镜框架</h2>
                  <ol className="space-y-2">
                    {script.structure.map((s, i) => (
                      <li
                        key={i}
                        className="flex gap-3 rounded-xl border border-line bg-muted px-4 py-2.5 text-sm text-fg"
                      >
                        <span className="font-mono text-douyin-cyan">{i + 1}</span>
                        {s}
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="space-y-4">
                  <div className="glass-card p-5">
                    <h2 className="font-semibold">结尾 CTA · 框架</h2>
                    <p className="mt-2 text-sm text-fg-muted">{script.cta}</p>
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

              {!scriptReady && (
                <div className="glass-card border-douyin-cyan/20 p-5 text-center">
                  <p className="mb-4 text-sm text-fg-muted">
                    已选钩子 · <strong className="text-fg">{activeHookType}</strong>。点击下方生成<strong className="text-fg">完整口播稿</strong>，每段 3 版可换，看着念即可。
                  </p>
                  <button
                    type="button"
                    onClick={generateScriptContent}
                    disabled={scriptLoading}
                    className="btn-primary inline-flex items-center gap-2 px-8 py-3 disabled:opacity-50"
                  >
                    {scriptLoading ? (
                      <>
                        <Sparkles className="h-4 w-4 animate-spin" />
                        正在生成脚本…
                      </>
                    ) : (
                      <>
                        <PenLine className="h-4 w-4" />
                        生成脚本
                      </>
                    )}
                  </button>
                </div>
              )}

              {scriptReady && (
                <div className="space-y-4">
                  <div className="glass-card p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="font-semibold text-douyin-cyan">完整口播稿 · 每段三选一（看着念）</h2>
                      <CopyButton text={fullScriptText} label="复制口播稿" />
                    </div>

                    {beats.map((beat, beatIndex) => (
                      <div
                        key={beat.framework}
                        className="mb-5 border-b border-line-subtle pb-5 last:mb-0 last:border-0 last:pb-0"
                      >
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <span className="text-xs font-medium text-douyin-pink">
                            {beat.framework}
                          </span>
                          <button
                            type="button"
                            onClick={() => refreshBeat(beatIndex)}
                            className="btn-ghost flex items-center gap-1 px-2 py-1 text-[10px]"
                          >
                            <RefreshCw className="h-3 w-3" />
                            换一批
                          </button>
                        </div>
                        <div className="grid gap-2 md:grid-cols-3">
                          {beat.options.map((opt, optIndex) => (
                            <button
                              key={`${beatIndex}-${optIndex}-${opt.slice(0, 12)}`}
                              type="button"
                              onClick={() =>
                                setBeats((prev) =>
                                  prev.map((b, i) =>
                                    i === beatIndex ? { ...b, selectedIndex: optIndex } : b
                                  )
                                )
                              }
                              className={`rounded-xl border p-3 text-left text-xs leading-relaxed text-fg transition ${
                                beat.selectedIndex === optIndex
                                  ? "border-douyin-cyan bg-douyin-cyan/10 ring-1 ring-douyin-cyan/40"
                                  : "border-line bg-muted hover:border-fg-subtle hover:bg-inset"
                              }`}
                            >
                              <span className="text-[10px] text-fg-muted">版本 {optIndex + 1}</span>
                              <p className="mt-1">{opt}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}

                    <div className="mt-4 border-t border-line-subtle pt-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-medium text-douyin-pink">结尾 CTA · 三选一</span>
                        <button
                          type="button"
                          onClick={refreshCta}
                          className="btn-ghost flex items-center gap-1 px-2 py-1 text-[10px]"
                        >
                          <RefreshCw className="h-3 w-3" />
                          换一批
                        </button>
                      </div>
                      <div className="grid gap-2 md:grid-cols-3">
                        {ctaOptions.map((opt, i) => (
                          <button
                            key={`cta-${i}-${opt.slice(0, 8)}`}
                            type="button"
                            onClick={() => setCtaSelectedIndex(i)}
                            className={`rounded-xl border p-3 text-left text-xs text-fg transition ${
                              ctaSelectedIndex === i
                                ? "border-douyin-cyan bg-douyin-cyan/10 ring-1 ring-douyin-cyan/40"
                                : "border-line bg-muted hover:border-fg-subtle hover:bg-inset"
                            }`}
                          >
                            版本 {i + 1} · {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-line bg-muted p-5">
                    <h3 className="mb-3 text-sm font-semibold text-fg">
                      口播稿预览（由上方脚本自动组装）
                    </h3>
                    <div className="rounded-lg border border-line-subtle bg-inset p-4">
                      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-fg">
                        {previewBody}
                      </pre>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={confirmToCompliance}
                    disabled={!canGoCompliance}
                    className="btn-primary flex w-full items-center justify-center gap-2 py-3 disabled:opacity-50"
                  >
                    <Shield className="h-4 w-4" />
                    确认脚本，进入合规预检
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <div className="glass-card p-4 text-xs text-fg-muted">
        <strong className="text-fg">V1.0：</strong>基于分镜框架生成<strong className="text-fg">可直念口播稿</strong>（非拍摄指令）；每段三版可刷新。V1.1 接入 LLM。
      </div>
    </div>
  );
}
