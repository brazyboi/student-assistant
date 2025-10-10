import { defineConfig } from 'vite'
import path from "path"
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
  // Force Vite to pre-bundle these dependencies to avoid "Outdated Optimize Dep" requests
  optimizeDeps: {
    include: ["react-katex", "katex"]
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  }
})
