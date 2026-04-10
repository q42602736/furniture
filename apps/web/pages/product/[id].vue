<template>
  <div class="bg-[#f5f5f5] min-h-screen">
    <!-- 面包屑 -->
    <div class="max-w-[1200px] mx-auto px-4 py-3">
      <nav class="flex items-center text-sm text-gray-400 gap-1">
        <NuxtLink to="/" class="hover:text-orange-500 transition">首页</NuxtLink>
        <span>/</span>
        <NuxtLink to="/category/living-room" class="hover:text-orange-500 transition">客厅</NuxtLink>
        <span>/</span>
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
            <span class="text-gray-300 text-lg">主商品图片</span>
          </div>
          <!-- 缩略图列表 -->
          <div class="flex gap-2">
            <div
              v-for="i in 5"
              :key="i"
              :class="[
                'w-[75px] h-[75px] bg-gradient-to-br from-gray-50 to-gray-100 rounded border-2 flex items-center justify-center cursor-pointer transition',
                activeThumb === i ? 'border-orange-500' : 'border-gray-100 hover:border-orange-300'
              ]"
              @click="activeThumb = i"
            >
              <span class="text-gray-300 text-[10px]">图{{ i }}</span>
            </div>
          </div>
        </div>

        <!-- 右侧：商品信息 -->
        <div class="flex-1 min-w-0">
          <h1 class="text-xl font-bold text-gray-800 leading-relaxed">{{ product.name }}</h1>
          <p class="text-sm text-gray-400 mt-1">{{ product.subtitle }}</p>

          <!-- 价格区域 -->
          <div class="bg-[#fef3f0] rounded-lg p-4 mt-4">
            <div class="flex items-baseline gap-3">
              <span class="text-sm text-gray-500">促销价</span>
              <span class="text-orange-500 text-3xl font-bold">¥{{ product.price }}</span>
              <span class="text-gray-400 text-sm line-through">¥{{ product.originalPrice }}</span>
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
              <NuxtLink to="/brand/1" class="text-orange-500 hover:underline">{{ product.brand }}</NuxtLink>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-gray-500 w-14 shrink-0">店铺</span>
              <NuxtLink to="/merchant/1" class="text-orange-500 hover:underline">{{ product.merchant }}</NuxtLink>
            </div>
          </div>

          <!-- SKU 选择 -->
          <div class="mt-5">
            <div class="mb-4">
              <span class="text-sm text-gray-500 mb-2 block">颜色分类</span>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="color in skuColors"
                  :key="color"
                  :class="[
                    'px-4 py-2 border rounded text-sm cursor-pointer transition',
                    selectedColor === color ? 'border-orange-500 text-orange-500 bg-orange-50' : 'border-gray-200 text-gray-600 hover:border-orange-300'
                  ]"
                  @click="selectedColor = color"
                >
                  {{ color }}
                </span>
              </div>
            </div>

            <div class="mb-4">
              <span class="text-sm text-gray-500 mb-2 block">尺寸</span>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="size in skuSizes"
                  :key="size"
                  :class="[
                    'px-4 py-2 border rounded text-sm cursor-pointer transition',
                    selectedSize === size ? 'border-orange-500 text-orange-500 bg-orange-50' : 'border-gray-200 text-gray-600 hover:border-orange-300'
                  ]"
                  @click="selectedSize = size"
                >
                  {{ size }}
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
            <span class="text-xs text-gray-400">库存充足</span>
          </div>

          <!-- 操作按钮 -->
          <div class="flex gap-3 mt-6">
            <button class="h-12 px-10 bg-orange-500 text-white font-medium rounded hover:bg-orange-600 transition">
              立即购买
            </button>
            <button class="h-12 px-10 border-2 border-orange-500 text-orange-500 font-medium rounded hover:bg-orange-50 transition">
              加入购物车
            </button>
            <button class="h-12 px-6 border border-gray-200 text-gray-500 rounded hover:border-orange-500 hover:text-orange-500 transition flex items-center gap-1">
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
                <div v-for="(param, idx) in productParams" :key="idx" class="flex border-b border-gray-100 last:border-0">
                  <span class="w-28 bg-gray-50 px-4 py-2.5 text-sm text-gray-500 shrink-0">{{ param.label }}</span>
                  <span class="px-4 py-2.5 text-sm text-gray-700">{{ param.value }}</span>
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
                <div class="text-3xl font-bold text-orange-500">4.8</div>
                <div class="text-xs text-gray-400 mt-1">综合评分</div>
              </div>
              <div class="flex gap-2 text-xs">
                <span class="px-3 py-1 bg-orange-50 text-orange-500 rounded-full cursor-pointer">全部 (126)</span>
                <span class="px-3 py-1 bg-gray-50 text-gray-500 rounded-full cursor-pointer hover:bg-orange-50 hover:text-orange-500 transition">好评 (118)</span>
                <span class="px-3 py-1 bg-gray-50 text-gray-500 rounded-full cursor-pointer hover:bg-orange-50 hover:text-orange-500 transition">中评 (6)</span>
                <span class="px-3 py-1 bg-gray-50 text-gray-500 rounded-full cursor-pointer hover:bg-orange-50 hover:text-orange-500 transition">差评 (2)</span>
                <span class="px-3 py-1 bg-gray-50 text-gray-500 rounded-full cursor-pointer hover:bg-orange-50 hover:text-orange-500 transition">有图 (42)</span>
              </div>
            </div>
            <!-- 评价列表 -->
            <div class="space-y-5">
              <div v-for="i in 5" :key="i" class="pb-5 border-b border-gray-100 last:border-0">
                <div class="flex items-center gap-3 mb-2">
                  <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-400">头</div>
                  <span class="text-sm text-gray-600">用户***{{ i }}</span>
                  <div class="flex text-orange-400 text-xs">★★★★★</div>
                  <span class="text-xs text-gray-400 ml-auto">2025-0{{ i }}-1{{ i }}</span>
                </div>
                <p class="text-sm text-gray-600 leading-relaxed">家具质量非常好，做工精细，颜色和图片一致。安装师傅很专业，服务态度也很好。整体非常满意！</p>
                <div class="flex gap-2 mt-2">
                  <div v-for="j in (i <= 3 ? 3 : 0)" :key="j" class="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-[10px] text-gray-300">评价图</div>
                </div>
                <div class="flex items-center gap-2 mt-3 text-xs text-gray-400">
                  <span>颜色分类：胡桃色</span>
                  <span class="mx-1">|</span>
                  <span>尺寸：2.0m</span>
                </div>
              </div>
            </div>
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
          <!-- 店铺信息卡 -->
          <div class="bg-white rounded-lg p-4">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold">美</div>
              <div>
                <p class="text-sm font-medium text-gray-700">{{ product.merchant }}</p>
                <p class="text-xs text-gray-400">已入驻 2 年</p>
              </div>
            </div>
            <div class="grid grid-cols-3 gap-2 text-center border-y border-gray-100 py-3 mb-3">
              <div>
                <p class="text-orange-500 font-bold text-sm">4.9</p>
                <p class="text-[10px] text-gray-400">描述</p>
              </div>
              <div>
                <p class="text-orange-500 font-bold text-sm">4.8</p>
                <p class="text-[10px] text-gray-400">服务</p>
              </div>
              <div>
                <p class="text-orange-500 font-bold text-sm">4.9</p>
                <p class="text-[10px] text-gray-400">物流</p>
              </div>
            </div>
            <NuxtLink to="/merchant/1" class="block w-full text-center py-2 border border-orange-500 text-orange-500 text-sm rounded hover:bg-orange-50 transition">
              进入店铺
            </NuxtLink>
          </div>

          <!-- 热销推荐 -->
          <div class="bg-white rounded-lg p-4">
            <h3 class="text-sm font-medium text-gray-800 mb-3">热销推荐</h3>
            <div class="space-y-3">
              <NuxtLink
                v-for="i in 4"
                :key="i"
                to="#"
                class="flex gap-3 group"
              >
                <div class="w-[70px] h-[70px] bg-gradient-to-br from-gray-50 to-gray-100 rounded flex items-center justify-center shrink-0">
                  <span class="text-gray-300 text-[10px]">图片</span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs text-gray-600 truncate group-hover:text-orange-500 transition">推荐家具商品名称 {{ i }}</p>
                  <p class="text-orange-500 font-bold text-sm mt-1">¥{{ (i + 2) * 1000 }}</p>
                  <p class="text-[10px] text-gray-400">已售 {{ i * 50 + 20 }}</p>
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
const productId = computed(() => route.params.id as string)

const activeThumb = ref(1)
const selectedColor = ref('胡桃色')
const selectedSize = ref('1.8m')
const quantity = ref(1)
const activeTab = ref('detail')

const skuColors = ['胡桃色', '原木色', '白色', '黑色']
const skuSizes = ['1.5m', '1.8m', '2.0m']

const detailTabs = [
  { key: 'detail', label: '商品详情' },
  { key: 'reviews', label: '商品评价', count: 126 },
  { key: 'aftersale', label: '售后保障' },
]

const product = {
  name: '意式极简真皮沙发 大户型客厅直排三人位组合 头层牛皮沙发',
  subtitle: '进口A级头层牛皮 · 北美白蜡木框架 · 高密度回弹海绵',
  price: '6,980',
  originalPrice: '9,800',
  brand: '欧瑞仕',
  merchant: '欧瑞仕旗舰店',
}

const productParams = [
  { label: '品牌', value: '欧瑞仕' },
  { label: '材质', value: 'A级头层牛皮 + 白蜡木' },
  { label: '填充物', value: '高密度回弹海绵' },
  { label: '颜色分类', value: '胡桃色 / 原木色 / 白色 / 黑色' },
  { label: '尺寸', value: '1.5m / 1.8m / 2.0m' },
  { label: '风格', value: '意式极简' },
  { label: '适用空间', value: '客厅' },
  { label: '产地', value: '广东省佛山市' },
]

useHead({
  title: `${product.name} - 美家优选`,
})
</script>
