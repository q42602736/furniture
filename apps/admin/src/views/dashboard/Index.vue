<template>
  <div>
    <div class="row g-4">
      <div class="col-md-3" v-for="item in statCards" :key="item.label">
        <div class="card">
          <div class="card-body">
            <p class="text-muted mb-1">{{ item.label }}</p>
            <h3>{{ item.value }}</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '@/core/api'

const stats = ref({ userCount: 0, merchantCount: 0, productCount: 0, orderCount: 0 })

const statCards = computed(() => [
  { label: '注册用户', value: stats.value.userCount },
  { label: '入驻商家', value: stats.value.merchantCount },
  { label: '上架商品', value: stats.value.productCount },
  { label: '总订单数', value: stats.value.orderCount },
])

onMounted(async () => {
  try {
    const res: any = await api.get('/admin/stats')
    stats.value = res.data
  } catch {}
})
</script>
