// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import content from '@originjs/vite-plugin-content' // 暫時註解掉

export default defineConfig({
  plugins: [
    react(),
    // content() // 暫時註解掉，因為我們手動處理了 .md 和 .yml
  ],
  base: '/portfolio/',
})