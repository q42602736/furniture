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
          :key="order.orderNo"
          class="border border-gray-100 rounded-lg overflow-hidden"
        >
          <!-- 订单头 -->
          <div class="bg-gray-50 px-5 py-2.5 flex items-center justify-between text-sm">
            <div class="flex items-center gap-4 text-gray-500">
              <span>{{ new Date(order.createdAt).toLocaleString() }}</span>
              <span>订单号：{{ order.orderNo }}</span>
            </div>
            <span :class="statusMap[order.status]?.color || 'text-gray-500'" class="font-medium">{{ statusMap[order.status]?.text || '未知' }}</span>
          </div>
          <!-- 商品列表 -->
          <div v-for="item in order.items" :key="item.id" class="px-5 py-4 flex items-center border-b border-gray-50 last:border-0">
            <div class="w-[80px] h-[80px] bg-gradient-to-br from-gray-50 to-gray-100 rounded flex items-center justify-center shrink-0 mr-4 overflow-hidden">
              <img v-if="item.image" :src="item.image" class="w-full h-full object-cover" @error="onImgError" />
              <span v-else class="text-gray-300 text-[10px]">图片</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-700 truncate">{{ item.name }}</p>
            </div>
            <div class="w-[80px] text-center text-sm text-gray-600">×{{ item.quantity }}</div>
            <div class="w-[100px] text-right text-sm text-orange-500 font-medium">¥{{ item.price }}</div>
          </div>
          <!-- 订单尾 -->
          <div class="px-5 py-3 flex items-center justify-between bg-gray-50/50">
            <div class="text-sm text-gray-500">
              共 {{ order.items?.length || 0 }} 件商品，合计：<span class="text-orange-500 font-bold text-base">¥{{ order.payAmount }}</span>
            </div>
            <div class="flex gap-2">
              <button v-if="order.status === 0" class="px-4 py-1.5 bg-orange-500 text-white text-sm rounded hover:bg-orange-600 transition">去付款</button>
              <button v-if="order.status === 3" class="px-4 py-1.5 bg-orange-500 text-white text-sm rounded hover:bg-orange-600 transition">确认收货</button>
              <button v-if="order.status === 5" class="px-4 py-1.5 border border-orange-500 text-orange-500 text-sm rounded hover:bg-orange-50 transition">去评价</button>
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

const { get } = useApi()
function onImgError(e: Event) { (e.target as HTMLImageElement).style.display = 'none' }

const activeTab = ref('all')
const orders = ref<any[]>([])
const currentPage = ref(1)
const totalPages = ref(1)

const orderTabs = [
  { label: '全部', value: 'all' },
  { label: '待付款', value: '0' },
  { label: '待发货', value: '2' },
  { label: '待收货', value: '3' },
  { label: '已完成', value: '5' },
]

const statusMap: Record<number, { text: string; color: string }> = {
  0: { text: '待付款', color: 'text-orange-500' },
  1: { text: '已付款', color: 'text-blue-500' },
  2: { text: '待发货', color: 'text-blue-500' },
  3: { text: '已发货', color: 'text-purple-500' },
  4: { text: '已收货', color: 'text-green-500' },
  5: { text: '已完成', color: 'text-green-500' },
}

async function loadOrders() {
  const params: Record<string, any> = { page: currentPage.value, pageSize: 10 }
  if (activeTab.value !== 'all') params.status = Number(activeTab.value)
  try {
    const res: any = await get('/v1/orders', params)
    if (res?.data) {
      orders.value = res.data.list || []
      totalPages.value = Math.max(1, Math.ceil((res.data.total || 0) / 10))
    }
  } catch {
    orders.value = []
  }
}

watch([activeTab, currentPage], () => {
  if (import.meta.client) loadOrders()
}, { immediate: true })

useHead({ title: '我的订单 - 美家优选' })
</script>
