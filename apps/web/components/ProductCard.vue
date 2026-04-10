<template>
  <NuxtLink
    :to="`/product/${product.id}`"
    class="bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-lg transition-all group"
  >
    <div :class="['bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative', imageClass || 'aspect-square']">
      <span class="text-gray-300 text-sm">商品图片</span>
      <div v-if="product.tag" class="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded">{{ product.tag }}</div>
    </div>
    <div class="p-3">
      <p v-if="product.brand" class="text-xs text-gray-400 mb-1">{{ product.brand }}</p>
      <p class="text-sm font-medium text-gray-700 truncate group-hover:text-orange-500 transition">{{ product.name }}</p>
      <div class="flex items-baseline gap-2 mt-2">
        <span class="text-orange-500 font-bold">¥{{ product.price }}</span>
        <span v-if="product.originalPrice" class="text-xs text-gray-400 line-through">¥{{ product.originalPrice }}</span>
      </div>
      <div v-if="showMeta" class="flex items-center justify-between mt-2 text-xs text-gray-400">
        <span>{{ product.merchant || `已售 ${product.sales || 0}` }}</span>
        <span v-if="product.comments">{{ product.comments }} 评价</span>
        <span v-else-if="product.sales">{{ product.sales }} 人付款</span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
export interface ProductCardItem {
  id: string
  name: string
  brand?: string
  price: number | string
  originalPrice?: number | string
  sales?: number
  comments?: number
  tag?: string
  merchant?: string
}

defineProps<{
  product: ProductCardItem
  showMeta?: boolean
  imageClass?: string
}>()
</script>
