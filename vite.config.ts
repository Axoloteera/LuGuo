import { defineConfig } from 'vite';
import monkey, { util } from 'vite-plugin-monkey';
import AutoImport from 'unplugin-auto-import/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    AutoImport({
      imports: [
          util.unimportPreset
      ]
    }),
    monkey({
      entry: 'src/main.ts',
      userscript: {
        icon: 'https://www.luogu.com.cn/favicon.ico',
        namespace: 'github/luguo',
        match: [
            'https://*.luogu.com.cn/*',
            'https://*.luogu.com/*'
        ],
        "run-at": "document-idle", // 等待洛谷加载完毕
      },
    }),
  ],
});
