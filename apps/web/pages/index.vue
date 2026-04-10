<template>
  <div>
    <!-- Banner 轮播占位 -->
    <section class="bg-gray-100">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="bg-gray-300 rounded-lg h-80 flex items-center justify-center text-gray-500 text-xl">
          Banner 轮播区（待接入后端数据）
        </div>
      </div>
    </section>

    <!-- 品牌秀场 -->
    <section class="max-w-7xl mx-auto px-4 py-8">
      <h2 class="text-xl font-bold mb-4">品牌秀场</h2>
      <div class="grid grid-cols-4 md:grid-cols-8 gap-4">
        <div
          v-for="i in 8"
          :key="i"
          class="bg-gray-100 rounded-lg h-20 flex items-center justify-center text-gray-400 text-sm"
        >
          品牌 {{ i }}
        </div>
      </div>
    </section>

    <!-- 热门商品推荐 -->
    <section class="max-w-7xl mx-auto px-4 py-8">
      <h2 class="text-xl font-bold mb-4">热门推荐</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div
          v-for="i in 8"
          :key="i"
          class="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
        >
          <div class="bg-gray-200 h-48 flex items-center justify-center text-gray-400">
            商品图片
          </div>
          <div class="p-3">
            <p class="text-sm text-gray-500 mb-1">品牌名称</p>
            <p class="text-sm font-medium truncate">示例商品名称 {{ i }}</p>
            <p class="text-orange-500 font-bold mt-1">¥0,000</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 按分类展示 -->
    <section
      v-for="cat in homeCategories"
      :key="cat.slug"
      class="max-w-7xl mx-auto px-4 py-6"
    >
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold">{{ cat.name }}</h2>
        <NuxtLink
          :to="`/category/${cat.slug}`"
          class="text-orange-500 text-sm hover:underline"
        >
          查看更多 →
        </NuxtLink>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div
          v-for="i in 5"
          :key="i"
          class="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
        >
          <div class="bg-gray-200 h-40 flex items-center justify-center text-gray-400 text-sm">
            {{ cat.name }}商品图片
          </div>
          <div class="p-3">
            <p class="text-sm font-medium truncate">{{ cat.name }}商品 {{ i }}</p>
            <p class="text-orange-500 font-bold text-sm mt-1">¥0,000</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const homeCategories = [
  { name: '客厅', slug: 'living-room' },
  { name: '卧室', slug: 'bedroom' },
  { name: '餐厅', slug: 'dining-room' },
  { name: '书房', slug: 'study' },
]
</script>
