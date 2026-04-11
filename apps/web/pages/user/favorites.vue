<template>
  <div>
    <div class="bg-white rounded-lg p-6">
      <h3 class="text-base font-medium text-gray-800 mb-5">我的收藏</h3>

      <div v-if="favorites.length" class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <NuxtLink
          v-for="fav in favorites"
          :key="fav.id"
          :to="`/product/${fav.productId}`"
          class="bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition group"
        >
          <div class="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
            <img v-if="fav.product?.mainImage" :src="fav.product.mainImage" :alt="fav.product.name" class="w-full h-full object-cover" @error="onImgError" />
            <span v-else class="text-gray-300 text-xs">商品图片</span>
            <button class="absolute top-2 right-2 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center text-red-400 hover:text-red-500 transition text-sm" @click.prevent="removeFavorite(fav.productId)">
              ❤️
            </button>
          </div>
          <div class="p-3">
            <p class="text-xs text-gray-600 truncate group-hover:text-orange-500 transition">{{ fav.product?.name || '商品' }}</p>
            <div class="flex items-baseline gap-2 mt-1">
              <span class="text-orange-500 font-bold text-sm">¥{{ fav.product?.skus?.[0]?.price || '--' }}</span>
            </div>
          </div>
        </NuxtLink>
      </div>
      <div v-else class="text-center py-20 text-gray-400">
        <p class="text-lg mb-2">暂无收藏</p>
        <p class="text-sm">去逛逛发现喜欢的家具吧</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'user' })

const { get, post } = useApi()
function onImgError(e: Event) { (e.target as HTMLImageElement).style.display = 'none' }
const favorites = ref<any[]>([])

if (import.meta.client) {
  get('/v1/favorites', { page: 1, pageSize: 20 }).then((res: any) => {
    if (res?.data?.list) favorites.value = res.data.list
  }).catch(() => {})
}

async function removeFavorite(productId: number) {
  try {
    await post(`/v1/favorites/${productId}`)
    favorites.value = favorites.value.filter(f => f.productId !== productId)
  } catch {}
}

useHead({ title: '我的收藏 - 美家优选' })
</script>
