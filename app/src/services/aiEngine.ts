import { SENSITIVE_WORDS, TREND_TOPICS } from "../data/mockData";
import { resolveContentGoal } from "../hooks/useTopicSession";
import type {
  CommercialBrief,
  ComplianceResult,
  ContentVertical,
  CreatorProfile,
  CreatorStage,
  ScriptOutline,
  TopicSessionContext,
  TopicSuggestion,
} from "../types";

function stageMultiplier(stage: CreatorStage): number {
  if (stage === "new") return 1.15;
  if (stage === "growing") return 1.0;
  return 0.92;
}

function effectiveGoal(profile: CreatorProfile, ctx: TopicSessionContext) {
  return resolveContentGoal(profile.contentGoalDefault ?? "mixed", ctx.contentGoal);
}

export function generateTopics(
  profile: CreatorProfile,
  ctx: TopicSessionContext
): TopicSuggestion[] {
  const base = TREND_TOPICS[profile.vertical] ?? TREND_TOPICS["知识"];
  const mult = stageMultiplier(profile.stage);
  const goal = effectiveGoal(profile, ctx);
  const product = ctx.brief.product || ctx.brief.brand;

  return base.map((title, i) => {
    const isCommercial = ctx.hasCommercial && i < 3;
    let displayTitle = title;
    if (isCommercial && product) {
      displayTitle = `${product}实测：${title.slice(0, 10)}`;
    } else if (goal === "seeding" && i === 0) {
      displayTitle = `亲测${title}｜真实体验不踩雷`;
    } else if (goal === "exposure" && i === 0) {
      displayTitle = `千万别${title.slice(0, 6)}！除非你看完这条`;
    }

    const heat = Math.min(99, Math.round((72 + i * 5 + Math.random() * 12) * mult));
    const fitScore = Math.min(
      98,
      Math.round(
        (75 + (4 - i) * 4 + (profile.stage === "new" ? 8 : 0) + (isCommercial ? 6 : 0)) *
          mult
      )
    );
    const competition: "低" | "中" | "高" =
      heat > 85 ? "高" : heat > 70 ? "中" : "低";

    let reason = "";
    if (isCommercial) {
      reason = `商单 Brief 匹配：突出「${ctx.brief.sellingPoints.slice(0, 12) || "卖点"}」，适合种草转化`;
    } else if (goal === "exposure") {
      reason = `曝光向：强冲突标题，利于推荐流破圈与 5 秒完播`;
    } else if (goal === "seeding") {
      reason = `种草向：场景化选题，利于收藏与深度完播`;
    } else {
      reason = `混合策略：兼顾播放与互动，适合${profile.vertical}垂类`;
    }

    const duration =
      goal === "exposure" || profile.stage === "new"
        ? "25-35秒竖屏"
        : isCommercial
          ? "45-60秒测评"
          : "45-90秒剧情/干货";

    const tags = [`#${profile.vertical}`, `#${displayTitle.slice(0, 4)}`, "#抖音创作者"];
    if (isCommercial) tags.push("#合作", "#广告");

    return {
      id: `topic-${i}`,
      title: displayTitle,
      heat,
      competition,
      fitScore,
      reason,
      hashtags: tags,
      bestFormat: duration,
      isCommercial,
    };
  });
}

function buildHookOptions(
  topic: string,
  profile: CreatorProfile,
  ctx: TopicSessionContext
): { type: string; text: string }[] {
  const v = profile.vertical;
  const product = ctx.brief.product || "这款产品";
  const short = topic.slice(0, 8);

  const exposure: Record<ContentVertical, [string, string, string]> = {
    美食: [
      `「别再${short}了！90%的人都做错了第一步…」`,
      `「以为只是普通${short}，结果第三秒我愣住了」`,
      `「同样食材，为什么你的${short}没人看？」`,
    ],
    美妆: [
      `「黄皮别划走！${short}踩雷我替你们试过了」`,
      `「打开前以为是智商税，上脸那秒我闭嘴了…」`,
      `「同一光线，左右脸差两色号，右边赢了」`,
    ],
    知识: [
      `「90%的人不知道：${short}核心就这一句话」`,
      `「如果你还在用老方法做${short}，先停一下」`,
      `「3秒能救你的${short}，很多人第一步就错了」`,
    ],
    剧情: [
      `「当我以为只是普通一天，直到…（反转）」`,
      `「社恐真实瞬间：${short}」`,
      `「老板看到这条视频，沉默了10秒」`,
    ],
    旅行: [
      `「周末别宅！${short}这条线我替你们踩过了」`,
      `「以为会踩雷，到了现场我直接改计划…」`,
      `「同样预算，为什么你的${short}玩不出片？」`,
    ],
    健身: [
      `「7分钟跟练！${short}，新手也能坚持完」`,
      `「以为只是热身，第30秒我后悔了…」`,
      `「同样动作，为什么你的${short}没效果？」`,
    ],
  };

  const seeding: Record<ContentVertical, [string, string, string]> = {
    美食: [
      `「亲测一周${short}，这条路线最省事」`,
      `「${product}搭配${short}，新手也能复刻」`,
      `「从踩雷到真香，我只改了这一步…」`,
    ],
    美妆: [
      `「${product}上脸实测：黄皮真实色号对比」`,
      `「同价位横评：${short}到底值不值？」`,
      `「持妆8小时，我只做对了这一件事…」`,
    ],
    知识: [
      `「我用${short}提效一周，分享可复制的步骤」`,
      `「${product}怎么选？我按这3条筛的」`,
      `「从0到上手，${short}我只推荐这一条路径」`,
    ],
    剧情: [
      `「真实体验${short}，不夸张版」`,
      `「${product}植入也能自然？我是这样拍的…」`,
      `「粉丝催更的${short}，完整过程来了」`,
    ],
    旅行: [
      `「${short}攻略：省钱不踩雷版」`,
      `「${product}旅行实测，适不适合新手？」`,
      `「同样路线，为什么你的${short}不出片？」`,
    ],
    健身: [
      `「跟练7天${short}，变化在这3个点」`,
      `「${product}健身辅助实测，适不适合新手」`,
      `「从做不到到跟完，我只改了一个细节…」`,
    ],
  };

  const goal = effectiveGoal(profile, ctx);
  const triple = ctx.hasCommercial || goal === "seeding" ? seeding[v] : exposure[v];
  return [
    { type: "痛点型", text: triple[0] },
    { type: "悬念型", text: triple[1] },
    { type: ctx.hasCommercial ? "测评型" : "对比型", text: triple[2] },
  ];
}

export function generateScript(
  topic: string,
  profile: CreatorProfile,
  ctx: TopicSessionContext
): ScriptOutline {
  const hookOptions = buildHookOptions(topic, profile, ctx);
  const goal = effectiveGoal(profile, ctx);

  const structuresExposure: Record<CreatorStage, string[]> = {
    new: [
      "0-3秒：强钩子 + 痛点",
      "3-12秒：展示过程/对比",
      "12-25秒：结果 + 简单总结",
      "结尾：关注引导",
    ],
    growing: [
      "0-5秒：悬念钩子",
      "5-20秒：核心冲突/反转",
      "20-40秒：价值点快速输出",
      "40-60秒：互动提问",
    ],
    established: [
      "0-5秒：人设/品牌开场",
      "5-25秒：高密度信息",
      "25-45秒：观点输出",
      "45-60秒：CTA",
    ],
  };

  const structuresSeeding: Record<CreatorStage, string[]> = {
    new: [
      "0-3秒：痛点 + 产品/场景",
      "3-15秒：使用过程/对比",
      "15-35秒：效果与细节",
      "结尾：总结 + #广告 声明",
    ],
    growing: [
      "0-5秒：结果预告",
      "5-25秒：测评/清单/步骤",
      "25-45秒：优缺点诚实说",
      "45-60秒：适谁买 + 提问",
    ],
    established: [
      "0-5秒：信任背书",
      "5-30秒：深度体验",
      "30-50秒：与竞品差异",
      "50-60秒：合作声明 + CTA",
    ],
  };

  const structure =
    goal === "seeding" || ctx.hasCommercial
      ? structuresSeeding[profile.stage]
      : structuresExposure[profile.stage];

  const tips = [
    `前3秒口播「${topic.slice(0, 10)}」关键词，提升搜索匹配`,
    "字幕字号 ≥ 48，关键句高亮",
    ctx.hasCommercial
      ? "商单须口播/字幕标注 #广告 或合作声明"
      : profile.vertical === "美妆"
        ? "展示前后对比需标注「效果因人而异」"
        : "BGM 使用抖音热歌榜 Top50",
  ];
  if (ctx.brief.mustMention) {
    tips.push(`Brief 必提：${ctx.brief.mustMention}`);
  }
  if (ctx.brief.forbidden) {
    tips.push(`Brief 禁用：${ctx.brief.forbidden}`);
  }

  return {
    hook: hookOptions[0].text,
    hookOptions,
    selectedHookIndex: 0,
    structure,
    cta: ctx.hasCommercial
      ? "觉得有用记得收藏；合作声明见简介 #广告"
      : profile.stage === "new"
        ? "点赞收藏，下期教你避坑"
        : "评论区告诉我你最想看哪期",
    duration:
      goal === "exposure" && !ctx.hasCommercial
        ? "25-35秒"
        : ctx.hasCommercial
          ? "45-60秒"
          : "45-90秒",
    tips,
  };
}

export function checkCompliance(
  text: string,
  options?: { hasCommercial?: boolean; brief?: CommercialBrief }
): ComplianceResult {
  const risks = SENSITIVE_WORDS.filter((s) => text.includes(s.word)).map((s) => ({
    level: s.level,
    word: s.word,
    suggestion: s.suggestion,
  }));

  if (options?.brief?.forbidden) {
    options.brief.forbidden
      .split(/[,，、]/)
      .map((w) => w.trim())
      .filter(Boolean)
      .forEach((word) => {
        if (text.includes(word)) {
          risks.push({
            level: "高",
            word,
            suggestion: "Brief 禁用表述，请删除或改写",
          });
        }
      });
  }

  let score = Math.max(
    0,
    100 - risks.length * 18 - (risks.some((r) => r.level === "高") ? 15 : 0)
  );

  const suggestions = [
    "添加「个人观点，仅供参考」免责声明（知识/健康类）",
    "避免绝对化用语，用「我觉得」「亲测」替代",
    "封面与标题需一致，避免标题党",
  ];

  if (options?.hasCommercial) {
    suggestions.unshift("商单内容须标注 #广告 / 合作声明（口播+简介）");
    if (!text.includes("广告") && !text.includes("合作")) {
      score = Math.max(0, score - 12);
      suggestions.push("当前文案未检测到合作声明，建议补充");
    }
  } else {
    suggestions.push("涉及品牌合作需标注 #广告 或合作声明");
  }

  return {
    passed: score >= 70 && !risks.some((r) => r.level === "高"),
    score,
    risks,
    suggestions,
  };
}

export interface PublishDraft {
  title: string;
  description: string;
  tags: string[];
}

export function generatePublishDraft(
  topic: string,
  profile: CreatorProfile,
  ctx?: TopicSessionContext
): PublishDraft {
  const topicShort = topic.slice(0, 12) || profile.vertical;
  const goal = ctx ? effectiveGoal(profile, ctx) : "exposure";
  const commercial = ctx?.hasCommercial;

  let title = `亲测！${topicShort}这样做真的香`;
  if (commercial && ctx?.brief.product) {
    title = `${ctx.brief.product}实测｜${topicShort}`;
  } else if (goal === "seeding") {
    title = `${topicShort}｜真实体验不踩雷`;
  } else if (goal === "exposure") {
    title = `千万别乱${topicShort.slice(0, 4)}！除非你看完`;
  }

  const tags = [
    `#${profile.vertical}`,
    `#${topicShort.replace(/\s/g, "")}`,
    "#抖音创作者",
    profile.stage === "new" ? "#新手创作者" : "#创作者成长",
  ];
  if (commercial) tags.push("#广告", "#合作");

  let description = `本期聊「${topic}」——${profile.stage === "new" ? "新手也能跟做" : "点赞收藏不迷路"}。#个人观点仅供参考`;
  if (commercial) {
    description = `本期为品牌合作内容，仅代表个人体验。#广告 ${ctx?.brief.brand ? `@${ctx.brief.brand}` : ""} ${ctx?.brief.sellingPoints.slice(0, 30)}`;
  }

  return { title, description, tags };
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
