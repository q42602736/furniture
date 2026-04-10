<template>
  <div>
    <!-- 欢迎卡片 -->
    <div class="bg-white rounded-lg p-6 mb-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-bold text-gray-800">欢迎回来，用户昵称</h2>
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
          :key="order.no"
          class="border border-gray-100 rounded-lg p-4 hover:border-orange-200 transition"
        >
          <div class="flex items-center justify-between mb-3 text-sm">
            <span class="text-gray-400">订单号：{{ order.no }}</span>
            <span :class="order.statusColor">{{ order.status }}</span>
          </div>
          <div class="flex items-center gap-4">
            <div
              v-for="item in order.items"
              :key="item"
              class="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded flex items-center justify-center shrink-0"
            >
              <span class="text-gray-300 text-[10px]">图片</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-700 truncate">{{ order.name }}</p>
              <p class="text-xs text-gray-400 mt-1">{{ order.time }}</p>
            </div>
            <div class="text-right shrink-0">
              <p class="text-orange-500 font-bold">¥{{ order.amount }}</p>
              <p class="text-xs text-gray-400">共{{ order.count }}件</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'user' })

const quickEntries = [
  { icon: '📦', label: '全部订单', to: '/user/orders' },
  { icon: '❤️', label: '我的收藏', to: '/user/favorites' },
  { icon: '📍', label: '收货地址', to: '/user/address' },
  { icon: '🎫', label: '我的优惠券', to: '/user/coupons' },
]

const recentOrders = [
  { no: 'MJ20250615001', name: '意式极简真皮沙发 大户型客厅直排三人位', status: '待发货', statusColor: 'text-blue-500', time: '2025-06-15 10:30', amount: '6,980', count: 1, items: ['img1'] },
  { no: 'MJ20250614002', name: '北欧实木床 + 床头柜 × 2', status: '已完成', statusColor: 'text-green-500', time: '2025-06-14 15:20', amount: '5,780', count: 3, items: ['img1', 'img2'] },
  { no: 'MJ20250610003', name: '意式岩板餐桌 长方形轻奢饭桌 + 餐椅 × 4', status: '已完成', statusColor: 'text-green-500', time: '2025-06-10 09:15', amount: '8,680', count: 5, items: ['img1', 'img2'] },
]

useHead({ title: '个人中心 - 美家优选' })
</script>
