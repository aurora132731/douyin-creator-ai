import { useState } from "react";
import { ExternalLink, Rocket } from "lucide-react";
import { MarkdownDocViewer } from "../components/MarkdownDocViewer";
import { DOC_LINKS } from "../config/docLinks";
import prdContent from "../../../docs/PRD.md?raw";
import roadmapContent from "../../../docs/未来迭代方向.md?raw";

const CURRENT_VERSION_SUMMARY = `【本版 V2.0 实际交付】
· GitHub Pages 静态站，无后端
· AI：aiEngine.ts 规则模板（非大模型）
· 数据：mockData / diagnosisMock（非抖音 API）
· 已验证：全链路 UI、四段漏斗指标、作品诊断交互

【下一版关键接入】
· V1.1：豆包/通义 API + BFF（选题/脚本/诊断真生成）
· V1.2：抖音开放平台（真实作品与漏斗数据）`;

const SECTIONS = [
  {
    title: "0. 交付方案",
    content: `GitHub Pages + Mock · https://aurora132731.github.io/douyin-creator-ai/`,
  },
  {
    title: "1. 背景 & 目标",
    content: `覆盖 JD 全链路：选题→创作→发布→审核→成长→AI作品诊断`,
  },
  {
    title: "2. 用户分层",
    content: `新手：5秒完播+涨粉 | 成长期：完播+互动 | 头部：合规+IP`,
  },
  {
    title: "3. 功能 MVP",
    content: `F1选题 F2脚本 F3发布 F4合规 F5成长
F5+ AI作品诊断（抖音漏斗+小红书诊断交互）
F6指标看板 · 本页产品方案`,
  },
  {
    title: "4. 指标 V2",
    content: `【L1 抖音】作品详情四段漏斗
1流量转化 2开头吸引力 3互动 4内容深度

【P3公式】
5秒完播35%+全片完播30%+互动20%+CTR15%

【L2】P1留存 P2效率 P3质量 P4转化 P5诊断有效率 P6满意度`,
  },
  {
    title: "5. AI诊断机制【学小红书】",
    content: `先选作品 → 雷达 → 开始AI诊断 → 分维度解读
同类对标 · 现状/原因/建议`,
  },
];

function InlineDocLinks({
  onRead,
  readLabel,
  githubHref,
}: {
  onRead?: () => void;
  readLabel: string;
  githubHref?: string;
}) {
  return (
    <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-fg-muted">
      {onRead ? (
        <button
          type="button"
          onClick={onRead}
          className="text-douyin-cyan transition hover:text-douyin-pink hover:underline"
        >
          {readLabel}
        </button>
      ) : null}
      {onRead && githubHref ? <span className="text-fg-subtle">·</span> : null}
      {githubHref ? (
        <a
          href={githubHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 text-douyin-cyan transition hover:text-douyin-pink hover:underline"
        >
          GitHub 查看
          <ExternalLink className="h-3 w-3" />
        </a>
      ) : null}
    </p>
  );
}

type DocView = "summary" | "prd" | "roadmap";

export function PrdPage() {
  const [docView, setDocView] = useState<DocView>("summary");

  if (docView === "prd") {
    return (
      <MarkdownDocViewer
        title="创灵 · 产品需求文档（PRD V2）"
        content={prdContent}
        onBack={() => setDocView("summary")}
        backLabel="返回产品方案摘要"
      />
    );
  }

  if (docView === "roadmap") {
    return (
      <MarkdownDocViewer
        title="创灵 · 未来迭代方向"
        content={roadmapContent}
        onBack={() => setDocView("summary")}
        backLabel="返回产品方案摘要"
      />
    );
  }

  return (
    <div className="animate-slide-up space-y-6">
      <header>
        <h1 className="text-xl font-bold">产品方案（PRD V2 摘要）</h1>
        <p className="mt-1 text-sm text-fg-muted">
          抖音指标口径 · 小红书 AI 诊断形态 · JD 对齐
        </p>
        <InlineDocLinks
          onRead={() => setDocView("prd")}
          readLabel="完整 PRD"
          githubHref={DOC_LINKS.prd.github}
        />
      </header>

      <div className="glass-card border-douyin-pink/20 bg-gradient-to-br from-douyin-pink/10 to-transparent p-5">
        <h2 className="font-semibold">与岗位的匹配点</h2>
        <ul className="mt-3 grid gap-2 text-sm text-fg-muted sm:grid-cols-2">
          {[
            "抖音作品数据详情四段漏斗",
            "小红书式 AI 诊断（现状/原因/建议）",
            "P3 公式含权重原理与参考来源",
            "P5 AI 诊断有效率（分维度对标）",
            "全链路 + 数据驱动 A/B",
            "GitHub Pages 可演示",
          ].map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-douyin-cyan">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        {SECTIONS.map((s) => (
          <div key={s.title} className="glass-card p-5">
            <h2 className="mb-3 font-semibold text-douyin-cyan">{s.title}</h2>
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-fg-muted">
              {s.content}
            </pre>
          </div>
        ))}

        <div className="glass-card border-douyin-cyan/15 bg-gradient-to-br from-douyin-cyan/8 to-transparent p-5">
          <h2 className="flex items-center gap-2 font-semibold">
            <Rocket className="h-4 w-4 text-douyin-cyan" />
            6. 未来迭代方向（本版实际 vs 待接入）
          </h2>
          <InlineDocLinks
            onRead={() => setDocView("roadmap")}
            readLabel="完整迭代方案"
          />
          <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-relaxed text-fg-muted">
            {CURRENT_VERSION_SUMMARY}
          </pre>
          <p className="mt-2 text-[11px] text-fg-subtle">
            含分模块 Mock 边界、V1.1 大模型、V1.2 抖音 API、面试 30 秒话术
          </p>
        </div>
      </div>
    </div>
  );
}
