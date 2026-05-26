/** 文档静态资源与 GitHub 仓库链接（适配 GitHub Pages base path） */
const BASE = import.meta.env.BASE_URL;

export const DOC_LINKS = {
  prd: {
    local: `${BASE}docs/PRD.md`,
    github:
      "https://github.com/aurora132731/douyin-creator-ai/blob/main/docs/PRD.md",
  },
  script: {
    local: `${BASE}docs/面试讲稿.md`,
    github:
      "https://github.com/aurora132731/douyin-creator-ai/blob/main/docs/面试讲稿.md",
  },
  demo: "https://aurora132731.github.io/douyin-creator-ai/",
  repo: "https://github.com/aurora132731/douyin-creator-ai",
} as const;
