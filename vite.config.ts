import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import * as child from "child_process"

const envHash = process.env.VITE_COMMIT_HASH?.trim()
let commitHash = envHash && envHash !== "unknown" ? envHash : "unknown"
if (commitHash === "unknown") {
  try {
    commitHash = child.execSync('git rev-parse --short HEAD')
      .toString()
      .trim();
  } catch (error) {
    // Not inside a git repository (e.g. docker build without .git in context).
    console.warn('git rev-parse failed, using "unknown" as commit hash:', error)
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __COMMIT_HASH__: JSON.stringify(commitHash),
  },
  resolve: {
    alias: {
      lodash: 'lodash-es'
    }
  },
  plugins: [react()],
})
