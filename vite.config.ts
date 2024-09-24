import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import * as child from "child_process"

const commitHash = child.execSync('git rev-parse --short HEAD')
  .toString();

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
