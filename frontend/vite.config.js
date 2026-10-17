import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    // Proxy avoids CORS issues during local development by forwarding to the API gateway
    proxy: {
      '/auth': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:4004',
        changeOrigin: true,
      },
      '/api': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:4004',
        changeOrigin: true,
      },
    },
  },
})
