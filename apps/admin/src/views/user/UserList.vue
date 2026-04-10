<template>
  <div>
    <!--begin::用户列表卡片-->
    <div class="card card-flush">
      <!--begin::卡片头部-->
      <div class="card-header align-items-center py-5 gap-2 gap-md-5">
        <div class="card-title">
          <div class="d-flex align-items-center position-relative my-1">
            <KTIcon icon-name="magnifier" icon-class="fs-3 position-absolute ms-4" />
            <input
              v-model="keyword"
              type="text"
              class="form-control form-control-solid w-250px ps-12"
              placeholder="搜索手机号/昵称"
              @keyup.enter="loadData(1)"
            />
          </div>
        </div>
      </div>
      <!--end::卡片头部-->
      <!--begin::卡片内容-->
      <div class="card-body pt-0">
        <table class="table align-middle table-row-dashed fs-6 gy-5">
          <thead>
            <tr class="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
              <th class="min-w-50px">ID</th>
              <th class="min-w-150px">用户</th>
              <th class="min-w-100px">手机号</th>
              <th class="text-end min-w-70px">订单数</th>
              <th class="text-end min-w-80px">状态</th>
              <th class="text-end min-w-100px">注册时间</th>
              <th class="text-end min-w-100px">操作</th>
            </tr>
          </thead>
          <tbody class="fw-semibold text-gray-600">
            <tr v-if="loading">
              <td colspan="7" class="text-center py-8">
                <span class="spinner-border spinner-border-sm align-middle me-2"></span>
                加载中...
              </td>
            </tr>
            <tr v-else-if="!list.length">
              <td colspan="7" class="text-center text-muted py-8">暂无用户数据</td>
            </tr>
            <tr v-for="item in list" :key="item.id">
              <td>{{ item.id }}</td>
              <td>
                <div class="d-flex align-items-center">
                  <div class="symbol symbol-35px me-3">
                    <span v-if="item.avatar" class="symbol-label" :style="{ backgroundImage: `url(${item.avatar})` }"></span>
                    <span v-else class="symbol-label bg-light-primary">
                      <KTIcon icon-name="profile-circle" icon-class="fs-3 text-primary" />
                    </span>
                  </div>
                  <span class="text-gray-800 fw-bold">{{ item.nickname || '-' }}</span>
                </div>
              </td>
              <td>{{ item.phone }}</td>
              <td class="text-end pe-0">{{ item._count?.orders || 0 }}</td>
              <td class="text-end pe-0">
                <div :class="`badge badge-light-${item.status === 1 ? 'success' : 'danger'}`">
                  {{ item.status === 1 ? '正常' : '禁用' }}
                </div>
              </td>
              <td class="text-end pe-0">{{ new Date(item.createdAt).toLocaleDateString('zh-CN') }}</td>
              <td class="text-end">
                <a
                  href="javascript:;"
                  class="btn btn-sm btn-light btn-flex btn-center btn-active-light-primary"
                  data-kt-menu-trigger="click"
                  data-kt-menu-placement="bottom-end"
                >
                  操作
                  <KTIcon icon-name="down" icon-class="fs-5 ms-1" />
                </a>
                <div
                  class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-125px py-4"
                  data-kt-menu="true"
                >
                  <div class="menu-item px-3">
                    <a href="javascript:;" class="menu-link px-3" @click="viewDetail(item.id)">查看详情</a>
                  </div>
                  <div class="menu-item px-3">
                    <a
                      v-if="item.status === 1"
                      href="javascript:;"
                      class="menu-link px-3 text-warning"
                      @click="setStatus(item.id, 0)"
                    >禁用</a>
                    <a
                      v-else
                      href="javascript:;"
                      class="menu-link px-3 text-success"
                      @click="setStatus(item.id, 1)"
                    >启用</a>
                  </div>
                </div>
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
    <!--end::用户列表卡片-->

    <!--begin::用户详情弹窗-->
    <div class="modal fade" ref="detailModalRef" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">用户详情</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body" v-if="detailUser">
            <!--begin::用户信息-->
            <div class="d-flex align-items-center mb-6">
              <div class="symbol symbol-50px me-4">
                <span v-if="detailUser.avatar" class="symbol-label" :style="{ backgroundImage: `url(${detailUser.avatar})` }"></span>
                <span v-else class="symbol-label bg-light-primary fs-2 fw-bold text-primary">
                  {{ (detailUser.nickname || 'U')[0].toUpperCase() }}
                </span>
              </div>
              <div class="flex-grow-1">
                <span class="text-gray-800 fs-4 fw-bold">{{ detailUser.nickname || '-' }}</span>
                <div class="text-muted fs-7">{{ detailUser.phone }} · 注册于 {{ new Date(detailUser.createdAt).toLocaleDateString('zh-CN') }}</div>
              </div>
              <div :class="`badge badge-light-${detailUser.status === 1 ? 'success' : 'danger'}`">
                {{ detailUser.status === 1 ? '正常' : '禁用' }}
              </div>
            </div>
            <!--end::用户信息-->
            <!--begin::统计-->
            <div class="row g-4 mb-6">
              <div class="col-6">
                <div class="border border-dashed border-gray-300 rounded py-3 px-4 text-center">
                  <div class="fs-2hx fw-bold text-gray-900">{{ detailUser._count?.orders || 0 }}</div>
                  <div class="fw-semibold text-muted fs-7">订单数</div>
                </div>
              </div>
              <div class="col-6">
                <div class="border border-dashed border-gray-300 rounded py-3 px-4 text-center">
                  <div class="fs-2hx fw-bold text-gray-900">{{ detailUser._count?.favorites || 0 }}</div>
                  <div class="fw-semibold text-muted fs-7">收藏数</div>
                </div>
              </div>
            </div>
            <!--end::统计-->
            <div class="separator my-5"></div>
            <!--begin::收货地址-->
            <h6 class="fw-bold text-gray-800 mb-3">收货地址</h6>
            <table v-if="detailUser.addresses?.length" class="table align-middle table-row-dashed fs-6 gy-4 mb-6">
              <thead>
                <tr class="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
                  <th>收货人</th><th>电话</th><th>地址</th><th class="text-end">默认</th>
                </tr>
              </thead>
              <tbody class="fw-semibold text-gray-600">
                <tr v-for="addr in detailUser.addresses" :key="addr.id">
                  <td>{{ addr.name }}</td>
                  <td>{{ addr.phone }}</td>
                  <td>{{ addr.province }}{{ addr.city }}{{ addr.district }}{{ addr.address }}</td>
                  <td class="text-end">
                    <div v-if="addr.isDefault" class="badge badge-light-primary">默认</div>
                  </td>
                </tr>
              </tbody>
            </table>
            <p v-else class="text-muted mb-6">暂无收货地址</p>
            <!--end::收货地址-->
            <!--begin::最近订单-->
            <h6 class="fw-bold text-gray-800 mb-3">最近订单</h6>
            <table v-if="detailUser.orders?.length" class="table align-middle table-row-dashed fs-6 gy-4">
              <thead>
                <tr class="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
                  <th>订单号</th><th class="text-end">金额</th><th class="text-end">状态</th><th class="text-end">时间</th>
                </tr>
              </thead>
              <tbody class="fw-semibold text-gray-600">
                <tr v-for="order in detailUser.orders" :key="order.id">
                  <td class="fw-bold text-gray-800">{{ order.orderNo }}</td>
                  <td class="text-end text-danger">¥{{ order.totalAmount }}</td>
                  <td class="text-end">
                    <div :class="`badge badge-light-${orderStatusColor(order.status)}`">{{ orderStatusText(order.status) }}</div>
                  </td>
                  <td class="text-end">{{ new Date(order.createdAt).toLocaleString('zh-CN') }}</td>
                </tr>
              </tbody>
            </table>
            <p v-else class="text-muted">暂无订单</p>
            <!--end::最近订单-->
          </div>
          <div class="modal-footer">
            <button class="btn btn-light" data-bs-dismiss="modal">关闭</button>
          </div>
        </div>
      </div>
    </div>
    <!--end::用户详情弹窗-->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import api from '@/core/api'

declare const bootstrap: any

const list = ref<any[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = 10
const loading = ref(false)
const keyword = ref('')

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

// 详情弹窗
const detailModalRef = ref<HTMLElement>()
const detailUser = ref<any>(null)
let detailModal: any = null

const statusMap: Record<number, string> = { 0: '待付款', 1: '待发货', 2: '待收货', 3: '已完成', 4: '已取消', 5: '售后中' }
const statusColorMap: Record<number, string> = { 0: 'warning', 1: 'info', 2: 'primary', 3: 'success', 4: 'secondary', 5: 'danger' }

function orderStatusText(s: number) { return statusMap[s] || '未知' }
function orderStatusColor(s: number) { return statusColorMap[s] || 'secondary' }

async function loadData(p = 1) {
  page.value = p
  loading.value = true
  const params: any = { page: p, pageSize }
  if (keyword.value) params.keyword = keyword.value
  try {
    const res: any = await api.get('/admin/users', { params })
    list.value = res.data.list
    total.value = res.data.total
  } catch {} finally {
    loading.value = false
  }
}

async function setStatus(id: number, status: number) {
  try {
    await api.put(`/admin/users/${id}/status`, { status })
    await loadData(page.value)
  } catch {}
}

async function viewDetail(id: number) {
  try {
    const res: any = await api.get(`/admin/users/${id}`)
    detailUser.value = res.data
    nextTick(() => {
      if (!detailModal) detailModal = new bootstrap.Modal(detailModalRef.value)
      detailModal.show()
    })
  } catch {}
}

onMounted(() => loadData())
</script>
