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
      /** 图片转 base64 编码的阈值。为防止过多的 http 请求，Vite 会将小于此阈值的图片转为 base64 格式 */
      assetsInlineLimit: 1024,
      /** 规定触发警告的 chunk 大小。（以 kbs 为单位） */
      chunkSizeWarningLimit: 1024,
      /** 启用/禁用 CSS 代码拆分 */
      cssCodeSplit: true,
      /** 构建后是否生成 source map 文件 */
      sourcemap: false,
      /** 是否在构建阶段将 publicDir 目录中的所有文件复制到 outDir 目录中 */
      copyPublicDir: true,
      rolldownOptions: {
        checks: {
          // 关闭构建耗时诊断输出（PLUGIN_TIMINGS），仅影响日志提示不影响实际构建（禁用插件计时器检查，以提高构建性能）
          bundlerTimings: false,
        },
        output: {
          // 按依赖来源拆包，避免 ECharts 等大依赖挤进同一个超过 500 kB 的 chunk
          codeSplitting: {
            groups: [
              // zrender 是 echarts 的渲染引擎，priority 必须高于 echarts，否则会被 echarts-core 一并收走
              { name: 'zrender', test: /node_modules[\\/]zrender[\\/]/, priority: 30 },
              // echarts 为按需引入，图表与组件分别成块，避免单个 chunk 过大
              { name: 'echarts-charts', test: /node_modules[\\/]echarts[\\/](lib[\\/]chart[\\/]|charts\.js)/, priority: 29 },
              { name: 'echarts-components', test: /node_modules[\\/]echarts[\\/](lib[\\/]component[\\/]|components\.js)/, priority: 28 },
              { name: 'echarts-core', test: /node_modules[\\/]echarts[\\/]/, priority: 27 },
              { name: 'element-plus', test: /node_modules[\\/](@element-plus[\\/]|element-plus[\\/])/, priority: 26 },
              { name: 'vue', test: /node_modules[\\/](vue|@vue)[\\/]/, priority: 25 },
              { name: 'pinia', test: /node_modules[\\/]pinia[\\/]/, priority: 24 },
              { name: 'vue-router', test: /node_modules[\\/]vue-router[\\/]/, priority: 23 },
              { name: 'axios', test: /node_modules[\\/]axios[\\/]/, priority: 22 },
              { name: 'dayjs', test: /node_modules[\\/]dayjs[\\/]/, priority: 21 },
            ],
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
