import type { App } from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue'

/* 异步注册避免进首屏主包，仅渲染到时才加载对应 chunk */
const ProChart = defineAsyncComponent(() => import('@/components/ProChart/index.vue'))

export function registerGlobalComponent(app: App<any>) {
  app.component('SvgIcon', SvgIcon)
  app.component('ProChart', ProChart)
}
