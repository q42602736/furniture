<template>
  <div>
    <!--begin::订单列表卡片-->
    <div class="card card-flush">
      <!--begin::卡片头部-->
      <div class="card-header align-items-center py-5 gap-2 gap-md-5">
        <!--begin::搜索-->
        <div class="card-title">
          <div class="d-flex align-items-center position-relative my-1">
            <KTIcon icon-name="magnifier" icon-class="fs-3 position-absolute ms-4" />
            <input
              v-model="filterKeyword"
              type="text"
              class="form-control form-control-solid w-250px ps-12"
              placeholder="搜索订单号"
              @keyup.enter="loadData(1)"
            />
          </div>
        </div>
        <!--end::搜索-->
        <!--begin::工具栏-->
        <div class="card-toolbar flex-row-fluid justify-content-end gap-5">
          <div class="w-100 mw-150px">
            <select
              v-model="filterStatus"
              class="form-select form-select-solid"
              @change="loadData(1)"
            >
              <option value="">全部状态</option>
              <option value="0">待付款</option>
              <option value="1">待发货</option>
              <option value="2">待收货</option>
              <option value="3">已完成</option>
              <option value="4">已取消</option>
              <option value="5">售后中</option>
            </select>
          </div>
        </div>
        <!--end::工具栏-->
      </div>
      <!--end::卡片头部-->
      <!--begin::卡片内容-->
      <div class="card-body pt-0">
        <!--begin::表格-->
        <table class="table align-middle table-row-dashed fs-6 gy-5">
          <thead>
            <tr class="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
              <th class="min-w-130px">订单号</th>
              <th class="min-w-100px">买家</th>
              <th class="text-end min-w-80px">金额</th>
              <th class="text-end min-w-100px">状态</th>
              <th class="text-end min-w-120px">下单时间</th>
              <th class="text-end min-w-100px">操作</th>
            </tr>
          </thead>
          <tbody class="fw-semibold text-gray-600">
            <tr v-if="loading">
              <td colspan="6" class="text-center py-8">
                <span class="spinner-border spinner-border-sm align-middle me-2"></span>
                加载中...
              </td>
            </tr>
            <tr v-else-if="!list.length">
              <td colspan="6" class="text-center text-muted py-8">暂无订单数据</td>
            </tr>
            <tr v-for="item in list" :key="item.id">
              <td>
                <a href="javascript:;" class="text-gray-800 text-hover-primary fw-bold" @click="viewDetail(item.id)">
                  {{ item.orderNo }}
                </a>
              </td>
              <td>{{ item.user?.nickname || item.user?.phone || '-' }}</td>
              <td class="text-end pe-0">
                <span class="fw-bold text-danger">¥{{ item.totalAmount }}</span>
              </td>
              <td class="text-end pe-0">
                <div :class="`badge badge-light-${orderStatusColor(item.status)}`">
                  {{ orderStatusText(item.status) }}
                </div>
              </td>
              <td class="text-end pe-0">{{ formatTime(item.createdAt) }}</td>
              <!--begin::操作-->
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
                  <div v-if="item.status === 1" class="menu-item px-3">
                    <a href="javascript:;" class="menu-link px-3 text-success" @click="shipOrder(item.id)">确认发货</a>
                  </div>
                  <div v-if="[0,1].includes(item.status)" class="menu-item px-3">
                    <a href="javascript:;" class="menu-link px-3 text-danger" @click="cancelOrder(item.id)">取消订单</a>
                  </div>
                </div>
              </td>
              <!--end::操作-->
            </tr>
          </tbody>
        </table>
        <!--end::表格-->
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
    <!--end::订单列表卡片-->

    <!--begin::订单详情弹窗-->
    <div class="modal fade" ref="detailModalRef" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">订单详情</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body" v-if="detailOrder">
            <!--begin::基本信息-->
            <div class="row mb-6">
              <div class="col-md-6">
                <div class="mb-3">
                  <span class="text-muted fs-7 d-block mb-1">订单号</span>
                  <span class="fw-bold text-gray-800">{{ detailOrder.orderNo }}</span>
                </div>
                <div class="mb-3">
                  <span class="text-muted fs-7 d-block mb-1">状态</span>
                  <div :class="`badge badge-light-${orderStatusColor(detailOrder.status)}`">
                    {{ orderStatusText(detailOrder.status) }}
                  </div>
                </div>
                <div class="mb-3">
                  <span class="text-muted fs-7 d-block mb-1">下单时间</span>
                  <span class="fw-semibold text-gray-600">{{ formatTime(detailOrder.createdAt) }}</span>
                </div>
                <div v-if="detailOrder.paidAt" class="mb-3">
                  <span class="text-muted fs-7 d-block mb-1">支付时间</span>
                  <span class="fw-semibold text-gray-600">{{ formatTime(detailOrder.paidAt) }}</span>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <span class="text-muted fs-7 d-block mb-1">买家</span>
                  <span class="fw-bold text-gray-800">{{ detailOrder.user?.nickname || detailOrder.user?.phone || '-' }}</span>
                </div>
                <div class="mb-3">
                  <span class="text-muted fs-7 d-block mb-1">收货人</span>
                  <span class="fw-semibold text-gray-600">{{ detailOrder.receiverName }} {{ detailOrder.receiverPhone }}</span>
                </div>
                <div class="mb-3">
                  <span class="text-muted fs-7 d-block mb-1">地址</span>
                  <span class="fw-semibold text-gray-600">{{ detailOrder.receiverAddr }}</span>
                </div>
                <div v-if="detailOrder.remark" class="mb-3">
                  <span class="text-muted fs-7 d-block mb-1">备注</span>
                  <span class="fw-semibold text-gray-600">{{ detailOrder.remark }}</span>
                </div>
              </div>
            </div>
            <!--end::基本信息-->
            <div class="separator my-5"></div>
            <!--begin::商品列表-->
            <table class="table align-middle table-row-dashed fs-6 gy-4">
              <thead>
                <tr class="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
                  <th>商品</th>
                  <th>规格</th>
                  <th class="text-end">单价</th>
                  <th class="text-end">数量</th>
                  <th class="text-end">小计</th>
                </tr>
              </thead>
              <tbody class="fw-semibold text-gray-600">
                <tr v-for="item in detailOrder.items" :key="item.id">
                  <td>
                    <div class="d-flex align-items-center">
                      <a v-if="item.image" class="symbol symbol-40px me-3">
                        <span class="symbol-label" :style="{ backgroundImage: `url(${item.image})` }"></span>
                      </a>
                      <span>{{ item.name }}</span>
                    </div>
                  </td>
                  <td>{{ item.sku?.name || '-' }}</td>
                  <td class="text-end">¥{{ item.price }}</td>
                  <td class="text-end">{{ item.quantity }}</td>
                  <td class="text-end text-danger fw-bold">¥{{ (Number(item.price) * item.quantity).toFixed(2) }}</td>
                </tr>
              </tbody>
            </table>
            <!--end::商品列表-->
            <div class="d-flex justify-content-end gap-5 mt-4">
              <span class="text-gray-600">总金额：<strong class="text-gray-800">¥{{ detailOrder.totalAmount }}</strong></span>
              <span class="text-gray-600">实付：<strong class="text-danger">¥{{ detailOrder.payAmount }}</strong></span>
            </div>
          </div>
          <div class="modal-footer" v-if="detailOrder">
            <button v-if="detailOrder.status === 1" class="btn btn-success" @click="shipOrder(detailOrder.id); detailModal?.hide()">
              <KTIcon icon-name="delivery" icon-class="fs-4 me-1" />
              确认发货
            </button>
            <button v-if="detailOrder.status === 2" class="btn btn-primary" @click="completeOrder(detailOrder.id); detailModal?.hide()">
              <KTIcon icon-name="check" icon-class="fs-4 me-1" />
              确认完成
            </button>
            <button v-if="[0,1].includes(detailOrder.status)" class="btn btn-danger" @click="cancelOrder(detailOrder.id); detailModal?.hide()">取消订单</button>
            <button class="btn btn-light" data-bs-dismiss="modal">关闭</button>
          </div>
        </div>
      </div>
    </div>
    <!--end::订单详情弹窗-->
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
const filterStatus = ref('')
const filterKeyword = ref('')

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
const detailOrder = ref<any>(null)
let detailModal: any = null

const statusMap: Record<number, string> = { 0: '待付款', 1: '待发货', 2: '待收货', 3: '已完成', 4: '已取消', 5: '售后中' }
const statusColorMap: Record<number, string> = { 0: 'warning', 1: 'info', 2: 'primary', 3: 'success', 4: 'secondary', 5: 'danger' }

function orderStatusText(s: number) { return statusMap[s] || '未知' }
function orderStatusColor(s: number) { return statusColorMap[s] || 'secondary' }
function formatTime(t: string) { return t ? new Date(t).toLocaleString('zh-CN') : '-' }

async function loadData(p = 1) {
  page.value = p
  loading.value = true
  const params: any = { page: p, pageSize }
  if (filterStatus.value !== '') params.status = Number(filterStatus.value)
  if (filterKeyword.value) params.keyword = filterKeyword.value
  try {
    const res: any = await api.get('/admin/orders', { params })
    list.value = res.data.list
    total.value = res.data.total
  } catch {} finally {
    loading.value = false
  }
}

async function viewDetail(id: number) {
  try {
    const res: any = await api.get(`/admin/orders/${id}`)
    detailOrder.value = res.data
    nextTick(() => {
      if (!detailModal) detailModal = new bootstrap.Modal(detailModalRef.value)
      detailModal.show()
    })
  } catch {}
}

async function shipOrder(id: number) {
  if (!confirm('确认发货？')) return
  try {
    await api.put(`/admin/orders/${id}/status`, { status: 2 })
    await loadData(page.value)
  } catch {}
}

async function completeOrder(id: number) {
  if (!confirm('确认完成该订单？')) return
  try {
    await api.put(`/admin/orders/${id}/status`, { status: 3 })
    await loadData(page.value)
  } catch {}
}

async function cancelOrder(id: number) {
  if (!confirm('确认取消该订单？取消后将恢复库存。')) return
  try {
    await api.put(`/admin/orders/${id}/status`, { status: 4 })
    await loadData(page.value)
  } catch {}
}

onMounted(() => loadData())
</script>
