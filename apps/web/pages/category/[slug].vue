<template>
  <div class="bg-[#f5f5f5] min-h-screen">
    <div class="max-w-[1200px] mx-auto px-4 py-3">
      <nav class="flex items-center text-sm text-gray-400 gap-1">
        <NuxtLink to="/" class="hover:text-orange-500 transition">首页</NuxtLink>
        <span>/</span>
        <span class="text-gray-700">{{ breadcrumbName }}</span>
      </nav>
    </div>

    <div class="max-w-[1200px] mx-auto px-4 pb-10">
      <section class="relative overflow-hidden rounded-[32px] min-h-[320px] bg-slate-900 mb-6">
        <img
          v-if="pageCategory?.image"
          :src="pageCategory.image"
          :alt="pageCategory.name"
          class="absolute inset-0 h-full w-full object-cover"
          @error="onImgError"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/55 to-slate-950/10" />
        <div class="relative min-h-[320px] p-8 md:p-10 flex flex-col justify-between text-white">
          <div>
            <div class="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-xs font-medium backdrop-blur-sm">
              <span>{{ pageCategory?.icon || '📂' }}</span>
              <span>{{ pageCategory?.name || '分类' }}</span>
            </div>
            <h1 class="mt-5 text-3xl md:text-4xl font-bold leading-tight">{{ breadcrumbName }}</h1>
          </div>

          <div class="flex flex-wrap gap-2">
            <span
              v-for="child in heroChildren"
              :key="child.slug"
              class="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/85 backdrop-blur-sm"
            >
              {{ child.name }}
            </span>
          </div>
        </div>
      </section>

      <section v-if="pageCards.length" class="mb-6">
        <div class="flex items-center justify-between gap-4 mb-4">
          <h2 class="text-xl font-bold text-gray-800">分类图片</h2>
          <span class="text-sm text-gray-400">{{ pageCards.length }} 项</span>
        </div>

        <div class="grid md:grid-cols-3 gap-4">
          <article
            v-for="item in pageCards"
            :key="item.slug"
            class="bg-white rounded-[24px] overflow-hidden border border-gray-100 hover:shadow-lg transition"
          >
            <NuxtLink :to="`/category/${item.slug}`" class="block">
              <div class="aspect-[4/3] bg-slate-100 overflow-hidden">
                <img
                  v-if="item.image"
                  :src="item.image"
                  :alt="item.name"
                  class="h-full w-full object-cover"
                  @error="onImgError"
                />
              </div>
              <div class="p-5">
                <p class="text-xs text-orange-500 font-medium">{{ pageCategory?.name || breadcrumbName }}</p>
                <h3 class="mt-2 text-lg font-semibold text-gray-800 leading-7">{{ item.name }}</h3>
              </div>
            </NuxtLink>
          </article>
        </div>
      </section>

      <template v-if="showProductArea">
        <div v-if="!currentSubCategory" class="bg-white rounded-lg p-5 mb-4">
          <div class="flex items-start gap-4">
            <span class="text-sm text-gray-500 shrink-0 pt-1">子分类：</span>
            <div class="flex flex-wrap gap-2">
              <span
                :class="[
                  'px-3 py-1 rounded text-sm cursor-pointer transition',
                  !activeSubCategory ? 'bg-orange-500 text-white' : 'text-gray-600 hover:text-orange-500',
                ]"
                @click="activeSubCategory = ''"
              >
                全部
              </span>
              <span
                v-for="sub in filterChildren"
                :key="sub.slug"
                :class="[
                  'px-3 py-1 rounded text-sm cursor-pointer transition',
                  activeSubCategory === sub.slug ? 'bg-orange-500 text-white' : 'text-gray-600 hover:text-orange-500',
                ]"
                @click="activeSubCategory = sub.slug"
              >
                {{ sub.name }}
              </span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg px-5 py-3 mb-4 flex items-center justify-between">
          <div class="flex items-center gap-4 text-sm">
            <span
              v-for="sort in sortOptions"
              :key="sort.value"
              :class="[
                'cursor-pointer transition flex items-center gap-1',
                activeSort === sort.value ? 'text-orange-500 font-medium' : 'text-gray-500 hover:text-orange-500',
              ]"
              @click="activeSort = sort.value"
            >
              {{ sort.label }}
              <svg v-if="sort.sortable" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
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
                  <rect x="0" y="0" width="7" height="7" rx="1" />
                  <rect x="9" y="0" width="7" height="7" rx="1" />
                  <rect x="0" y="9" width="7" height="7" rx="1" />
                  <rect x="9" y="9" width="7" height="7" rx="1" />
                </svg>
              </button>
              <button
                :class="['w-8 h-8 flex items-center justify-center transition', viewMode === 'list' ? 'bg-orange-500 text-white' : 'text-gray-400']"
                @click="viewMode = 'list'"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                  <rect x="0" y="0" width="16" height="3" rx="1" />
                  <rect x="0" y="4.5" width="16" height="3" rx="1" />
                  <rect x="0" y="9" width="16" height="3" rx="1" />
                  <rect x="0" y="13" width="16" height="3" rx="1" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div v-if="viewMode === 'grid'" class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <NuxtLink
            v-for="product in products"
            :key="product.id"
            :to="`/product/${product.id}`"
            class="bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-lg transition-all group"
          >
            <div class="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative">
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
                <span>{{ product._count?.reviews || 0 }} 评价</span>
              </div>
            </div>
          </NuxtLink>
        </div>

        <div v-else class="space-y-3">
          <NuxtLink
            v-for="product in products"
            :key="product.id"
            :to="`/product/${product.id}`"
            class="bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-lg transition-all flex group"
          >
            <div class="w-[220px] h-[220px] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center shrink-0 relative">
              <img v-if="product.mainImage" :src="product.mainImage" :alt="product.name" class="w-full h-full object-cover" @error="onImgError" />
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

        <div v-if="!loading && products.length === 0" class="text-center py-20 text-gray-400">
          <p class="text-lg">暂无商品</p>
        </div>

        <div v-if="loading" class="text-center py-20 text-gray-400">
          <p>加载中...</p>
        </div>

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
              currentPage === page ? 'bg-orange-500 text-white border-orange-500' : 'bg-white border-gray-200 text-gray-600 hover:border-orange-500 hover:text-orange-500',
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
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { get } = useApi()
const slug = computed(() => route.params.slug as string)

const activeSubCategory = ref('')
const activeSort = ref('default')
const viewMode = ref<'grid' | 'list'>('grid')
const currentPage = ref(1)
const totalProducts = ref(0)
const pageSize = 20
const loading = ref(false)
const products = ref<any[]>([])

function onImgError(e: Event) {
  (e.target as HTMLImageElement).style.display = 'none'
}

const totalPages = computed(() => Math.max(1, Math.ceil(totalProducts.value / pageSize)))

const sortOptions = [
  { label: '综合排序', value: 'default', sortable: false },
  { label: '销量', value: 'sales', sortable: true },
  { label: '价格', value: 'price_asc', sortable: true },
  { label: '新品', value: 'newest', sortable: false },
]

const { categories } = useCategories()

const allSubCategories = computed(() =>
  categories.value.flatMap(category =>
    (category.children || []).map(child => ({
      ...child,
      parentName: category.name,
      parentSlug: category.slug,
    })),
  ),
)

const topCategory = computed(() =>
  categories.value.find(category => category.slug === slug.value)
  || categories.value.find(category => category.children?.some(child => child.slug === slug.value))
  || null,
)

const currentSubCategory = computed(() =>
  allSubCategories.value.find(item => item.slug === slug.value) || null,
)

const selectedSubCategory = computed(() =>
  activeSubCategory.value ? allSubCategories.value.find(item => item.slug === activeSubCategory.value) || null : null,
)

const resolvedCategoryId = computed(() =>
  selectedSubCategory.value?.id || currentSubCategory.value?.id || topCategory.value?.id || null,
)

const showProductArea = computed(() => Boolean(resolvedCategoryId.value))

const breadcrumbName = computed(() =>
  currentSubCategory.value?.name || topCategory.value?.name || '分类',
)

const pageCategory = computed(() => topCategory.value)

const heroChildren = computed(() =>
  pageCategory.value?.children || (currentSubCategory.value ? [currentSubCategory.value] : []),
)

const filterChildren = computed(() => pageCategory.value?.children || [])

const pageCards = computed(() => {
  const children = pageCategory.value?.children || []
  const targetSlug = activeSubCategory.value || currentSubCategory.value?.slug || ''

  if (!children.length) {
    return currentSubCategory.value ? [currentSubCategory.value] : []
  }

  if (targetSlug) {
    return children.filter(child => child.slug === targetSlug)
  }

  return children
})

async function loadProducts() {
  if (!resolvedCategoryId.value) {
    products.value = []
    totalProducts.value = 0
    loading.value = false
    return
  }

  loading.value = true
  try {
    const params: Record<string, any> = {
      page: currentPage.value,
      pageSize,
      sort: activeSort.value,
      categoryId: resolvedCategoryId.value,
    }

    const res: any = await get('/v1/products', params)
    if (res?.data) {
      products.value = res.data.list || []
      totalProducts.value = res.data.total || 0
    }
  } catch {
    products.value = []
    totalProducts.value = 0
  } finally {
    loading.value = false
  }
}

watch(slug, () => {
  activeSubCategory.value = ''
  currentPage.value = 1
})

watch([slug, activeSubCategory, activeSort, currentPage], () => {
  if (import.meta.client) loadProducts()
}, { immediate: true })

useHead({
  title: computed(() => `${breadcrumbName.value} - 美家优选`),
})
</script>
