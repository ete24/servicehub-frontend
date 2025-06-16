// vite.config.js (located at servicehub-frontend/vite.config.js)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Explicitly tell Vite to use PostCSS for CSS processing, pointing to your config file
  css: {
    postcss: './postcss.config.js', // This path is relative to vite.config.js
  },
})
