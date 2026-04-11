<template>
  <div>
    <!-- ========== Banner 区域 ========== -->
    <section class="bg-[#f5f5f5]">
      <div class="max-w-[1200px] mx-auto px-4 py-4">
        <div class="flex gap-4">
          <!-- 左侧分类（首页常驻展示） -->
          <div class="hidden lg:block w-[210px] shrink-0 bg-[#3d3d3f] rounded-lg overflow-hidden">
            <NuxtLink
              v-for="cat in mainCategories"
              :key="cat.slug"
              :to="`/category/${cat.slug}`"
              class="flex items-center justify-between px-4 py-[10px] text-gray-200 text-sm hover:bg-[#555] hover:text-white transition"
            >
              <span>{{ cat.name }}</span>
              <svg class="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </NuxtLink>
          </div>

          <!-- Banner 轮播 -->
          <div class="flex-1 relative rounded-lg overflow-hidden bg-gray-200 min-h-[380px]">
            <template v-if="banners.length">
              <div
                v-for="(banner, idx) in banners"
                :key="banner.id || idx"
                :class="[
                  'absolute inset-0 transition-opacity duration-700',
                  idx === currentBanner ? 'opacity-100 z-10' : 'opacity-0 z-0'
                ]"
              >
                <div class="flex items-center justify-center h-full text-white" :style="{ background: banner.image ? 'none' : gradients[idx % gradients.length] }">
                  <img v-if="banner.image" :src="banner.image" :alt="banner.title" class="w-full h-full object-cover" @error="onImgError" />
                  <div v-else class="text-center">
                    <h2 class="text-3xl font-bold mb-2">{{ banner.title }}</h2>
                  </div>
                </div>
              </div>
            </template>
            <div v-else class="flex items-center justify-center h-full">
              <span class="text-gray-400">加载中...</span>
            </div>
            <!-- 指示器 -->
            <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              <button
                v-for="(_, idx) in banners"
                :key="idx"
                :class="[
                  'w-8 h-1.5 rounded-full transition-all',
                  idx === currentBanner ? 'bg-white' : 'bg-white/40'
                ]"
                @click="currentBanner = idx"
              />
            </div>
          </div>

          <!-- 右侧信息栏 -->
          <div class="hidden xl:flex flex-col w-[210px] shrink-0 gap-3">
            <div class="bg-white rounded-lg p-4 flex-1">
              <div class="flex items-center gap-2 mb-3">
                <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-sm">头像</div>
                <div>
                  <p class="text-sm font-medium">Hi，欢迎来到美家优选</p>
                  <div class="flex gap-2 mt-1">
                    <NuxtLink to="/login" class="text-xs text-orange-500 border border-orange-500 rounded px-2 py-0.5">登录</NuxtLink>
                    <NuxtLink to="/register" class="text-xs text-gray-500 border border-gray-300 rounded px-2 py-0.5">注册</NuxtLink>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-white rounded-lg p-4 flex-1">
              <h4 class="text-sm font-medium mb-2 text-gray-700">公告</h4>
              <ul class="text-xs text-gray-500 space-y-1.5">
                <li class="truncate">· 全场家具正品保障，假一赔十</li>
                <li class="truncate">· 满3000包邮包安装</li>
                <li class="truncate">· 7天无理由退换货</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ========== 唯美风尚（精选推荐） ========== -->
    <section class="max-w-[1200px] mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-5">
        <div>
          <h2 class="text-xl font-bold text-gray-800">唯美风尚</h2>
          <p class="text-sm text-gray-400 mt-0.5">精选品质家居，打造理想生活空间</p>
        </div>
        <div class="flex gap-3 text-sm">
          <span
            v-for="style in designStyles"
            :key="style"
            class="px-3 py-1 rounded-full border cursor-pointer transition"
            :class="activeStyle === style ? 'bg-orange-500 text-white border-orange-500' : 'text-gray-500 border-gray-200 hover:border-orange-500 hover:text-orange-500'"
            @click="activeStyle = style"
          >
            {{ style }}
          </span>
        </div>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <NuxtLink
          v-for="product in recommendProducts"
          :key="product.id"
          :to="`/product/${product.id}`"
          class="group bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-lg transition-all cursor-pointer"
        >
          <div class="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
            <img v-if="product.skus?.[0]?.image" :src="product.skus[0].image" :alt="product.name" class="w-full h-full object-cover" @error="onImgError" />
            <span v-else class="text-gray-400 text-sm">商品图片</span>
            <div class="absolute top-2 left-2 bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded">在售</div>
          </div>
          <div class="p-3">
            <p class="text-xs text-orange-500 mb-1">{{ product.brand?.name || '品牌' }}</p>
            <p class="text-sm font-medium text-gray-700 truncate group-hover:text-orange-500 transition">{{ product.name }}</p>
            <p class="text-orange-500 font-bold text-sm mt-1">¥{{ product.skus?.[0]?.price || '--' }}</p>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- ========== 品牌秀场 ========== -->
    <section class="bg-[#fafafa] py-8">
      <div class="max-w-[1200px] mx-auto px-4">
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-xl font-bold text-gray-800">品牌秀场</h2>
          <NuxtLink to="/brand" class="text-sm text-orange-500 hover:underline">查看全部品牌 →</NuxtLink>
        </div>
        <!-- 品牌滚动区域 -->
        <div class="overflow-hidden">
          <div class="flex gap-4 animate-marquee">
            <div
              v-for="brand in brandList"
              :key="brand"
              class="shrink-0 w-[140px] h-[80px] bg-white rounded-lg border border-gray-100 flex items-center justify-center hover:shadow-md hover:border-orange-200 transition cursor-pointer"
            >
              <span class="text-sm text-gray-500 font-medium">{{ brand }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ========== 分类楼层 ========== -->
    <section
      v-for="floor in categoryFloors"
      :key="floor.slug"
      class="max-w-[1200px] mx-auto px-4 py-8"
    >
      <!-- 楼层标题 -->
      <div class="flex items-center justify-between mb-5">
        <div class="flex items-center gap-4">
          <h2 class="text-xl font-bold text-gray-800">{{ floor.name }}</h2>
          <div class="flex gap-2 text-sm">
            <NuxtLink
              v-for="sub in floor.children"
              :key="sub.slug"
              :to="`/category/${sub.slug}`"
              class="text-gray-400 hover:text-orange-500 transition"
            >
              {{ sub.name }}
            </NuxtLink>
          </div>
        </div>
        <NuxtLink
          :to="`/category/${floor.slug}`"
          class="text-sm text-orange-500 hover:underline"
        >
          查看更多 →
        </NuxtLink>
      </div>

      <!-- 楼层内容：左侧大图 + 右侧商品网格 -->
      <div class="flex gap-4">
        <!-- 左侧分类大图 -->
        <div class="hidden md:block w-[234px] shrink-0 rounded-lg overflow-hidden bg-gradient-to-b" :class="floor.gradient">
          <div class="p-5 h-full flex flex-col justify-between text-white">
            <div>
              <h3 class="text-lg font-bold mb-2">{{ floor.name }}</h3>
              <p class="text-sm opacity-80">{{ floor.desc }}</p>
            </div>
            <NuxtLink :to="`/category/${floor.slug}`" class="text-sm opacity-80 hover:opacity-100 transition">
              进入频道 →
            </NuxtLink>
          </div>
        </div>

        <!-- 右侧商品网格 -->
        <div class="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
          <NuxtLink
            v-for="product in (floorProducts[floor.slug] || [])"
            :key="product.id"
            :to="`/product/${product.id}`"
            class="bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition cursor-pointer group"
          >
            <div class="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
              <img v-if="product.skus?.[0]?.image" :src="product.skus[0].image" :alt="product.name" class="w-full h-full object-cover" @error="onImgError" />
              <span v-else class="text-gray-300 text-xs">{{ floor.name }}商品图片</span>
            </div>
            <div class="p-2.5">
              <p class="text-xs text-gray-500 truncate">{{ product.brand?.name || '品牌' }} · {{ product.name }}</p>
              <p class="text-orange-500 font-bold text-sm mt-1">¥{{ product.skus?.[0]?.price || '--' }}</p>
            </div>
          </NuxtLink>
          <div
            v-for="i in Math.max(0, 8 - (floorProducts[floor.slug]?.length || 0))"
            :key="'placeholder-' + i"
            class="bg-white border border-gray-100 rounded-lg overflow-hidden"
          >
            <div class="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
              <span class="text-gray-300 text-xs">{{ floor.name }}商品图片</span>
            </div>
            <div class="p-2.5">
              <p class="text-xs text-gray-500 truncate">{{ floor.name }}商品</p>
              <p class="text-orange-500 font-bold text-sm mt-1">¥--</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ========== 服务保障 ========== -->
    <section class="bg-[#fafafa] py-8 mt-4">
      <div class="max-w-[1200px] mx-auto px-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div v-for="service in services" :key="service.title" class="flex items-center gap-3">
            <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
              <span class="text-2xl">{{ service.icon }}</span>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-700">{{ service.title }}</p>
              <p class="text-xs text-gray-400">{{ service.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { get } = useApi()
const currentBanner = ref(0)
const activeStyle = ref('意式美学')
function onImgError(e: Event) { (e.target as HTMLImageElement).style.display = 'none' }

const gradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
]

// 从 API 获取 banner
const banners = ref<any[]>([
  { title: '意式极简 轻奢生活', image: '' },
  { title: '奶油风系列 温暖家居', image: '' },
  { title: '实木工坊 匠心之作', image: '' },
])
if (import.meta.client) {
  get('/v1/banners').then((res: any) => {
    if (res?.data?.length) banners.value = res.data
  }).catch(() => {})
}

const designStyles = ['意式美学', 'INS奶油风', '现代艺术', '木本侘寂']

const brandList = [
  '欧瑞仕', '卡琪朵', '慕梵希', '罗曼仕',
  'Milantti 米兰蒂', '檀雅居', '诺美帝斯', '歌迪',
  '欧瑞仕', '卡琪朵', '慕梵希', '罗曼仕',
]

const { categories } = useCategories()
const mainCategories = computed(() => categories.value.map(c => ({ name: c.name, slug: c.slug })))

// 从 API 获取推荐商品
const recommendProducts = ref<any[]>([])
if (import.meta.client) {
  get('/v1/products', { page: 1, pageSize: 4, sort: 'newest' }).then((res: any) => {
    if (res?.data?.list) recommendProducts.value = res.data.list
  }).catch(() => {})
}

const categoryFloors = [
  {
    name: '客厅', slug: 'living-room',
    desc: '品质沙发 · 精选茶几 · 电视柜',
    gradient: 'from-orange-400 to-orange-600',
    children: [
      { name: '沙发', slug: 'sofa' },
      { name: '茶几', slug: 'coffee-table' },
      { name: '电视柜', slug: 'tv-cabinet' },
      { name: '休闲椅', slug: 'lounge-chair' },
    ],
  },
  {
    name: '卧室', slug: 'bedroom',
    desc: '舒适好床 · 优质床垫 · 收纳柜',
    gradient: 'from-blue-400 to-blue-600',
    children: [
      { name: '床', slug: 'bed' },
      { name: '床头柜', slug: 'nightstand' },
      { name: '床垫', slug: 'mattress' },
      { name: '妆台', slug: 'vanity' },
    ],
  },
  {
    name: '餐厅', slug: 'dining-room',
    desc: '岩板餐桌 · 舒适餐椅 · 收纳柜',
    gradient: 'from-emerald-400 to-emerald-600',
    children: [
      { name: '餐桌', slug: 'dining-table' },
      { name: '餐椅', slug: 'dining-chair' },
      { name: '餐边柜', slug: 'sideboard' },
    ],
  },
  {
    name: '书房', slug: 'study',
    desc: '实木书桌 · 大容量书柜 · 人体工学椅',
    gradient: 'from-violet-400 to-violet-600',
    children: [
      { name: '书桌', slug: 'desk' },
      { name: '书柜', slug: 'bookcase' },
      { name: '转椅', slug: 'office-chair' },
    ],
  },
]

// 楼层商品数据：按分类加载
const floorProducts = ref<Record<string, any[]>>({})
if (import.meta.client) {
  // 先等分类数据加载，然后按分类ID获取商品
  const loadFloorProducts = () => {
    categoryFloors.forEach(floor => {
      const cat = categories.value.find(c => c.slug === floor.slug)
      if (cat) {
        get('/v1/products', { page: 1, pageSize: 8, categoryId: cat.id }).then((res: any) => {
          if (res?.data?.list) {
            floorProducts.value[floor.slug] = res.data.list
          }
        }).catch(() => {})
      }
    })
  }
  // 延迟一点加载，等 categories 数据就绪
  watch(categories, (val) => {
    if (val.length) loadFloorProducts()
  }, { immediate: true })
}

const services = [
  { icon: '🛡️', title: '正品保障', desc: '100% 品牌授权' },
  { icon: '🚚', title: '全国配送', desc: '免费送货上门' },
  { icon: '🔧', title: '免费安装', desc: '专业师傅上门' },
  { icon: '🔄', title: '售后无忧', desc: '7天无理由退换' },
]

// Banner 自动轮播
let timer: ReturnType<typeof setInterval> | null = null
onMounted(() => {
  timer = setInterval(() => {
    currentBanner.value = (currentBanner.value + 1) % banners.length
  }, 4000)
})
onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.animate-marquee {
  animation: marquee 20s linear infinite;
}

.animate-marquee:hover {
  animation-play-state: paused;
}
</style>
