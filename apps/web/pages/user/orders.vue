<template>
  <div>
    <div class="bg-white rounded-lg p-6">
      <div class="flex items-center justify-between mb-5">
        <h3 class="text-base font-medium text-gray-800">我的订单</h3>
        <!-- 订单状态 Tab -->
        <div class="flex gap-1 text-sm">
          <span
            v-for="tab in orderTabs"
            :key="tab.value"
            :class="[
              'px-3 py-1 rounded cursor-pointer transition',
              activeTab === tab.value ? 'bg-orange-500 text-white' : 'text-gray-500 hover:text-orange-500'
            ]"
            @click="activeTab = tab.value"
          >
            {{ tab.label }}
          </span>
        </div>
      </div>

      <!-- 订单列表 -->
      <div class="space-y-4">
        <div
          v-for="order in orders"
          :key="order.no"
          class="border border-gray-100 rounded-lg overflow-hidden"
        >
          <!-- 订单头 -->
          <div class="bg-gray-50 px-5 py-2.5 flex items-center justify-between text-sm">
            <div class="flex items-center gap-4 text-gray-500">
              <span>{{ order.time }}</span>
              <span>订单号：{{ order.no }}</span>
              <span class="text-gray-400">{{ order.merchant }}</span>
            </div>
            <span :class="order.statusColor" class="font-medium">{{ order.status }}</span>
          </div>
          <!-- 商品列表 -->
          <div v-for="(item, idx) in order.items" :key="idx" class="px-5 py-4 flex items-center border-b border-gray-50 last:border-0">
            <div class="w-[80px] h-[80px] bg-gradient-to-br from-gray-50 to-gray-100 rounded flex items-center justify-center shrink-0 mr-4">
              <span class="text-gray-300 text-[10px]">图片</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-700 truncate">{{ item.name }}</p>
              <p class="text-xs text-gray-400 mt-1">{{ item.sku }}</p>
            </div>
            <div class="w-[80px] text-center text-sm text-gray-600">×{{ item.count }}</div>
            <div class="w-[100px] text-right text-sm text-orange-500 font-medium">¥{{ item.price }}</div>
          </div>
          <!-- 订单尾 -->
          <div class="px-5 py-3 flex items-center justify-between bg-gray-50/50">
            <div class="text-sm text-gray-500">
              共 {{ order.totalCount }} 件商品，合计：<span class="text-orange-500 font-bold text-base">¥{{ order.totalAmount }}</span>
            </div>
            <div class="flex gap-2">
              <button v-if="order.status === '待付款'" class="px-4 py-1.5 bg-orange-500 text-white text-sm rounded hover:bg-orange-600 transition">去付款</button>
              <button v-if="order.status === '待收货'" class="px-4 py-1.5 bg-orange-500 text-white text-sm rounded hover:bg-orange-600 transition">确认收货</button>
              <button v-if="order.status === '待评价'" class="px-4 py-1.5 border border-orange-500 text-orange-500 text-sm rounded hover:bg-orange-50 transition">去评价</button>
              <button class="px-4 py-1.5 border border-gray-200 text-gray-500 text-sm rounded hover:border-orange-500 hover:text-orange-500 transition">订单详情</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="flex items-center justify-center mt-6 gap-1">
        <button
          v-for="page in 3"
          :key="page"
          :class="[
            'w-9 h-9 flex items-center justify-center rounded border text-sm transition',
            page === 1 ? 'bg-orange-500 text-white border-orange-500' : 'bg-white border-gray-200 text-gray-600 hover:border-orange-500 hover:text-orange-500'
          ]"
        >
          {{ page }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'user' })

const activeTab = ref('all')

const orderTabs = [
  { label: '全部', value: 'all' },
  { label: '待付款', value: 'unpaid' },
  { label: '待发货', value: 'unshipped' },
  { label: '待收货', value: 'unreceived' },
  { label: '待评价', value: 'uncommented' },
]

const orders = [
  {
    no: 'MJ20250615001', time: '2025-06-15 10:30', merchant: '欧瑞仕旗舰店', status: '待发货', statusColor: 'text-blue-500',
    totalCount: 1, totalAmount: '6,980',
    items: [{ name: '意式极简真皮沙发 大户型客厅直排三人位', sku: '胡桃色 / 2.0m', count: 1, price: '6,980' }],
  },
  {
    no: 'MJ20250614002', time: '2025-06-14 15:20', merchant: '欧瑞仕旗舰店', status: '待收货', statusColor: 'text-orange-500',
    totalCount: 3, totalAmount: '5,780',
    items: [
      { name: '北欧实木床 双人床主卧大床', sku: '原木色 / 1.8m', count: 1, price: '4,580' },
      { name: '现代简约实木床头柜', sku: '原木色', count: 2, price: '600' },
    ],
  },
  {
    no: 'MJ20250610003', time: '2025-06-10 09:15', merchant: '慕梵希家居旗舰店', status: '已完成', statusColor: 'text-green-500',
    totalCount: 5, totalAmount: '8,680',
    items: [
      { name: '意式岩板餐桌 长方形轻奢饭桌', sku: '白色 / 1.4m', count: 1, price: '3,280' },
      { name: '轻奢餐椅 真皮软包', sku: '米白色', count: 4, price: '1,350' },
    ],
  },
]

useHead({ title: '我的订单 - 美家优选' })
</script>
