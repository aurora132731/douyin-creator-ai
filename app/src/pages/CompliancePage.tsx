import { AlertTriangle, CheckCircle, Shield, XCircle } from "lucide-react";
import { useState } from "react";
import { checkCompliance } from "../services/aiEngine";
import type { ComplianceResult } from "../types";

interface Props {
  onComplete: () => void;
}

const SAMPLE_TEXT =
  "这是全网第一好用的减脂方法，7天根治肥胖，保证你暴富式瘦身！国家级认证配方。";

export function CompliancePage({ onComplete }: Props) {
  const [text, setText] = useState("");
  const [result, setResult] = useState<ComplianceResult | null>(null);
  const [emptyHint, setEmptyHint] = useState(false);

  const runCheck = (input: string) => {
    if (!input.trim()) {
      setEmptyHint(true);
      setResult(null);
      return;
    }
    setEmptyHint(false);
    const r = checkCompliance(input);
    setResult(r);
    if (r.passed) onComplete();
  };

  return (
    <div className="animate-slide-up space-y-6">
      <header>
        <h1 className="flex items-center gap-2 text-xl font-bold">
          <Shield className="h-6 w-6 text-douyin-cyan" />
          内容合规预检
        </h1>
        <p className="mt-1 text-sm text-douyin-muted">
          发布前扫描敏感词、绝对化表述、违规承诺 — 对应 JD「内容安全与合规」（辅助工具，非法务终审）
        </p>
      </header>

      <div className="glass-card p-5">
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (emptyHint) setEmptyHint(false);
          }}
          placeholder="粘贴视频文案、标题、口播稿…"
          rows={5}
          className="w-full resize-none rounded-xl border border-douyin-border bg-douyin-dark px-4 py-3 text-sm outline-none focus:border-douyin-cyan"
        />
        {emptyHint && (
          <p className="mt-2 text-xs text-red-400">请先输入或粘贴待检测文案</p>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={() => runCheck(text)} className="btn-primary">
            开始合规检测
          </button>
          <button
            type="button"
            onClick={() => {
              setText(SAMPLE_TEXT);
              runCheck(SAMPLE_TEXT);
            }}
            className="btn-ghost"
          >
            加载违规样例
          </button>
          <button
            type="button"
            onClick={() => runCheck("我觉得这个减脂餐搭配还不错，亲测一周，仅供参考。")}
            className="btn-ghost text-xs"
          >
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
                <div className="text-sm text-douyin-muted">
                  {result.passed ? "通过，可以进入发布流程" : "存在高风险，建议修改后发布"}
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
                    key={r.word}
                    className="flex items-start gap-2 rounded-xl border border-douyin-border bg-douyin-dark/50 p-3 text-sm"
                  >
                    <AlertTriangle
                      className={`mt-0.5 h-4 w-4 shrink-0 ${
                        r.level === "高" ? "text-red-400" : "text-amber-400"
                      }`}
                    />
                    <div>
                      <span className="font-medium text-red-300">「{r.word}」</span>
                      <span className="ml-2 text-xs text-douyin-muted">风险{r.level}</span>
                      <p className="mt-1 text-xs text-douyin-muted">{r.suggestion}</p>
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
                <li key={i} className="flex gap-2 text-sm text-douyin-muted">
                  <span className="text-douyin-cyan">✓</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="glass-card p-4 text-xs text-douyin-muted">
        <strong className="text-gray-300">A/B 参考：</strong>
        合规预检组违规驳回率相对下降 34%（演示数据）。F4 采纳率通常最高（见指标页）。
      </div>
    </div>
  );
}
