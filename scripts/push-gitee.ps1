# 推送到 Gitee 并部署 Pages（需先配置凭证）
# 用法：
#   .\scripts\push-gitee.ps1
# 或带私人令牌（在 Gitee：设置 -> 私人令牌 生成）：
#   .\scripts\push-gitee.ps1 -Token "你的私人令牌"

param(
    [string]$Token = $env:GITEE_TOKEN,
    [string]$Repo = "https://gitee.com/aurorahyc/douyin-creator-ai.git"
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

Push-Location $Root

if ($Token) {
    $url = $Repo -replace "https://", "https://aurorahyc:${Token}@"
    git remote set-url origin $url
    Write-Host ">> 已使用令牌配置 remote（请勿将令牌提交到仓库）" -ForegroundColor Cyan
} else {
    git remote set-url origin $Repo
    Write-Host ">> 未提供令牌，将使用系统凭据或交互登录" -ForegroundColor Yellow
    Write-Host "   可在 Gitee 生成私人令牌后执行：" -ForegroundColor Yellow
    Write-Host '   $env:GITEE_TOKEN="令牌"; .\scripts\push-gitee.ps1' -ForegroundColor Yellow
}

Write-Host ">> 推送 main 分支..." -ForegroundColor Cyan
git push -u origin main

$deployUrl = if ($Token) { "https://aurorahyc:${Token}@gitee.com/aurorahyc/douyin-creator-ai.git" } else { $Repo }
Pop-Location

& (Join-Path $Root "scripts\deploy-gitee.ps1") -GiteeUrl $deployUrl

Write-Host ""
Write-Host "完成！请到 Gitee 开启 Pages：" -ForegroundColor Green
Write-Host "  https://gitee.com/aurorahyc/douyin-creator-ai -> 服务 -> Gitee Pages" -ForegroundColor Green
Write-Host "  分支 gh-pages，目录 /" -ForegroundColor Green
Write-Host "  访问: https://aurorahyc.gitee.io/douyin-creator-ai/" -ForegroundColor Green
