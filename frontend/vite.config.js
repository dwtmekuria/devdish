import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: 'esnext',
    rollupOptions: {
      external: [], // Ensure no modules are being externalized incorrectly
    },
  },
  esbuild: {
    target: 'esnext',
  },
})