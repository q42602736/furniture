<template>
  <div>
    <!--begin::退款管理卡片-->
    <div class="card card-flush">
      <!--begin::卡片头部-->
      <div class="card-header align-items-center py-5 gap-2 gap-md-5">
        <div class="card-title">
          <KTIcon icon-name="arrow-left" icon-class="fs-2 text-gray-500 me-2" />
          <span class="fw-bold text-gray-800">售后/退款管理</span>
        </div>
        <div class="card-toolbar">
          <select v-model="filterStatus" class="form-select form-select-solid form-select-sm w-150px" @change="loadData(1)">
            <option value="">全部状态</option>
            <option value="0">申请中</option>
            <option value="1">已同意</option>
            <option value="2">已拒绝</option>
            <option value="3">已退款</option>
          </select>
        </div>
      </div>
      <!--end::卡片头部-->
      <!--begin::卡片内容-->
      <div class="card-body pt-0">
        <table class="table align-middle table-row-dashed fs-6 gy-5">
          <thead>
            <tr class="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
              <th class="min-w-50px">ID</th>
              <th class="min-w-130px">订单号</th>
              <th class="min-w-100px">买家</th>
              <th class="min-w-200px">退款原因</th>
              <th class="text-end min-w-80px">退款金额</th>
              <th class="text-end min-w-80px">状态</th>
              <th class="text-end min-w-120px">申请时间</th>
              <th class="text-end min-w-120px">操作</th>
            </tr>
          </thead>
          <tbody class="fw-semibold text-gray-600">
            <tr v-if="loading">
              <td colspan="8" class="text-center py-8">
                <span class="spinner-border spinner-border-sm align-middle me-2"></span>
                加载中...
              </td>
            </tr>
            <tr v-else-if="!list.length">
              <td colspan="8" class="text-center text-muted py-8">暂无退款记录</td>
            </tr>
            <tr v-for="item in list" :key="item.id">
              <td class="text-gray-600">{{ item.id }}</td>
              <td>
                <router-link
                  v-if="item.order"
                  :to="`/orders/${item.order.id}`"
                  class="text-gray-800 text-hover-primary fw-bold"
                >
                  {{ item.order.orderNo }}
                </router-link>
                <span v-else class="text-muted">-</span>
              </td>
              <td>{{ item.order?.user?.nickname || item.order?.user?.phone || '-' }}</td>
              <td>
                <span class="text-gray-800 d-block text-truncate" style="max-width:250px" :title="item.reason">
                  {{ item.reason }}
                </span>
              </td>
              <td class="text-end">
                <span class="fw-bold text-danger">¥{{ item.amount }}</span>
              </td>
              <td class="text-end">
                <span :class="`badge badge-light-${statusColor(item.status)}`">
                  {{ statusText(item.status) }}
                </span>
              </td>
              <td class="text-end text-gray-600 fs-7">{{ formatDate(item.createdAt) }}</td>
              <td class="text-end">
                <!-- 申请中：显示同意/拒绝 -->
                <template v-if="item.status === 0">
                  <button class="btn btn-sm btn-light-success me-1" @click="approve(item.id)">同意</button>
                  <button class="btn btn-sm btn-light-danger" @click="reject(item.id)">拒绝</button>
                </template>
                <!-- 已同意：显示确认退款 -->
                <template v-else-if="item.status === 1">
                  <button class="btn btn-sm btn-light-primary" @click="complete(item.id)">确认退款</button>
                </template>
                <!-- 其他状态不显示操作按钮 -->
                <span v-else class="text-muted fs-7">-</span>
              </td>
            </tr>
          </tbody>
        </table>
        <!--begin::分页-->
        <div v-if="totalPages > 1" class="d-flex justify-content-between align-items-center flex-wrap pt-4">
          <div class="fs-6 fw-semibold text-gray-700">
            共 {{ total }} 条，第 {{ page }} / {{ totalPages }} 页
          </div>
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: page <= 1 }">
              <a class="page-link" href="javascript:;" @click="page > 1 && loadData(page - 1)">
                <KTIcon icon-name="left" icon-class="fs-6" />
              </a>
            </li>
            <li
              v-for="p in visiblePages"
              :key="p"
              class="page-item"
              :class="{ active: p === page }"
            >
              <a class="page-link" href="javascript:;" @click="loadData(p)">{{ p }}</a>
            </li>
            <li class="page-item" :class="{ disabled: page >= totalPages }">
              <a class="page-link" href="javascript:;" @click="page < totalPages && loadData(page + 1)">
                <KTIcon icon-name="right" icon-class="fs-6" />
              </a>
            </li>
          </ul>
        </div>
        <!--end::分页-->
      </div>
      <!--end::卡片内容-->
    </div>
    <!--end::退款管理卡片-->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '@/core/api'

const list = ref<any[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = 10
const loading = ref(false)
const filterStatus = ref('')

const totalPages = computed(() => Math.ceil(total.value / pageSize))
const visiblePages = computed(() => {
  const pages: number[] = []
  const tp = totalPages.value
  const cur = page.value
  let start = Math.max(1, cur - 2)
  let end = Math.min(tp, cur + 2)
  if (end - start < 4) {
    if (start === 1) end = Math.min(tp, start + 4)
    else start = Math.max(1, end - 4)
  }
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

const statusMap: Record<number, string> = { 0: '申请中', 1: '已同意', 2: '已拒绝', 3: '已退款' }
const statusColorMap: Record<number, string> = { 0: 'warning', 1: 'info', 2: 'danger', 3: 'success' }

function statusText(s: number) { return statusMap[s] || '未知' }
function statusColor(s: number) { return statusColorMap[s] || 'secondary' }
function formatDate(d: string) {
  return d ? new Date(d).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : '-'
}

async function loadData(p = 1) {
  page.value = p
  loading.value = true
  const params: any = { page: p, pageSize }
  if (filterStatus.value !== '') params.status = Number(filterStatus.value)
  try {
    const res: any = await api.get('/admin/refunds', { params })
    list.value = res.data.list
    total.value = res.data.total
  } catch {} finally {
    loading.value = false
  }
}

async function approve(id: number) {
  if (!confirm('确认同意该退款申请？')) return
  try {
    await api.put(`/admin/refunds/${id}/approve`)
    await loadData(page.value)
  } catch {}
}

async function reject(id: number) {
  if (!confirm('确认拒绝该退款申请？')) return
  try {
    await api.put(`/admin/refunds/${id}/reject`)
    await loadData(page.value)
  } catch {}
}

async function complete(id: number) {
  if (!confirm('确认已完成退款？将恢复库存并关闭订单。')) return
  try {
    await api.put(`/admin/refunds/${id}/complete`)
    await loadData(page.value)
  } catch {}
}

onMounted(() => loadData())
</script>
