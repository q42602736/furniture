<template>
  <div class="bg-[#f5f5f5] min-h-screen">
    <div class="max-w-[1200px] mx-auto px-4 py-4">
      <!-- 搜索结果头 -->
      <div class="mb-4">
        <h1 class="text-lg text-gray-700">
          搜索 "<span class="text-orange-500 font-medium">{{ keyword }}</span>" 的结果
          <span class="text-sm text-gray-400 ml-2">共 {{ totalResults }} 件商品</span>
        </h1>
      </div>

      <!-- 筛选 + 排序 -->
      <div class="bg-white rounded-lg px-5 py-3 mb-4 flex items-center justify-between">
        <div class="flex items-center gap-4 text-sm">
          <span
            v-for="sort in sortOptions"
            :key="sort.value"
            :class="[
              'cursor-pointer transition',
              activeSort === sort.value ? 'text-orange-500 font-medium' : 'text-gray-500 hover:text-orange-500'
            ]"
            @click="activeSort = sort.value"
          >
            {{ sort.label }}
          </span>
        </div>
        <div class="flex items-center gap-4 text-sm">
          <label class="flex items-center gap-1 text-gray-500 cursor-pointer">
            <input type="checkbox" v-model="onlyInStock" class="w-4 h-4 accent-orange-500" />
            仅看有货
          </label>
          <label class="flex items-center gap-1 text-gray-500 cursor-pointer">
            <input type="checkbox" v-model="onlyFreeShipping" class="w-4 h-4 accent-orange-500" />
            包邮
          </label>
        </div>
      </div>

      <!-- 商品列表 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <NuxtLink
          v-for="product in products"
          :key="product.id"
          :to="`/product/${product.id}`"
          class="bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-lg transition-all group"
        >
          <div class="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative">
            <span class="text-gray-300 text-sm">商品图片</span>
            <div v-if="product.tag" class="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded">{{ product.tag }}</div>
          </div>
          <div class="p-3">
            <p class="text-xs text-gray-400 mb-1">{{ product.brand }}</p>
            <p class="text-sm font-medium text-gray-700 truncate group-hover:text-orange-500 transition">{{ product.name }}</p>
            <div class="flex items-baseline gap-2 mt-2">
              <span class="text-orange-500 font-bold">¥{{ product.price }}</span>
              <span v-if="product.originalPrice" class="text-xs text-gray-400 line-through">¥{{ product.originalPrice }}</span>
            </div>
            <div class="flex items-center justify-between mt-2 text-xs text-gray-400">
              <span>{{ product.merchant }}</span>
              <span>{{ product.sales }} 人付款</span>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- 无结果 -->
      <div v-if="products.length === 0" class="bg-white rounded-lg py-20 text-center">
        <div class="text-5xl mb-4">🔍</div>
        <p class="text-gray-500">未找到相关商品</p>
        <p class="text-sm text-gray-400 mt-1">换个关键词试试吧</p>
      </div>

      <!-- 分页 -->
      <div v-if="products.length > 0" class="flex items-center justify-center mt-8 gap-1">
        <button
          v-for="page in 5"
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
const route = useRoute()
const keyword = computed(() => (route.query.q as string) || '')
const activeSort = ref('default')
const onlyInStock = ref(false)
const onlyFreeShipping = ref(false)
const totalResults = ref(86)

const sortOptions = [
  { label: '综合排序', value: 'default' },
  { label: '销量优先', value: 'sales' },
  { label: '价格从低到高', value: 'price-asc' },
  { label: '价格从高到低', value: 'price-desc' },
  { label: '新品优先', value: 'new' },
]

const brands = ['欧瑞仕', '卡琪朵', '慕梵希', '罗曼仕', 'Milantti 米兰蒂', '檀雅居']
const merchants = ['欧瑞仕旗舰店', '慕梵希家居', '卡琪朵官方', '檀雅居旗舰店']

const products = computed(() => {
  const items = []
  for (let i = 1; i <= 20; i++) {
    items.push({
      id: `search-${i}`,
      name: `${keyword.value || '家具'} 精选商品 ${i} · 正品保障`,
      brand: brands[i % brands.length],
      merchant: merchants[i % merchants.length],
      price: (Math.floor(Math.random() * 80) + 10) * 100,
      originalPrice: i % 3 === 0 ? (Math.floor(Math.random() * 80) + 90) * 100 : undefined,
      sales: Math.floor(Math.random() * 1000) + 10,
      tag: i <= 2 ? '热卖' : i === 3 ? '新品' : undefined,
    })
  }
  return items
})

useHead({ title: `${keyword.value} - 搜索结果 - 美家优选` })
</script>
