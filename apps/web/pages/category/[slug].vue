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
              <span>{{ pageCategory?.name || '服务' }}</span>
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

      <section v-if="pageCards.length && !currentSubCategory" class="mb-6">
        <div class="flex items-center justify-between gap-4 mb-4">
          <h2 class="text-xl font-bold text-gray-800">{{ serviceSectionTitle }}</h2>
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

      <section v-if="isRuralSupportCategory" class="mb-6">
        <div :class="ruralDisplayItems.length ? 'grid xl:grid-cols-[1.05fr_0.95fr] gap-4' : 'grid gap-4'">
          <div class="overflow-hidden rounded-[28px] border border-gray-100 bg-white">
            <div class="aspect-[16/10] bg-slate-100 overflow-hidden">
              <img
                v-if="ruralDisplayCover"
                :src="ruralDisplayCover"
                :alt="ruralDisplayTitle"
                class="h-full w-full object-cover"
                @error="onImgError"
              />
            </div>

            <div class="p-6 md:p-7">
              <p class="text-xs font-semibold tracking-[0.25em] text-orange-500">企业图片展示</p>
              <h2 class="mt-3 text-2xl font-bold text-gray-800">{{ ruralDisplayTitle }}</h2>
              <p class="mt-3 text-sm leading-7 text-gray-500">{{ ruralDisplaySummary }}</p>

              <div class="mt-5 flex flex-wrap gap-2">
                <span
                  v-for="tag in ruralDisplayTags"
                  :key="tag"
                  class="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-500"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>

          <div v-if="ruralDisplayItems.length" class="grid gap-4 sm:grid-cols-2">
            <article
              v-for="item in ruralDisplayItems"
              :key="item.title"
              class="overflow-hidden rounded-[24px] border border-gray-100 bg-white"
            >
              <div class="aspect-[4/3] bg-slate-100 overflow-hidden">
                <img
                  v-if="item.image"
                  :src="item.image"
                  :alt="item.title"
                  class="h-full w-full object-cover"
                  @error="onImgError"
                />
                <div
                  v-else
                  class="flex h-full w-full items-center justify-center text-sm text-gray-300"
                >
                  图片展示位
                </div>
              </div>

              <div class="p-5">
                <p class="text-xs font-medium text-orange-500">{{ item.tag }}</p>
                <h3 class="mt-2 text-lg font-semibold text-gray-800">{{ item.title }}</h3>
                <p class="mt-3 text-sm leading-6 text-gray-500">{{ item.description }}</p>
              </div>
            </article>
          </div>
        </div>

        <div class="mt-4 grid md:grid-cols-3 gap-4">
          <article
            v-for="slot in ruralArchiveSlots"
            :key="slot.title"
            class="rounded-[24px] border border-dashed border-gray-200 bg-white px-5 py-6"
          >
            <p class="text-xs font-semibold tracking-[0.2em] text-gray-400">图片预留位</p>
            <h3 class="mt-3 text-lg font-semibold text-gray-800">{{ slot.title }}</h3>
            <p class="mt-3 text-sm leading-6 text-gray-500">{{ slot.description }}</p>
          </article>
        </div>
      </section>

      <section v-if="serviceExample" class="mb-6">
        <div class="grid xl:grid-cols-[1.2fr_0.8fr] gap-4">
          <div class="bg-white rounded-[28px] p-6 md:p-7 border border-gray-100">
            <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div>
                <p class="text-xs font-semibold tracking-[0.25em] text-orange-500">{{ serviceExample.badge }}</p>
                <h2 class="mt-3 text-2xl font-bold text-gray-800">{{ serviceExample.title }}</h2>
                <p class="mt-3 text-sm leading-7 text-gray-500">{{ serviceExample.summary }}</p>
              </div>

              <div class="shrink-0 rounded-[24px] bg-orange-50 px-5 py-4">
                <p class="text-xs text-gray-400">参考价格</p>
                <p class="mt-1 text-3xl font-bold text-orange-500">{{ serviceExample.price }}</p>
                <p class="mt-1 text-xs text-gray-400">{{ serviceExample.priceNote }}</p>
              </div>
            </div>

            <div class="grid sm:grid-cols-3 gap-3 mt-6">
              <div
                v-for="stat in serviceExample.stats"
                :key="stat.label"
                class="rounded-2xl bg-[#f8f8f8] px-4 py-4"
              >
                <p class="text-xs text-gray-400">{{ stat.label }}</p>
                <p class="mt-2 text-lg font-semibold text-gray-800">{{ stat.value }}</p>
              </div>
            </div>

            <div class="grid md:grid-cols-3 gap-4 mt-6">
              <article
                v-for="pkg in serviceExample.packages"
                :key="pkg.name"
                class="rounded-[24px] border border-gray-100 bg-[#fcfcfc] p-5"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <p class="text-base font-semibold text-gray-800">{{ pkg.name }}</p>
                    <p class="mt-2 text-sm text-gray-500 leading-6">{{ pkg.description }}</p>
                  </div>
                  <span class="shrink-0 whitespace-nowrap text-lg font-bold text-orange-500">{{ pkg.price }}</span>
                </div>

                <div class="mt-4 space-y-2">
                  <p
                    v-for="feature in pkg.features"
                    :key="feature"
                    class="text-sm text-gray-600"
                  >
                    {{ feature }}
                  </p>
                </div>
              </article>
            </div>
          </div>

          <div class="space-y-4">
            <div class="rounded-[28px] bg-slate-900 p-6 text-white">
              <p class="text-xs font-semibold tracking-[0.25em] text-orange-300">服务包含</p>
              <div class="mt-4 space-y-3">
                <p
                  v-for="highlight in serviceExample.highlights"
                  :key="highlight"
                  class="text-sm text-white/85"
                >
                  {{ highlight }}
                </p>
              </div>

              <div class="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  @click="showPhoneDialog = true"
                  class="inline-flex items-center justify-center rounded-full bg-orange-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-600 transition"
                >
                  电话咨询
                </button>
                <NuxtLink
                  to="/login"
                  class="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm text-white hover:bg-white/15 transition"
                >
                  预约示例
                </NuxtLink>
              </div>
            </div>

            <div class="bg-white rounded-[28px] p-6 border border-gray-100">
              <p class="text-lg font-semibold text-gray-800">服务流程</p>
              <div class="mt-4 space-y-4">
                <div
                  v-for="(step, idx) in serviceExample.process"
                  :key="step"
                  class="flex items-start gap-3"
                >
                  <span class="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-500 text-xs font-semibold text-white">
                    {{ idx + 1 }}
                  </span>
                  <p class="text-sm leading-6 text-gray-600">{{ step }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section v-if="serviceExample" class="mb-6">
        <div class="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
          <article
            v-for="promise in serviceExample.promises"
            :key="promise.title"
            class="bg-white rounded-[24px] border border-gray-100 p-5"
          >
            <p class="text-base font-semibold text-gray-800">{{ promise.title }}</p>
            <p class="mt-2 text-sm leading-6 text-gray-500">{{ promise.description }}</p>
          </article>
        </div>
      </section>

      <div
        v-if="showPhoneDialog && !isRuralSupportCategory"
        class="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/55 px-4"
        @click.self="showPhoneDialog = false"
      >
        <div class="w-full max-w-[520px] rounded-[28px] bg-white p-6 md:p-7 shadow-2xl">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-xs font-semibold tracking-[0.25em] text-orange-500">电话咨询示例</p>
              <h3 class="mt-3 text-2xl font-bold text-gray-800">{{ phoneDialogTitle }}</h3>
              <p class="mt-2 text-sm leading-7 text-gray-500">
                这里先做站内弹窗示例，避免直接唤起系统电话。后面如果你要，我们再接真实客服系统。
              </p>
            </div>

            <button
              type="button"
              class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition"
              @click="showPhoneDialog = false"
            >
              ×
            </button>
          </div>

          <div class="mt-6 grid gap-3">
            <div class="rounded-2xl bg-[#f8f8f8] px-4 py-4">
              <p class="text-xs text-gray-400">服务热线</p>
              <p class="mt-2 text-2xl font-bold text-orange-500">400-888-0000</p>
            </div>

            <div class="grid sm:grid-cols-2 gap-3">
              <div class="rounded-2xl border border-gray-100 px-4 py-4">
                <p class="text-xs text-gray-400">当前咨询</p>
                <p class="mt-2 text-base font-semibold text-gray-800">{{ phoneDialogTitle }}</p>
              </div>
              <div class="rounded-2xl border border-gray-100 px-4 py-4">
                <p class="text-xs text-gray-400">服务时段</p>
                <p class="mt-2 text-base font-semibold text-gray-800">09:00 - 21:00</p>
              </div>
            </div>

            <div class="rounded-2xl border border-gray-100 px-4 py-4">
              <p class="text-xs text-gray-400">咨询说明</p>
              <div class="mt-3 space-y-2 text-sm leading-6 text-gray-600">
                <p>报价咨询：可先说明面积、数量、户型或安装环境。</p>
                <p>预约说明：可先登记时间、联系人和服务地址。</p>
                <p>售后回访：可记录问题点，后续再对接真实工单。</p>
              </div>
            </div>
          </div>

          <div class="mt-6 flex flex-wrap justify-end gap-3">
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-full border border-gray-200 px-5 py-2.5 text-sm text-gray-600 hover:border-gray-300 transition"
              @click="showPhoneDialog = false"
            >
              关闭
            </button>
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-full bg-orange-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-600 transition"
              @click="showPhoneDialog = false"
            >
              知道了
            </button>
          </div>
        </div>
      </div>

      <template v-if="showProductArea">
        <div v-if="!currentSubCategory" class="bg-white rounded-lg p-5 mb-4">
          <div class="flex items-start gap-4">
            <span class="text-sm text-gray-500 shrink-0 pt-1">服务类型：</span>
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
            <span class="text-sm text-gray-400">共 <b class="text-gray-700">{{ totalProducts }}</b> 项服务</span>
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
              <span v-else class="text-gray-300 text-sm">服务图片</span>
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
              <span v-else class="text-gray-300 text-sm">服务图片</span>
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
          <p class="text-lg">暂无服务</p>
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
interface ServiceStat {
  label: string
  value: string
}

interface ServicePackage {
  name: string
  price: string
  description: string
  features: string[]
}

interface ServicePromise {
  title: string
  description: string
}

interface RuralDisplayItem {
  title: string
  tag: string
  description: string
  image?: string
}

interface RuralArchiveSlot {
  title: string
  description: string
}

interface ServiceExample {
  badge: string
  title: string
  summary: string
  price: string
  priceNote: string
  stats: ServiceStat[]
  packages: ServicePackage[]
  highlights: string[]
  process: string[]
  promises: ServicePromise[]
}

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
const showPhoneDialog = ref(false)

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

const pageCategory = computed(() => topCategory.value)
const isRuralSupportCategory = computed(() => pageCategory.value?.slug === 'rural-support')

const showProductArea = computed(() =>
  !isRuralSupportCategory.value && Boolean(resolvedCategoryId.value),
)

const breadcrumbName = computed(() =>
  currentSubCategory.value?.name || topCategory.value?.name || '分类',
)

const serviceSectionTitle = computed(() =>
  isRuralSupportCategory.value ? '展示分类' : (currentSubCategory.value ? '服务详情' : '服务内容'),
)

const activeService = computed(() =>
  selectedSubCategory.value || currentSubCategory.value || null,
)

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

function getRuralDisplayMeta(itemSlug: string) {
  switch (itemSlug) {
    case 'farm-produce':
      return {
        tag: '产地纪实',
        description: '用于展示产地走访、基地环境和助农项目相关图片。',
      }
    case 'rural-revitalization':
      return {
        tag: '乡村共建',
        description: '用于展示乡村共建、项目现场和阶段推进相关图片。',
      }
    case 'public-welfare-procurement':
      return {
        tag: '公益活动',
        description: '用于展示公益活动现场、物资交接和帮扶落地相关图片。',
      }
    case 'corporate-responsibility':
      return {
        tag: '企业责任',
        description: '用于展示企业公益活动、团队参与和责任项目相关图片。',
      }
    default:
      return {
        tag: '图片展示',
        description: '用于展示企业活动、项目现场和阶段记录相关图片。',
      }
  }
}

const ruralDisplayItems = computed<RuralDisplayItem[]>(() => {
  if (!isRuralSupportCategory.value) return []

  const items = currentSubCategory.value ? [currentSubCategory.value] : []

  return items.map((item) => {
    const meta = getRuralDisplayMeta(item.slug)
    return {
      title: item.name,
      tag: meta.tag,
      description: meta.description,
      image: item.image || pageCategory.value?.image,
    }
  })
})

const ruralDisplayTags = computed(() => {
  if (!isRuralSupportCategory.value) return []

  if (currentSubCategory.value) {
    return ruralDisplayItems.value.map(item => item.tag)
  }

  return ['企业图片', '项目纪实', '责任展示', '活动留档']
})

const ruralDisplayTitle = computed(() =>
  currentSubCategory.value ? `${breadcrumbName.value}图片展示` : '助农帮扶图片展示',
)

const ruralDisplaySummary = computed(() =>
  currentSubCategory.value
    ? `当前页面用于集中展示${breadcrumbName.value}相关图片、项目记录和企业责任内容。`
    : '当前分类用于集中展示助农帮扶、乡村共建、公益活动和企业责任相关图片。',
)

const ruralDisplayCover = computed(() =>
  ruralDisplayItems.value[0]?.image || pageCategory.value?.image || '',
)

const ruralArchiveSlots = computed<RuralArchiveSlot[]>(() => {
  if (!isRuralSupportCategory.value) return []

  const scopeName = currentSubCategory.value?.name || '助农帮扶'

  return [
    {
      title: `${scopeName}图片位 01`,
      description: '后续可补充企业活动、现场纪实或走访记录图片。',
    },
    {
      title: `${scopeName}图片位 02`,
      description: '后续可补充项目过程、团队参与或帮扶留影图片。',
    },
    {
      title: `${scopeName}图片位 03`,
      description: '后续可补充阶段成果、物料海报或责任展示图片。',
    },
  ]
})

function buildServiceExample(serviceName: string, parentName: string, parentSlug: string): ServiceExample {
  const serviceScene = parentName === serviceName ? serviceName : `${parentName} · ${serviceName}`

  switch (parentSlug) {
    case 'housekeeping':
      return {
        badge: '到家服务示例',
        title: `${serviceName}服务方案`,
        summary: `${serviceName}支持线上预约、上门评估、服务验收与回访，先用示例内容把服务详情承接起来，后面接真实订单数据也方便。`,
        price: '¥199起',
        priceNote: '按面积、时长和服务深度计费',
        stats: [
          { label: '最快响应', value: '2小时内' },
          { label: '服务时长', value: '2-6小时' },
          { label: '服务方式', value: '上门执行' },
        ],
        packages: [
          { name: '基础方案', price: '¥199', description: `适合日常${serviceName}需求。`, features: ['基础清洁/整理', '标准工具耗材', '服务后确认'] },
          { name: '精选方案', price: '¥399', description: `适合重点区域和更细致的${serviceName}安排。`, features: ['重点区域加强', '细节处理', '服务照片反馈'] },
          { name: '尊享方案', price: '¥699', description: `适合整屋或复杂场景的${serviceName}示例。`, features: ['全屋服务规划', '多人上门', '售后回访'] },
        ],
        highlights: ['服务前电话确认时间', '支持按区域说明重点需求', '完成后现场验收，不满意可复核'],
        process: ['提交需求并说明户型/面积', '客服确认时间与服务重点', '服务人员按约上门执行', '完成后验收并回访记录'],
        promises: [
          { title: '身份核验', description: '上门服务人员统一实名登记，服务前再次确认。' },
          { title: '准时上门', description: '预约时段内安排到场，异常情况提前沟通。' },
          { title: '服务复核', description: '现场验收不满意可登记复核，便于后续补处理。' },
          { title: '售后回访', description: '服务完成后统一回访，方便沉淀真实评价数据。' },
        ],
      }
    case 'cabinet-custom':
      return {
        badge: '定制方案示例',
        title: `${serviceName}定制示例`,
        summary: `${serviceName}点击后先展示一个可落地的定制详情示例，包括量尺、设计、报价和安装交付，不再只是停留在分类图层。`,
        price: '¥999/延米起',
        priceNote: '按尺寸、材质、五金配置核价',
        stats: [
          { label: '上门量尺', value: '24小时内预约' },
          { label: '方案输出', value: '1-3个工作日' },
          { label: '安装交付', value: '排产后上门' },
        ],
        packages: [
          { name: '标准方案', price: '¥999起', description: `适合基础${serviceName}空间。`, features: ['上门量尺', '平面布局', '标准五金'] },
          { name: '品质方案', price: '¥1680起', description: `适合更完整的${serviceName}展示与收纳。`, features: ['效果图示例', '分区优化', '升级板材/五金'] },
          { name: '高配方案', price: '¥2680起', description: `适合更高要求的${serviceName}交付。`, features: ['一对一深化', '灯带/功能件预留', '安装验收'] },
        ],
        highlights: ['先量尺再出方案', '支持材质与颜色搭配示例', '安装完成后现场验收确认'],
        process: ['预约顾问沟通需求', '上门量尺并记录空间尺寸', '输出方案与报价示例', '确认排产后安装交付'],
        promises: [
          { title: '量尺到位', description: '按现场尺寸记录，避免后续返工。' },
          { title: '方案确认', description: '下单前先确认布局、材质和五金配置。' },
          { title: '安装收口', description: '安装完成后进行基础清洁和收口检查。' },
          { title: '售后支持', description: '交付后保留售后沟通窗口，便于后续维护。' },
        ],
      }
    case 'bath-hardware':
      return {
        badge: '安装示例',
        title: `${serviceName}安装服务示例`,
        summary: `${serviceName}除了展示图片，也补充了安装与交付示例，方便用户理解服务内容和收费方式。`,
        price: '¥129起',
        priceNote: '按安装件数和辅材使用计费',
        stats: [
          { label: '预约上门', value: '当日可约' },
          { label: '施工时长', value: '1-3小时' },
          { label: '适配方式', value: '包安装调试' },
        ],
        packages: [
          { name: '基础安装', price: '¥129', description: `适合单项${serviceName}安装。`, features: ['基础安装', '功能调试', '现场清理'] },
          { name: '配套安装', price: '¥299', description: `适合多件${serviceName}一起处理。`, features: ['多点位安装', '辅材建议', '统一验收'] },
          { name: '升级安装', price: '¥499', description: `适合改造类${serviceName}需求。`, features: ['旧件拆除示例', '安装调平', '售后回访'] },
        ],
        highlights: ['支持安装前电话确认', '现场确认孔位与辅材', '完工后测试功能是否正常'],
        process: ['预约时间', '确认安装环境', '师傅上门安装', '调试与验收'],
        promises: [
          { title: '透明报价', description: '安装前说明辅材和额外收费项，避免临时加价。' },
          { title: '现场调试', description: '安装完成后逐项测试，再交付使用。' },
          { title: '文明施工', description: '施工过程做好保护，减少对现场影响。' },
          { title: '回访记录', description: '完工后回访，方便后续售后跟进。' },
        ],
      }
    case 'appliances':
      return {
        badge: '交付示例',
        title: `${serviceName}安装/调试示例`,
        summary: `${serviceName}先做一版服务购买示例，包含送装一体、调试交付和售后保障，让点击后能看到具体承接内容。`,
        price: '¥199起',
        priceNote: '按送装距离、机型与辅材配置计费',
        stats: [
          { label: '送装方式', value: '送货安装一体' },
          { label: '最快预约', value: '次日可排' },
          { label: '调试交付', value: '现场完成' },
        ],
        packages: [
          { name: '标准送装', price: '¥199', description: `适合基础${serviceName}送装需求。`, features: ['送货到户', '标准安装', '通电调试'] },
          { name: '含辅材方案', price: '¥399', description: `适合需要辅材配套的${serviceName}服务。`, features: ['含常用辅材', '安装固定', '功能讲解'] },
          { name: '安心交付', price: '¥699', description: `适合复杂环境下的${serviceName}安排。`, features: ['拆旧示例', '加长管线/配件建议', '售后回访'] },
        ],
        highlights: ['支持送货前再次确认时间', '上门安装后现场调试', '交付时说明使用注意事项'],
        process: ['下单预约', '客服确认地址与机型', '送货安装并调试', '交付后回访'],
        promises: [
          { title: '送装同步', description: '减少多次上门，提高交付效率。' },
          { title: '安装调试', description: '安装完成后现场试机并确认状态。' },
          { title: '旧机处理', description: '可预留拆旧/回收沟通入口，后续再接真实流程。' },
          { title: '售后承接', description: '交付后保留售后咨询和安装记录。' },
        ],
      }
    case 'building-materials':
      return {
        badge: '方案示例',
        title: `${serviceName}供应服务示例`,
        summary: `${serviceName}先按服务方式展示选材、配送和施工配套示例，避免用户点进来只看到静态分类图。`,
        price: '¥89/㎡起',
        priceNote: '按面积、材料规格和施工要求核算',
        stats: [
          { label: '测算方式', value: '按面积核价' },
          { label: '配送安排', value: '分批到场' },
          { label: '施工配合', value: '可协同师傅' },
        ],
        packages: [
          { name: '基础供应', price: '¥89起', description: `适合标准${serviceName}用量。`, features: ['材料测算', '基础配送', '规格建议'] },
          { name: '配套方案', price: '¥159起', description: `适合需要施工配套的${serviceName}场景。`, features: ['搭配建议', '批次配送', '施工衔接'] },
          { name: '整屋方案', price: '¥299起', description: `适合整屋或多空间${serviceName}安排。`, features: ['整屋清单', '分区核算', '交付跟进'] },
        ],
        highlights: ['支持前期选材建议', '可按施工节奏安排配送', '后续可接真实报价与清单数据'],
        process: ['需求沟通', '材料测算', '方案报价', '配送/施工衔接'],
        promises: [
          { title: '规格清晰', description: '颜色、规格、数量先确认再下单。' },
          { title: '配送协同', description: '根据现场节奏安排到货，减少堆料。' },
          { title: '过程跟进', description: '配送后可继续跟进补货与调整。' },
          { title: '示例承接', description: '先用示例方案承接点击体验，后续接真实订单。' },
        ],
      }
    case 'lighting':
      return {
        badge: '照明方案示例',
        title: `${serviceName}配置示例`,
        summary: `${serviceName}先展示一个照明服务详情示例，包含选型、点位建议、安装调试和售后说明。`,
        price: '¥159起',
        priceNote: '按灯具数量、点位与安装难度计费',
        stats: [
          { label: '点位建议', value: '可先沟通' },
          { label: '安装时长', value: '1-4小时' },
          { label: '交付方式', value: '装完即调试' },
        ],
        packages: [
          { name: '基础布置', price: '¥159', description: `适合基础${serviceName}安装。`, features: ['单空间建议', '基础安装', '亮灯测试'] },
          { name: '氛围方案', price: '¥359', description: `适合更讲究层次感的${serviceName}配置。`, features: ['多灯型搭配', '点位调整建议', '效果确认'] },
          { name: '整屋联动', price: '¥699', description: `适合多空间${serviceName}统一安排。`, features: ['整屋方案', '批量安装', '交付回访'] },
        ],
        highlights: ['支持风格和空间匹配建议', '安装后统一亮灯调试', '保留后续补装与调整入口'],
        process: ['确认空间需求', '建议灯型与点位', '预约安装调试', '交付回访'],
        promises: [
          { title: '选型建议', description: '先确认空间和风格，再推荐灯型。' },
          { title: '调试交付', description: '安装后测试亮灯效果和基础稳定性。' },
          { title: '施工保护', description: '上门施工做好区域保护与清理。' },
          { title: '后续补装', description: '可继续承接追加点位和补装需求。' },
        ],
      }
    case 'interior-design':
      return {
        badge: '设计方案示例',
        title: `${serviceName}设计示例`,
        summary: `${serviceName}按装修设计服务来承接页面，突出需求沟通、风格确认、效果输出和落地配套，比只放分类图更完整。`,
        price: '¥699起',
        priceNote: '按空间面积、设计深度和输出内容核算',
        stats: [
          { label: '沟通方式', value: '在线+到场' },
          { label: '方案输出', value: '3-5个工作日' },
          { label: '设计内容', value: '图纸+建议' },
        ],
        packages: [
          { name: '基础设计', price: '¥699', description: `适合基础${serviceName}需求。`, features: ['平面布局建议', '风格方向沟通', '基础设计说明'] },
          { name: '深化设计', price: '¥1680', description: `适合更完整的${serviceName}安排。`, features: ['空间细化设计', '材质色彩建议', '效果图示例'] },
          { name: '落地配套', price: '¥2999', description: `适合需要完整落地配套的${serviceName}场景。`, features: ['全案设计思路', '主材软装建议', '施工衔接说明'] },
        ],
        highlights: ['先确认生活习惯和空间需求', '支持现代、轻奢、简约等风格沟通', '后续可继续接施工和主材配套'],
        process: ['收集户型信息与需求', '确认风格与功能分区', '输出设计方案和效果示例', '衔接选材与施工落地'],
        promises: [
          { title: '需求先行', description: '先把居住需求和预算范围确认清楚，再进入设计阶段。' },
          { title: '风格统一', description: '从空间、色彩到软装方向保持统一表达。' },
          { title: '落地导向', description: '不是只看效果图，也考虑后续施工和选材配套。' },
          { title: '迭代沟通', description: '方案输出后可继续按重点空间做调整和细化。' },
        ],
      }
    case 'township-self-build':
      return {
        badge: '建房方案示例',
        title: `${serviceName}规划示例`,
        summary: `${serviceName}按乡镇建房场景承接页面，重点展示户型规划、外观设计、施工安排和院落配套，让分类点击后更符合自建房主题。`,
        price: '¥1280起',
        priceNote: '按建筑面积、层数和方案深度核算',
        stats: [
          { label: '适用场景', value: '乡镇建房' },
          { label: '方案内容', value: '户型+外观' },
          { label: '沟通方式', value: '按地块定制' },
        ],
        packages: [
          { name: '基础规划', price: '¥1280', description: `适合基础${serviceName}需求。`, features: ['户型功能规划', '建房动线建议', '基础面积测算'] },
          { name: '外观方案', price: '¥2680', description: `适合重视外观表达的${serviceName}场景。`, features: ['外立面风格设计', '门窗比例建议', '色彩材质建议'] },
          { name: '整院配套', price: '¥4680', description: `适合整套${serviceName}统筹安排。`, features: ['主楼+院落统筹', '配套空间建议', '施工阶段说明'] },
        ],
        highlights: ['更适合乡镇宅基地和自建房场景', '兼顾居住功能、外观表达和院落使用', '后续可继续补施工图片和建房案例'],
        process: ['确认宅基地尺寸和建房需求', '梳理层数、户型和外观方向', '输出规划方案与配套建议', '衔接施工安排与阶段执行'],
        promises: [
          { title: '按地块规划', description: '先结合宅基地尺寸和朝向做空间规划。' },
          { title: '兼顾实用', description: '重视老人房、停车、储物和院落活动等真实使用需求。' },
          { title: '风格清晰', description: '外立面和整体比例统一，不做杂乱拼凑。' },
          { title: '阶段承接', description: '方案可继续承接施工、材料和现场阶段记录。' },
        ],
      }
    case 'rural-support':
      return {
        badge: '合作示例',
        title: `${serviceName}合作示例`,
        summary: `${serviceName}先用一个合作详情示例承接页面，说明对接方式、合作内容和交付路径，更符合助农帮扶的表达。`,
        price: '按项目沟通',
        priceNote: '以合作清单和执行范围为准',
        stats: [
          { label: '对接方式', value: '一对一沟通' },
          { label: '响应时间', value: '当日反馈' },
          { label: '交付形式', value: '项目制推进' },
        ],
        packages: [
          { name: '基础合作', price: '示例一', description: `适合初步${serviceName}对接。`, features: ['需求沟通', '合作范围确认', '基础执行建议'] },
          { name: '联合推进', price: '示例二', description: `适合持续性的${serviceName}合作。`, features: ['阶段计划', '资源协同', '执行复盘'] },
          { name: '品牌共建', price: '示例三', description: `适合长期${serviceName}项目。`, features: ['年度规划示例', '多方协作', '结果回顾'] },
        ],
        highlights: ['聚焦项目合作而不是单纯商品售卖', '先展示合作流程和责任分工', '便于后续接入真实案例图片和数据'],
        process: ['提交合作意向', '确认帮扶方向', '输出推进计划', '阶段执行与复盘'],
        promises: [
          { title: '合作透明', description: '合作范围、周期与交付节点提前明确。' },
          { title: '过程记录', description: '阶段推进有记录，方便回顾和汇报。' },
          { title: '长期跟进', description: '不是一次性页面展示，后续可补真实案例。' },
          { title: '社会责任', description: '更突出平台与企业的社会责任表达。' },
        ],
      }
    default:
      return {
        badge: '服务示例',
        title: `${serviceName}服务说明`,
        summary: `${serviceScene}先用示例内容承接点击后的详细信息，后续再接真实价格、订单与预约接口。`,
        price: '¥199起',
        priceNote: '具体以实际沟通为准',
        stats: [
          { label: '响应时间', value: '当天反馈' },
          { label: '服务方式', value: '预约处理' },
          { label: '交付形式', value: '按需安排' },
        ],
        packages: [
          { name: '基础方案', price: '¥199', description: `适合基础${serviceName}需求。`, features: ['需求沟通', '基础服务', '结果确认'] },
          { name: '精选方案', price: '¥399', description: `适合更完整的${serviceName}安排。`, features: ['方案细化', '重点处理', '服务反馈'] },
          { name: '进阶方案', price: '¥699', description: `适合复杂${serviceName}场景。`, features: ['深度处理', '执行跟进', '售后回访'] },
        ],
        highlights: ['先用示例承接点击体验', '后续可接真实服务数据', '保留电话咨询与预约入口'],
        process: ['提交需求', '确认方案', '安排执行', '回访跟进'],
        promises: [
          { title: '响应及时', description: '收到需求后尽快安排沟通。' },
          { title: '过程透明', description: '服务前先确认内容和方式。' },
          { title: '结果确认', description: '完成后进行验收或确认。' },
          { title: '持续补全', description: '后续再补真实购买与预约链路。' },
        ],
      }
  }
}

const serviceExample = computed(() => {
  if (!activeService.value) return null
  if (isRuralSupportCategory.value) return null

  const parentName = activeService.value.parentName || pageCategory.value?.name || '服务'
  const parentSlug = activeService.value.parentSlug || pageCategory.value?.slug || slug.value

  return buildServiceExample(activeService.value.name, parentName, parentSlug)
})

const phoneDialogTitle = computed(() =>
  activeService.value?.name ? `${activeService.value.name}电话咨询` : `${breadcrumbName.value}电话咨询`,
)

async function loadProducts() {
  if (!resolvedCategoryId.value || isRuralSupportCategory.value) {
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
