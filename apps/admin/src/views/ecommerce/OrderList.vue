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
                <router-link :to="`/orders/${item.id}`" class="text-gray-800 text-hover-primary fw-bold">
                  {{ item.orderNo }}
                </router-link>
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
                    <router-link :to="`/orders/${item.id}`" class="menu-link px-3">查看详情</router-link>
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

    <!--begin::发货弹窗-->
    <div class="modal fade" ref="shipModalRef" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">确认发货</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-5">
              <label class="form-label required">物流公司</label>
              <select v-model="shipForm.shippingCompany" class="form-select form-select-solid">
                <option value="">请选择物流公司</option>
                <option value="顺丰速运">顺丰速运</option>
                <option value="中通快递">中通快递</option>
                <option value="圆通速递">圆通速递</option>
                <option value="韵达快递">韵达快递</option>
                <option value="申通快递">申通快递</option>
                <option value="极兔速递">极兔速递</option>
                <option value="京东物流">京东物流</option>
                <option value="邮政EMS">邮政EMS</option>
                <option value="德邦快递">德邦快递</option>
              </select>
            </div>
            <div class="mb-5">
              <label class="form-label required">物流单号</label>
              <input v-model="shipForm.trackingNo" class="form-control form-control-solid" placeholder="请输入物流单号" />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-light" data-bs-dismiss="modal">取消</button>
            <button class="btn btn-primary" :disabled="shipSaving" @click="submitShip">
              <span v-if="shipSaving" class="spinner-border spinner-border-sm align-middle me-1"></span>
              {{ shipSaving ? '提交中...' : '确认发货' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <!--end::发货弹窗-->
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
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

// 发货弹窗相关
const shipModalRef = ref<HTMLElement | null>(null)
const shipForm = reactive({ shippingCompany: '', trackingNo: '' })
const shipSaving = ref(false)
const shipOrderId = ref(0)
let shipModalInstance: any = null

function shipOrder(id: number) {
  shipOrderId.value = id
  shipForm.shippingCompany = ''
  shipForm.trackingNo = ''
  if (!shipModalInstance && shipModalRef.value) {
    shipModalInstance = new bootstrap.Modal(shipModalRef.value)
  }
  shipModalInstance?.show()
}

async function submitShip() {
  if (!shipForm.shippingCompany || !shipForm.trackingNo) {
    alert('请填写物流公司和物流单号')
    return
  }
  shipSaving.value = true
  try {
    await api.put(`/admin/orders/${shipOrderId.value}/ship`, {
      shippingCompany: shipForm.shippingCompany,
      trackingNo: shipForm.trackingNo,
    })
    shipModalInstance?.hide()
    await loadData(page.value)
  } catch {} finally {
    shipSaving.value = false
  }
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
