<template>
  <div class="bg-[#f5f5f5] min-h-screen">
    <div class="max-w-[1200px] mx-auto px-4 py-4">
      <!-- 面包屑 -->
      <nav class="flex items-center text-sm text-gray-400 gap-1 mb-4">
        <NuxtLink to="/" class="hover:text-orange-500 transition">首页</NuxtLink>
        <span>/</span>
        <NuxtLink to="/cart" class="hover:text-orange-500 transition">购物车</NuxtLink>
        <span>/</span>
        <span class="text-gray-700">确认订单</span>
      </nav>

      <!-- 步骤条 -->
      <div class="bg-white rounded-lg p-5 mb-4">
        <div class="flex items-center justify-center gap-4 text-sm">
          <div class="flex items-center gap-2">
            <span class="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs">1</span>
            <span class="text-orange-500 font-medium">购物车</span>
          </div>
          <div class="h-px w-16 bg-orange-500"/>
          <div class="flex items-center gap-2">
            <span class="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs">2</span>
            <span class="text-orange-500 font-medium">确认订单</span>
          </div>
          <div class="h-px w-16 bg-gray-200"/>
          <div class="flex items-center gap-2">
            <span class="w-6 h-6 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center text-xs">3</span>
            <span class="text-gray-400">支付</span>
          </div>
          <div class="h-px w-16 bg-gray-200"/>
          <div class="flex items-center gap-2">
            <span class="w-6 h-6 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center text-xs">4</span>
            <span class="text-gray-400">完成</span>
          </div>
        </div>
      </div>

      <!-- 收货地址 -->
      <div class="bg-white rounded-lg p-6 mb-4">
        <h3 class="text-base font-medium text-gray-800 mb-4">收货地址</h3>
        <div class="space-y-3">
          <label
            v-for="addr in addresses"
            :key="addr.id"
            :class="[
              'flex items-center gap-4 border rounded-lg p-4 cursor-pointer transition',
              selectedAddress === addr.id ? 'border-orange-500 bg-orange-50/30' : 'border-gray-100 hover:border-orange-200'
            ]"
          >
            <input type="radio" :value="addr.id" v-model="selectedAddress" class="accent-orange-500" />
            <div class="flex-1">
              <span class="text-sm font-medium text-gray-700 mr-3">{{ addr.name }}</span>
              <span class="text-sm text-gray-500 mr-3">{{ addr.phone }}</span>
              <span v-if="addr.isDefault" class="text-[10px] bg-orange-500 text-white px-2 py-0.5 rounded mr-3">默认</span>
              <span class="text-sm text-gray-500">{{ addr.address }}</span>
            </div>
          </label>
        </div>
        <button class="mt-3 text-sm text-orange-500 hover:underline">+ 使用新地址</button>
      </div>

      <!-- 商品清单 -->
      <div class="bg-white rounded-lg p-6 mb-4">
        <h3 class="text-base font-medium text-gray-800 mb-4">商品清单</h3>
        <div class="space-y-3">
          <div
            v-for="item in orderItems"
            :key="item.id"
            class="flex items-center gap-4 pb-3 border-b border-gray-50 last:border-0"
          >
            <div class="w-[70px] h-[70px] bg-gradient-to-br from-gray-50 to-gray-100 rounded flex items-center justify-center shrink-0 overflow-hidden">
              <img v-if="item.image" :src="item.image" :alt="item.name" class="w-full h-full object-cover" @error="onImgError" />
              <span v-else class="text-gray-300 text-[10px]">图片</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-700 truncate">{{ item.name }}</p>
              <p class="text-xs text-gray-400 mt-0.5">{{ item.sku }}</p>
            </div>
            <div class="text-sm text-gray-600">×{{ item.count }}</div>
            <div class="text-sm text-orange-500 font-medium w-[80px] text-right">¥{{ item.price }}</div>
          </div>
        </div>
      </div>

      <!-- 优惠券 & 备注 -->
      <div class="bg-white rounded-lg p-6 mb-4">
        <div class="flex items-center gap-4 pb-4 border-b border-gray-100">
          <span class="text-sm text-gray-500">优惠券</span>
          <select class="h-9 border border-gray-200 rounded px-3 text-sm focus:outline-none focus:border-orange-500">
            <option>请选择优惠券</option>
            <option>满3000减200 优惠券</option>
            <option>新人立减50 优惠券</option>
          </select>
        </div>
        <div class="flex items-start gap-4 pt-4">
          <span class="text-sm text-gray-500 pt-2">订单备注</span>
          <textarea
            v-model="remark"
            rows="2"
            placeholder="如有特殊要求请备注（选填）"
            class="flex-1 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500 resize-none"
          />
        </div>
      </div>

      <!-- 费用汇总 & 提交 -->
      <div class="bg-white rounded-lg p-6">
        <div class="text-right space-y-2 text-sm">
          <div class="text-gray-500">商品总额：<span class="text-gray-700">¥{{ totalAmount.toLocaleString() }}</span></div>
          <div class="text-gray-500">运费：<span class="text-green-500">免运费</span></div>
          <div class="pt-3 border-t border-gray-100 mt-3">
            <span class="text-gray-500">应付总额：</span>
            <span class="text-orange-500 text-2xl font-bold">¥{{ totalAmount.toLocaleString() }}</span>
          </div>
        </div>
        <div class="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          <div class="text-sm text-gray-500">
            配送至：<span class="text-gray-700">广东省 深圳市 南山区 科技园 XX大厦</span>
          </div>
          <button class="h-12 px-12 bg-orange-500 text-white text-lg font-medium rounded hover:bg-orange-600 transition">
            提交订单
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { get } = useApi()
const userStore = useUserStore()
const selectedAddress = ref<number | null>(null)
const remark = ref('')
function onImgError(e: Event) { (e.target as HTMLImageElement).style.display = 'none' }

interface CheckoutItem {
  id: number
  name: string
  sku: string
  count: number
  price: number
  image: string
}

const addresses = ref<any[]>([])
const orderItems = ref<CheckoutItem[]>([])

const totalAmount = computed(() =>
  orderItems.value.reduce((sum, item) => sum + item.price * item.count, 0)
)

if (import.meta.client && userStore.isLoggedIn) {
  // 加载购物车数据作为结算商品
  get('/v1/cart').then((res: any) => {
    if (res?.data) {
      orderItems.value = res.data.map((item: any) => ({
        id: item.id,
        name: item.product?.name || '商品',
        sku: item.sku?.name || '',
        count: item.quantity,
        price: Number(item.sku?.price || 0),
        image: item.sku?.image || item.product?.mainImage || '',
      }))
    }
  }).catch(() => {})

  // 加载收货地址
  get('/v1/addresses').then((res: any) => {
    const list = res?.data?.list || res?.data || []
    addresses.value = list
    const defaultAddr = list.find((a: any) => a.isDefault)
    if (defaultAddr) selectedAddress.value = defaultAddr.id
    else if (list.length) selectedAddress.value = list[0].id
  }).catch(() => {})
}

useHead({ title: '确认订单 - 美家优选' })
</script>
