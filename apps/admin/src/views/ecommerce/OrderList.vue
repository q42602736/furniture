<template>
  <div>
    <div class="card mb-3">
      <div class="card-body py-2">
        <form class="row g-2 align-items-end" @submit.prevent="loadData(1)">
          <div class="col-auto">
            <select v-model="filterStatus" class="form-select form-select-sm">
              <option value="">全部状态</option>
              <option value="0">待付款</option>
              <option value="1">待发货</option>
              <option value="2">待收货</option>
              <option value="3">已完成</option>
              <option value="4">已取消</option>
            </select>
          </div>
          <div class="col-auto">
            <button class="btn btn-sm btn-primary" type="submit">筛选</button>
          </div>
        </form>
      </div>
    </div>

    <div class="card">
      <div class="card-header">共 {{ total }} 条订单</div>
      <div class="card-body p-0">
        <table class="table table-hover mb-0">
          <thead class="table-light">
            <tr>
              <th>订单号</th>
              <th>买家</th>
              <th>金额</th>
              <th>状态</th>
              <th>下单时间</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!list.length">
              <td colspan="5" class="text-center text-muted py-4">暂无数据</td>
            </tr>
            <tr v-for="item in list" :key="item.id">
              <td><code>{{ item.orderNo }}</code></td>
              <td>{{ item.user?.nickname || item.user?.phone || '-' }}</td>
              <td class="text-danger">¥{{ item.totalAmount }}</td>
              <td>
                <span :class="orderStatusClass(item.status)">{{ orderStatusText(item.status) }}</span>
              </td>
              <td>{{ new Date(item.createdAt).toLocaleString('zh-CN') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card-footer d-flex justify-content-end" v-if="total > pageSize">
        <nav>
          <ul class="pagination pagination-sm mb-0">
            <li class="page-item" :class="{ disabled: page <= 1 }">
              <a class="page-link" href="#" @click.prevent="page > 1 && loadData(page - 1)">上一页</a>
            </li>
            <li class="page-item" :class="{ disabled: page * pageSize >= total }">
              <a class="page-link" href="#" @click.prevent="page * pageSize < total && loadData(page + 1)">下一页</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/core/api'

const list = ref<any[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = 10
const filterStatus = ref('')

const statusMap: Record<number, string> = { 0: '待付款', 1: '待发货', 2: '待收货', 3: '已完成', 4: '已取消' }
const statusClassMap: Record<number, string> = { 0: 'bg-warning', 1: 'bg-info', 2: 'bg-primary', 3: 'bg-success', 4: 'bg-secondary' }

function orderStatusText(s: number) { return statusMap[s] || '未知' }
function orderStatusClass(s: number) { return `badge ${statusClassMap[s] || 'bg-secondary'}` }

async function loadData(p = 1) {
  page.value = p
  const params: any = { page: p, pageSize }
  if (filterStatus.value !== '') params.status = Number(filterStatus.value)
  try {
    const res: any = await api.get('/admin/orders', { params })
    list.value = res.data.list
    total.value = res.data.total
  } catch {}
}

onMounted(() => loadData())
</script>
