<template>
  <div>
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <span>共 {{ total }} 个商家</span>
      </div>
      <div class="card-body p-0">
        <table class="table table-hover mb-0">
          <thead class="table-light">
            <tr>
              <th>ID</th>
              <th>商家名称</th>
              <th>联系人</th>
              <th>联系电话</th>
              <th>商品数</th>
              <th>状态</th>
              <th>入驻时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!list.length">
              <td colspan="8" class="text-center text-muted py-4">暂无数据</td>
            </tr>
            <tr v-for="item in list" :key="item.id">
              <td>{{ item.id }}</td>
              <td>
                <div class="d-flex align-items-center">
                  <img v-if="item.logo" :src="item.logo" class="rounded me-2" style="width:32px;height:32px;object-fit:cover" />
                  {{ item.name }}
                </div>
              </td>
              <td>{{ item.contactName || '-' }}</td>
              <td>{{ item.contactPhone || '-' }}</td>
              <td>{{ item._count?.products || 0 }}</td>
              <td>
                <span :class="statusClass(item.status)">{{ statusText(item.status) }}</span>
              </td>
              <td>{{ formatDate(item.createdAt) }}</td>
              <td>
                <button v-if="item.status !== 1" class="btn btn-sm btn-success me-1" @click="setStatus(item.id, 1)">启用</button>
                <button v-if="item.status === 1" class="btn btn-sm btn-warning" @click="setStatus(item.id, 0)">禁用</button>
              </td>
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

function statusText(s: number) {
  return s === 1 ? '正常' : s === 0 ? '禁用' : '待审核'
}
function statusClass(s: number) {
  return `badge ${s === 1 ? 'bg-success' : s === 0 ? 'bg-secondary' : 'bg-warning'}`
}
function formatDate(d: string) {
  return new Date(d).toLocaleDateString('zh-CN')
}

async function loadData(p = 1) {
  page.value = p
  try {
    const res: any = await api.get('/admin/merchants', { params: { page: p, pageSize } })
    list.value = res.data.list
    total.value = res.data.total
  } catch {}
}

async function setStatus(id: number, status: number) {
  try {
    await api.put(`/admin/merchants/${id}/status`, { status })
    await loadData(page.value)
  } catch {}
}

onMounted(() => loadData())
</script>
