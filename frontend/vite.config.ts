import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
    // Docker Desktop on Windows does not forward file-change events into containers.
    watch: { usePolling: process.env.VITE_USE_POLLING === 'true' },
  },
})
