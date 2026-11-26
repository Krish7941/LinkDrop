import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isExtension = mode.startsWith('extension-')
  const isDevelopmentBuild = mode === 'extension-dev'

  return {
    plugins: [react()],
    base: isExtension ? './' : '/',
    build: isExtension
      ? {
          outDir: isDevelopmentBuild ? 'dist-extension-dev' : 'dist-extension',
          minify: !isDevelopmentBuild,
          sourcemap: isDevelopmentBuild,
        }
      : undefined,
  }
})
