import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // 1. 引入 Tailwind 外掛

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 2. 啟動 Tailwind 外掛
  ],
  base: '/portfolio/', 
})