import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Build into ./dist so our existing server.py can serve it.
// Base path: site is at https://clock.ethanshermes.com/ — root, not a subpath.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2020',
    cssCodeSplit: false,
  },
})
