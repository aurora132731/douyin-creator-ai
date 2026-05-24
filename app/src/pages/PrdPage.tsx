const SECTIONS = [
  {
    title: "0. 交付方案（面试版）",
    content: `已锁定：Gitee Pages 静态托管 + 前端 Mock（无后端/无真 API）

• 部署：npm run build → gh-pages → Gitee Pages
• AI：规则引擎模拟（aiEngine.ts）
• 数据：mockData + localStorage
• 文档：docs/PRD.md、docs/面试部署清单.md、docs/面试讲稿.md

为何：1 天内验证链路、指标、交互；V1.1 真 LLM，V1.2 抖音数据。`,
  },
  {
    title: "1. 背景 & 目标",
    content: `抖音创作者面临「选题难、创作慢、违规风险高、复盘无方向」四大痛点。

「创灵」用 AI 贯穿全链路：选题 → 创作 → 发布 → 审核 → 成长，对齐字节 AI 产品运营（创作者运营）岗位 JD。

产品目标：
• 降低选题到发布准备的决策成本
• 用 L1 平台指标验证 AI 是否帮创作者做出更好内容
• 用 L2 产品指标驱动工具迭代`,
  },
  {
    title: "2. 用户画像 & 分层策略",
    content: `新手（<1万粉）：5秒完播、投稿数、涨粉 → 低竞争选题 + 短脚本
成长期（1-50万）：完播率、互动率、系列化 → 悬念结构 + 数据复盘
头部（50万+）：互动指数、商业合规 → IP延展 + 严格合规预检`,
  },
  {
    title: "3. 核心功能（MVP）",
    content: `F1 AI 智能选题 — 垂类 × 阶段个性化推荐
F2 AI 脚本助手 — 钩子/分镜/CTA（优化 5秒完播、2秒跳出）
F3 发布助手 — 检查清单 + 最佳时段（对标快手活跃时段）
F4 合规预检 — 敏感词/绝对化扫描
F5 成长复盘 — 涨粉/互动诊断 + 行动建议
F6 指标看板 — L1 平台指标 + L2 产品指标 + A/B
F7 PRD 展示 — 完整文档 docs/PRD.md`,
  },
  {
    title: "4. 核心指标（双层体系）",
    content: `【L1 内容结果 — 验证 AI 是否帮内容变好】
抖音（主）：播放量、完播率、5秒完播、2秒跳出、涨粉量、流量来源
小红书（对标）：曝光、CTR、5秒播放率、互动率
快手（对标）：播放完成率、粉丝活跃时段、互动转化率

【L2 AI 产品 — 对齐 JD，验证工具可迭代】
P1 创作者留存 D7 ≥45%
P2 创作效率 -30%（选题→发布准备耗时）
P3 内容质量 ≥70（5秒完播40%+完播35%+互动25%）
P4 成长转化 +10%（7日粉丝净增）
P5 AI准确率 ≥80%（采纳且 L1 正向）
P6 满意度 ≥4.0/5`,
  },
  {
    title: "5. A/B 实验（平台指标当裁判）",
    content: `EXP-01 钩子模板：痛点型 vs 悬念型 → 主指标：5秒完播（抖音）
EXP-02 选题展示：卡片 vs 列表 → 选题采纳率
EXP-03 发布时段：AI推荐 vs 固定晚8点 → 1h播放量（快手时段对标）
EXP-04 合规预检：无 vs 有 → 违规率下降
护栏：CTR 提升时完播不得显著下降（小红书漏斗经验）`,
  },
  {
    title: "6. 迭代路线图",
    content: `V1.0（当前）：规则引擎 + Mock，验证交互与全链路
V1.1：接入豆包/通义 API，真实 LLM 生成
V1.2：抖音开放平台，L1 真实指标回流
V2.0：搜索词选题、进度条掉点分析、A/B 平台化`,
  },
  {
    title: "7. 风险 & 合规",
    content: `• AI 幻觉：脚本标注「仅供参考」
• 合规漏检：非法务工具，词库需运营更新
• 指标口径：UI/文档标注参考平台，演示数据为 Mock
• 非官方产品：页脚注明，不代表字节立场`,
  },
];

export function PrdPage() {
  return (
    <div className="animate-slide-up space-y-6">
      <header>
        <h1 className="text-xl font-bold">产品方案（PRD 摘要）</h1>
        <p className="mt-1 text-sm text-douyin-muted">
          用户洞察 → 方案设计 → 双层指标（L1 平台 + L2 产品）→ A/B 验证 → 迭代规划
        </p>
      </header>

      <div className="glass-card border-douyin-pink/20 bg-gradient-to-br from-douyin-pink/10 to-transparent p-5">
        <h2 className="font-semibold">与岗位的匹配点</h2>
        <ul className="mt-3 grid gap-2 text-sm text-douyin-muted sm:grid-cols-2">
          {[
            "创作者全链路 AI 产品规划",
            "阶段 × 垂类个性化机制",
            "L1 平台指标 + L2 产品指标双层体系",
            "抖音/小红书/快手指标对标与来源标注",
            "A/B 实验（平台原生指标当裁判）",
            "内容安全与合规预检",
            "可落地 MVP + 清晰路线图",
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
        <strong className="text-white">完整 PRD（V1.1）</strong> 见{" "}
        <code className="rounded bg-douyin-dark px-1.5 py-0.5 text-douyin-cyan">docs/PRD.md</code>
        <p className="mt-2 text-xs leading-relaxed">
          含交付方案、功能详述、AC 验收、Gitee Pages 部署、指标公式。配套：docs/面试部署清单.md、docs/面试讲稿.md。演示为
          Mock，非官方产品。
        </p>
      </div>
    </div>
  );
}
