import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // Relative base so assets resolve correctly under any GitHub Pages subdirectory
  base: './',
  plugins: [react()],
  build: {
    // Output to 'docs/' — matches the GitHub Pages source directory
    outDir: 'docs',
  },
})