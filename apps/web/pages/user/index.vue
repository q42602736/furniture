<template>
  <div>
    <!-- 欢迎卡片 -->
    <div class="bg-white rounded-lg p-6 mb-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-bold text-gray-800">欢迎回来，{{ userStore.user?.nickname || '用户' }}</h2>
          <p class="text-sm text-gray-400 mt-1">上次登录：2025-06-15 14:30</p>
        </div>
        <div class="flex gap-6 text-center">
          <div>
            <p class="text-2xl font-bold text-orange-500">5</p>
            <p class="text-xs text-gray-400">待付款</p>
          </div>
          <div>
            <p class="text-2xl font-bold text-orange-500">3</p>
            <p class="text-xs text-gray-400">待发货</p>
          </div>
          <div>
            <p class="text-2xl font-bold text-orange-500">2</p>
            <p class="text-xs text-gray-400">待收货</p>
          </div>
          <div>
            <p class="text-2xl font-bold text-orange-500">1</p>
            <p class="text-xs text-gray-400">待评价</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 快捷入口 -->
    <div class="grid grid-cols-4 gap-4 mb-4">
      <NuxtLink
        v-for="entry in quickEntries"
        :key="entry.to"
        :to="entry.to"
        class="bg-white rounded-lg p-5 text-center hover:shadow-md transition group"
      >
        <div class="text-3xl mb-2">{{ entry.icon }}</div>
        <p class="text-sm text-gray-600 group-hover:text-orange-500 transition">{{ entry.label }}</p>
      </NuxtLink>
    </div>

    <!-- 最近订单 -->
    <div class="bg-white rounded-lg p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-base font-medium text-gray-800">最近订单</h3>
        <NuxtLink to="/user/orders" class="text-sm text-orange-500 hover:underline">查看全部 →</NuxtLink>
      </div>
      <div class="space-y-3">
        <div
          v-for="order in recentOrders"
          :key="order.orderNo"
          class="border border-gray-100 rounded-lg p-4 hover:border-orange-200 transition"
        >
          <div class="flex items-center justify-between mb-3 text-sm">
            <span class="text-gray-400">订单号：{{ order.orderNo }}</span>
            <span :class="statusMap[order.status]?.color || 'text-gray-500'">{{ statusMap[order.status]?.text || '未知' }}</span>
          </div>
          <div class="flex items-center gap-4">
            <div
              v-for="item in (order.items || []).slice(0, 3)"
              :key="item.id"
              class="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded flex items-center justify-center shrink-0 overflow-hidden"
            >
              <img v-if="item.image" :src="item.image" class="w-full h-full object-cover" />
              <span v-else class="text-gray-300 text-[10px]">图片</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-700 truncate">{{ order.items?.[0]?.name || '商品' }}</p>
              <p class="text-xs text-gray-400 mt-1">{{ new Date(order.createdAt).toLocaleString() }}</p>
            </div>
            <div class="text-right shrink-0">
              <p class="text-orange-500 font-bold">¥{{ order.payAmount }}</p>
              <p class="text-xs text-gray-400">共{{ order.items?.length || 0 }}件</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'user' })

const { get } = useApi()
const userStore = useUserStore()

const quickEntries = [
  { icon: '📦', label: '全部订单', to: '/user/orders' },
  { icon: '❤️', label: '我的收藏', to: '/user/favorites' },
  { icon: '📍', label: '收货地址', to: '/user/address' },
  { icon: '🎫', label: '我的优惠券', to: '/user/coupons' },
]

const recentOrders = ref<any[]>([])

// 加载用户信息和最近订单
if (import.meta.client) {
  userStore.fetchProfile()
  get('/v1/orders', { page: 1, pageSize: 3 }).then((res: any) => {
    if (res?.data?.list) recentOrders.value = res.data.list
  }).catch(() => {})
}

const statusMap: Record<number, { text: string; color: string }> = {
  0: { text: '待付款', color: 'text-orange-500' },
  1: { text: '已付款', color: 'text-blue-500' },
  2: { text: '待发货', color: 'text-blue-500' },
  3: { text: '已发货', color: 'text-purple-500' },
  4: { text: '已收货', color: 'text-green-500' },
  5: { text: '已完成', color: 'text-green-500' },
}

useHead({ title: '个人中心 - 美家优选' })
</script>
