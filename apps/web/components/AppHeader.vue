<template>
  <header class="bg-white shadow-sm sticky top-0 z-50">
    <!-- 顶部工具栏 -->
    <div class="bg-gray-100 text-sm">
      <div class="max-w-7xl mx-auto px-4 flex items-center justify-between h-8">
        <span class="text-gray-500">欢迎来到美家优选</span>
        <div class="flex items-center gap-4">
          <NuxtLink to="/login" class="text-gray-600 hover:text-orange-500">登录</NuxtLink>
          <NuxtLink to="/user/orders" class="text-gray-600 hover:text-orange-500">我的订单</NuxtLink>
          <NuxtLink to="/user" class="text-gray-600 hover:text-orange-500">个人中心</NuxtLink>
          <NuxtLink to="/help" class="text-gray-600 hover:text-orange-500">客户服务</NuxtLink>
        </div>
      </div>
    </div>

    <!-- Logo + 搜索栏 -->
    <div class="max-w-7xl mx-auto px-4 py-3 flex items-center gap-8">
      <NuxtLink to="/" class="text-2xl font-bold text-orange-500 whitespace-nowrap">
        美家优选
      </NuxtLink>
      <div class="flex-1 flex">
        <input
          type="text"
          placeholder="请输入搜索内容"
          class="flex-1 border border-r-0 border-gray-300 rounded-l px-4 py-2 focus:outline-none focus:border-orange-500"
        />
        <button class="bg-orange-500 text-white px-6 py-2 rounded-r hover:bg-orange-600">
          搜索
        </button>
      </div>
    </div>

    <!-- 分类导航 -->
    <nav class="border-t border-gray-200">
      <div class="max-w-7xl mx-auto px-4 flex items-center gap-6 h-10 text-sm">
        <NuxtLink
          v-for="cat in categories"
          :key="cat.slug"
          :to="`/category/${cat.slug}`"
          class="text-gray-700 hover:text-orange-500 whitespace-nowrap"
        >
          {{ cat.name }}
        </NuxtLink>
        <NuxtLink to="/brand" class="text-gray-700 hover:text-orange-500 whitespace-nowrap">品牌馆</NuxtLink>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
const categories = [
  { name: '客厅', slug: 'living-room' },
  { name: '卧室', slug: 'bedroom' },
  { name: '餐厅', slug: 'dining-room' },
  { name: '儿童房', slug: 'kids-room' },
  { name: '书房', slug: 'study' },
  { name: '灯饰', slug: 'lighting' },
  { name: '卫浴', slug: 'bathroom' },
  { name: '家饰家纺', slug: 'decor' },
  { name: '建材电器', slug: 'material' },
]
</script>
