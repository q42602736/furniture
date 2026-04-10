<template>
  <div class="bg-[#f5f5f5] min-h-screen">
    <!-- 店铺头部 -->
    <div class="bg-white border-b border-gray-100">
      <div class="max-w-[1200px] mx-auto px-4 py-6">
        <div class="flex items-center gap-6">
          <div class="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold shrink-0">
            {{ merchantInfo.name.charAt(0) }}
          </div>
          <div class="flex-1">
            <h1 class="text-xl font-bold text-gray-800">{{ merchantInfo.name }}</h1>
            <p class="text-sm text-gray-400 mt-1">{{ merchantInfo.desc }}</p>
            <div class="flex items-center gap-6 mt-2 text-sm">
              <span class="text-gray-500">商品：<b class="text-gray-700">{{ merchantInfo.productCount }}</b></span>
              <span class="text-gray-500">粉丝：<b class="text-gray-700">{{ merchantInfo.fans }}</b></span>
              <span class="text-gray-500">入驻：<b class="text-gray-700">{{ merchantInfo.joinYear }}</b></span>
            </div>
          </div>
          <div class="flex gap-4 text-center shrink-0">
            <div class="px-4 py-2 bg-orange-50 rounded-lg">
              <p class="text-orange-500 font-bold text-lg">{{ merchantInfo.score.desc }}</p>
              <p class="text-[10px] text-gray-400">描述相符</p>
            </div>
            <div class="px-4 py-2 bg-orange-50 rounded-lg">
              <p class="text-orange-500 font-bold text-lg">{{ merchantInfo.score.service }}</p>
              <p class="text-[10px] text-gray-400">服务态度</p>
            </div>
            <div class="px-4 py-2 bg-orange-50 rounded-lg">
              <p class="text-orange-500 font-bold text-lg">{{ merchantInfo.score.logistics }}</p>
              <p class="text-[10px] text-gray-400">物流服务</p>
            </div>
          </div>
          <button class="h-10 px-6 border-2 border-orange-500 text-orange-500 rounded hover:bg-orange-50 transition text-sm font-medium shrink-0">
            + 关注店铺
          </button>
        </div>
      </div>
    </div>

    <!-- 店铺导航 -->
    <div class="bg-white border-b border-gray-100 sticky top-0 z-30">
      <div class="max-w-[1200px] mx-auto px-4 flex items-center h-[42px] gap-6 text-sm">
        <span
          v-for="nav in shopNavs"
          :key="nav.key"
          :class="[
            'cursor-pointer transition relative py-2',
            activeNav === nav.key ? 'text-orange-500 font-medium' : 'text-gray-500 hover:text-orange-500'
          ]"
          @click="activeNav = nav.key"
        >
          {{ nav.label }}
          <div v-if="activeNav === nav.key" class="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"/>
        </span>
      </div>
    </div>

    <div class="max-w-[1200px] mx-auto px-4 py-6">
      <!-- 全部商品 -->
      <template v-if="activeNav === 'all'">
        <!-- 排序栏 -->
        <div class="bg-white rounded-lg px-5 py-3 mb-4 flex items-center gap-4 text-sm">
          <span
            v-for="sort in sortOptions"
            :key="sort"
            :class="[
              'cursor-pointer transition',
              activeSort === sort ? 'text-orange-500 font-medium' : 'text-gray-500 hover:text-orange-500'
            ]"
            @click="activeSort = sort"
          >
            {{ sort }}
          </span>
        </div>

        <!-- 商品网格 -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <NuxtLink
            v-for="i in 16"
            :key="i"
            to="#"
            class="bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-lg transition-all group"
          >
            <div class="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
              <span class="text-gray-300 text-sm">商品图片</span>
            </div>
            <div class="p-3">
              <p class="text-sm font-medium text-gray-700 truncate group-hover:text-orange-500 transition">{{ merchantInfo.name }} 精选商品 {{ i }}</p>
              <div class="flex items-baseline gap-2 mt-2">
                <span class="text-orange-500 font-bold">¥{{ (i + 1) * 680 }}</span>
              </div>
              <p class="text-xs text-gray-400 mt-1">已售 {{ i * 20 + 10 }}</p>
            </div>
          </NuxtLink>
        </div>
      </template>

      <!-- 新品 -->
      <template v-if="activeNav === 'new'">
        <div class="bg-white rounded-lg p-10 text-center">
          <div class="text-4xl mb-3">🆕</div>
          <p class="text-gray-500">新品上架中，敬请期待</p>
        </div>
      </template>

      <!-- 店铺介绍 -->
      <template v-if="activeNav === 'about'">
        <div class="bg-white rounded-lg p-6">
          <h3 class="text-base font-medium text-gray-800 mb-4">店铺介绍</h3>
          <div class="text-sm text-gray-600 leading-relaxed space-y-3">
            <p>{{ merchantInfo.name }}是一家专注于高品质意式家居的品牌，致力于将意大利的设计美学与中国的制造工艺完美融合。</p>
            <p>我们的产品涵盖客厅、卧室、餐厅、书房等全屋家居，选用A级头层牛皮、北美白蜡木等优质材料，由经验丰富的工匠精心制作。</p>
            <p>品牌理念：让每一个家庭都能享受到品质生活。</p>
          </div>
          <div class="mt-6 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-500">所在地区：</span>
              <span class="text-gray-700">广东省 佛山市</span>
            </div>
            <div>
              <span class="text-gray-500">主营类目：</span>
              <span class="text-gray-700">沙发 · 床 · 柜类 · 桌椅</span>
            </div>
            <div>
              <span class="text-gray-500">开店时间：</span>
              <span class="text-gray-700">2023年6月</span>
            </div>
            <div>
              <span class="text-gray-500">客服电话：</span>
              <span class="text-gray-700">400-888-0001</span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const merchantId = computed(() => route.params.id as string)

const activeNav = ref('all')
const activeSort = ref('综合排序')

const shopNavs = [
  { key: 'all', label: '全部商品' },
  { key: 'new', label: '新品上架' },
  { key: 'about', label: '店铺介绍' },
]

const sortOptions = ['综合排序', '销量', '价格从低到高', '价格从高到低', '新品']

const merchantInfo = {
  name: '欧瑞仕旗舰店',
  desc: '意大利设计师品牌，专注意式极简风格高端家居',
  productCount: 286,
  fans: '1.2万',
  joinYear: '2023年',
  score: { desc: '4.9', service: '4.8', logistics: '4.9' },
}

useHead({ title: `${merchantInfo.name} - 美家优选` })
</script>
