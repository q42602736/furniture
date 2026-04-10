<template>
  <div>
    <div class="bg-white rounded-lg p-6">
      <div class="flex items-center justify-between mb-5">
        <h3 class="text-base font-medium text-gray-800">收货地址</h3>
        <button class="px-4 py-2 bg-orange-500 text-white text-sm rounded hover:bg-orange-600 transition" @click="showAddForm = true">
          + 新增地址
        </button>
      </div>

      <div class="space-y-3">
        <div
          v-for="addr in addresses"
          :key="addr.id"
          :class="[
            'border rounded-lg p-4 flex items-center justify-between transition',
            addr.isDefault ? 'border-orange-300 bg-orange-50/30' : 'border-gray-100 hover:border-orange-200'
          ]"
        >
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3 mb-1">
              <span class="text-sm font-medium text-gray-700">{{ addr.name }}</span>
              <span class="text-sm text-gray-500">{{ addr.phone }}</span>
              <span v-if="addr.isDefault" class="text-[10px] bg-orange-500 text-white px-2 py-0.5 rounded">默认</span>
            </div>
            <p class="text-sm text-gray-500">{{ addr.address }}</p>
          </div>
          <div class="flex items-center gap-3 shrink-0 ml-4">
            <button class="text-xs text-gray-400 hover:text-orange-500 transition">编辑</button>
            <button class="text-xs text-gray-400 hover:text-red-500 transition">删除</button>
            <button v-if="!addr.isDefault" class="text-xs text-gray-400 hover:text-orange-500 transition">设为默认</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'user' })

const showAddForm = ref(false)

const addresses = [
  { id: 1, name: '张三', phone: '138****8888', address: '广东省 深圳市 南山区 科技园 XX大厦 1栋 1001', isDefault: true },
  { id: 2, name: '张三', phone: '138****8888', address: '广东省 广州市 天河区 珠江新城 XX广场 2栋 2001', isDefault: false },
  { id: 3, name: '李四', phone: '139****9999', address: '北京市 朝阳区 望京 XX小区 3号楼 301', isDefault: false },
]

useHead({ title: '收货地址 - 美家优选' })
</script>
