<template>
  <div class="bg-[#f5f5f5] min-h-screen">
    <div class="max-w-[1200px] mx-auto px-4 py-4">
      <!-- 面包屑 -->
      <nav class="flex items-center text-sm text-gray-400 gap-1 mb-4">
        <NuxtLink to="/" class="hover:text-orange-500 transition">首页</NuxtLink>
        <span>/</span>
        <span class="text-gray-700">个人中心</span>
      </nav>

      <div class="flex gap-4">
        <!-- 左侧：用户菜单 -->
        <aside class="hidden md:block w-[200px] shrink-0">
          <div class="bg-white rounded-lg overflow-hidden">
            <!-- 用户头像 -->
            <div class="p-5 text-center border-b border-gray-100">
              <div class="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mx-auto flex items-center justify-center text-white text-xl font-bold mb-2">
                U
              </div>
              <p class="text-sm font-medium text-gray-700">用户昵称</p>
              <p class="text-xs text-gray-400 mt-0.5">普通会员</p>
            </div>
            <!-- 导航菜单 -->
            <nav class="py-2">
              <NuxtLink
                v-for="nav in sideNavs"
                :key="nav.to"
                :to="nav.to"
                :class="[
                  'flex items-center gap-2 px-5 py-2.5 text-sm transition',
                  route.path === nav.to ? 'text-orange-500 bg-orange-50 font-medium' : 'text-gray-600 hover:text-orange-500 hover:bg-gray-50'
                ]"
              >
                <span>{{ nav.icon }}</span>
                <span>{{ nav.label }}</span>
              </NuxtLink>
            </nav>
          </div>
        </aside>

        <!-- 右侧：内容区 -->
        <main class="flex-1 min-w-0">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const sideNavs = [
  { icon: '📊', label: '个人总览', to: '/user' },
  { icon: '📦', label: '我的订单', to: '/user/orders' },
  { icon: '❤️', label: '我的收藏', to: '/user/favorites' },
  { icon: '📍', label: '收货地址', to: '/user/address' },
  { icon: '⚙️', label: '账户设置', to: '/user/settings' },
]
</script>
