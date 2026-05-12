import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/portfolio/', // 這裡必須與 https://oosululyoo.github.io/portfolio/ 一致
})