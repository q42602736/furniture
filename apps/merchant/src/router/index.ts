import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/MerchantLayout.vue'),
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/views/dashboard/Index.vue'),
          meta: { title: '数据看板' },
        },
        // 商品管理
        {
          path: 'products',
          name: 'products',
          component: () => import('@/views/ecommerce/ProductList.vue'),
          meta: { title: '商品列表' },
        },
        {
          path: 'products/add',
          name: 'product-add',
          component: () => import('@/views/ecommerce/ProductAdd.vue'),
          meta: { title: '发布商品' },
        },
        // 订单管理
        {
          path: 'orders',
          name: 'orders',
          component: () => import('@/views/ecommerce/OrderList.vue'),
          meta: { title: '订单列表' },
        },
        {
          path: 'orders/:id',
          name: 'order-detail',
          component: () => import('@/views/ecommerce/OrderDetail.vue'),
          meta: { title: '订单详情' },
        },
        // 店铺设置
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/views/Settings.vue'),
          meta: { title: '店铺设置' },
        },
      ],
    },
    // 登录
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/Login.vue'),
      meta: { title: '商家登录' },
    },
  ],
})

export default router
