import type { Experiment, MetricSnapshot } from "../types";

export const STAGE_LABELS = {
  new: "新手创作者",
  growing: "成长期创作者",
  established: "头部创作者",
} as const;

export const STAGE_DESC = {
  new: "粉丝 < 1万 · 重点：选题命中率、完播率、发布频次",
  growing: "粉丝 1-50万 · 重点：人设差异化、系列化、互动转化",
  established: "粉丝 50万+ · 重点：商业转化、IP 延展、内容安全",
} as const;

export const LIFECYCLE_STEPS = [
  { id: "topic", label: "选题", icon: "Lightbulb" },
  { id: "create", label: "创作", icon: "PenLine" },
  { id: "publish", label: "发布", icon: "Send" },
  { id: "compliance", label: "审核", icon: "Shield" },
  { id: "growth", label: "成长", icon: "TrendingUp" },
] as const;

export const TREND_TOPICS: Record<string, string[]> = {
  美食: ["3分钟懒人早餐", "减脂餐一周挑战", "夜市探店避雷", "电饭煲神仙做法"],
  美妆: ["黄皮显白口红", "早八伪素颜", "油皮夏季定妆", "平价彩妆测评"],
  知识: ["AI工具提效", "职场沟通技巧", "读书一分钟", "冷知识系列"],
  剧情: ["反转短剧", "职场搞笑日常", "情侣相处梗", "社恐真实瞬间"],
  旅行: ["周末周边游", "穷游攻略", "城市漫步vlog", "酒店避坑指南"],
  健身: ["居家7分钟燃脂", "体态矫正", "新手健身房", "拉伸跟练"],
};

export const SENSITIVE_WORDS = [
  { word: "最好", level: "中" as const, suggestion: "改为「我个人体验很好」" },
  { word: "第一", level: "高" as const, suggestion: "避免绝对化表述，用数据支撑" },
  { word: "根治", level: "高" as const, suggestion: "医疗健康类需资质，避免疗效承诺" },
  { word: "暴富", level: "中" as const, suggestion: "避免夸大收益，符合金融广告规范" },
  { word: "国家级", level: "高" as const, suggestion: "需权威来源，否则删除" },
];

export const DEFAULT_METRICS: MetricSnapshot = {
  retention: 42,
  creativeEfficiency: 68,
  contentQuality: 75,
  growthConversion: 12,
  aiAccuracy: 81,
  creatorSatisfaction: 4.2,
};

export const METRIC_HISTORY = [
  { week: "W1", retention: 35, efficiency: 55, quality: 68, conversion: 8 },
  { week: "W2", retention: 38, efficiency: 60, quality: 70, conversion: 9 },
  { week: "W3", retention: 40, efficiency: 64, quality: 72, conversion: 10 },
  { week: "W4", retention: 42, efficiency: 68, quality: 75, conversion: 12 },
];

export const EXPERIMENTS: Experiment[] = [
  {
    id: "exp1",
    name: "EXP-01 钩子模板：痛点型 vs 悬念型",
    status: "completed",
    variantA: "痛点型钩子",
    variantB: "悬念型钩子",
    lift: 12.4,
    metric: "5秒完播率（抖音作品分析）",
  },
  {
    id: "exp2",
    name: "EXP-02 选题展示：卡片 vs 列表",
    status: "running",
    variantA: "卡片式推荐",
    variantB: "列表式推荐",
    lift: 18.5,
    metric: "选题采纳率 → 7日播放量",
  },
  {
    id: "exp3",
    name: "EXP-04 发布前合规预检",
    status: "completed",
    variantA: "无预检",
    variantB: "AI 预检",
    lift: 34.0,
    metric: "违规/限流率下降",
  },
  {
    id: "exp4",
    name: "EXP-05 标题：AI生成 vs 自拟",
    status: "running",
    variantA: "AI 标题",
    variantB: "创作者自拟",
    lift: 8.1,
    metric: "CTR（小红书口径）· 护栏：完播率",
  },
];

export type MetricLayer = "L1" | "L2";

export interface KpiDefinition {
  key: keyof MetricSnapshot | string;
  name: string;
  desc: string;
  target: string;
  layer: MetricLayer;
  source: string;
  formula?: string;
}

/** L2：AI 产品指标（对齐岗位 JD） */
export const KPI_DEFINITIONS: KpiDefinition[] = [
  {
    key: "retention",
    name: "P1 创作者留存",
    desc: "D7 再次打开创灵的比例",
    target: "≥ 45%",
    layer: "L2",
    source: "岗位 JD · 留存",
  },
  {
    key: "creativeEfficiency",
    name: "P2 创作效率",
    desc: "选题→发布准备完成中位耗时 vs 基线",
    target: "-30%",
    layer: "L2",
    source: "岗位 JD · 创作效率",
    formula: "L1 代理：周期投稿数↑",
  },
  {
    key: "contentQuality",
    name: "P3 内容质量",
    desc: "采纳 AI 作品的质量综合分",
    target: "≥ 70 分",
    layer: "L2",
    source: "岗位 JD · 内容质量",
    formula: "5秒完播×40% + 完播×35% + 互动×25%",
  },
  {
    key: "growthConversion",
    name: "P4 成长转化",
    desc: "完整采纳链路后 7 日粉丝净增 vs 同类基线",
    target: "+10%",
    layer: "L2",
    source: "岗位 JD · 成长转化",
    formula: "L1：抖音涨粉量/粉丝净增量",
  },
  {
    key: "aiAccuracy",
    name: "P5 AI 建议准确率",
    desc: "采纳且 7 日内 L1 指标正向的建议占比",
    target: "≥ 80%",
    layer: "L2",
    source: "岗位 JD · AI 准确度",
    formula: "例：5秒完播 > 近10条均值",
  },
  {
    key: "creatorSatisfaction",
    name: "P6 创作者满意度",
    desc: "链路结束五星评分 / NPS",
    target: "≥ 4.0 / 5",
    layer: "L2",
    source: "岗位 JD · 满意度",
  },
];

/** L1：平台原生指标（演示 mock 值） */
export const L1_PLATFORM_METRICS = [
  {
    name: "5秒完播率",
    value: "41%",
    source: "抖音创作者中心",
    note: "验证 F2 钩子 AI",
  },
  {
    name: "完播率",
    value: "36%",
    source: "抖音创作者中心",
    note: "内容质量核心",
  },
  {
    name: "互动率",
    value: "5.8%",
    source: "抖音 + 小红书拆解",
    note: "(赞+评+分享)/播放",
  },
  {
    name: "涨粉量（7日）",
    value: "+1,240",
    source: "抖音创作者中心",
    note: "成长转化 P4 代理",
  },
  {
    name: "CTR",
    value: "9.2%",
    source: "小红书笔记分析",
    note: "发布标题优化 F3",
  },
  {
    name: "粉丝活跃峰值",
    value: "21:00-22:00",
    source: "快手数据中心",
    note: "发布时段建议 F3",
  },
];
