# 在线部署：Vercel vs GitHub Pages

## 怎么选？

| | **Vercel（推荐）** | **GitHub Pages** |
|---|-------------------|------------------|
| 上手难度 | ⭐ 最简单，连仓库即部署 | ⭐⭐ 需在 Settings 开 Pages |
| 国内访问 | 多数情况可打开，偶发慢 | `github.io` 有时慢或被墙 |
| 自动更新 | push 即部署 | push 触发 Actions |
| 适合面试 | ✅ 链接好发、稳定 | ✅ 代码同平台，偏技术向 |

**建议：优先 Vercel；若 Vercel 打不开再试 GitHub Pages。**

代码仓库（Gitee 已有）：https://gitee.com/aurorahyc/douyin-creator-ai  
建议 **同步一份到 GitHub**（Vercel / Pages 都从 GitHub 拉代码最省事）。

---

## 方案 A：Vercel（推荐，约 5 分钟）

### 1. 代码放到 GitHub

在 https://github.com/new 新建仓库 `douyin-creator-ai`（公开、不要初始化 README）。

本地执行（已有 git 可跳过 init）：

```powershell
cd "c:\Users\aurora\Documents\抖音项目"
git remote add github https://github.com/你的用户名/douyin-creator-ai.git
git push -u github main
```

若已有 `origin` 指向 Gitee，可保留双 remote：

```powershell
git remote add github https://github.com/你的用户名/douyin-creator-ai.git
git push -u github main
```

### 2. 导入 Vercel

1. 打开 https://vercel.com → **Sign Up** → 用 **GitHub** 登录  
2. **Add New → Project** → 选择 `douyin-creator-ai`  
3. 配置（一般会自动识别，核对即可）：
   - **Root Directory**：`app`
   - **Framework Preset**：Vite
   - **Build Command**：`npm run build`
   - **Output Directory**：`dist`
4. 点 **Deploy**，等 1～2 分钟  

### 3. 获得链接

部署成功后会得到：

```
https://douyin-creator-ai.vercel.app
```

（或带随机后缀的域名，以 Vercel 面板为准。）

### 4. 更新网站

以后改代码：

```powershell
git add .
git commit -m "update"
git push github main
```

Vercel 会自动重新部署。

---

## 方案 B：GitHub Pages（约 8 分钟）

### 1. 推送代码到 GitHub

同方案 A 第 1 步。

### 2. 开启 Pages

1. 打开 GitHub 仓库 → **Settings** → **Pages**  
2. **Build and deployment** → **Source** 选 **GitHub Actions**  
3. 推送 `main` 分支后，Actions 会自动跑 `.github/workflows/deploy-github-pages.yml`  

### 3. 查看部署

- **Actions** 页看 workflow 是否绿色 ✅  
- **Settings → Pages** 里会显示站点地址：

```
https://你的用户名.github.io/douyin-creator-ai/
```

### 4. 注意

- 项目页地址带 **仓库名** 路径，已在 CI 里设置 `VITE_BASE_PATH=/仓库名/`  
- 若 Actions 失败，在 Actions 日志里查看 `npm run build` 报错

---

## 发给面试官

```
在线体验（Vercel）：
https://你的项目.vercel.app

代码与 PRD：
https://github.com/你的用户名/douyin-creator-ai
（或 Gitee：https://gitee.com/aurorahyc/douyin-creator-ai）

本地运行：cd app && npm install && npm run dev
```

---

## 常见问题

| 问题 | 处理 |
|------|------|
| Vercel 构建失败 | 确认 Root Directory = `app` |
| GitHub Pages 白屏 | 确认 Pages Source = GitHub Actions；等 Actions 跑完 |
| 国内打不开 Vercel | 换 GitHub Pages 链接，或面试时本地 `npm run dev` 共享屏幕 |
| 只有 Gitee 没有 GitHub | 在 GitHub 导入：`New repository → Import from URL` 填 Gitee 地址 |

---

*项目根目录 `vercel.json` 与 `.github/workflows/deploy-github-pages.yml` 已配置好。*
