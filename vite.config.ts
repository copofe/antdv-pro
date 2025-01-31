/// <reference types="vitest" />

import { fileURLToPath } from 'node:url'
import * as process from 'node:process'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import AntdvResolver from 'antdv-component-resolver'

const baseSrc = fileURLToPath(new URL('./src', import.meta.url))
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const ENV = loadEnv(mode, process.cwd())
  const mockEnable = ENV.VITE_MOCK_ENABLE === 'true'

  return {
    plugins: [
      vue(),
      vueJsx(),
      AutoImport({
        imports: [
          'vue',
          'vue-router',
          'vue-i18n',
          '@vueuse/core',
          'pinia',
        ],
        dts: 'types/auto-imports.d.ts',
        dirs: ['src/view/stores', 'src/view/composables'],
      }),
      Components({
        resolvers: [AntdvResolver()],
        dts: 'types/components.d.ts',
        dirs: ['src/view/components'],
      }),
    ],
    resolve: {
      alias: [
        {
          find: 'dayjs',
          replacement: 'dayjs/esm',
        },
        {
          find: /^dayjs\/locale/,
          replacement: 'dayjs/esm/locale',
        },
        {
          find: /^dayjs\/plugin/,
          replacement: 'dayjs/esm/plugin',
        },
        {
          find: 'vue-i18n',
          replacement: mode === 'development' ? 'vue-i18n/dist/vue-i18n.esm-browser.js' : 'vue-i18n/dist/vue-i18n.esm-bundler.js',
        },
        {
          find: /^ant-design-vue\/es$/,
          replacement: 'ant-design-vue/es',
        },
        {
          find: /^ant-design-vue\/dist$/,
          replacement: 'ant-design-vue/dist',
        },
        {
          find: /^ant-design-vue\/lib$/,
          replacement: 'ant-design-vue/es',
        },
        {
          find: /^ant-design-vue$/,
          replacement: 'ant-design-vue/es',
        },
        {
          find: 'lodash',
          replacement: 'lodash-es',
        },
        {
          find: '::',
          replacement: baseSrc,
        },
      ],
    },
    build: {
      chunkSizeWarningLimit: 4096,
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia', 'vue-i18n', '@vueuse/core'],
            antd: ['ant-design-vue', '@ant-design/icons-vue', 'dayjs'],
            // lodash: ['loadsh-es'],
          },
        },
      },
    },
    server: {
      port: 6678,
      proxy: {
        '/api': mockEnable ? ENV.VITE_MOCK_SERVER : ENV.VITE_API_BASE_URL,
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
    },
  }
})
