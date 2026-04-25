<template>
  <header class="bg-white">
    <!-- 顶部工具栏 -->
    <div class="bg-[#333] text-xs">
      <div class="max-w-[1200px] mx-auto px-4 flex items-center justify-between h-8 text-gray-300">
        <span>欢迎来到美家优选！家政到家 · 设计装修 · 自建房规划 · 助农展示</span>
        <div class="flex items-center gap-4">
          <template v-if="userStore.isLoggedIn">
            <NuxtLink to="/user" class="hover:text-white transition">{{ userStore.user?.nickname || '我的账户' }}</NuxtLink>
            <span class="text-gray-500">|</span>
            <button class="hover:text-white transition" @click="userStore.logout()">退出</button>
          </template>
          <template v-else>
            <NuxtLink to="/login" class="hover:text-white transition">登录</NuxtLink>
            <span class="text-gray-500">|</span>
            <NuxtLink to="/login" class="hover:text-white transition">免费注册</NuxtLink>
          </template>
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
              placeholder="搜索家政服务、柜体定制、建材灯饰..."
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

  </header>
</template>

<script setup lang="ts">
const searchKeyword = ref('')

const hotWords = ['开荒保洁', '柜体定制', '卫浴五金', '建材', '助农帮扶']

const userStore = useUserStore()

// 初始化时加载用户信息
if (import.meta.client && userStore.isLoggedIn && !userStore.user) {
  userStore.fetchProfile()
}

function handleSearch() {
  if (searchKeyword.value.trim()) {
    navigateTo(`/search?q=${encodeURIComponent(searchKeyword.value.trim())}`)
  }
}
</script>
