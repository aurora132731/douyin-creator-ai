# 构建并推送到 Gitee 的 gh-pages 分支（供 Gitee Pages 使用）
# 用法（在项目根目录）：
#   .\scripts\deploy-gitee.ps1 -GiteeUrl "git@gitee.com:你的用户名/仓库名.git"

param(
    [Parameter(Mandatory = $true)]
    [string]$GiteeUrl
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$AppDir = Join-Path $Root "app"
$TmpDir = Join-Path $Root ".deploy-tmp"

Write-Host ">> 安装依赖并构建..." -ForegroundColor Cyan
Push-Location $AppDir
npm install
npm run build
if ($LASTEXITCODE -ne 0) { Pop-Location; exit 1 }
Pop-Location

if (Test-Path $TmpDir) { Remove-Item -Recurse -Force $TmpDir }
New-Item -ItemType Directory -Path $TmpDir | Out-Null

Copy-Item -Recurse (Join-Path $AppDir "dist\*") $TmpDir

Push-Location $TmpDir
git init | Out-Null
git checkout -b gh-pages 2>$null
if ($LASTEXITCODE -ne 0) { git checkout gh-pages }
git add -A
git commit -m "deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
git remote remove origin 2>$null
git remote add origin $GiteeUrl
Write-Host ">> 推送到 gh-pages 分支..." -ForegroundColor Cyan
git push -f origin gh-pages
Pop-Location

Remove-Item -Recurse -Force $TmpDir
Write-Host ""
Write-Host "完成。请到 Gitee 仓库 -> 服务 -> Gitee Pages -> 选择 gh-pages 分支 -> 更新" -ForegroundColor Green
Write-Host "访问地址一般为: https://<你的用户名>.gitee.io/<仓库名>/" -ForegroundColor Green
