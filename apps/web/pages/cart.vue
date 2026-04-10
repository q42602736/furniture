<template>
  <div class="bg-[#f5f5f5] min-h-screen">
    <!-- 面包屑 -->
    <div class="max-w-[1200px] mx-auto px-4 py-3">
      <nav class="flex items-center text-sm text-gray-400 gap-1">
        <NuxtLink to="/" class="hover:text-orange-500 transition">首页</NuxtLink>
        <span>/</span>
        <span class="text-gray-700">我的购物车</span>
      </nav>
    </div>

    <div class="max-w-[1200px] mx-auto px-4 pb-10">
      <!-- 购物车有商品 -->
      <template v-if="cartItems.length > 0">
        <!-- 表头 -->
        <div class="bg-white rounded-t-lg px-5 py-3 flex items-center text-sm text-gray-500 border-b border-gray-100">
          <label class="flex items-center gap-2 cursor-pointer w-[60px]">
            <input type="checkbox" v-model="selectAll" class="w-4 h-4 accent-orange-500" />
            <span>全选</span>
          </label>
          <span class="flex-1">商品信息</span>
          <span class="w-[100px] text-center">单价</span>
          <span class="w-[120px] text-center">数量</span>
          <span class="w-[100px] text-center">小计</span>
          <span class="w-[80px] text-center">操作</span>
        </div>

        <!-- 按店铺分组 -->
        <div v-for="group in groupedCart" :key="group.merchantId" class="bg-white mb-2 last:mb-0">
          <!-- 店铺名 -->
          <div class="px-5 py-2.5 border-b border-gray-50 flex items-center gap-2">
            <input type="checkbox" :checked="isMerchantAllSelected(group.merchantId)" class="w-4 h-4 accent-orange-500 cursor-pointer" @change="toggleMerchant(group.merchantId)" />
            <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4"/>
            </svg>
            <span class="text-sm font-medium text-gray-700">{{ group.merchantName }}</span>
          </div>

          <!-- 商品行 -->
          <div
            v-for="item in group.items"
            :key="item.id"
            class="px-5 py-4 flex items-center border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition"
          >
            <label class="w-[60px] shrink-0">
              <input type="checkbox" v-model="item.selected" class="w-4 h-4 accent-orange-500 cursor-pointer" />
            </label>
            <div class="flex-1 flex items-center gap-4 min-w-0">
              <NuxtLink :to="`/product/${item.productId}`" class="w-[80px] h-[80px] bg-gradient-to-br from-gray-50 to-gray-100 rounded flex items-center justify-center shrink-0 overflow-hidden">
                <img v-if="item.image" :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
                <span v-else class="text-gray-300 text-[10px]">图片</span>
              </NuxtLink>
              <div class="min-w-0 flex-1">
                <NuxtLink :to="`/product/${item.productId}`" class="text-sm text-gray-700 hover:text-orange-500 transition line-clamp-2">{{ item.name }}</NuxtLink>
                <p class="text-xs text-gray-400 mt-1">{{ item.sku }}</p>
              </div>
            </div>
            <div class="w-[100px] text-center">
              <span class="text-sm text-orange-500 font-medium">¥{{ item.price }}</span>
            </div>
            <div class="w-[120px] flex items-center justify-center">
              <div class="flex items-center border border-gray-200 rounded">
                <button class="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-orange-500 transition" @click="updateQuantity(item, item.quantity - 1)">−</button>
                <input v-model.number="item.quantity" type="number" class="w-10 h-7 text-center text-sm border-x border-gray-200 focus:outline-none" min="1" @change="updateQuantity(item, item.quantity)" />
                <button class="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-orange-500 transition" @click="updateQuantity(item, item.quantity + 1)">+</button>
              </div>
            </div>
            <div class="w-[100px] text-center">
              <span class="text-sm text-orange-500 font-bold">¥{{ (item.price * item.quantity).toLocaleString() }}</span>
            </div>
            <div class="w-[80px] text-center">
              <button class="text-xs text-gray-400 hover:text-red-500 transition" @click="removeItem(item.id)">删除</button>
            </div>
          </div>
        </div>

        <!-- 结算栏（吸底） -->
        <div class="bg-white rounded-b-lg px-5 py-4 flex items-center justify-between sticky bottom-0 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] mt-2">
          <div class="flex items-center gap-4">
            <label class="flex items-center gap-2 cursor-pointer text-sm">
              <input type="checkbox" v-model="selectAll" class="w-4 h-4 accent-orange-500" />
              全选
            </label>
            <button class="text-sm text-gray-400 hover:text-red-500 transition">删除选中</button>
          </div>
          <div class="flex items-center gap-6">
            <div class="text-sm text-gray-500">
              已选 <b class="text-gray-700">{{ selectedCount }}</b> 件商品
            </div>
            <div class="text-sm">
              合计：<span class="text-orange-500 text-2xl font-bold">¥{{ totalPrice.toLocaleString() }}</span>
            </div>
            <button
              :class="[
                'h-12 px-10 rounded font-medium text-lg transition',
                selectedCount > 0 ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              ]"
              :disabled="selectedCount === 0"
            >
              去结算
            </button>
          </div>
        </div>
      </template>

      <!-- 购物车空状态 -->
      <template v-else>
        <div class="bg-white rounded-lg py-20 text-center">
          <div class="text-6xl mb-4">🛒</div>
          <p class="text-gray-500 mb-2">购物车还是空的</p>
          <p class="text-sm text-gray-400 mb-6">快去挑选心仪的家具吧</p>
          <NuxtLink to="/" class="inline-block px-8 py-2.5 bg-orange-500 text-white rounded hover:bg-orange-600 transition">去逛逛</NuxtLink>
        </div>
      </template>

      <!-- 猜你喜欢 -->
      <div class="mt-8">
        <h2 class="text-lg font-bold text-gray-800 mb-4">猜你喜欢</h2>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
          <NuxtLink
            v-for="i in 5"
            :key="i"
            to="#"
            class="bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-lg transition-all group"
          >
            <div class="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
              <span class="text-gray-300 text-xs">推荐图片</span>
            </div>
            <div class="p-3">
              <p class="text-xs text-gray-600 truncate group-hover:text-orange-500 transition">精选推荐家具商品 {{ i }}</p>
              <p class="text-orange-500 font-bold text-sm mt-1">¥{{ (i + 1) * 1200 }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { get, put, del } = useApi()
const userStore = useUserStore()

interface CartItem {
  id: number
  productId: number
  skuId: number
  name: string
  sku: string
  price: number
  quantity: number
  selected: boolean
  image: string
  merchantId: number
  merchantName: string
}

const cartItems = reactive<CartItem[]>([])
const loading = ref(false)

// 加载购物车
async function loadCart() {
  if (!userStore.isLoggedIn) return
  loading.value = true
  try {
    const res: any = await get('/v1/cart')
    if (res?.data) {
      cartItems.splice(0, cartItems.length)
      for (const item of res.data) {
        cartItems.push({
          id: item.id,
          productId: item.productId,
          skuId: item.skuId,
          name: item.product?.name || '商品',
          sku: item.sku?.name || '',
          price: Number(item.sku?.price || 0),
          quantity: item.quantity,
          selected: false,
          image: item.sku?.image || '',
          merchantId: item.product?.merchant?.id || 0,
          merchantName: item.product?.merchant?.name || '店铺',
        })
      }
    }
  } catch {} finally {
    loading.value = false
  }
}

if (import.meta.client) {
  loadCart()
}

const selectAll = computed({
  get: () => cartItems.length > 0 && cartItems.every(item => item.selected),
  set: (val: boolean) => cartItems.forEach(item => item.selected = val),
})

const selectedCount = computed(() => cartItems.filter(i => i.selected).length)
const totalPrice = computed(() => cartItems.filter(i => i.selected).reduce((sum, i) => sum + i.price * i.quantity, 0))

const groupedCart = computed(() => {
  const map = new Map<number, { merchantId: number; merchantName: string; items: CartItem[] }>()
  for (const item of cartItems) {
    if (!map.has(item.merchantId)) {
      map.set(item.merchantId, { merchantId: item.merchantId, merchantName: item.merchantName, items: [] })
    }
    map.get(item.merchantId)!.items.push(item)
  }
  return Array.from(map.values())
})

function isMerchantAllSelected(merchantId: number) {
  const items = cartItems.filter(i => i.merchantId === merchantId)
  return items.length > 0 && items.every(i => i.selected)
}

function toggleMerchant(merchantId: number) {
  const items = cartItems.filter(i => i.merchantId === merchantId)
  const allSelected = items.every(i => i.selected)
  items.forEach(i => i.selected = !allSelected)
}

async function updateQuantity(item: CartItem, newQty: number) {
  if (newQty < 1) return
  try {
    await put(`/v1/cart/${item.id}`, { quantity: newQty })
    item.quantity = newQty
  } catch {}
}

async function removeItem(id: number) {
  try {
    await del(`/v1/cart/${id}`)
    const index = cartItems.findIndex(i => i.id === id)
    if (index !== -1) cartItems.splice(index, 1)
  } catch {}
}

useHead({ title: '购物车 - 美家优选' })
</script>
