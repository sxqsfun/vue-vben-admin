import { defineApplicationConfig } from '@vben/vite-config';
import { resolve } from 'path';

export default defineApplicationConfig({
  overrides: {
    resolve: {
      alias: {
        '@img': resolve(__dirname, 'src/assets/images'), // 图片路径别名
        '@': resolve(__dirname, 'src/'), // 根路徑
      },
      extensions: ['.js', '.json', '.ts', '.tsx', '.jsx'], // 使用路径别名时想要省略的后缀名，可以自己 增减
    },
    optimizeDeps: {
      include: [
        'echarts/core',
        'echarts/charts',
        'echarts/components',
        'echarts/renderers',
        'qrcode',
        '@iconify/iconify',
        'ant-design-vue/es/locale/zh_CN',
        'ant-design-vue/es/locale/en_US',
      ],
    },
    server: {
      proxy: {
        '/basic-api': {
          // target: 'http://10.0.1.37:9010',
          target: 'http://localhost:9010',
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(new RegExp(`^/basic-api`), ''),
          // only https
          // secure: false
        },
        '/upload': {
          target: 'http://localhost:3300/upload',
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(new RegExp(`^/upload`), ''),
        },
      },
    },
  },
});
