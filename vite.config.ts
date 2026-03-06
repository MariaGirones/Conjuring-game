import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // Must match the GitHub repository name for GitHub Pages to resolve assets correctly
  base: '/Conjuring-game/',
  plugins: [react()],
  build: {
    // Output to 'dist/' — the GitHub Actions workflow uploads this directory
    outDir: 'dist',
  },
})