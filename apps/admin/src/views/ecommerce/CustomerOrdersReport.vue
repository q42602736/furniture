<template>
  <div>
    <!--begin::工具栏-->
    <div class="card card-flush">
      <div class="card-header align-items-center py-5 gap-2 gap-md-5">
        <div class="card-title">
          <div class="d-flex align-items-center position-relative my-1">
            <KTIcon icon-name="magnifier" icon-class="fs-3 position-absolute ms-4" />
            <input
              v-model="keyword"
              type="text"
              class="form-control form-control-solid w-250px ps-12"
              placeholder="搜索客户..."
              @keyup.enter="loadData(1)"
            />
          </div>
        </div>
        <div class="card-toolbar flex-row-fluid justify-content-end gap-5">
          <input
            v-model="startDate"
            type="date"
            class="form-control form-control-solid w-150px"
            placeholder="开始日期"
          />
          <input
            v-model="endDate"
            type="date"
            class="form-control form-control-solid w-150px"
            placeholder="结束日期"
          />
          <button class="btn btn-primary" @click="loadData(1)">
            <KTIcon icon-name="magnifier" icon-class="fs-4 me-1" />查询
          </button>
        </div>
      </div>
      <!--begin::Card body-->
      <div class="card-body pt-0">
        <table class="table align-middle table-row-dashed fs-6 gy-5">
          <thead>
            <tr class="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
              <th class="min-w-100px">客户</th>
              <th class="min-w-100px">手机号</th>
              <th class="min-w-80px">状态</th>
              <th class="min-w-100px">注册时间</th>
              <th class="text-end min-w-75px">订单数</th>
              <th class="text-end min-w-75px">商品数</th>
              <th class="text-end min-w-100px">消费总额</th>
            </tr>
          </thead>
          <tbody class="fw-semibold text-gray-600">
            <tr v-for="row in list" :key="row.userId">
              <td>
                <router-link
                  :to="`/users/${row.userId}`"
                  class="text-gray-900 text-hover-primary"
                >{{ row.nickname || '未设置' }}</router-link>
              </td>
              <td>{{ row.phone }}</td>
              <td>
                <span :class="row.status === 1 ? 'badge badge-light-success' : 'badge badge-light-danger'">
                  {{ row.status === 1 ? '正常' : '禁用' }}
                </span>
              </td>
              <td>{{ formatDate(row.createdAt) }}</td>
              <td class="text-end pe-0">{{ row.orderCount }}</td>
              <td class="text-end pe-0">{{ row.productCount }}</td>
              <td class="text-end">
                <span class="fw-bold">¥{{ formatMoney(row.totalAmount) }}</span>
              </td>
            </tr>
            <tr v-if="!list.length">
              <td colspan="7" class="text-center text-muted py-10">暂无数据</td>
            </tr>
          </tbody>
        </table>

        <!--begin::分页-->
        <div v-if="totalPages > 1" class="d-flex justify-content-end mt-5">
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: page <= 1 }">
              <a class="page-link" href="#" @click.prevent="loadData(page - 1)">上一页</a>
            </li>
            <li
              v-for="p in visiblePages"
              :key="p"
              class="page-item"
              :class="{ active: p === page }"
            >
              <a class="page-link" href="#" @click.prevent="loadData(p)">{{ p }}</a>
            </li>
            <li class="page-item" :class="{ disabled: page >= totalPages }">
              <a class="page-link" href="#" @click.prevent="loadData(page + 1)">下一页</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '@/core/api'

const keyword = ref('')
const startDate = ref('')
const endDate = ref('')
const page = ref(1)
const pageSize = 20
const total = ref(0)
const totalPages = computed(() => Math.ceil(total.value / pageSize))

const list = ref<Array<{
  userId: number
  nickname: string
  phone: string
  status: number
  createdAt: string
  orderCount: number
  productCount: number
  totalAmount: number
}>>([])

const visiblePages = computed(() => {
  const pages: number[] = []
  const start = Math.max(1, page.value - 2)
  const end = Math.min(totalPages.value, page.value + 2)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

function formatMoney(n: number) {
  return n.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatDate(d: string) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('zh-CN')
}

function setDefaultDates() {
  const now = new Date()
  endDate.value = now.toISOString().slice(0, 10)
  now.setDate(now.getDate() - 90)
  startDate.value = now.toISOString().slice(0, 10)
}

async function loadData(p = 1) {
  page.value = p
  try {
    const params: Record<string, any> = { page: p, pageSize }
    if (startDate.value) params.startDate = startDate.value
    if (endDate.value) params.endDate = endDate.value
    const res: any = await api.get('/admin/reports/customers', { params })
    list.value = res.data.list || []
    total.value = res.data.total || 0
  } catch {
    list.value = []
  }
}

onMounted(() => {
  setDefaultDates()
  loadData()
})
</script>
