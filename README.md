# 创灵 · 抖音创作者 AI 运营工作台

面试演示项目：Web 版创作者 AI 工作台（选题 → 创作 → 发布 → 合规 → 成长 + 指标看板）。

- **在线演示**：https://aurora132731.github.io/douyin-creator-ai/
- **GitHub**：https://github.com/aurora132731/douyin-creator-ai
- **Gitee（备份）**：https://gitee.com/aurorahyc/douyin-creator-ai
- **完整 PRD**：[`docs/PRD.md`](docs/PRD.md)
- **面试部署清单**：[`docs/面试部署清单.md`](docs/面试部署清单.md)（含 GitHub Pages 步骤）
- **3 分钟讲稿**：[`docs/面试讲稿.md`](docs/面试讲稿.md)

**交付方案：** GitHub Pages + 前端 Mock（无后端 / 无真 API）

---

## 一、本地运行

```powershell
cd app
npm install
npm run dev
```

浏览器打开 `http://localhost:5173`。

---

## 二、推送到 GitHub（更新线上演示）

```powershell
cd "c:\Users\aurora\Documents\抖音项目"
git add .
git commit -m "update"
git push github main
```

推送后 Actions 自动部署，约 1～2 分钟生效。

---

## 三、GitHub Pages 首次开启（只需一次）

1. https://github.com/aurora132731/douyin-creator-ai/settings/pages
2. **Source** → **GitHub Actions**
3. 在 [Actions](https://github.com/aurora132731/douyin-creator-ai/actions) 确认部署成功

详见 [`docs/面试部署清单.md`](docs/面试部署清单.md)。

---

## 四、面试前检查

- [ ] https://aurora132731.github.io/douyin-creator-ai/ 可打开
- [ ] 走通：画像 → 选题 → 脚本 → 合规 → 指标
- [ ] 简历附上 **Pages 链接** + **GitHub 仓库链接**

**话术：**

> 创灵覆盖 JD 全链路与双层指标。在线 Demo：https://aurora132731.github.io/douyin-creator-ai/ ，代码：https://github.com/aurora132731/douyin-creator-ai

---

## 五、项目结构

```
抖音项目/
├── app/                 # React + Vite 前端
├── docs/PRD.md
├── .github/workflows/   # GitHub Pages 自动部署
└── README.md
```

---

*演示项目，非字节跳动官方产品。*
