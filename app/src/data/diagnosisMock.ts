import type { CreatorProfile, DiagnosisDimension, WorkDiagnosisSummary } from "../types";

/** 抖音作品数据详情 · 四段漏斗（总览 Tab） */
export const DOUYIN_FUNNEL_SEGMENTS = [
  { segment: 1, title: "流量转化", tip: "优化封面标题，提升观看转化" },
  { segment: 2, title: "开头吸引力", tip: "把握视频节奏，留下更多观众" },
  { segment: 3, title: "互动表现", tip: "创造互动场景，引发观众互动" },
  { segment: 4, title: "内容深度", tip: "增加内容价值，带来更多涨粉" },
] as const;

/** P3 内容质量分 · 权重原理（V2） */
export const P3_QUALITY_FORMULA = {
  title: "P3 内容质量综合分",
  expression:
    "质量分 = 5秒完播率×35% + 全片完播率×30% + 互动率×20% + 封面点击率×15%",
  normalize:
    "各指标先按「同类创作者」分布做 min-max 归一化到 0–100 分，再加权求和（避免量纲不同直接相加）",
  weights: [
    {
      pct: "35%",
      metric: "5秒完播率",
      source: "抖音 · 作品数据详情 §开头吸引力",
      rationale:
        "推荐流冷启动最先验证「前 5 秒是否留住人」；与 F2 脚本钩子直接对应，权重最高。",
    },
    {
      pct: "30%",
      metric: "全片完播率",
      source: "抖音 · 作品数据详情 §内容深度",
      rationale:
        "决定作品能否进入更高流量池；对应中段节奏与信息密度，仅次于开头。",
    },
    {
      pct: "20%",
      metric: "互动率",
      source: "抖音 · 作品数据详情 §互动表现",
      rationale:
        "点赞/评论/分享反映共鸣；JD「内容质量」含互动维度，但需防刷互动故低于完播。",
    },
    {
      pct: "15%",
      metric: "封面点击率",
      source: "抖音 · 作品数据详情 §流量转化",
      rationale:
        "入口效率；借鉴小红书「高曝低完播」护栏思路——单独拉高 CTR 可能标题党，故权重最低且与完播联动观测。",
    },
  ],
  xhsReference:
    "诊断交互借鉴小红书「笔记诊断」：同类中位数对标 + 现状/原因/建议三段式；指标口径以抖音为准。",
};

export function buildWorkSummary(profile: CreatorProfile): WorkDiagnosisSummary {
  const titles: Record<string, string> = {
    美食: "3分钟懒人早餐实测",
    美妆: "黄皮早八伪素颜跟练",
    知识: "AI工具提效1分钟说清",
    剧情: "职场反转短剧·第3集",
    旅行: "周末城市漫步vlog",
    健身: "7分钟居家燃脂跟练",
  };
  return {
    workTitle: titles[profile.vertical] ?? "近期代表作品",
    workDate: "05-08 发布",
    views: profile.stage === "new" ? 1280 : profile.stage === "growing" ? 4860 : 21800,
    likes: profile.stage === "new" ? 42 : 186,
    comments: profile.stage === "new" ? 8 : 23,
    weakestDimensionId: profile.stage === "new" ? "hook" : "engagement",
    trafficSource: [
      { name: "推荐", percent: 56 },
      { name: "搜索", percent: 12 },
      { name: "关注", percent: 18 },
      { name: "同城", percent: 9 },
      { name: "其他", percent: 5 },
    ],
    audienceInsight:
      profile.stage === "new"
        ? "新用户占比偏低（12%），建议加强推荐流选题与破圈标签。"
        : "老用户占比 68%，可尝试系列化提升复访，同时用搜索型选题拉新。",
  };
}

export function buildDiagnosisDimensions(
  profile: CreatorProfile
): DiagnosisDimension[] {
  const v = profile.vertical;
  return [
    {
      id: "traffic",
      title: "流量转化",
      segment: 1,
      segmentTip: DOUYIN_FUNNEL_SEGMENTS[0].tip,
      status: "good",
      metricLabel: "封面点击率",
      metricValue: "13.1%",
      median: "10.7%",
      exceedPercent: "超 70% 同类",
      situation:
        "封面点击率优于多数同类作品，说明标题与封面在双列流中具备点击吸引力。",
      cause: `「${v}」垂类下，封面主体清晰、关键词与标题「浪漫/干货」一致，用户愿意点击进入。`,
      suggestions: [
        "保持当前封面风格，可复制高 CTR 作品的标题结构做 A/B",
        "略提高封面亮度，避免暗部过多影响小屏识别",
        "标题控制在 18 字内，核心关键词前置",
      ],
      funnelMetrics: [
        { label: "曝光量", value: "1,332", fanShare: "粉丝 1.6%", highlight: true },
        { label: "播放量", value: "276", fanShare: "粉丝 0.7%" },
        { label: "封面点击率", value: "13.1%", fanShare: "粉丝 0%" },
      ],
      radarScore: 82,
    },
    {
      id: "hook",
      title: "开头吸引力",
      segment: 2,
      segmentTip: DOUYIN_FUNNEL_SEGMENTS[1].tip,
      status: "warn",
      metricLabel: "5秒完播率",
      metricValue: "35.8%",
      median: "44.9%",
      exceedPercent: "仅超 27% 同类",
      situation:
        "超 70% 用户在开播 5 秒内划走，开头留存明显低于同类中位数，拉低整体推荐效率。",
      cause:
        "前 3 秒画面偏暗、信息密度低，口播未立刻抛出痛点或悬念，缺少「视觉钩子」与 BGM。",
      suggestions: [
        "黄金 3 秒：把最亮/最有冲击力的画面移到片头",
        "口播第一句使用 F2 生成的钩子文案，直接点题",
        "搭配节奏感 BGM，避免静音开场",
        "→ 前往「AI 创作」优化脚本开头",
      ],
      funnelMetrics: [
        { label: "2秒退出率", value: "28.2%", fanShare: "粉丝 50%", highlight: true },
        { label: "5秒完播率", value: "35.8%", fanShare: "粉丝 0%" },
      ],
      radarScore: 45,
    },
    {
      id: "engagement",
      title: "互动表现",
      segment: 3,
      segmentTip: DOUYIN_FUNNEL_SEGMENTS[2].tip,
      status: "warn",
      metricLabel: "互动率",
      metricValue: "1.5%",
      median: "3.8%",
      exceedPercent: "仅超 22% 同类",
      situation: "点赞与评论偏低，用户愿意看完但未形成互动，评论区缺少讨论话题。",
      cause: "结尾 CTA 偏弱，未设计提问或投票；文案偏「记录型」，缺少可复制的互动梗。",
      suggestions: [
        "结尾加明确提问：「你更选 A 还是 B？」",
        "置顶评论补充拍摄地点/花絮，降低评论门槛",
        "尝试「剧情+干货」混合，提升分享动机",
      ],
      funnelMetrics: [
        { label: "互动率", value: "1.5%", fanShare: "粉丝 0%", highlight: true },
        { label: "点赞", value: "3" },
        { label: "评论", value: "0" },
        { label: "分享", value: "1" },
      ],
      radarScore: 38,
    },
    {
      id: "depth",
      title: "内容深度",
      segment: 4,
      segmentTip: DOUYIN_FUNNEL_SEGMENTS[3].tip,
      status: "warn",
      metricLabel: "平均观看时长",
      metricValue: "3.8秒",
      median: "8.6秒",
      exceedPercent: "仅超 5% 同类",
      situation: "人均观看时长显著低于同类，多数用户未进入中段价值区。",
      cause: "镜头单一、节奏平；与开头退出叠加，导致全片完播率仅 17.9%。",
      suggestions: [
        "采用卡点剪辑，每 2–3 秒切换景别",
        "中段插入对比/清单等高信息密度画面",
        "控制时长：新手账号优先 25–35 秒闭环",
      ],
      funnelMetrics: [
        { label: "平均观看时长", value: "3.8秒", fanShare: "粉丝 2.4秒", highlight: true },
        { label: "60秒播放数", value: "0", fanShare: "粉丝 0%" },
        { label: "全片完播率", value: "17.9%", fanShare: "粉丝 0%" },
        { label: "涨粉数", value: "0" },
      ],
      radarScore: 42,
    },
  ];
}
