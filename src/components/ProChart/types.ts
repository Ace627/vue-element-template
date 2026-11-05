import type { EChartsOption } from 'echarts'

/**
 * 图表组件属性
 */
export interface ProChartProps {
  /** 容器自定义类名 */
  customClass?: string
  /** ECharts 核心配置项，遵循 ECharts 官方配置规范；默认空对象 */
  options?: EChartsOption
}
