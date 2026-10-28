import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// `npm run build` → normal multi-file build in /dist (deploy this).
// SINGLE=1 npm run build → one self-contained HTML file (used for previews).
export default defineConfig(async () => {
  const plugins = [react()]
  if (process.env.SINGLE) {
    const { viteSingleFile } = await import('vite-plugin-singlefile')
    plugins.push(viteSingleFile())
  }
  return { plugins }
})
