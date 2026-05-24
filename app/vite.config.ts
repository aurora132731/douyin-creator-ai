import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages 项目页：https://<用户名>.github.io/<仓库名>/
// CI 构建时设置 VITE_BASE_PATH=/douyin-creator-ai/；本地 dev 默认 "./"
const base = process.env.VITE_BASE_PATH || "./";

export default defineConfig({
  plugins: [react()],
  base,
});