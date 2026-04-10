<template>
  <header class="bg-white">
    <!-- 顶部工具栏 -->
    <div class="bg-[#333] text-xs">
      <div class="max-w-[1200px] mx-auto px-4 flex items-center justify-between h-8 text-gray-300">
        <span>欢迎来到美家优选！正品保障 · 全国配送 · 售后无忧</span>
        <div class="flex items-center gap-4">
          <NuxtLink to="/login" class="hover:text-white transition">登录</NuxtLink>
          <span class="text-gray-500">|</span>
          <NuxtLink to="/register" class="hover:text-white transition">免费注册</NuxtLink>
          <span class="text-gray-500">|</span>
          <NuxtLink to="/user/orders" class="hover:text-white transition">我的订单</NuxtLink>
          <span class="text-gray-500">|</span>
          <NuxtLink to="/user" class="hover:text-white transition">个人中心</NuxtLink>
          <span class="text-gray-500">|</span>
          <NuxtLink to="/help" class="hover:text-white transition">客户服务</NuxtLink>
        </div>
      </div>
    </div>

    <!-- Logo + 搜索 + 购物车 -->
    <div class="border-b border-gray-100">
      <div class="max-w-[1200px] mx-auto px-4 flex items-center justify-between h-[90px]">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2 shrink-0">
          <div class="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
            <span class="text-white text-xl font-bold">美</span>
          </div>
          <div>
            <div class="text-xl font-bold text-gray-800 leading-tight">美家优选</div>
            <div class="text-[11px] text-gray-400 tracking-wider">MEIJIA SELECT</div>
          </div>
        </NuxtLink>

        <!-- 搜索框 -->
        <div class="flex-1 max-w-[560px] mx-8">
          <div class="flex gap-3 mb-1.5 text-xs text-gray-400">
            <span
              v-for="word in hotWords"
              :key="word"
              class="cursor-pointer hover:text-orange-500 transition"
            >
              {{ word }}
            </span>
          </div>
          <div class="flex">
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="搜索家具、建材、家饰..."
              class="flex-1 h-10 border-2 border-orange-500 border-r-0 rounded-l px-4 text-sm focus:outline-none"
              @keyup.enter="handleSearch"
            />
            <button
              class="h-10 px-8 bg-orange-500 text-white text-sm font-medium rounded-r hover:bg-orange-600 transition shrink-0"
              @click="handleSearch"
            >
              搜 索
            </button>
          </div>
        </div>

        <!-- 购物车 -->
        <NuxtLink
          to="/cart"
          class="flex items-center gap-2 border border-gray-200 rounded px-5 py-2.5 hover:border-orange-500 hover:text-orange-500 transition group shrink-0"
        >
          <svg class="w-5 h-5 text-gray-500 group-hover:text-orange-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/>
          </svg>
          <span class="text-sm">购物车</span>
          <span class="bg-orange-500 text-white text-[10px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">0</span>
        </NuxtLink>
      </div>
    </div>

    <!-- 分类导航 + 频道 -->
    <div class="bg-white shadow-sm relative z-40">
      <div class="max-w-[1200px] mx-auto px-4 flex items-stretch h-[42px]">
        <!-- 全部分类 -->
        <div
          class="relative w-[210px] shrink-0"
          @mouseenter="showCategoryPanel = true"
          @mouseleave="showCategoryPanel = false"
        >
          <div class="bg-orange-500 text-white h-full flex items-center justify-center gap-2 cursor-pointer text-sm font-medium">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
            全部商品分类
          </div>

          <!-- 分类悬浮面板 -->
          <div
            v-show="showCategoryPanel"
            class="absolute top-full left-0 w-[210px] bg-[#3d3d3f] z-50 shadow-xl"
          >
            <div
              v-for="cat in categories"
              :key="cat.slug"
              class="group relative"
              @mouseenter="activeCategorySlug = cat.slug"
              @mouseleave="activeCategorySlug = ''"
            >
              <NuxtLink
                :to="`/category/${cat.slug}`"
                class="flex items-center justify-between px-4 py-2.5 text-gray-200 text-sm hover:bg-[#555] hover:text-white transition"
              >
                <span>{{ cat.name }}</span>
                <svg class="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </NuxtLink>

              <!-- 二级分类弹出 -->
              <div
                v-if="activeCategorySlug === cat.slug && cat.children?.length"
                class="absolute left-[210px] top-0 bg-white shadow-xl border border-gray-100 rounded-r min-w-[400px] p-6 z-50"
              >
                <div class="flex flex-wrap gap-x-6 gap-y-2">
                  <NuxtLink
                    v-for="sub in cat.children"
                    :key="sub.slug"
                    :to="`/category/${sub.slug}`"
                    class="text-sm text-gray-600 hover:text-orange-500 transition"
                  >
                    {{ sub.name }}
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 频道导航 -->
        <nav class="flex items-center gap-6 ml-6 text-sm">
          <NuxtLink to="/" class="text-gray-700 hover:text-orange-500 font-medium transition">首页</NuxtLink>
          <NuxtLink to="/brand" class="text-gray-700 hover:text-orange-500 transition">品牌馆</NuxtLink>
          <NuxtLink to="/new" class="text-gray-700 hover:text-orange-500 transition">新品上市</NuxtLink>
          <NuxtLink to="/sale" class="text-gray-700 hover:text-orange-500 transition">特惠专区</NuxtLink>
          <NuxtLink to="/buyer-show" class="text-gray-700 hover:text-orange-500 transition">买家秀</NuxtLink>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const searchKeyword = ref('')
const showCategoryPanel = ref(false)
const activeCategorySlug = ref('')

const hotWords = ['意式极简', '奶油风沙发', '实木床', '岩板餐桌', '智能马桶']

const { categories } = useCategories()

function handleSearch() {
  if (searchKeyword.value.trim()) {
    navigateTo(`/search?q=${encodeURIComponent(searchKeyword.value.trim())}`)
  }
}
</script>
