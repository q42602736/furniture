<template>
  <div>
    <div class="card mb-3">
      <div class="card-body py-2">
        <form class="row g-2 align-items-end" @submit.prevent="loadData(1)">
          <div class="col-auto">
            <input v-model="keyword" class="form-control form-control-sm" placeholder="搜索手机号/昵称" />
          </div>
          <div class="col-auto">
            <button class="btn btn-sm btn-primary" type="submit">搜索</button>
          </div>
        </form>
      </div>
    </div>

    <div class="card">
      <div class="card-header">共 {{ total }} 个用户</div>
      <div class="card-body p-0">
        <table class="table table-hover mb-0">
          <thead class="table-light">
            <tr>
              <th>ID</th>
              <th>用户</th>
              <th>手机号</th>
              <th>订单数</th>
              <th>状态</th>
              <th>注册时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!list.length">
              <td colspan="7" class="text-center text-muted py-4">暂无数据</td>
            </tr>
            <tr v-for="item in list" :key="item.id">
              <td>{{ item.id }}</td>
              <td>
                <div class="d-flex align-items-center">
                  <img v-if="item.avatar" :src="item.avatar" class="rounded-circle me-2" style="width:28px;height:28px" />
                  {{ item.nickname || '-' }}
                </div>
              </td>
              <td>{{ item.phone }}</td>
              <td>{{ item._count?.orders || 0 }}</td>
              <td>
                <span :class="`badge ${item.status === 1 ? 'bg-success' : 'bg-secondary'}`">
                  {{ item.status === 1 ? '正常' : '禁用' }}
                </span>
              </td>
              <td>{{ new Date(item.createdAt).toLocaleDateString('zh-CN') }}</td>
              <td>
                <button v-if="item.status === 1" class="btn btn-sm btn-outline-warning" @click="setStatus(item.id, 0)">禁用</button>
                <button v-else class="btn btn-sm btn-outline-success" @click="setStatus(item.id, 1)">启用</button>
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
const keyword = ref('')

async function loadData(p = 1) {
  page.value = p
  const params: any = { page: p, pageSize }
  if (keyword.value) params.keyword = keyword.value
  try {
    const res: any = await api.get('/admin/users', { params })
    list.value = res.data.list
    total.value = res.data.total
  } catch {}
}

async function setStatus(id: number, status: number) {
  try {
    await api.put(`/admin/users/${id}/status`, { status })
    await loadData(page.value)
  } catch {}
}

onMounted(() => loadData())
</script>
