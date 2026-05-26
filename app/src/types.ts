export type CreatorStage = "new" | "growing" | "established";

export type ContentVertical =

  | "美食"

  | "美妆"

  | "知识"

  | "剧情"

  | "旅行"

  | "健身";



export type TabId =

  | "overview"

  | "topic"

  | "create"

  | "publish"

  | "compliance"

  | "growth"

  | "diagnosis"

  | "metrics"

  | "prd";



export type DiagnosisStatus = "good" | "warn";



export type ContentGoal = "exposure" | "seeding" | "mixed";

export interface CommercialBrief {
  brand: string;
  product: string;
  sellingPoints: string;
  mustMention: string;
  forbidden: string;
}

/** 本条视频的选题上下文（选题页 → 创作/合规/发布） */
export interface TopicSessionContext {
  contentGoal: ContentGoal;
  hasCommercial: boolean;
  brief: CommercialBrief;
}

export interface CreatorProfile {
  name: string;
  stage: CreatorStage;
  vertical: ContentVertical;
  followers: number;
  avgViews: number;
  postFrequency: number;
  /** 账号默认内容目标 */
  contentGoalDefault: ContentGoal;
}



export interface TopicSuggestion {

  id: string;

  title: string;

  heat: number;

  competition: "低" | "中" | "高";

  fitScore: number;

  reason: string;

  hashtags: string[];

  bestFormat: string;

  /** 商单向选题 */
  isCommercial?: boolean;

}



export interface ScriptOutline {

  hook: string;

  /** 前三秒钩子三选一 */
  hookOptions: { type: string; text: string }[];

  selectedHookIndex: number;

  structure: string[];

  cta: string;

  duration: string;

  tips: string[];

}

/** 分镜环节口播 · 三选一 */
export interface ScriptBeatDraft {
  framework: string;
  options: string[];
  selectedIndex: number;
}

export interface ComplianceResult {

  passed: boolean;

  score: number;

  risks: { level: "高" | "中" | "低"; word: string; suggestion: string }[];

  suggestions: string[];

}



export interface MetricSnapshot {

  retention: number;

  creativeEfficiency: number;

  contentQuality: number;

  growthConversion: number;

  aiDiagnosisEffective: number;

  creatorSatisfaction: number;

}



export interface Experiment {

  id: string;

  name: string;

  status: "running" | "completed";

  variantA: string;

  variantB: string;

  lift: number;

  metric: string;

}



export interface FunnelMetricCard {

  label: string;

  value: string;

  fanShare?: string;

  highlight?: boolean;

}



export interface DiagnosisDimension {

  id: string;

  title: string;

  segment: number;

  segmentTip: string;

  status: DiagnosisStatus;

  metricLabel: string;

  metricValue: string;

  median: string;

  exceedPercent: string;

  situation: string;

  cause: string;

  suggestions: string[];

  funnelMetrics: FunnelMetricCard[];

  /** 本篇作品该维度得分 0–100 */
  radarScore: number;

  /** 同类创作者均值（雷达对比层） */
  radarPeerScore: number;

}



export interface PublishedWork {
  id: string;
  title: string;
  publishDate: string;
  views: number;
  likes: number;
  comments: number;
  duration: string;
  statusLabel: string;
}

export interface WorkDiagnosisSummary {
  workId: string;
  workTitle: string;
  workDate: string;
  views: number;
  likes: number;
  comments: number;
  weakestDimensionId: string;
  trafficSource: { name: string; percent: number }[];
  audienceInsight: string;
}

export type DiagnosisPhase = "select" | "overview" | "generating" | "ready";


