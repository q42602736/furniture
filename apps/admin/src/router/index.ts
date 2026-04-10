import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/dashboard',
    component: () => import('@/layouts/default-layout/DefaultLayout.vue'),
    meta: { middleware: 'auth' },
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/Index.vue'),
        meta: { pageTitle: '平台总览', breadcrumbs: ['仪表盘'] },
      },
      // 商品管理
      {
        path: '/products',
        name: 'products',
        component: () => import('@/views/ecommerce/ProductList.vue'),
        meta: { pageTitle: '商品管理', breadcrumbs: ['电商管理', '商品管理'] },
      },
      {
        path: '/products/add',
        name: 'product-add',
        component: () => import('@/views/ecommerce/ProductForm.vue'),
        meta: { pageTitle: '新增商品', breadcrumbs: ['电商管理', '商品管理', '新增商品'] },
      },
      {
        path: '/products/:id/edit',
        name: 'product-edit',
        component: () => import('@/views/ecommerce/ProductForm.vue'),
        meta: { pageTitle: '编辑商品', breadcrumbs: ['电商管理', '商品管理', '编辑商品'] },
      },
      // 分类管理
      {
        path: '/categories',
        name: 'categories',
        component: () => import('@/views/ecommerce/CategoryList.vue'),
        meta: { pageTitle: '分类管理', breadcrumbs: ['电商管理', '分类管理'] },
      },
      // 订单管理
      {
        path: '/orders',
        name: 'orders',
        component: () => import('@/views/ecommerce/OrderList.vue'),
        meta: { pageTitle: '订单管理', breadcrumbs: ['电商管理', '订单管理'] },
      },
      {
        path: '/orders/:id',
        name: 'order-detail',
        component: () => import('@/views/ecommerce/OrderDetail.vue'),
        meta: { pageTitle: '订单详情', breadcrumbs: ['电商管理', '订单管理', '订单详情'] },
      },
      // 用户管理
      {
        path: '/users',
        name: 'users',
        component: () => import('@/views/user/UserList.vue'),
        meta: { pageTitle: '用户管理', breadcrumbs: ['用户与内容', '用户管理'] },
      },
      {
        path: '/users/:id',
        name: 'user-detail',
        component: () => import('@/views/user/UserDetail.vue'),
        meta: { pageTitle: '用户详情', breadcrumbs: ['用户与内容', '用户管理', '用户详情'] },
      },
      // Banner 管理
      {
        path: '/banners',
        name: 'banners',
        component: () => import('@/views/content/BannerList.vue'),
        meta: { pageTitle: 'Banner 管理', breadcrumbs: ['用户与内容', 'Banner 管理'] },
      },
      // 系统设置
      {
        path: '/settings',
        name: 'settings',
        component: () => import('@/views/system/Settings.vue'),
        meta: { pageTitle: '系统设置', breadcrumbs: ['系统', '系统设置'] },
      },
      // 报表
      {
        path: '/reports/sales',
        name: 'report-sales',
        component: () => import('@/views/ecommerce/SalesReport.vue'),
        meta: { pageTitle: '销售报表', breadcrumbs: ['报表', '销售报表'] },
      },
      {
        path: '/reports/customers',
        name: 'report-customers',
        component: () => import('@/views/ecommerce/CustomerOrdersReport.vue'),
        meta: { pageTitle: '客户订单报表', breadcrumbs: ['报表', '客户订单报表'] },
      },
      {
        path: '/reports/shipping',
        name: 'report-shipping',
        component: () => import('@/views/ecommerce/ShippingReport.vue'),
        meta: { pageTitle: '物流报表', breadcrumbs: ['报表', '物流报表'] },
      },
      {
        path: '/reports/returns',
        name: 'report-returns',
        component: () => import('@/views/ecommerce/ReturnsReport.vue'),
        meta: { pageTitle: '退货报表', breadcrumbs: ['报表', '退货报表'] },
      },
    ],
  },
  {
    path: '/sign-in',
    name: 'sign-in',
    component: () => import('@/views/auth/Login.vue'),
    meta: { pageTitle: '管理员登录' },
  },
  // 兼容旧路由
  {
    path: '/login',
    redirect: '/sign-in',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫：未登录跳转登录页
router.beforeEach((to) => {
  const authStore = useAuthStore()
  if (to.meta.middleware === 'auth' && !authStore.isAuthenticated) {
    return { name: 'sign-in' }
  }
  if (to.name === 'sign-in' && authStore.isAuthenticated) {
    return { name: 'dashboard' }
  }
})

export default router

