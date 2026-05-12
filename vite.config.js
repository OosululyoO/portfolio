import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // 這裡非常重要！必須對應你的 GitHub Repo 名稱
  base: '/portfolio/', 
  plugins: [
    react(),
    tailwindcss(),
  ],
})