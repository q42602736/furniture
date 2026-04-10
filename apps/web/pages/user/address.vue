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
            <p class="text-sm text-gray-500">{{ addr.province }} {{ addr.city }} {{ addr.district }} {{ addr.address }}</p>
          </div>
          <div class="flex items-center gap-3 shrink-0 ml-4">
            <button class="text-xs text-gray-400 hover:text-red-500 transition" @click="deleteAddress(addr.id)">删除</button>
            <button v-if="!addr.isDefault" class="text-xs text-gray-400 hover:text-orange-500 transition" @click="setDefault(addr.id)">设为默认</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'user' })

const { get, post, put, del } = useApi()
const showAddForm = ref(false)
const addresses = ref<any[]>([])

async function loadAddresses() {
  try {
    const res: any = await get('/v1/addresses')
    if (res?.data) addresses.value = res.data
  } catch {}
}

if (import.meta.client) {
  loadAddresses()
}

async function deleteAddress(id: number) {
  if (!confirm('确定删除该地址？')) return
  try {
    await del(`/v1/addresses/${id}`)
    addresses.value = addresses.value.filter(a => a.id !== id)
  } catch {}
}

async function setDefault(id: number) {
  try {
    await put(`/v1/addresses/${id}`, { isDefault: true })
    await loadAddresses()
  } catch {}
}

useHead({ title: '收货地址 - 美家优选' })
</script>
