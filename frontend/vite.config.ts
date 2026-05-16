import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// In Docker the shared dir is mounted separately; SHARED_PATH overrides the default
const sharedPath = process.env.SHARED_PATH ?? path.resolve(__dirname, '../shared')

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': sharedPath,
    },
  },
  server: {
    host: true,
    watch: {
      usePolling: true
    },
    proxy: {
      '/api': 'http://backend:3000'
    }
  }
})
//Disable polling on linux