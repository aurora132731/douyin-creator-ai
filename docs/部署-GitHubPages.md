# GitHub Pages 部署指南（创灵）

> 在线演示地址：**https://aurora132731.github.io/douyin-creator-ai/**  
> 代码仓库：**https://github.com/aurora132731/douyin-creator-ai**

---

## 一、自动部署（已配置）

推送 `main` 分支后，GitHub Actions 会自动构建并发布（`.github/workflows/deploy-github-pages.yml`）。

```powershell
cd "c:\Users\aurora\Documents\抖音项目"
git add .
git commit -m "update"
git push github main
```

---

## 二、首次开启 Pages（只需做一次）

1. 打开 https://github.com/aurora132731/douyin-creator-ai/settings/pages  
2. **Build and deployment → Source** 选择 **GitHub Actions**  
3. 打开 https://github.com/aurora132731/douyin-creator-ai/actions  
4. 确认 **Deploy GitHub Pages** 工作流为绿色 ✅  

访问：**https://aurora132731.github.io/douyin-creator-ai/**

---

## 三、面试前检查

- [ ] Actions 最近一次运行成功  
- [ ] 手机 + 电脑能打开 Pages 链接  
- [ ] 走通：总览 → 选题 → 脚本 → 合规 → 指标  

---

## 四、发给面试官

```
在线体验：
https://aurora132731.github.io/douyin-creator-ai/

代码与 PRD：
https://github.com/aurora132731/douyin-creator-ai
（完整 PRD：docs/PRD.md）

说明：Web 工作台 Mock 演示，覆盖创作者全链路与双层指标设计。
```

---

## 五、常见问题

| 问题 | 处理 |
|------|------|
| Actions 失败 | 点进失败 run 查看 `npm run build` 日志 |
| 白屏 | 确认 Pages Source = GitHub Actions；等部署完成 |
| 国内打开慢 | 面试可备用：本地 `cd app && npm run dev` 共享屏幕 |
| 只改了代码没更新线上 | `git push github main` 后等 Actions 跑完 |

---

## 六、本地构建（可选）

```powershell
cd app
npm install
npm run build
# 产物在 app/dist，由 CI 自动上传，无需手动上传
```

---

*不使用 Vercel / Gitee Pages；以 GitHub Pages 为唯一在线演示方案。*
