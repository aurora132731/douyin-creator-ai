# 构建并打包 app/dist，供腾讯云静态托管上传
# 用法：.\scripts\prepare-tencent-upload.ps1

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$AppDir = Join-Path $Root "app"
$DistDir = Join-Path $AppDir "dist"
$ReleaseDir = Join-Path $Root "release"
$ZipPath = Join-Path $ReleaseDir "chuangling-web.zip"

$npm = if (Test-Path "$env:ProgramFiles\nodejs\npm.cmd") {
  "$env:ProgramFiles\nodejs\npm.cmd"
} else {
  "npm"
}

Write-Host ">> 构建前端..." -ForegroundColor Cyan
Push-Location $AppDir
& $npm install
& $npm run build
if ($LASTEXITCODE -ne 0) { Pop-Location; exit 1 }
Pop-Location

if (-not (Test-Path $DistDir)) {
  Write-Error "未找到 dist 目录: $DistDir"
}

if (-not (Test-Path $ReleaseDir)) {
  New-Item -ItemType Directory -Path $ReleaseDir | Out-Null
}

if (Test-Path $ZipPath) { Remove-Item -Force $ZipPath }

Write-Host ">> 打包 dist -> release/chuangling-web.zip ..." -ForegroundColor Cyan
Compress-Archive -Path "$DistDir\*" -DestinationPath $ZipPath -Force

Write-Host ""
Write-Host "完成！" -ForegroundColor Green
Write-Host "  文件夹上传: $DistDir" -ForegroundColor Green
Write-Host "  ZIP 上传:   $ZipPath" -ForegroundColor Green
Write-Host ""
Write-Host "下一步: 打开 https://console.cloud.tencent.com/tcb" -ForegroundColor Yellow
Write-Host "  静态网站托管 -> 上传文件夹(选 dist) 或 上传 ZIP" -ForegroundColor Yellow
Write-Host "  详细步骤见 docs/腾讯云部署.md" -ForegroundColor Yellow
