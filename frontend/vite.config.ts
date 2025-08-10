import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/gitlab": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
      "/github": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
       "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  }
})
