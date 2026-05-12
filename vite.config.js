import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // 替換為你的 GitHub 倉庫名稱，例如 /portfolio/
  base: '/portfolio/', 
})