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
  | "metrics"
  | "prd";

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
  aiAccuracy: number;
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
