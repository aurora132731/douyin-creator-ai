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

export interface GeneratedScriptBeats {
  beats: { framework: string; options: string[] }[];
  ctaOptions: string[];
}

function classifyFramework(framework: string): string {
  if (/钩子|开场|0-3|0-5/.test(framework)) return "opening";
  if (/过程|对比|展示|步骤|测评|清单|展开|体验|跟练|演示|冲突|反转|干货|深度/.test(framework))
    return "demo";
  if (/结果|总结|效果|细节|优缺点|差异|价值|观点|情感|信任|背书/.test(framework))
    return "result";
  if (/结尾|CTA|关注|声明|提问|适谁|合作/.test(framework)) return "closing";
  return "demo";
}

function cleanHook(hook: string): string {
  return hook.replace(/[「」""]/g, "").trim();
}

function spokenOpening(
  topic: string,
  hook: string,
  profile: CreatorProfile,
  ctx: TopicSessionContext,
  variant: number
): string {
  const h = cleanHook(hook);
  const short = topic.slice(0, 12);
  const v = profile.vertical;

  const byVertical: Record<ContentVertical, string[]> = {
    美食: [
      `${h} 今天这条我全程实拍，从备料到出锅，你们照着做就行。`,
      `先说结论：${short}这样做，真的省事又好吃，往下看步骤。`,
      `很多人做${short}第一步就错了，我先花三秒把坑说清楚。`,
    ],
    美妆: [
      `${h} 我这张黄皮脸替你们试过了，自然光下真实效果马上给你们看。`,
      `黄皮姐妹先别划走，${short}这条我只讲实测，不吹不黑。`,
      `同一光线、同一角度，我只改一个变量，差别你们自己看。`,
    ],
    知识: [
      `${h} 接下来我用最简单的话，把${short}讲明白。`,
      `如果你也在纠结${short}，先听我把核心说完再决定。`,
      `这条不绕弯子，${short}我就按这三步说清楚。`,
    ],
    剧情: [
      `${h} 后面有反转，你们先看到最后。`,
      `本来以为是普通一天，结果${short}这段把我整不会了。`,
      `社恐真实现场，${short}全程无脚本，就看自然反应。`,
    ],
    旅行: [
      `${h} 这条路线我亲自走了一遍，花费和时间都帮你们算好了。`,
      `周末不知道去哪的，${short}这条线可以直接抄作业。`,
      `以为会踩雷，到了现场我直接改计划，原因你们往下看。`,
    ],
    健身: [
      `${h} 新手也能跟完，动作我会放慢讲，不用器械。`,
      `7分钟跟练开始，${short}每个动作我都标了呼吸节奏。`,
      `别急着划走，${short}做错这一步，练再久也白搭。`,
    ],
  };

  const commercial = ctx.hasCommercial
    ? [
        `${h} 这期是品牌合作，我只分享真实使用感受，不合适的我也会说。`,
        `先声明：本期含合作内容。${ctx.brief.product || short}到底值不值，看我实测。`,
        `${h} 卖点我只讲${ctx.brief.sellingPoints.slice(0, 14) || "我真实体验"}，你们自行判断。`,
      ]
    : null;

  const pool = commercial ?? byVertical[v];
  return pool[variant % pool.length];
}

function spokenDemo(
  topic: string,
  framework: string,
  profile: CreatorProfile,
  ctx: TopicSessionContext,
  variant: number
): string {
  const short = topic.slice(0, 12);
  const product = ctx.brief.product || "这个";
  const v = profile.vertical;
  const sell = ctx.brief.sellingPoints.slice(0, 20) || "细节";

  const pools: Record<ContentVertical, string[][]> = {
    美食: [
      [
        `第一步，食材就这几样，家里一般都有。第二步，火不要太大，中间这一步最关键。第三步，出锅前尝一下咸淡，按自己口味微调就行。`,
        `左边是我以前的做法，右边是改完后的。你们看颜色跟口感，右边明显更入味，而且不会柴。`,
        `全程没加复杂调料，就靠这一步提香。暂停一下看特写，这个状态刚刚好。`,
      ],
      [
        `我按时间顺序讲：备菜两分钟，下锅三分钟，最后收汁一分钟。总共不到十分钟，上班族也能做。`,
        `这里最容易翻车的是火候，我一般会调到中火，看到这种小气泡就转小。`,
        `如果你们也做${short}，记得把这一步多留十秒，口感会差很多。`,
      ],
      [
        `无滤镜实拍，就是普通厨房光线。你们看切面，这个状态是我觉得最稳的。`,
        `我试了三版配比，这版最省事，失败率也最低，新手直接跟。`,
        `口播里我不夸张，就是日常能复刻的版本，复杂的我都删了。`,
      ],
    ],
    美妆: [
      [
        `我先涂半边脸给你们做对比。左边是之前常用的，右边是今天这支。你们看显色，黄皮在自然光下不会发橘。`,
        `质地是这样的，推开很顺，我不会叠太厚。一般两层就够日常通勤，八小时下来只掉一点点。`,
        `近看也不卡纹，我法令纹这里你们可以对焦看。色号我放简介了，仅供参考。`,
      ],
      [
        `上妆顺序很简单：打底、薄涂、局部叠涂。重点在唇峰这一笔，气色马上不一样。`,
        `我特意没开美颜，就是为了看真实颜色。室内暖光和窗边冷光我都试了，都还能打。`,
        `${product}我用的量是这些，太多会糊，太少又不显色，这个量刚刚好。`,
      ],
      [
        `持妆我测了大概八小时，中间只喝过水。你们看氧化程度，我觉得可以接受。`,
        `如果唇色深，可以先压一层底色。这一步做完，颜色会更准。`,
        `优缺点我直说：优点是显色稳，缺点是超干唇要先润一下。`,
      ],
    ],
    知识: [
      [
        `第一个误区是贪多，其实核心就一句话。第二个是顺序反了，应该先做A再做B。第三个是忽略复盘，做完要对照检查。`,
        `我把它拆成三步：准备、执行、验收。你们可以直接截图，照着做就行。`,
        `举个例子，如果你现在卡在${short}，先改这一步，效率会立刻上来。`,
      ],
      [
        `很多人问过我同样的问题，我统一在这期讲清楚。先讲原理，再讲操作，最后讲避坑。`,
        `我不堆概念，就讲能马上用的。第一步打开工具，第二步选这个模板，第三步导出。`,
        `同样时间，为什么有人快有人慢？差别就在中间这三十秒。`,
      ],
      [
        `清单我口述一遍：一、明确目标；二、限定时间；三、只做一个版本先跑通。`,
        `你可以暂停跟做，我语速会放慢。做完打勾，别跳步。`,
        `这套方法我自己用了一周，省下的时间大概每天二十多分钟。`,
      ],
    ],
    剧情: [
      [
        `一开始我还挺正常的，直到同事递过来这个。我当时表情你们也看到了，真的没绷住。`,
        `反转在这：我以为会被骂，结果老板沉默十秒，然后说了那句经典台词。`,
        `这段不是演的，就是我俩真实反应，可能有点长，但结尾值得看。`,
      ],
      [
        `铺垫一下背景：那天加班，大家都很累。然后这个意外就发生了。`,
        `你们注意看我眼神变化，前三秒是懵的，后面才开始反应过来。`,
        `如果换作是你，你会怎么接？我先说我的版本，评论区等你们的。`,
      ],
      [
        `剧情走到这里，其实埋了前面一个细节。回看你会发现，前面五秒就有提示。`,
        `我不剧透太多，就说到这个转折点。后面自己看，别划走。`,
        `这条拍了三遍，这遍最自然，保留了一些口误，更像真的。`,
      ],
    ],
    旅行: [
      [
        `交通这样走最省：地铁到这一站，出来步行八分钟。第一段风景最好，建议上午到。`,
        `第二个点别踩坑：门口那家别进，往里走五十米，性价比更高。`,
        `拍照位置在这，逆光下午四点以后，人脸会柔和很多。`,
      ],
      [
        `预算我算给你们：车票、吃饭、门票加起来大概这些。学生党也能承受。`,
        `路线是环线，不走回头路。第一站打卡，第二站吃饭，第三站看日落。`,
        `如果只有半天，只走我标记的前两段就够，别贪多。`,
      ],
      [
        `住宿我选的是这家，干净而且离地铁近。房间不大，但一个人够用。`,
        `本地朋友推荐的店在这，口味偏淡，适合不吃辣的人。`,
        `雨天备选方案我也准备了，室内这条线同样出片。`,
      ],
    ],
    健身: [
      [
        `第一个动作三十秒，注意膝盖别内扣。第二个动作四十秒，呼吸是推起吐气、放下吸气。第三个动作收尾，把心率降下来。`,
        `跟练版开始：我数节拍，你们跟着做。做不到的可以减幅度，别硬撑。`,
        `新手版我会少做两组，你们看自己体力，能跟多少跟多少。`,
      ],
      [
        `常见错误是腰塌，我这里收紧核心给你们看。正确版本是背打平，脖子放松。`,
        `左右各做一遍，你们对比幅度。左边是我第一次做的，右边是调整后。`,
        `拉伸别跳过，最后这分钟很重要，第二天不会那么酸。`,
      ],
      [
        `全程七分钟，中间有十秒休息，喝水就行。`,
        `如果你只有五分钟，做前两个动作也有效，别因为时间短就不动。`,
        `练完Feel是这样的，微微喘但还能说话，这个强度刚好。`,
      ],
    ],
  };

  const pool = pools[v];
  const triple = pool[(variant + framework.length) % pool.length];
  if (ctx.hasCommercial && variant === 1) {
    return `使用${product}的过程中，我主要关注${sell}。这一步是关键，你们看实际效果，是不是符合宣传说的方向。`;
  }
  return triple[variant % 3];
}

function spokenResult(
  topic: string,
  profile: CreatorProfile,
  ctx: TopicSessionContext,
  variant: number
): string {
  const short = topic.slice(0, 12);
  const product = ctx.brief.product || "这款";
  const v = profile.vertical;

  const pools: Record<ContentVertical, string[]> = {
    美食: [
      `最后尝一口，这个味道我自己会回购。复杂度不高，但成功率很高，适合厨房新手。`,
      `总结一下：最省事的点是准备快，最要注意的是火候。你们按我步骤来，基本不会翻车。`,
      `成品在这，你们觉得卖相怎么样？我个人觉得日常够用了，招待朋友也拿得出手。`,
    ],
    美妆: [
      `全脸效果在这，我觉得日常通勤够用了。黄皮友好这一点对我很重要，这支达标。`,
      `优缺点我说完：优点是显色稳、好驾驭；缺点是超干唇要先打底。`,
      `效果因人而异，但就我这周体验，我会把它留进常用清单。`,
    ],
    知识: [
      `收个尾：记住核心就三步，别贪多。你先做最小版本，跑通再优化。`,
      `这期${short}讲完了，如果你只能记一句，就是先改顺序再改工具。`,
      `复盘一下，我踩过的坑都告诉你们了，能少绕一圈是一圈。`,
    ],
    剧情: [
      `故事到这就收尾了，你们猜到的评论区扣1，没猜到的扣2。`,
      `反转讲完了，其实最想说的是：别预设立场，很多时候结局不一样。`,
      `这条我保留了一些真实反应，可能不完美，但更像日常。`,
    ],
    旅行: [
      `整条线走下来，我最推荐的是第二站，性价比和出片率都高。`,
      `如果只能选一个时间去，我建议周末上午，人相对少，体验更好。`,
      `花费明细我放简介了，你们按预算取舍就行。`,
    ],
    健身: [
      `跟练完状态在这，微微出汗但没有崩掉，这个强度新手也能坚持。`,
      `一周练三次这个量，配合拉伸，体态会有变化，别指望一天见效。`,
      `你们要是某一步做不到，先降幅度，比硬撑更重要。`,
    ],
  };

  const commercial = [
    `整体体验如上，${product}适不适合你，要看你在不在意${ctx.brief.sellingPoints.slice(0, 12) || "这几个点"}。`,
    `合作款我直说：喜欢的点、犹豫的点我都讲了，你们理性判断。`,
    `这期是合作内容，仅代表个人感受，同款链接我不硬推，需要的自己搜。`,
  ];

  const base = ctx.hasCommercial ? commercial : pools[v];
  const line = base[variant % base.length];
  return `${line} 个人观点，仅供参考。`;
}

function spokenClosing(
  topic: string,
  profile: CreatorProfile,
  ctx: TopicSessionContext,
  variant: number
): string {
  const short = topic.slice(0, 10);
  const options = ctx.hasCommercial
    ? [
        `觉得有用先收藏，合作声明和色号详情都在简介，记得看 #广告。`,
        `这期合作内容到此结束，有问题评论区问我，我看到会回。`,
        `如果也在找${short}，可以先马住这条，买之前对照着看。`,
      ]
    : [
        `这期${short}就到这，觉得有用帮我点个赞，收藏下次做之前还能找到。`,
        `你们还想看哪条路线，评论区告诉我，我按票数安排下期。`,
        `新手友好版已经尽量讲细了，跟做的回来交作业，我看到会点赞。`,
      ];
  return options[variant % options.length];
}

function beatTemplates(
  topic: string,
  hook: string,
  framework: string,
  profile: CreatorProfile,
  ctx: TopicSessionContext,
  beatIndex: number,
  refreshSeed: number
): string[] {
  const phase = classifyFramework(framework);
  const variantBase = (refreshSeed * 3 + beatIndex) % 9;

  if (phase === "opening") {
    return [0, 1, 2].map((i) =>
      spokenOpening(topic, hook, profile, ctx, variantBase + i + refreshSeed)
    );
  }
  if (phase === "demo") {
    return [0, 1, 2].map((i) =>
      spokenDemo(topic, framework, profile, ctx, variantBase + i + refreshSeed)
    );
  }
  if (phase === "result") {
    return [0, 1, 2].map((i) => spokenResult(topic, profile, ctx, variantBase + i + refreshSeed));
  }
  if (phase === "closing") {
    return [0, 1, 2].map((i) => spokenClosing(topic, profile, ctx, variantBase + i + refreshSeed));
  }
  return [0, 1, 2].map((i) =>
    spokenDemo(topic, framework, profile, ctx, variantBase + i + refreshSeed)
  );
}

function buildCtaVariants(
  baseCta: string,
  topic: string,
  profile: CreatorProfile,
  ctx: TopicSessionContext,
  refreshSeed: number
): string[] {
  const offset = refreshSeed % 3;
  const spoken = spokenClosing(topic, profile, ctx, offset);
  const variants = [
    spoken,
    spokenClosing(topic, profile, ctx, offset + 1),
    ctx.hasCommercial
      ? `合作内容到此，详情和声明都在简介，记得看 #广告。`
      : `关注我不迷路，${profile.vertical}同类内容我会做成系列，下期见。`,
  ];
  return variants;
}

export function generateFullScriptBeats(
  topic: string,
  hook: string,
  outline: ScriptOutline,
  profile: CreatorProfile,
  ctx: TopicSessionContext,
  refreshSeed = 0
): GeneratedScriptBeats {
  const beats = outline.structure.map((framework, i) => ({
    framework,
    options: beatTemplates(topic, hook, framework, profile, ctx, i, refreshSeed),
  }));
  return {
    beats,
    ctaOptions: buildCtaVariants(outline.cta, topic, profile, ctx, refreshSeed),
  };
}

export function refreshSingleBeat(
  topic: string,
  hook: string,
  framework: string,
  profile: CreatorProfile,
  ctx: TopicSessionContext,
  beatIndex: number,
  refreshSeed: number
): string[] {
  return beatTemplates(topic, hook, framework, profile, ctx, beatIndex, refreshSeed);
}

export function assembleScriptBody(
  _hook: string,
  beats: { framework: string; options: string[]; selectedIndex: number }[],
  cta: string
): string {
  const parts = beats
    .map((b) => b.options[b.selectedIndex] ?? b.options[0] ?? "")
    .filter(Boolean);
  if (cta.trim()) parts.push(cta);
  return parts.join("\n\n");
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
