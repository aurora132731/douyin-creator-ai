# 创灵 · 抖音创作者 AI 运营工作台

面试演示项目：Web 版创作者 AI 工作台（选题 → 创作 → 发布 → 合规 → 成长 + 指标看板）。

- **完整 PRD**：[`docs/PRD.md`](docs/PRD.md)
- **面试前清单**：[`docs/面试部署清单.md`](docs/面试部署清单.md)
- **3 分钟讲稿**：[`docs/面试讲稿.md`](docs/面试讲稿.md)
- **前端代码**：[`app/`](app/)

**交付方案（已锁定）：** Gitee Pages 静态托管 + 前端 Mock（无后端 / 无真 API），适合 1 天内面试演示。

---

## 一、本地运行

```powershell
cd app
npm install
npm run dev
```

浏览器打开终端里显示的地址（一般是 `http://localhost:5173`）。

---

## 二、代码推到 Gitee（国内 Git）

### 1. 在 Gitee 新建仓库

1. 打开 [https://gitee.com](https://gitee.com) 登录（需实名认证才能用 Pages）
2. 右上角 **「+」→ 新建仓库**
3. 仓库名建议：`douyin-creator-ai`（英文，避免路径问题）
4. **不要**勾选「使用 Readme 初始化」（避免和本地冲突）
5. 创建后记下仓库地址，例如：`git@gitee.com:你的用户名/douyin-creator-ai.git`

### 2. 本地首次推送（在项目根目录 `抖音项目`）

```powershell
cd "c:\Users\aurora\Documents\抖音项目"

git init
git add .
git commit -m "feat: 创灵 MVP - PRD + Web 工作台"
git branch -M main
git remote add origin git@gitee.com:你的用户名/douyin-creator-ai.git
git push -u origin main
```

> 若提示没有 git：安装 [Git for Windows](https://git-scm.com/download/win)  
> 若推送要密码：在 Gitee **设置 → 私人令牌** 生成令牌，或用 SSH 公钥（**设置 → SSH 公钥**）

---

## 三、免费上线给面试官看

| 方案 | 推荐度 | 说明 |
|------|--------|------|
| **[Vercel](https://vercel.com)** | ⭐ 首选 | 连 GitHub 一键部署，约 5 分钟 |
| **[GitHub Pages](https://pages.github.com)** | 备选 | push 后 Actions 自动部署 |
| 腾讯云 | 可选 | 见 [`docs/腾讯云部署.md`](docs/腾讯云部署.md) |

**完整步骤：** [`docs/部署-Vercel与GitHubPages.md`](docs/部署-Vercel与GitHubPages.md)

```text
1. 把代码 push 到 GitHub
2. Vercel 导入仓库，Root Directory 填 app → Deploy
3. 得到 https://xxx.vercel.app 发给面试官
```

### 方式 A：脚本一键部署（推荐）

在项目根目录执行（把地址换成你的）：

```powershell
.\scripts\deploy-gitee.ps1 -GiteeUrl "git@gitee.com:你的用户名/douyin-creator-ai.git"
```

然后在 Gitee 网页：

1. 进入你的仓库 → **服务** → **Gitee Pages**
2. **分支** 选 `gh-pages`，目录选 **`/`（根目录）**
3. 点击 **启动** 或 **更新**
4. 等 1～3 分钟，访问：**`https://你的用户名.gitee.io/douyin-creator-ai/`**

把该链接发给面试官即可。

### 方式 B：手动部署

```powershell
cd app
npm install
npm run build
```

将 `app/dist` 里**所有文件**推到仓库的 `gh-pages` 分支根目录，再在 Gitee 开启 Pages（同上）。

### 若页面空白或资源 404

在 `app` 目录构建前指定仓库路径（仓库名与 URL 路径一致）：

```powershell
$env:VITE_BASE_PATH="/douyin-creator-ai/"
npm run build
```

然后重新执行部署脚本。

---

## 四、面试前检查清单

- [ ] Gitee 仓库为 **公开**（Pages 免费版通常要求公开库）
- [ ] 已开启 Gitee Pages，链接能在手机/电脑浏览器打开
- [ ] 走通一遍：画像 → 选题 → 脚本 → 合规 → 指标页
- [ ] 页脚/指标页能看到「演示数据为 Mock」说明
- [ ] 简历或消息里附上：**在线演示链接** + **Gitee 仓库链接**

**话术示例：**

> 我做了一个 Web 版创作者 AI 工作台 Demo，覆盖 JD 里的全链路和双层指标，在线地址：xxx.gitee.io/xxx ，代码在 Gitee：xxx。

---

## 五、备选免费托管（国内/访问性）

| 平台 | 特点 | 说明 |
|------|------|------|
| **Gitee Pages** | 国内访问快、与 Gitee 一体 | **首选**，本 README 主流程 |
| **腾讯云 CloudBase 静态托管** | 国内 CDN | [云开发控制台](https://console.cloud.tencent.com/tcb) 上传 `app/dist`，有免费额度 |
| **Cloudflare Pages** | 免费、构建方便 | 国内偶有不稳定，可作备份 |
| **Vercel** | 类似 Vercel 体验 | 国内直连不稳定，不建议作唯一演示地址 |

代码仍以 **Gitee** 为主仓即可；若想双备份，可把 Gitee 仓库「导入」到 Cloudflare Pages 关联构建。

---

## 六、项目结构

```
抖音项目/
├── app/                 # React + Vite 前端
├── docs/PRD.md          # 产品需求文档
├── scripts/
│   └── deploy-gitee.ps1 # Gitee Pages 部署脚本
└── README.md            # 本文件
```

---

## 七、常见问题

**Q：Gitee Pages 找不到或要付费？**  
A：确认账号已实名；到仓库 **服务 → Gitee Pages** 查看是否开放。若暂不可用，用腾讯云 CloudBase 上传 `dist` 目录。

**Q：面试官打不开链接？**  
A：发 Gitee 仓库地址 + 本地录屏 30 秒备用；确认仓库 Public、Pages 已启动。

**Q：还需要写 API 吗？**  
A：V1.0 不需要。演示为前端 Mock + 规则引擎；PRD 里 V1.2 再写接抖音开放平台。

---

*演示项目，非字节跳动官方产品。*
