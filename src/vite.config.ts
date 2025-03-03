import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { libInjectCss } from 'vite-plugin-lib-inject-css';


const __dirname = dirname(fileURLToPath(import.meta.url))


export default defineConfig({
  plugins: [
    // @ts-ignore
    vue(),
    // @ts-ignore
    dts(),
    // @ts-ignore
    libInjectCss()
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
        // Put chunk files at <output>/chunks
        chunkFileNames: 'chunks/[name].[hash].js',
        // Put chunk styles at <output>/assets
        assetFileNames: 'assets/[name][extname]',
        entryFileNames: '[name].js',
      }
    },
    sourcemap: true,
    minify: false,
    cssMinify: false,
  },
  optimizeDeps: {
    exclude: ["node"]
  }
})
