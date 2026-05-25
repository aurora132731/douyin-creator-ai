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



export interface CreatorProfile {

  name: string;

  stage: CreatorStage;

  vertical: ContentVertical;

  followers: number;

  avgViews: number;

  postFrequency: number;

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

}



export interface ScriptOutline {

  hook: string;

  structure: string[];

  cta: string;

  duration: string;

  tips: string[];

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

  radarScore: number;

}



export interface WorkDiagnosisSummary {

  workTitle: string;

  workDate: string;

  views: number;

  likes: number;

  comments: number;

  weakestDimensionId: string;

  trafficSource: { name: string; percent: number }[];

  audienceInsight: string;

}


