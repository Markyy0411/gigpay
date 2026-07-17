import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/supabase': {
        target: 'https://gulshfticoirrpuohdxk.supabase.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/supabase/, '')
      }
    }
  }
})
