import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isProd = process.env.NODE_ENV === 'production'

export default defineConfig({
  base: isProd ? '/monorepo/' : '/',
  plugins: [react()],
  server: {
    port: 4174,
  },
})
