<template>
  <div class="bg-[#f5f5f5] min-h-screen">
    <!-- 面包屑 -->
    <div class="max-w-[1200px] mx-auto px-4 py-3">
      <nav class="flex items-center text-sm text-gray-400 gap-1">
        <NuxtLink to="/" class="hover:text-orange-500 transition">首页</NuxtLink>
        <span>/</span>
        <span class="text-gray-700">{{ categoryInfo.name }}</span>
      </nav>
    </div>

    <div class="max-w-[1200px] mx-auto px-4 pb-10">
      <!-- 筛选区域 -->
      <div class="bg-white rounded-lg p-5 mb-4">
        <!-- 子分类筛选 -->
        <div class="flex items-start gap-4 pb-4 border-b border-gray-100">
          <span class="text-sm text-gray-500 shrink-0 pt-1">子分类：</span>
          <div class="flex flex-wrap gap-2">
            <span
              :class="[
                'px-3 py-1 rounded text-sm cursor-pointer transition',
                !activeSubCategory ? 'bg-orange-500 text-white' : 'text-gray-600 hover:text-orange-500'
              ]"
              @click="activeSubCategory = ''"
            >
              全部
            </span>
            <span
              v-for="sub in categoryInfo.children"
              :key="sub.slug"
              :class="[
                'px-3 py-1 rounded text-sm cursor-pointer transition',
                activeSubCategory === sub.slug ? 'bg-orange-500 text-white' : 'text-gray-600 hover:text-orange-500'
              ]"
              @click="activeSubCategory = sub.slug"
            >
              {{ sub.name }}
            </span>
          </div>
        </div>

        <!-- 品牌筛选 -->
        <div class="flex items-start gap-4 py-4 border-b border-gray-100">
          <span class="text-sm text-gray-500 shrink-0 pt-1">品牌：</span>
          <div class="flex flex-wrap gap-2">
            <span
              :class="[
                'px-3 py-1 rounded text-sm cursor-pointer transition',
                !activeBrand ? 'bg-orange-500 text-white' : 'text-gray-600 hover:text-orange-500'
              ]"
              @click="activeBrand = ''"
            >
              全部
            </span>
            <span
              v-for="brand in brands"
              :key="brand"
              :class="[
                'px-3 py-1 rounded text-sm cursor-pointer transition',
                activeBrand === brand ? 'bg-orange-500 text-white' : 'text-gray-600 hover:text-orange-500'
              ]"
              @click="activeBrand = brand"
            >
              {{ brand }}
            </span>
          </div>
        </div>

        <!-- 风格筛选 -->
        <div class="flex items-start gap-4 py-4 border-b border-gray-100">
          <span class="text-sm text-gray-500 shrink-0 pt-1">风格：</span>
          <div class="flex flex-wrap gap-2">
            <span
              :class="[
                'px-3 py-1 rounded text-sm cursor-pointer transition',
                !activeStyleFilter ? 'bg-orange-500 text-white' : 'text-gray-600 hover:text-orange-500'
              ]"
              @click="activeStyleFilter = ''"
            >
              全部
            </span>
            <span
              v-for="style in styles"
              :key="style"
              :class="[
                'px-3 py-1 rounded text-sm cursor-pointer transition',
                activeStyleFilter === style ? 'bg-orange-500 text-white' : 'text-gray-600 hover:text-orange-500'
              ]"
              @click="activeStyleFilter = style"
            >
              {{ style }}
            </span>
          </div>
        </div>

        <!-- 价格区间 -->
        <div class="flex items-center gap-4 pt-4">
          <span class="text-sm text-gray-500 shrink-0">价格：</span>
          <div class="flex items-center gap-2">
            <input
              v-model="priceMin"
              type="number"
              placeholder="最低价"
              class="w-24 h-8 border border-gray-200 rounded px-2 text-sm focus:outline-none focus:border-orange-500"
            />
            <span class="text-gray-400">—</span>
            <input
              v-model="priceMax"
              type="number"
              placeholder="最高价"
              class="w-24 h-8 border border-gray-200 rounded px-2 text-sm focus:outline-none focus:border-orange-500"
            />
            <button class="h-8 px-4 bg-orange-500 text-white text-sm rounded hover:bg-orange-600 transition" @click="currentPage = 1; loadProducts()">确定</button>
          </div>
        </div>
      </div>

      <!-- 排序栏 -->
      <div class="bg-white rounded-lg px-5 py-3 mb-4 flex items-center justify-between">
        <div class="flex items-center gap-4 text-sm">
          <span
            v-for="sort in sortOptions"
            :key="sort.value"
            :class="[
              'cursor-pointer transition flex items-center gap-1',
              activeSort === sort.value ? 'text-orange-500 font-medium' : 'text-gray-500 hover:text-orange-500'
            ]"
            @click="activeSort = sort.value"
          >
            {{ sort.label }}
            <svg v-if="sort.sortable" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"/>
            </svg>
          </span>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-sm text-gray-400">共 <b class="text-gray-700">{{ totalProducts }}</b> 件商品</span>
          <div class="flex border border-gray-200 rounded">
            <button
              :class="['w-8 h-8 flex items-center justify-center transition', viewMode === 'grid' ? 'bg-orange-500 text-white' : 'text-gray-400']"
              @click="viewMode = 'grid'"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                <rect x="0" y="0" width="7" height="7" rx="1"/><rect x="9" y="0" width="7" height="7" rx="1"/>
                <rect x="0" y="9" width="7" height="7" rx="1"/><rect x="9" y="9" width="7" height="7" rx="1"/>
              </svg>
            </button>
            <button
              :class="['w-8 h-8 flex items-center justify-center transition', viewMode === 'list' ? 'bg-orange-500 text-white' : 'text-gray-400']"
              @click="viewMode = 'list'"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                <rect x="0" y="0" width="16" height="3" rx="1"/><rect x="0" y="4.5" width="16" height="3" rx="1"/>
                <rect x="0" y="9" width="16" height="3" rx="1"/><rect x="0" y="13" width="16" height="3" rx="1"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- 商品列表 - 网格视图 -->
      <div v-if="viewMode === 'grid'" class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <NuxtLink
          v-for="product in products"
          :key="product.id"
          :to="`/product/${product.id}`"
          class="bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-lg transition-all group"
        >
          <div class="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative">
            <img v-if="product.skus?.[0]?.image" :src="product.skus[0].image" :alt="product.name" class="w-full h-full object-cover" @error="onImgError" />
            <span v-else class="text-gray-300 text-sm">商品图片</span>
          </div>
          <div class="p-3">
            <p class="text-xs text-gray-400 mb-1">{{ product.brand?.name || '品牌' }}</p>
            <p class="text-sm font-medium text-gray-700 truncate group-hover:text-orange-500 transition">{{ product.name }}</p>
            <div class="flex items-baseline gap-2 mt-2">
              <span class="text-orange-500 font-bold">¥{{ product.skus?.[0]?.price || '--' }}</span>
            </div>
            <div class="flex items-center justify-between mt-2 text-xs text-gray-400">
              <span>{{ product._count?.reviews || 0 }} 评价</span>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- 商品列表 - 列表视图 -->
      <div v-else class="space-y-3">
        <NuxtLink
          v-for="product in products"
          :key="product.id"
          :to="`/product/${product.id}`"
          class="bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-lg transition-all flex group"
        >
          <div class="w-[220px] h-[220px] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center shrink-0 relative">
            <img v-if="product.skus?.[0]?.image" :src="product.skus[0].image" :alt="product.name" class="w-full h-full object-cover" @error="onImgError" />
            <span v-else class="text-gray-300 text-sm">商品图片</span>
          </div>
          <div class="flex-1 p-5 flex flex-col justify-between">
            <div>
              <p class="text-xs text-gray-400 mb-1">{{ product.brand?.name || '品牌' }}</p>
              <p class="text-base font-medium text-gray-700 group-hover:text-orange-500 transition line-clamp-2">{{ product.name }}</p>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-baseline gap-2">
                <span class="text-orange-500 font-bold text-lg">¥{{ product.skus?.[0]?.price || '--' }}</span>
              </div>
              <div class="flex items-center gap-4 text-xs text-gray-400">
                <span>{{ product._count?.reviews || 0 }} 评价</span>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- 空状态 -->
      <div v-if="!loading && products.length === 0" class="text-center py-20 text-gray-400">
        <p class="text-lg mb-2">暂无商品</p>
        <p class="text-sm">该分类下还没有商品，请查看其他分类</p>
      </div>

      <!-- 加载中 -->
      <div v-if="loading" class="text-center py-20 text-gray-400">
        <p>加载中...</p>
      </div>

      <!-- 分页 -->
      <div v-if="totalPages > 1" class="flex items-center justify-center mt-8 gap-1">
        <button
          class="w-9 h-9 flex items-center justify-center rounded border border-gray-200 bg-white text-sm text-gray-400 hover:border-orange-500 hover:text-orange-500 transition"
          :disabled="currentPage === 1"
          @click="currentPage > 1 && (currentPage--)"
        >
          &lt;
        </button>
        <button
          v-for="page in totalPages"
          :key="page"
          :class="[
            'w-9 h-9 flex items-center justify-center rounded border text-sm transition',
            currentPage === page ? 'bg-orange-500 text-white border-orange-500' : 'bg-white border-gray-200 text-gray-600 hover:border-orange-500 hover:text-orange-500'
          ]"
          @click="currentPage = page"
        >
          {{ page }}
        </button>
        <button
          class="w-9 h-9 flex items-center justify-center rounded border border-gray-200 bg-white text-sm text-gray-400 hover:border-orange-500 hover:text-orange-500 transition"
          :disabled="currentPage === totalPages"
          @click="currentPage < totalPages && (currentPage++)"
        >
          &gt;
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { get } = useApi()
const slug = computed(() => route.params.slug as string)

const activeSubCategory = ref('')
const activeBrand = ref('')
const activeStyleFilter = ref('')
const priceMin = ref('')
const priceMax = ref('')
const activeSort = ref('default')
const viewMode = ref<'grid' | 'list'>('grid')
const currentPage = ref(1)
const totalProducts = ref(0)
const pageSize = 20
const loading = ref(false)
const products = ref<any[]>([])
function onImgError(e: Event) { (e.target as HTMLImageElement).style.display = 'none' }

const totalPages = computed(() => Math.max(1, Math.ceil(totalProducts.value / pageSize)))

const sortOptions = [
  { label: '综合排序', value: 'default', sortable: false },
  { label: '销量', value: 'sales', sortable: true },
  { label: '价格', value: 'price_asc', sortable: true },
  { label: '新品', value: 'newest', sortable: false },
]

const { getCategoryBySlug, categories } = useCategories()

const categoryInfo = computed(() => {
  const found = getCategoryBySlug(slug.value)
  return found || { name: '分类', slug: slug.value, children: [] }
})

const brands = ['欧瑞仕', '卡琪朵', '慕梵希', '罗曼仕', 'Milantti 米兰蒂', '檀雅居', '诺美帝斯', '歌迪']
const styles = ['意式极简', '轻奢', '现代简约', '美式', '北欧', '新中式', '法式']

// 从 API 加载商品
async function loadProducts() {
  loading.value = true
  try {
    const cat = categoryInfo.value
    // 查找分类 ID
    const mainCat = categories.value.find(c => c.slug === slug.value)
    const subCat = activeSubCategory.value
      ? categories.value.flatMap(c => c.children || []).find(c => c.slug === activeSubCategory.value)
      : null

    const params: Record<string, any> = {
      page: currentPage.value,
      pageSize,
      sort: activeSort.value,
    }
    if (subCat) {
      params.categoryId = subCat.id
    } else if (mainCat) {
      params.categoryId = mainCat.id
    }
    if (priceMin.value) params.minPrice = Number(priceMin.value)
    if (priceMax.value) params.maxPrice = Number(priceMax.value)

    const res: any = await get('/v1/products', params)
    if (res?.data) {
      products.value = res.data.list || []
      totalProducts.value = res.data.total || 0
    }
  } catch {
    products.value = []
  } finally {
    loading.value = false
  }
}

// 监听筛选条件变化
watch([slug, activeSubCategory, activeSort, currentPage], () => {
  if (import.meta.client) loadProducts()
}, { immediate: true })

// 价格确定按钮触发（模板中已绑定）
watch([priceMin, priceMax], () => {
  // 价格由确定按钮触发，这里不自动加载
})

useHead({
  title: computed(() => `${categoryInfo.value.name} - 美家优选`),
})
</script>
