<template>
  <div class="bg-[#f5f5f5] min-h-screen">
    <!-- 品牌头部 -->
    <div class="bg-white border-b border-gray-100">
      <div class="max-w-[1200px] mx-auto px-4 py-6">
        <nav class="flex items-center text-sm text-gray-400 gap-1 mb-4">
          <NuxtLink to="/" class="hover:text-orange-500 transition">首页</NuxtLink>
          <span>/</span>
          <NuxtLink to="/brand" class="hover:text-orange-500 transition">品牌馆</NuxtLink>
          <span>/</span>
          <span class="text-gray-700">{{ brandInfo?.name || '品牌详情' }}</span>
        </nav>
        <div v-if="brandInfo" class="flex items-center gap-6">
          <div class="w-20 h-20 bg-white border border-gray-100 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
            <img v-if="brandInfo.logo" :src="brandInfo.logo" :alt="brandInfo.name" class="w-full h-full object-contain p-2" @error="onLogoError" />
            <span v-else class="text-orange-500 text-2xl font-bold">{{ brandInfo.name.charAt(0) }}</span>
          </div>
          <div class="flex-1">
            <h1 class="text-xl font-bold text-gray-800">{{ brandInfo.name }}</h1>
            <div class="flex items-center gap-4 mt-2 text-sm">
              <span class="text-gray-500">共 <b class="text-gray-700">{{ total }}</b> 件商品</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-[1200px] mx-auto px-4 py-6">
      <!-- 排序栏 -->
      <div class="bg-white rounded-lg px-5 py-3 mb-4 flex items-center gap-4 text-sm">
        <span
          v-for="opt in sortOptions"
          :key="opt.value"
          :class="[
            'cursor-pointer transition',
            activeSort === opt.value ? 'text-orange-500 font-medium' : 'text-gray-500 hover:text-orange-500'
          ]"
          @click="changeSort(opt.value)"
        >
          {{ opt.label }}
        </span>
      </div>

      <!-- 加载中 -->
      <div v-if="loading && !products.length" class="bg-white rounded-lg p-10 text-center">
        <p class="text-gray-400">加载中...</p>
      </div>

      <!-- 空状态 -->
      <div v-else-if="!products.length" class="bg-white rounded-lg p-10 text-center">
        <p class="text-gray-400">暂无商品</p>
      </div>

      <!-- 商品网格 -->
      <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ProductCard
          v-for="item in products"
          :key="item.id"
          :product="item"
          show-meta
        />
      </div>

      <!-- 加载更多 -->
      <div v-if="products.length && products.length < total" class="text-center mt-6">
        <button
          class="px-8 py-2 border border-gray-300 rounded text-sm text-gray-600 hover:border-orange-500 hover:text-orange-500 transition"
          :disabled="loading"
          @click="loadMore"
        >
          {{ loading ? '加载中...' : '加载更多' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProductCardItem } from '~/components/ProductCard.vue'

const route = useRoute()
const { get } = useApi()

const brandId = computed(() => route.params.id as string)

const products = ref<ProductCardItem[]>([])
const brandInfo = ref<{ id: number; name: string; logo: string | null } | null>(null)
const total = ref(0)
const page = ref(1)
const pageSize = 20
const activeSort = ref('default')
const loading = ref(false)

const sortOptions = [
  { label: '综合排序', value: 'default' },
  { label: '销量', value: 'sales' },
  { label: '价格从低到高', value: 'price_asc' },
  { label: '价格从高到低', value: 'price_desc' },
  { label: '新品', value: 'newest' },
]

function mapProduct(p: any): ProductCardItem {
  const minPrice = p.skus?.length
    ? Math.min(...p.skus.map((s: any) => Number(s.price)))
    : p.price
  return {
    id: String(p.id),
    name: p.name,
    image: p.mainImage || undefined,
    brand: p.brand?.name,
    price: minPrice,
    sales: p.salesCount,
    comments: p._count?.reviews,
  }
}

function onLogoError(e: Event) { (e.target as HTMLImageElement).style.display = 'none' }

async function fetchProducts(reset = false) {
  if (reset) {
    page.value = 1
    products.value = []
  }
  loading.value = true
  try {
    const res = await get('/v1/products', {
      brandId: brandId.value,
      page: page.value,
      pageSize,
      sort: activeSort.value,
    })
    const list: any[] = res?.data?.list ?? []
    if (list.length && !brandInfo.value) {
      brandInfo.value = list[0].brand
    }
    total.value = res?.data?.total ?? 0
    const mapped = list.map(mapProduct)
    if (reset) {
      products.value = mapped
    } else {
      products.value.push(...mapped)
    }
  } finally {
    loading.value = false
  }
}

function changeSort(sort: string) {
  activeSort.value = sort
  fetchProducts(true)
}

function loadMore() {
  page.value++
  fetchProducts()
}

// 加载品牌信息
get(`/v1/brands/${brandId.value}`).then((res: any) => {
  if (res?.data) brandInfo.value = res.data
}).catch(() => {})

await fetchProducts(true)

useHead({ title: computed(() => `${brandInfo.value?.name || '品牌'} - 美家优选`) })
</script>
