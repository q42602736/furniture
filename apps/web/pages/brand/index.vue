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

      <!-- 品牌列表 -->
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <NuxtLink
          v-for="brand in filteredBrands"
          :key="brand.id"
          :to="`/brand/${brand.id}`"
          class="bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-lg transition-all group"
        >
          <div class="h-[120px] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
            <span class="text-gray-400 text-lg font-medium group-hover:text-orange-500 transition">{{ brand.name }}</span>
          </div>
          <div class="p-3 border-t border-gray-50">
            <p class="text-xs text-gray-500 truncate">{{ brand.desc }}</p>
            <div class="flex items-center justify-between mt-2 text-xs">
              <span class="text-gray-400">{{ brand.productCount }} 件商品</span>
              <span class="text-orange-500">进入品牌 →</span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const activeLetter = ref('')

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'W', 'X', 'Y', 'Z']

const brands = [
  { id: '1', name: '欧瑞仕', letter: 'O', desc: '意大利设计师品牌，专注意式极简风格', productCount: 286 },
  { id: '2', name: '卡琪朵', letter: 'K', desc: '法式轻奢家居品牌，浪漫优雅', productCount: 198 },
  { id: '3', name: '慕梵希', letter: 'M', desc: '现代简约风格引领者，品质典范', productCount: 245 },
  { id: '4', name: '罗曼仕', letter: 'L', desc: '英伦古典风格，百年匠心传承', productCount: 167 },
  { id: '5', name: 'Milantti 米兰蒂', letter: 'M', desc: '意大利米兰设计，轻奢美学', productCount: 312 },
  { id: '6', name: '檀雅居', letter: 'T', desc: '新中式实木家居，东方美学', productCount: 156 },
  { id: '7', name: '诺美帝斯', letter: 'N', desc: '北欧简约设计，自然舒适', productCount: 203 },
  { id: '8', name: '歌迪', letter: 'G', desc: '德式工艺精品，严谨品质', productCount: 178 },
  { id: '9', name: '芝华仕', letter: 'Z', desc: '功能沙发领导品牌，头等舱级体验', productCount: 421 },
  { id: '10', name: '顾家家居', letter: 'G', desc: '全屋定制解决方案，一站式家装', productCount: 567 },
  { id: '11', name: '曲美家居', letter: 'Q', desc: '国民品质家居，时尚实用', productCount: 389 },
  { id: '12', name: '百强家具', letter: 'B', desc: '欧洲品质实木家具，环保健康', productCount: 234 },
  { id: '13', name: '斯可馨', letter: 'S', desc: '布艺沙发专家，舒适生活', productCount: 145 },
  { id: '14', name: '华日家居', letter: 'H', desc: '实木家具标杆，匠心品质', productCount: 298 },
  { id: '15', name: '全友家居', letter: 'Q', desc: '绿色全屋家居，健康环保', productCount: 612 },
]

const filteredBrands = computed(() => {
  if (!activeLetter.value) return brands
  return brands.filter(b => b.letter === activeLetter.value)
})

useHead({ title: '品牌馆 - 美家优选' })
</script>
