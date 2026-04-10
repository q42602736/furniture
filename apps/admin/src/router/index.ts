import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/views/dashboard/Index.vue'),
          meta: { title: '平台总览' },
        },
        // 商品管理
        {
          path: 'products',
          name: 'products',
          component: () => import('@/views/ecommerce/ProductList.vue'),
          meta: { title: '商品管理' },
        },
        // 分类管理
        {
          path: 'categories',
          name: 'categories',
          component: () => import('@/views/ecommerce/CategoryList.vue'),
          meta: { title: '分类管理' },
        },
        // 订单管理
        {
          path: 'orders',
          name: 'orders',
          component: () => import('@/views/ecommerce/OrderList.vue'),
          meta: { title: '全平台订单' },
        },
        // 用户管理
        {
          path: 'users',
          name: 'users',
          component: () => import('@/views/user/UserList.vue'),
          meta: { title: '用户管理' },
        },
        // 内容管理
        {
          path: 'banners',
          name: 'banners',
          component: () => import('@/views/content/BannerList.vue'),
          meta: { title: 'Banner 管理' },
        },
        // 系统设置
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/views/system/Settings.vue'),
          meta: { title: '系统设置' },
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/Login.vue'),
      meta: { title: '管理员登录' },
    },
  ],
})

// 路由守卫：未登录跳转登录页
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('admin_token')
  if (to.matched.some((r) => r.meta.requiresAuth) && !token) {
    next({ name: 'login' })
  } else if (to.name === 'login' && token) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router
