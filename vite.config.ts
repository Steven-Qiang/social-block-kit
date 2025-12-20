import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import { defineConfig } from 'vite';
import monkey, { cdn, util } from 'vite-plugin-monkey';
import pkg from './package.json';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    cors: true,
  },
  plugins: [
    AutoImport({
      imports: [util.unimportPreset],
    }),
    vue(),
    monkey({
      entry: 'src/main.ts',
      userscript: {
        name: '社交平台自动拉黑工具',
        namespace: 'social-block-kit',
        version: pkg.version,
        description: pkg.description,
        author: pkg.author,
        grant: [
          'GM_getValue',
          'GM_setValue'
        ],
        match: [
          'https://www.douyin.com/*',
          'https://www.bilibili.com/*',
          'https://search.bilibili.com/*',
          'https://account.bilibili.com/account/blacklist*',
        ],
        downloadURL: 'https://github.com/Steven-Qiang/social-block-kit/releases/latest/download/social-block-kit.user.js',
      },
      build: {
        externalGlobals: {
          vue: cdn.jsdelivr('Vue', 'dist/vue.global.prod.js'),
        },
      },
    }),
  ],
});
