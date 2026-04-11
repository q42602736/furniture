<template>
  <div class="bg-[#f5f5f5] min-h-screen">
    <div class="max-w-[1200px] mx-auto px-4 py-4">
      <!-- 面包屑 -->
      <nav class="flex items-center text-sm text-gray-400 gap-1 mb-4">
        <NuxtLink to="/" class="hover:text-orange-500 transition">首页</NuxtLink>
        <span>/</span>
        <span class="text-gray-700">品牌馆</span>
      </nav>

      <!-- 热门品牌 Banner -->
      <div class="bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg p-8 mb-6 text-white">
        <h1 class="text-2xl font-bold mb-2">品牌馆</h1>
        <p class="text-sm opacity-80">汇聚全球精选家居品牌 · 品质保障 · 正品直供</p>
      </div>

      <!-- 品牌字母索引 -->
      <div class="bg-white rounded-lg px-5 py-3 mb-4 flex items-center gap-3 text-sm flex-wrap">
        <span class="text-gray-500 shrink-0">品牌首字母：</span>
        <span
          v-for="letter in letters"
          :key="letter"
          :class="[
            'w-7 h-7 flex items-center justify-center rounded cursor-pointer transition text-xs',
            activeLetter === letter ? 'bg-orange-500 text-white' : 'text-gray-600 hover:text-orange-500'
          ]"
          @click="activeLetter = activeLetter === letter ? '' : letter"
        >
          {{ letter }}
        </span>
      </div>

      <!-- 加载中 -->
      <div v-if="loading" class="py-20 text-center text-gray-400">加载中...</div>

      <!-- 品牌列表 -->
      <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <NuxtLink
          v-for="brand in filteredBrands"
          :key="brand.id"
          :to="`/brand/${brand.id}`"
          class="bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-lg transition-all group"
        >
          <div class="h-[120px] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
            <img
              v-if="brand.logo"
              :src="brand.logo"
              :alt="brand.name"
              class="w-full h-full object-contain p-4"
              @error="onLogoError"
            />
            <span v-else class="text-gray-400 text-lg font-medium group-hover:text-orange-500 transition">{{ brand.name }}</span>
          </div>
          <div class="p-3 border-t border-gray-50">
            <p class="text-sm font-medium text-gray-700 truncate">{{ brand.name }}</p>
            <div class="flex items-center justify-between mt-2 text-xs">
              <span class="text-gray-400">{{ brand.productCount ? brand.productCount + ' 件商品' : '品牌旗舰' }}</span>
              <span class="text-orange-500">进入品牌 →</span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { get } = useApi()
const activeLetter = ref('')
const loading = ref(false)

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'W', 'X', 'Y', 'Z']

interface BrandItem {
  id: string
  name: string
  logo: string | null
  letter: string
  productCount: number
}

const brands = ref<BrandItem[]>([])

function onLogoError(e: Event) { (e.target as HTMLImageElement).style.display = 'none' }

if (import.meta.client) {
  loading.value = true
  get('/v1/brands').then((res: any) => {
    const list = res?.data?.list || res?.data || []
    brands.value = list.map((b: any) => ({
      id: String(b.id),
      name: b.name,
      logo: b.logo || null,
      letter: b.name.replace(/[^a-zA-Z]/, '').charAt(0).toUpperCase() || '#',
      productCount: b._count?.products || 0,
    }))
  }).catch(() => {}).finally(() => { loading.value = false })
}

const filteredBrands = computed(() => {
  if (!activeLetter.value) return brands.value
  return brands.value.filter(b => b.letter === activeLetter.value)
})

useHead({ title: '品牌馆 - 美家优选' })
</script>
