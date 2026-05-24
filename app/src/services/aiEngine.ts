import { SENSITIVE_WORDS, TREND_TOPICS } from "../data/mockData";
import type {
  ComplianceResult,
  ContentVertical,
  CreatorProfile,
  CreatorStage,
  ScriptOutline,
  TopicSuggestion,
} from "../types";

function stageMultiplier(stage: CreatorStage): number {
  if (stage === "new") return 1.15;
  if (stage === "growing") return 1.0;
  return 0.92;
}

export function generateTopics(profile: CreatorProfile): TopicSuggestion[] {
  const base = TREND_TOPICS[profile.vertical] ?? TREND_TOPICS["知识"];
  const mult = stageMultiplier(profile.stage);

  return base.map((title, i) => {
    const heat = Math.min(99, Math.round((72 + i * 5 + Math.random() * 12) * mult));
    const fitScore = Math.min(
      98,
      Math.round((75 + (4 - i) * 4 + (profile.stage === "new" ? 8 : 0)) * mult)
    );
    const competition: "低" | "中" | "高" =
      heat > 85 ? "高" : heat > 70 ? "中" : "低";

    const reasons: Record<CreatorStage, string> = {
      new: `低竞争赛道，适合${profile.vertical}垂类新手快速起量`,
      growing: `与你近期内容标签高度匹配，有望突破当前播放瓶颈`,
      established: `可承接你现有粉丝期待，适合做系列化 IP 延展`,
    };

    return {
      id: `topic-${i}`,
      title,
      heat,
      competition,
      fitScore,
      reason: reasons[profile.stage],
      hashtags: [`#${profile.vertical}`, `#${title.slice(0, 4)}`, "#抖音创作者"],
      bestFormat: profile.stage === "new" ? "15-30秒竖屏" : "45-90秒剧情/干货",
    };
  });
}

export function generateScript(
  topic: string,
  profile: CreatorProfile
): ScriptOutline {
  const hooks: Record<ContentVertical, string> = {
    美食: `「别再${topic.slice(0, 6)}了！我试了3次才发现…」`,
    美妆: `「黄皮姐妹停一下！这个${topic.slice(0, 4)}真的绝了」`,
    知识: `「90%的人不知道：${topic}的核心就1句话」`,
    剧情: `「当我以为只是普通一天，直到…（反转）」`,
    旅行: `「周末不想宅？${topic}这条路线我替你们踩过了」`,
    健身: `「7分钟跟练！${topic}，新手也能坚持完」`,
  };

  const structures: Record<CreatorStage, string[]> = {
    new: [
      "0-3秒：强钩子 + 痛点",
      "3-12秒：展示过程/对比",
      "12-25秒：结果 + 简单总结",
      "结尾：关注引导 + 下期预告",
    ],
    growing: [
      "0-5秒：悬念钩子",
      "5-20秒：核心干货/剧情展开",
      "20-40秒：价值升华/反转",
      "40-60秒：互动提问 + 系列预告",
    ],
    established: [
      "0-5秒：品牌开场/人设强化",
      "5-30秒：深度内容",
      "30-50秒：观点输出/情感共鸣",
      "50-60秒：商业植入自然过渡 + CTA",
    ],
  };

  return {
    hook: hooks[profile.vertical],
    structure: structures[profile.stage],
    cta:
      profile.stage === "new"
        ? "点赞收藏，下期教你避坑"
        : "评论区告诉我你最想看哪期",
    duration: profile.stage === "new" ? "25-35秒" : "45-90秒",
    tips: [
      `前3秒口播「${topic}」关键词，提升搜索匹配`,
      "字幕字号 ≥ 48，关键句高亮",
      profile.vertical === "美妆" ? "展示前后对比需标注「效果因人而异」" : "BGM 使用抖音热歌榜 Top50",
    ],
  };
}

export function checkCompliance(text: string): ComplianceResult {
  const risks = SENSITIVE_WORDS.filter((s) => text.includes(s.word)).map(
    (s) => ({
      level: s.level,
      word: s.word,
      suggestion: s.suggestion,
    })
  );

  const score = Math.max(0, 100 - risks.length * 18 - (risks.some((r) => r.level === "高") ? 15 : 0));

  return {
    passed: score >= 70 && !risks.some((r) => r.level === "高"),
    score,
    risks,
    suggestions: [
      "添加「个人观点，仅供参考」免责声明（知识/健康类）",
      "避免绝对化用语，用「我觉得」「亲测」替代",
      "涉及品牌合作需标注 #广告 或合作声明",
      "封面与标题需一致，避免标题党",
    ],
  };
}

export interface PublishDraft {
  title: string;
  description: string;
  tags: string[];
}

export function generatePublishDraft(
  topic: string,
  profile: CreatorProfile
): PublishDraft {
  const topicShort = topic.slice(0, 12) || profile.vertical;
  const titleTemplates: Record<ContentVertical, string> = {
    美食: `亲测！${topicShort}这样做真的香`,
    美妆: `${topicShort}｜黄皮也能驾驭的平价好物`,
    知识: `${topicShort}，90%的人第一步就错了`,
    剧情: `${topicShort}…结局我没想到`,
    旅行: `周末去哪？${topicShort}这条线我替你们踩过了`,
    健身: `7分钟跟练｜${topicShort}，新手友好`,
  };

  const tags = [
    `#${profile.vertical}`,
    `#${topicShort.replace(/\s/g, "")}`,
    "#抖音创作者",
    profile.stage === "new" ? "#新手创作者" : "#创作者成长",
    "#干货分享",
  ];

  return {
    title: titleTemplates[profile.vertical],
    description: `本期聊「${topic}」——${profile.stage === "new" ? "新手也能跟做" : "点赞收藏不迷路"}。#个人观点仅供参考`,
    tags,
  };
}

export function generateGrowthInsights(profile: CreatorProfile): string[] {
  const base = [
    `近7日发布 ${profile.postFrequency} 条，建议保持每周 4-5 条稳定更新`,
    `当前垂类「${profile.vertical}」大盘完播率 38%，你的内容可优化前3秒钩子`,
    `AI 选题采纳率 62%，高于同阶段创作者均值 48%`,
  ];

  const stageTips: Record<CreatorStage, string[]> = {
    new: [
      "优先做「低竞争 + 高匹配」选题，快速积累前1000粉",
      "建议开启「系列化」标签，提升粉丝记忆点",
    ],
    growing: [
      "尝试「剧情+干货」混合结构，提升分享率",
      "分析爆款评论区，提炼下期选题方向",
    ],
    established: [
      "布局「品牌合作内容」与「纯内容」7:3 比例",
      "关注合规红线，头部账号审核更严格",
    ],
  };

  return [...base, ...stageTips[profile.stage]];
}
