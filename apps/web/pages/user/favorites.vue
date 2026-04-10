<template>
  <div>
    <div class="bg-white rounded-lg p-6">
      <h3 class="text-base font-medium text-gray-800 mb-5">我的收藏</h3>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <NuxtLink
          v-for="i in 8"
          :key="i"
          to="#"
          class="bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition group"
        >
          <div class="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative">
            <span class="text-gray-300 text-xs">商品图片</span>
            <button class="absolute top-2 right-2 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center text-red-400 hover:text-red-500 transition text-sm" @click.prevent>
              ❤️
            </button>
          </div>
          <div class="p-3">
            <p class="text-xs text-gray-600 truncate group-hover:text-orange-500 transition">收藏的家具商品 {{ i }}</p>
            <div class="flex items-baseline gap-2 mt-1">
              <span class="text-orange-500 font-bold text-sm">¥{{ (i + 1) * 980 }}</span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'user' })
useHead({ title: '我的收藏 - 美家优选' })
</script>
