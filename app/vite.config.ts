import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Gitee Pages 项目页地址为 https://<用户名>.gitee.io/<仓库名>/
// 默认用相对路径 "./"，一般无需改；若资源 404，在构建前设置环境变量：
//   $env:VITE_BASE_PATH="/你的仓库名/"
const base = process.env.VITE_BASE_PATH || "./";

export default defineConfig({
  plugins: [react()],
  base,
});