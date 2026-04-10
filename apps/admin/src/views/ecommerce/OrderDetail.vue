<template>
  <div>
    <!--begin::加载状态-->
    <div v-if="loading" class="d-flex justify-content-center py-20">
      <span class="spinner-border text-primary"></span>
    </div>
    <!--end::加载状态-->

    <template v-if="order && !loading">
      <!--begin::顶部操作栏-->
      <div class="d-flex flex-wrap flex-stack gap-5 gap-lg-10 mb-7">
        <ul class="nav nav-custom nav-tabs nav-line-tabs nav-line-tabs-2x border-0 fs-4 fw-semibold mb-lg-n2 me-auto">
          <li class="nav-item">
            <a
              class="nav-link text-active-primary pb-4"
              :class="{ active: activeTab === 'summary' }"
              href="javascript:;"
              @click="activeTab = 'summary'"
            >订单概览</a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link text-active-primary pb-4"
              :class="{ active: activeTab === 'items' }"
              href="javascript:;"
              @click="activeTab = 'items'"
            >商品明细</a>
          </li>
        </ul>
        <router-link to="/orders" class="btn btn-icon btn-light btn-active-secondary btn-sm ms-auto">
          <KTIcon icon-name="left" icon-class="fs-2" />
        </router-link>
        <button
          v-if="order.status === 1"
          class="btn btn-success btn-sm"
          @click="shipOrder"
        >
          <KTIcon icon-name="delivery" icon-class="fs-4 me-1" />
          确认发货
        </button>
        <button
          v-if="order.status === 2"
          class="btn btn-primary btn-sm"
          @click="completeOrder"
        >
          <KTIcon icon-name="check" icon-class="fs-4 me-1" />
          确认完成
        </button>
        <button
          v-if="[0, 1].includes(order.status)"
          class="btn btn-danger btn-sm"
          @click="cancelOrder"
        >取消订单</button>
      </div>
      <!--end::顶部操作栏-->

      <!--begin::订单概览-->
      <div v-show="activeTab === 'summary'">
        <div class="d-flex flex-column flex-xl-row gap-7 gap-lg-10 mb-7">
          <!--begin::订单信息卡片-->
          <div class="card card-flush py-4 flex-row-fluid">
            <div class="card-header">
              <div class="card-title">
                <h2>订单信息 (#{{ order.orderNo }})</h2>
              </div>
            </div>
            <div class="card-body pt-0">
              <div class="table-responsive">
                <table class="table align-middle table-row-bordered mb-0 fs-6 gy-5 min-w-300px">
                  <tbody class="fw-semibold text-gray-600">
                    <tr>
                      <td class="text-muted">
                        <div class="d-flex align-items-center">
                          <KTIcon icon-name="calendar" icon-class="fs-2 me-2" />
                          下单时间
                        </div>
                      </td>
                      <td class="fw-bold text-end">{{ formatTime(order.createdAt) }}</td>
                    </tr>
                    <tr>
                      <td class="text-muted">
                        <div class="d-flex align-items-center">
                          <KTIcon icon-name="flag" icon-class="fs-2 me-2" />
                          订单状态
                        </div>
                      </td>
                      <td class="fw-bold text-end">
                        <div :class="`badge badge-light-${orderStatusColor(order.status)}`">
                          {{ orderStatusText(order.status) }}
                        </div>
                      </td>
                    </tr>
                    <tr v-if="order.paidAt">
                      <td class="text-muted">
                        <div class="d-flex align-items-center">
                          <KTIcon icon-name="dollar" icon-class="fs-2 me-2" />
                          支付时间
                        </div>
                      </td>
                      <td class="fw-bold text-end">{{ formatTime(order.paidAt) }}</td>
                    </tr>
                    <tr v-if="order.shippedAt">
                      <td class="text-muted">
                        <div class="d-flex align-items-center">
                          <KTIcon icon-name="delivery" icon-class="fs-2 me-2" />
                          发货时间
                        </div>
                      </td>
                      <td class="fw-bold text-end">{{ formatTime(order.shippedAt) }}</td>
                    </tr>
                    <tr v-if="order.completedAt">
                      <td class="text-muted">
                        <div class="d-flex align-items-center">
                          <KTIcon icon-name="check-circle" icon-class="fs-2 me-2" />
                          完成时间
                        </div>
                      </td>
                      <td class="fw-bold text-end">{{ formatTime(order.completedAt) }}</td>
                    </tr>
                    <tr>
                      <td class="text-muted">
                        <div class="d-flex align-items-center">
                          <KTIcon icon-name="tag" icon-class="fs-2 me-2" />
                          总金额
                        </div>
                      </td>
                      <td class="fw-bold text-end text-danger fs-4">¥{{ order.totalAmount }}</td>
                    </tr>
                    <tr>
                      <td class="text-muted">
                        <div class="d-flex align-items-center">
                          <KTIcon icon-name="wallet" icon-class="fs-2 me-2" />
                          实付金额
                        </div>
                      </td>
                      <td class="fw-bold text-end text-danger fs-4">¥{{ order.payAmount }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <!--end::订单信息卡片-->

          <!--begin::买家信息卡片-->
          <div class="card card-flush py-4 flex-row-fluid">
            <div class="card-header">
              <div class="card-title">
                <h2>买家信息</h2>
              </div>
            </div>
            <div class="card-body pt-0">
              <div class="table-responsive">
                <table class="table align-middle table-row-bordered mb-0 fs-6 gy-5 min-w-300px">
                  <tbody class="fw-semibold text-gray-600">
                    <tr>
                      <td class="text-muted">
                        <div class="d-flex align-items-center">
                          <KTIcon icon-name="profile-circle" icon-class="fs-2 me-2" />
                          买家
                        </div>
                      </td>
                      <td class="fw-bold text-end">
                        <router-link
                          v-if="order.user"
                          :to="`/users/${order.user.id}`"
                          class="text-gray-600 text-hover-primary"
                        >{{ order.user.nickname || order.user.phone || '-' }}</router-link>
                        <span v-else>-</span>
                      </td>
                    </tr>
                    <tr>
                      <td class="text-muted">
                        <div class="d-flex align-items-center">
                          <KTIcon icon-name="geolocation" icon-class="fs-2 me-2" />
                          收货人
                        </div>
                      </td>
                      <td class="fw-bold text-end">{{ order.receiverName }}</td>
                    </tr>
                    <tr>
                      <td class="text-muted">
                        <div class="d-flex align-items-center">
                          <KTIcon icon-name="phone" icon-class="fs-2 me-2" />
                          联系电话
                        </div>
                      </td>
                      <td class="fw-bold text-end">{{ order.receiverPhone }}</td>
                    </tr>
                    <tr>
                      <td class="text-muted">
                        <div class="d-flex align-items-center">
                          <KTIcon icon-name="map" icon-class="fs-2 me-2" />
                          收货地址
                        </div>
                      </td>
                      <td class="fw-bold text-end">{{ order.receiverAddr }}</td>
                    </tr>
                    <tr v-if="order.remark">
                      <td class="text-muted">
                        <div class="d-flex align-items-center">
                          <KTIcon icon-name="message-text" icon-class="fs-2 me-2" />
                          备注
                        </div>
                      </td>
                      <td class="fw-bold text-end">{{ order.remark }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <!--end::买家信息卡片-->
        </div>
      </div>
      <!--end::订单概览-->

      <!--begin::商品明细（两个Tab共享此表格，但概览Tab也显示）-->
      <div class="card card-flush" :class="{ 'mt-7': activeTab === 'items' }">
        <div class="card-header align-items-center py-5">
          <div class="card-title">
            <h2>商品明细</h2>
          </div>
          <div class="card-toolbar">
            <span class="badge badge-light-info fs-7">{{ order.items?.length || 0 }} 件商品</span>
          </div>
        </div>
        <div class="card-body pt-0">
          <table class="table align-middle table-row-dashed fs-6 gy-5">
            <thead>
              <tr class="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
                <th class="min-w-175px">商品</th>
                <th class="min-w-80px">规格</th>
                <th class="text-end min-w-80px">单价</th>
                <th class="text-end min-w-70px">数量</th>
                <th class="text-end min-w-100px">小计</th>
              </tr>
            </thead>
            <tbody class="fw-semibold text-gray-600">
              <tr v-for="item in order.items" :key="item.id">
                <td>
                  <div class="d-flex align-items-center">
                    <a v-if="item.image" class="symbol symbol-50px me-3">
                      <span class="symbol-label" :style="{ backgroundImage: `url(${item.image})` }"></span>
                    </a>
                    <span class="fw-bold text-gray-800">{{ item.name }}</span>
                  </div>
                </td>
                <td>{{ item.sku?.name || '-' }}</td>
                <td class="text-end">¥{{ item.price }}</td>
                <td class="text-end">{{ item.quantity }}</td>
                <td class="text-end fw-bold text-danger">¥{{ (Number(item.price) * item.quantity).toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
          <div class="d-flex justify-content-end border-top pt-5">
            <div class="mw-300px w-100">
              <div class="d-flex fs-6 fw-semibold align-items-center justify-content-between mb-3">
                <span class="text-muted">商品总额</span>
                <span class="text-gray-800">¥{{ order.totalAmount }}</span>
              </div>
              <div class="separator separator-dashed mb-3"></div>
              <div class="d-flex fs-4 fw-bold align-items-center justify-content-between">
                <span class="text-gray-800">实付金额</span>
                <span class="text-danger">¥{{ order.payAmount }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--end::商品明细-->
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/core/api'

const route = useRoute()
const router = useRouter()
const order = ref<any>(null)
const loading = ref(true)
const activeTab = ref('summary')

const statusMap: Record<number, string> = { 0: '待付款', 1: '待发货', 2: '待收货', 3: '已完成', 4: '已取消', 5: '售后中' }
const statusColorMap: Record<number, string> = { 0: 'warning', 1: 'info', 2: 'primary', 3: 'success', 4: 'secondary', 5: 'danger' }

function orderStatusText(s: number) { return statusMap[s] || '未知' }
function orderStatusColor(s: number) { return statusColorMap[s] || 'secondary' }
function formatTime(t: string) { return t ? new Date(t).toLocaleString('zh-CN') : '-' }

async function loadOrder() {
  loading.value = true
  try {
    const res: any = await api.get(`/admin/orders/${route.params.id}`)
    order.value = res.data
  } catch {
    router.push('/orders')
  } finally {
    loading.value = false
  }
}

async function shipOrder() {
  if (!confirm('确认发货？')) return
  try {
    await api.put(`/admin/orders/${route.params.id}/status`, { status: 2 })
    await loadOrder()
  } catch {}
}

async function completeOrder() {
  if (!confirm('确认完成该订单？')) return
  try {
    await api.put(`/admin/orders/${route.params.id}/status`, { status: 3 })
    await loadOrder()
  } catch {}
}

async function cancelOrder() {
  if (!confirm('确认取消该订单？取消后将恢复库存。')) return
  try {
    await api.put(`/admin/orders/${route.params.id}/status`, { status: 4 })
    await loadOrder()
  } catch {}
}

onMounted(() => loadOrder())
</script>
