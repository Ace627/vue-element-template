import Layout from '@/layout/index.vue'
import type { RouteRecordRaw } from 'vue-router'

export const STATIC_ROUTE_LIST: RouteRecordRaw[] = [
  {
    name: 'Layout', // 布局路由配置 确保可以显示布局框架
    path: '',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        name: 'Dashboard',
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '首页', icon: 'Home', affix: true },
      },
    ],
  },
]
