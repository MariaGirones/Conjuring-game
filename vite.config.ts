import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // Absolute base path matching the GitHub Pages subdirectory
  base: '/Conjuring-game/',
  plugins: [react()],
  build: {
    // Output to 'docs/' — matches the GitHub Pages source directory
    outDir: 'docs',
  },
})