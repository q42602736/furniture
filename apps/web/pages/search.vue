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
          <div class="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
            <img v-if="product.mainImage" :src="product.mainImage" :alt="product.name" class="w-full h-full object-cover" @error="onImgError" />
            <span v-else class="text-gray-300 text-sm">商品图片</span>
          </div>
          <div class="p-3">
            <p class="text-xs text-gray-400 mb-1">{{ product.brand?.name || '品牌' }}</p>
            <p class="text-sm font-medium text-gray-700 truncate group-hover:text-orange-500 transition">{{ product.name }}</p>
            <div class="flex items-baseline gap-2 mt-2">
              <span class="text-orange-500 font-bold">¥{{ product.skus?.[0]?.price || '--' }}</span>
            </div>
            <div class="flex items-center justify-between mt-2 text-xs text-gray-400">
              <span>{{ product.brand?.name || '' }}</span>
              <span>{{ product._count?.reviews || 0 }} 评价</span>
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
const { get } = useApi()
const keyword = computed(() => (route.query.q as string) || '')
const activeSort = ref('default')
const onlyInStock = ref(false)
const onlyFreeShipping = ref(false)
const totalResults = ref(0)
const currentPage = ref(1)
const products = ref<any[]>([])
const loading = ref(false)
function onImgError(e: Event) { (e.target as HTMLImageElement).style.display = 'none' }

const sortOptions = [
  { label: '综合排序', value: 'default' },
  { label: '销量优先', value: 'sales' },
  { label: '价格从低到高', value: 'price_asc' },
  { label: '价格从高到低', value: 'price_desc' },
  { label: '新品优先', value: 'newest' },
]

async function searchProducts() {
  if (!keyword.value) return
  loading.value = true
  try {
    const res: any = await get('/v1/products', {
      page: currentPage.value,
      pageSize: 20,
      keyword: keyword.value,
      sort: activeSort.value,
    })
    if (res?.data) {
      products.value = res.data.list || []
      totalResults.value = res.data.total || 0
    }
  } catch {
    products.value = []
  } finally {
    loading.value = false
  }
}

watch([keyword, activeSort, currentPage], () => {
  if (import.meta.client) searchProducts()
}, { immediate: true })

useHead({ title: computed(() => `${keyword.value} - 搜索结果 - 美家优选`) })
</script>
