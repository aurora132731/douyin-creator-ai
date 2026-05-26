import { AlertTriangle, CheckCircle, Shield, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { checkCompliance } from "../services/aiEngine";
import type { ComplianceResult, TopicSessionContext } from "../types";
import type { ScriptDraftPayload } from "./CreatePage";

interface Props {
  session: TopicSessionContext;
  upstreamDraft?: ScriptDraftPayload;
  onComplete: () => void;
}

const SAMPLE = {
  title: "全网第一减脂法，7天根治肥胖",
  body: "这是全网第一好用的减脂方法，7天根治肥胖，保证你暴富式瘦身！国家级认证配方。",
  description: "国家级认证，保证效果，暴富式瘦身",
};

export function CompliancePage({ session, upstreamDraft, onComplete }: Props) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [description, setDescription] = useState("");
  const [result, setResult] = useState<ComplianceResult | null>(null);
  const [emptyHint, setEmptyHint] = useState(false);

  useEffect(() => {
    if (upstreamDraft && !title && !body) {
      setTitle(upstreamDraft.title);
      setBody(upstreamDraft.body);
      setDescription(upstreamDraft.description);
    }
  }, [upstreamDraft]);

  const combinedText = [title, body, description].filter(Boolean).join("\n");

  const runCheck = () => {
    if (!combinedText.trim()) {
      setEmptyHint(true);
      setResult(null);
      return;
    }
    setEmptyHint(false);
    const r = checkCompliance(combinedText, {
      hasCommercial: session.hasCommercial,
      brief: session.brief,
    });
    setResult(r);
    if (r.passed) onComplete();
  };

  const loadSample = (pass: boolean) => {
    if (pass) {
      const t = "亲测一周减脂餐搭配";
      const b = "我觉得这个减脂餐搭配还不错，亲测一周，仅供参考。";
      const d = session.hasCommercial ? "#广告 合作内容，仅代表个人体验" : "#个人观点仅供参考";
      setTitle(t);
      setBody(b);
      setDescription(d);
      setTimeout(() => {
        const r = checkCompliance([t, b, d].join("\n"), {
          hasCommercial: session.hasCommercial,
          brief: session.brief,
        });
        setResult(r);
        if (r.passed) onComplete();
      }, 0);
    } else {
      setTitle(SAMPLE.title);
      setBody(SAMPLE.body);
      setDescription(SAMPLE.description);
      setTimeout(() => {
        const r = checkCompliance([SAMPLE.title, SAMPLE.body, SAMPLE.description].join("\n"), {
          hasCommercial: session.hasCommercial,
          brief: session.brief,
        });
        setResult(r);
      }, 0);
    }
    setEmptyHint(false);
  };

  return (
    <div className="animate-slide-up space-y-6">
      <header>
        <h1 className="flex items-center gap-2 text-xl font-bold">
          <Shield className="h-6 w-6 text-douyin-cyan" />
          内容合规预检
        </h1>
        <p className="mt-1 text-sm text-fg-muted">
          发布前扫描标题、口播稿、简介 — 对应 JD「内容安全与合规」（辅助工具，非法务终审）
        </p>
        {session.hasCommercial && (
          <p className="mt-2 text-xs text-douyin-pink">商单模式：请确保简介/口播含 #广告 或合作声明</p>
        )}
      </header>

      <div className="glass-card space-y-4 p-5">
        <label className="block">
          <span className="text-xs text-fg-muted">视频标题</span>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (emptyHint) setEmptyHint(false);
            }}
            placeholder="标题文案…"
            className="mt-1 w-full rounded-xl border border-line bg-muted px-4 py-2.5 text-sm outline-none focus:border-douyin-cyan"
          />
        </label>
        <label className="block">
          <span className="text-xs text-fg-muted">口播稿 / 正文</span>
          <textarea
            value={body}
            onChange={(e) => {
              setBody(e.target.value);
              if (emptyHint) setEmptyHint(false);
            }}
            placeholder="口播正文…"
            rows={4}
            className="mt-1 w-full resize-none rounded-xl border border-line bg-muted px-4 py-3 text-sm outline-none focus:border-douyin-cyan"
          />
        </label>
        <label className="block">
          <span className="text-xs text-fg-muted">视频简介 / 描述</span>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (emptyHint) setEmptyHint(false);
            }}
            placeholder={session.hasCommercial ? "建议含 #广告 …" : "简介、话题、免责声明…"}
            rows={2}
            className="mt-1 w-full resize-none rounded-xl border border-line bg-muted px-4 py-3 text-sm outline-none focus:border-douyin-cyan"
          />
        </label>
        {emptyHint && <p className="text-xs text-red-400">请至少填写一项待检测文案</p>}
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={runCheck} className="btn-primary">
            开始合规检测
          </button>
          <button type="button" onClick={() => loadSample(false)} className="btn-ghost">
            加载违规样例
          </button>
          <button type="button" onClick={() => loadSample(true)} className="btn-ghost text-xs">
            加载通过样例
          </button>
        </div>
      </div>

      {result && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div
            className={`glass-card p-5 ${
              result.passed ? "border-green-500/30" : "border-red-500/30"
            }`}
          >
            <div className="flex items-center gap-3">
              {result.passed ? (
                <CheckCircle className="h-10 w-10 text-green-400" />
              ) : (
                <XCircle className="h-10 w-10 text-red-400" />
              )}
              <div>
                <div className="text-2xl font-bold">{result.score} 分</div>
                <div className="text-sm text-fg-muted">
                  {result.passed ? "通过，可进入发布助手" : "存在高风险，建议修改后发布"}
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-5">
            <h2 className="mb-3 font-semibold">风险词检测</h2>
            {result.risks.length === 0 ? (
              <p className="text-sm text-green-400">未检测到敏感词 ✓</p>
            ) : (
              <div className="space-y-2">
                {result.risks.map((r) => (
                  <div
                    key={`${r.word}-${r.suggestion}`}
                    className="flex items-start gap-2 rounded-xl border border-line bg-muted/50 p-3 text-sm"
                  >
                    <AlertTriangle
                      className={`mt-0.5 h-4 w-4 shrink-0 ${
                        r.level === "高" ? "text-red-400" : "text-amber-400"
                      }`}
                    />
                    <div>
                      <span className="font-medium text-red-300">「{r.word}」</span>
                      <span className="ml-2 text-xs text-fg-muted">风险{r.level}</span>
                      <p className="mt-1 text-xs text-fg-muted">{r.suggestion}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass-card p-5 lg:col-span-2">
            <h2 className="mb-3 font-semibold">合规建议</h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {result.suggestions.map((s, i) => (
                <li key={i} className="flex gap-2 text-sm text-fg-muted">
                  <span className="text-douyin-cyan">✓</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="glass-card p-4 text-xs text-fg-muted">
        <strong className="text-gray-300">流程位置：</strong>
        创作 → <strong className="text-fg">合规</strong> → 发布。平台会在上传后做视频审核，本页仅做文案预检。
      </div>
    </div>
  );
}
