import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import { setupVitePlugins } from './build/plugins/index.ts'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isBuild = mode === 'production'
  const runtimeConfig = loadEnv(mode, process.cwd())

  return {
    // 部署应用包时的基本 URL
    base: runtimeConfig.VITE_PUBLIC_PATH ?? '/',

    plugins: setupVitePlugins(isBuild),

    resolve: {
      alias: {
        /** 设置 `@` 指向 `src` 目录 */
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },

    server: {
      // 指定开发服务器端口；端口被占用时 Vite 会自动尝试下一个可用端口
      port: Number(runtimeConfig.VITE_SERVER_PORT ?? 5173),
    },

    css: {
      /**
       * 如果启用了这个选项，那么 CSS 预处理器会尽可能在 worker 线程中运行；即通过多线程运行 CSS 预处理器，从而极大提高其处理速度
       * https://cn.vitejs.dev/config/shared-options#css-preprocessormaxworkers
       */
      preprocessorMaxWorkers: true,
      /**
       * 建议只用来嵌入 SCSS 的变量声明文件，嵌入后全局可用
       * 该选项可以用来为每一段样式内容添加额外的代码。但是要注意，如果你添加的是实际的样式而不仅仅是变量，那这些样式在最终的产物中会重复。
       * https://cn.vitejs.dev/config/shared-options.html#css-preprocessoroptions-extension-additionaldata
       */
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/element-plus/el-theme-light.scss";`,
        },
      },
    },

    build: {
      // 指定打包文件的输出目录
      outDir: runtimeConfig.VITE_OUTPUT_DIR ?? 'dist',
      chunkSizeWarningLimit: 1024,

      rolldownOptions: {
        checks: {
          // 关闭构建耗时诊断输出（PLUGIN_TIMINGS），仅影响日志提示不影响实际构建
          bundlerTimings: false,
        },
        output: {
          // 按依赖来源手动拆包，避免 ECharts 等大依赖挤进同一个超过 500 kB 的 chunk
          manualChunks(id: string) {
            if (!id.includes('node_modules')) return
            const path = id.replace(/\\/g, '/')
            if (path.includes('/zrender/')) return 'zrender'
            if (path.includes('/lib/chart/') || path.includes('/charts.js')) return 'echarts-charts'
            if (path.includes('/lib/component/') || path.includes('/components.js')) return 'echarts-components'
            if (path.includes('/echarts/')) return 'echarts-core'
            if (path.includes('element-plus') || path.includes('@element-plus')) return 'element-plus'
            if (path.includes('@vue') || path.includes('pinia') || path.includes('vue-router') || path.includes('/vue/')) return 'vue-vendor'
            return 'vendor'
          },
          minify: {
            compress: {
              // 是否移除 console 语句（环境变量不为 'false' 时启用，默认启用）
              dropConsole: runtimeConfig.VITE_DROP_CONSOLE !== 'false',
              // 是否移除 debugger 调试语句（环境变量不为 'false' 时启用，默认启用）
              dropDebugger: runtimeConfig.VITE_DROP_DEBUGGER !== 'false',
            },
          },
        },
      },
    },
  }
})
