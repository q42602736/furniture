<template>
  <div class="bg-[#f5f5f5] min-h-screen">
    <!-- 面包屑 -->
    <div class="max-w-[1200px] mx-auto px-4 py-3">
      <nav class="flex items-center text-sm text-gray-400 gap-1">
        <NuxtLink to="/" class="hover:text-orange-500 transition">首页</NuxtLink>
        <span>/</span>
        <NuxtLink v-if="product?.category" :to="`/category/${product.category.slug}`" class="hover:text-orange-500 transition">{{ product.category.name }}</NuxtLink>
        <span v-if="product?.category">/</span>
        <span class="text-gray-700">商品详情</span>
      </nav>
    </div>

    <div class="max-w-[1200px] mx-auto px-4 pb-10">
      <!-- ===== 商品主信息区 ===== -->
      <div class="bg-white rounded-lg p-6 mb-4 flex gap-8">
        <!-- 左侧：商品图片 -->
        <div class="w-[450px] shrink-0">
          <!-- 主图 -->
          <div class="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center border border-gray-100 overflow-hidden mb-3">
            <img v-if="mainImage" :src="mainImage" :alt="product?.name" class="w-full h-full object-cover" />
            <span v-else class="text-gray-300 text-lg">主商品图片</span>
          </div>
          <!-- 缩略图列表 -->
          <div class="flex gap-2">
            <div
              v-for="(img, idx) in productImages"
              :key="idx"
              :class="[
                'w-[75px] h-[75px] bg-gradient-to-br from-gray-50 to-gray-100 rounded border-2 flex items-center justify-center cursor-pointer transition overflow-hidden',
                activeThumb === idx ? 'border-orange-500' : 'border-gray-100 hover:border-orange-300'
              ]"
              @click="activeThumb = idx"
            >
              <img :src="img" class="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        <!-- 右侧：商品信息 -->
        <div class="flex-1 min-w-0">
          <h1 class="text-xl font-bold text-gray-800 leading-relaxed">{{ product?.name || '加载中...' }}</h1>
          <p class="text-sm text-gray-400 mt-1">{{ product?.description || '' }}</p>

          <!-- 价格区域 -->
          <div class="bg-[#fef3f0] rounded-lg p-4 mt-4">
            <div class="flex items-baseline gap-3">
              <span class="text-sm text-gray-500">价格</span>
              <span class="text-orange-500 text-3xl font-bold">¥{{ selectedSku?.price || product?.skus?.[0]?.price || '--' }}</span>
            </div>
            <div class="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <span class="bg-orange-100 text-orange-600 px-2 py-0.5 rounded">满3000减200</span>
              <span class="bg-orange-100 text-orange-600 px-2 py-0.5 rounded">新人立减50</span>
              <span class="bg-orange-100 text-orange-600 px-2 py-0.5 rounded">免费安装</span>
            </div>
          </div>

          <!-- 配送信息 -->
          <div class="mt-5 space-y-3 text-sm">
            <div class="flex items-center gap-4">
              <span class="text-gray-500 w-14 shrink-0">配送至</span>
              <span class="text-gray-700">广东省 深圳市 南山区</span>
              <span class="text-orange-500 text-xs cursor-pointer">修改</span>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-gray-500 w-14 shrink-0">运费</span>
              <span class="text-gray-700">包邮（含安装）</span>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-gray-500 w-14 shrink-0">品牌</span>
              <span class="text-orange-500">{{ product?.brand?.name || '--' }}</span>
            </div>
          </div>

          <!-- SKU 选择 -->
          <div class="mt-5">
            <div class="mb-4">
              <span class="text-sm text-gray-500 mb-2 block">规格选择</span>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="sku in (product?.skus || [])"
                  :key="sku.id"
                  :class="[
                    'px-4 py-2 border rounded text-sm cursor-pointer transition',
                    selectedSkuId === sku.id ? 'border-orange-500 text-orange-500 bg-orange-50' : 'border-gray-200 text-gray-600 hover:border-orange-300',
                    sku.stock <= 0 ? 'opacity-50 cursor-not-allowed' : ''
                  ]"
                  @click="sku.stock > 0 && (selectedSkuId = sku.id)"
                >
                  {{ sku.name }}
                </span>
              </div>
            </div>
          </div>

          <!-- 数量 -->
          <div class="flex items-center gap-4 mt-4">
            <span class="text-sm text-gray-500">数量</span>
            <div class="flex items-center border border-gray-200 rounded">
              <button class="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-orange-500 transition" @click="quantity > 1 && quantity--">−</button>
              <input v-model.number="quantity" type="number" class="w-12 h-8 text-center text-sm border-x border-gray-200 focus:outline-none" min="1" />
              <button class="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-orange-500 transition" @click="quantity++">+</button>
            </div>
            <span class="text-xs text-gray-400">库存 {{ selectedSku?.stock ?? '--' }}</span>
          </div>

          <!-- 操作按钮 -->
          <div class="flex gap-3 mt-6">
            <button class="h-12 px-10 bg-orange-500 text-white font-medium rounded hover:bg-orange-600 transition" @click="handleBuyNow">
              立即购买
            </button>
            <button class="h-12 px-10 border-2 border-orange-500 text-orange-500 font-medium rounded hover:bg-orange-50 transition" @click="handleAddToCart">
              加入购物车
            </button>
            <button class="h-12 px-6 border border-gray-200 text-gray-500 rounded hover:border-orange-500 hover:text-orange-500 transition flex items-center gap-1" @click="handleToggleFavorite">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
              收藏
            </button>
          </div>
        </div>
      </div>

      <!-- ===== 底部区域：详情 + 侧栏 ===== -->
      <div class="flex gap-4">
        <!-- 左侧详情 -->
        <div class="flex-1 min-w-0">
          <!-- Tab 导航 -->
          <div class="bg-white rounded-t-lg border-b border-gray-100">
            <div class="flex">
              <button
                v-for="tab in detailTabs"
                :key="tab.key"
                :class="[
                  'px-6 py-3.5 text-sm font-medium transition relative',
                  activeTab === tab.key ? 'text-orange-500' : 'text-gray-500 hover:text-gray-700'
                ]"
                @click="activeTab = tab.key"
              >
                {{ tab.label }}
                <span v-if="tab.count" class="ml-1 text-xs text-gray-400">({{ tab.count }})</span>
                <div v-if="activeTab === tab.key" class="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"/>
              </button>
            </div>
          </div>

          <!-- 商品详情 Tab -->
          <div v-if="activeTab === 'detail'" class="bg-white rounded-b-lg p-6">
            <!-- 参数表 -->
            <div class="mb-8">
              <h3 class="text-base font-medium text-gray-800 mb-4">产品参数</h3>
              <div class="grid grid-cols-2 gap-x-8 border border-gray-100 rounded-lg overflow-hidden">
                <div v-for="attr in (product?.attributes || [])" :key="attr.id" class="flex border-b border-gray-100 last:border-0">
                  <span class="w-28 bg-gray-50 px-4 py-2.5 text-sm text-gray-500 shrink-0">{{ attr.name }}</span>
                  <span class="px-4 py-2.5 text-sm text-gray-700">{{ attr.value }}</span>
                </div>
              </div>
            </div>
            <!-- 图文详情 -->
            <div class="space-y-4">
              <div v-for="i in 4" :key="i" class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center h-[400px]">
                <span class="text-gray-300">商品详情图 {{ i }}</span>
              </div>
            </div>
          </div>

          <!-- 评价 Tab -->
          <div v-if="activeTab === 'reviews'" class="bg-white rounded-b-lg p-6">
            <!-- 评价统计 -->
            <div class="flex items-center gap-8 pb-5 border-b border-gray-100 mb-5">
              <div class="text-center">
                <div class="text-3xl font-bold text-orange-500">{{ product?._count?.reviews || 0 }}</div>
                <div class="text-xs text-gray-400 mt-1">条评价</div>
              </div>
            </div>
            <!-- 评价列表 -->
            <div v-if="reviews.length" class="space-y-5">
              <div v-for="review in reviews" :key="review.id" class="pb-5 border-b border-gray-100 last:border-0">
                <div class="flex items-center gap-3 mb-2">
                  <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-400">
                    {{ review.user?.nickname?.[0] || '用' }}
                  </div>
                  <span class="text-sm text-gray-600">{{ review.user?.nickname || '匿名用户' }}</span>
                  <div class="flex text-orange-400 text-xs">{{ '★'.repeat(review.rating || 5) }}</div>
                  <span class="text-xs text-gray-400 ml-auto">{{ new Date(review.createdAt).toLocaleDateString() }}</span>
                </div>
                <p class="text-sm text-gray-600 leading-relaxed">{{ review.content }}</p>
              </div>
            </div>
            <div v-else class="text-center py-10 text-gray-400 text-sm">暂无评价</div>
          </div>

          <!-- 售后 Tab -->
          <div v-if="activeTab === 'aftersale'" class="bg-white rounded-b-lg p-6">
            <div class="space-y-4 text-sm text-gray-600 leading-relaxed">
              <div>
                <h4 class="font-medium text-gray-800 mb-2">退换货政策</h4>
                <p>自签收之日起7天内，如商品存在质量问题，可申请退换货。退换货运费由平台承担。</p>
              </div>
              <div>
                <h4 class="font-medium text-gray-800 mb-2">质保说明</h4>
                <p>本商品享受5年质保服务，自签收之日起计算。质保范围包括：主体框架、五金配件等。</p>
              </div>
              <div>
                <h4 class="font-medium text-gray-800 mb-2">安装服务</h4>
                <p>免费提供上门安装服务，安装师傅将在送货当天进行安装，请确保安装场地准备就绪。</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧栏 -->
        <div class="hidden lg:block w-[280px] shrink-0 space-y-4">
          <!-- 品牌信息卡 -->
          <div class="bg-white rounded-lg p-4" v-if="product?.brand">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold overflow-hidden">
                <img v-if="product.brand.logo" :src="product.brand.logo" class="w-full h-full object-cover" />
                <span v-else>{{ (product.brand.name || '品')[0] }}</span>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-700">{{ product.brand.name }}</p>
              </div>
            </div>
            <NuxtLink :to="`/brand/${product.brand.id}`" class="block w-full text-center py-2 border border-orange-500 text-orange-500 text-sm rounded hover:bg-orange-50 transition">
              进入品牌馆
            </NuxtLink>
          </div>

          <!-- 热销推荐 -->
          <div class="bg-white rounded-lg p-4">
            <h3 class="text-sm font-medium text-gray-800 mb-3">热销推荐</h3>
            <div class="space-y-3">
              <NuxtLink
                v-for="rec in recommendProducts"
                :key="rec.id"
                :to="`/product/${rec.id}`"
                class="flex gap-3 group"
              >
                <div class="w-[70px] h-[70px] bg-gradient-to-br from-gray-50 to-gray-100 rounded flex items-center justify-center shrink-0 overflow-hidden">
                  <img v-if="rec.skus?.[0]?.price" :src="rec.mainImage || ''" class="w-full h-full object-cover" />
                  <span v-else class="text-gray-300 text-[10px]">图片</span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs text-gray-600 truncate group-hover:text-orange-500 transition">{{ rec.name }}</p>
                  <p class="text-orange-500 font-bold text-sm mt-1">¥{{ rec.skus?.[0]?.price || '--' }}</p>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { get, post } = useApi()
const userStore = useUserStore()
const productId = computed(() => Number(route.params.id))

const activeThumb = ref(0)
const selectedSkuId = ref<number | null>(null)
const quantity = ref(1)
const activeTab = ref('detail')
const product = ref<any>(null)
const reviews = ref<any[]>([])
const recommendProducts = ref<any[]>([])

const selectedSku = computed(() => {
  if (!product.value?.skus) return null
  return product.value.skus.find((s: any) => s.id === selectedSkuId.value) || product.value.skus[0]
})

const productImages = computed(() => {
  if (!product.value) return []
  const imgs = (product.value.images || []).map((i: any) => i.url)
  if (!imgs.length && product.value.mainImage) return [product.value.mainImage]
  return imgs
})

const mainImage = computed(() => productImages.value[activeThumb.value] || product.value?.mainImage || '')

const detailTabs = computed(() => [
  { key: 'detail', label: '商品详情' },
  { key: 'reviews', label: '商品评价', count: product.value?._count?.reviews || 0 },
  { key: 'aftersale', label: '售后保障' },
])

// 加载商品数据
if (import.meta.client) {
  get(`/v1/products/${productId.value}`).then((res: any) => {
    if (res?.data) {
      product.value = res.data
      if (res.data.skus?.length) selectedSkuId.value = res.data.skus[0].id
    }
  }).catch(() => {})

  get(`/v1/products/${productId.value}/reviews`, { page: 1, pageSize: 10 }).then((res: any) => {
    if (res?.data?.list) reviews.value = res.data.list
  }).catch(() => {})

  get(`/v1/products/${productId.value}/recommend`).then((res: any) => {
    if (res?.data) recommendProducts.value = res.data
  }).catch(() => {})
}

async function handleAddToCart() {
  if (!userStore.isLoggedIn) return navigateTo('/login')
  if (!selectedSku.value) return alert('请选择规格')
  try {
    await post('/v1/cart', {
      productId: productId.value,
      skuId: selectedSku.value.id,
      quantity: quantity.value,
    })
    alert('已加入购物车')
  } catch (e: any) {
    alert(e?.data?.message || '加入购物车失败')
  }
}

async function handleBuyNow() {
  if (!userStore.isLoggedIn) return navigateTo('/login')
  await handleAddToCart()
  navigateTo('/cart')
}

async function handleToggleFavorite() {
  if (!userStore.isLoggedIn) return navigateTo('/login')
  try {
    await post(`/v1/favorites/${productId.value}`)
    alert('操作成功')
  } catch (e: any) {
    alert(e?.data?.message || '操作失败')
  }
}

useHead({
  title: computed(() => `${product.value?.name || '商品详情'} - 美家优选`),
})
</script>
