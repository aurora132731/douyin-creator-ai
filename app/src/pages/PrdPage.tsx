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
F6指标看板 F7 PRD`,
  },
  {
    title: "4. 指标 V2",
    content: `【L1 抖音】作品详情四段漏斗
1流量转化 2开头吸引力 3互动 4内容深度

【P3公式】
5秒完播35%+全片完播30%+互动20%+CTR15%
（权重原理见 PRD §6.4）

【L2】P1留存 P2效率 P3质量 P4转化
P5诊断有效率 P6满意度`,
  },
  {
    title: "5. AI诊断机制【学小红书】",
    content: `同类中位数对标 · 较好/待提升
现状→原因分析→建议（弹窗）
入口：开始诊断 · 分维度解读`,
  },
  {
    title: "6. 路线图",
    content: `V2当前：诊断+漏斗
V1.1 LLM V1.2 抖音数据`,
  },
];

export function PrdPage() {
  return (
    <div className="animate-slide-up space-y-6">
      <header>
        <h1 className="text-xl font-bold">产品方案（PRD V2 摘要）</h1>
        <p className="mt-1 text-sm text-douyin-muted">
          抖音指标口径 · 小红书 AI 诊断形态 · JD 对齐
        </p>
      </header>

      <div className="glass-card border-douyin-pink/20 bg-gradient-to-br from-douyin-pink/10 to-transparent p-5">
        <h2 className="font-semibold">与岗位的匹配点</h2>
        <ul className="mt-3 grid gap-2 text-sm text-douyin-muted sm:grid-cols-2">
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
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-douyin-muted">
              {s.content}
            </pre>
          </div>
        ))}
      </div>

      <div className="glass-card p-5 text-sm text-douyin-muted">
        <strong className="text-white">完整 PRD（V2）</strong>{" "}
        <code className="text-douyin-cyan">docs/PRD.md</code>
      </div>
    </div>
  );
}
