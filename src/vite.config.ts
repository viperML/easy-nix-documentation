import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'


const __dirname = dirname(fileURLToPath(import.meta.url))


export default defineConfig({
  plugins: [
    // @ts-ignore
    vue()
  ],
  build: {
    lib: {
      name: "easy-nix-documentation",
      entry: {
        index: resolve(__dirname, "index.ts"),
        loader: resolve(__dirname, "loader.ts")
      },
      formats: ["es"]
    },
    rollupOptions: {
      external: [
        /^node:.*/, "vue", "vitepress",
      ],
      output: {
        globals: {
          vue: "Vue,"
        },
      }
    },
    sourcemap: true,
  },
  optimizeDeps: {
    exclude: ["node"]
  }
})
