<template>
  <div>
    <!--begin::加载状态-->
    <div v-if="loading" class="d-flex justify-content-center py-20">
      <span class="spinner-border text-primary"></span>
    </div>
    <!--end::加载状态-->

    <template v-if="user && !loading">
      <!--begin::顶部操作栏-->
      <div class="d-flex flex-wrap flex-stack gap-5 gap-lg-10 mb-7">
        <div class="d-flex align-items-center gap-3">
          <router-link to="/users" class="btn btn-icon btn-light btn-active-secondary btn-sm">
            <KTIcon icon-name="left" icon-class="fs-2" />
          </router-link>
          <div class="d-flex align-items-center gap-3">
            <div class="symbol symbol-45px">
              <span v-if="user.avatar" class="symbol-label" :style="{ backgroundImage: `url(${user.avatar})` }"></span>
              <span v-else class="symbol-label bg-light-primary fs-3 fw-bold text-primary">
                {{ (user.nickname || 'U')[0].toUpperCase() }}
              </span>
            </div>
            <div>
              <div class="fs-3 fw-bold text-gray-800">{{ user.nickname || '-' }}</div>
              <div class="text-muted fs-7">{{ user.phone }}</div>
            </div>
          </div>
        </div>
        <div class="d-flex gap-3">
          <button
            v-if="user.status === 1"
            class="btn btn-warning btn-sm"
            @click="toggleStatus(0)"
          >
            <KTIcon icon-name="lock" icon-class="fs-4 me-1" />
            禁用
          </button>
          <button
            v-else
            class="btn btn-success btn-sm"
            @click="toggleStatus(1)"
          >
            <KTIcon icon-name="check" icon-class="fs-4 me-1" />
            启用
          </button>
        </div>
      </div>
      <!--end::顶部操作栏-->

      <!--begin::概览卡片区-->
      <div class="row g-5 g-xl-10 mb-7">
        <div class="col-sm-6 col-xl-3">
          <div class="card card-flush h-100">
            <div class="card-body d-flex flex-column justify-content-between">
              <KTIcon icon-name="handcart" icon-class="fs-2hx text-primary mb-3" />
              <div>
                <div class="fs-2hx fw-bold text-gray-900">{{ user._count?.orders || 0 }}</div>
                <div class="fw-semibold text-muted fs-6">总订单数</div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-6 col-xl-3">
          <div class="card card-flush h-100">
            <div class="card-body d-flex flex-column justify-content-between">
              <KTIcon icon-name="heart" icon-class="fs-2hx text-danger mb-3" />
              <div>
                <div class="fs-2hx fw-bold text-gray-900">{{ user._count?.favorites || 0 }}</div>
                <div class="fw-semibold text-muted fs-6">收藏数</div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-6 col-xl-3">
          <div class="card card-flush h-100">
            <div class="card-body d-flex flex-column justify-content-between">
              <KTIcon icon-name="calendar" icon-class="fs-2hx text-success mb-3" />
              <div>
                <div class="fs-6 fw-bold text-gray-900">{{ new Date(user.createdAt).toLocaleDateString('zh-CN') }}</div>
                <div class="fw-semibold text-muted fs-6">注册时间</div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-6 col-xl-3">
          <div class="card card-flush h-100">
            <div class="card-body d-flex flex-column justify-content-between">
              <KTIcon icon-name="shield-tick" icon-class="fs-2hx mb-3" :class="user.status === 1 ? 'text-success' : 'text-danger'" />
              <div>
                <div :class="`badge badge-light-${user.status === 1 ? 'success' : 'danger'} fs-7`">
                  {{ user.status === 1 ? '正常' : '已禁用' }}
                </div>
                <div class="fw-semibold text-muted fs-6 mt-1">账号状态</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--end::概览卡片区-->

      <!--begin::Tab 导航-->
      <ul class="nav nav-custom nav-tabs nav-line-tabs nav-line-tabs-2x border-0 fs-4 fw-semibold mb-7">
        <li class="nav-item">
          <a class="nav-link text-active-primary pb-4" :class="{ active: activeTab === 'address' }" href="javascript:;" @click="activeTab = 'address'">收货地址</a>
        </li>
        <li class="nav-item">
          <a class="nav-link text-active-primary pb-4" :class="{ active: activeTab === 'orders' }" href="javascript:;" @click="activeTab = 'orders'">最近订单</a>
        </li>
      </ul>
      <!--end::Tab 导航-->

      <!--begin::收货地址-->
      <div v-show="activeTab === 'address'" class="card card-flush">
        <div class="card-header align-items-center py-5">
          <div class="card-title"><h2>收货地址</h2></div>
          <div class="card-toolbar">
            <span class="badge badge-light-info fs-7">{{ user.addresses?.length || 0 }} 条</span>
          </div>
        </div>
        <div class="card-body pt-0">
          <table v-if="user.addresses?.length" class="table align-middle table-row-dashed fs-6 gy-5">
            <thead>
              <tr class="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
                <th>收货人</th><th>电话</th><th>地址</th><th class="text-end">默认</th>
              </tr>
            </thead>
            <tbody class="fw-semibold text-gray-600">
              <tr v-for="addr in user.addresses" :key="addr.id">
                <td>{{ addr.name }}</td>
                <td>{{ addr.phone }}</td>
                <td>{{ addr.province }}{{ addr.city }}{{ addr.district }}{{ addr.address }}</td>
                <td class="text-end">
                  <div v-if="addr.isDefault" class="badge badge-light-primary">默认</div>
                </td>
              </tr>
            </tbody>
          </table>
          <p v-else class="text-muted py-5 mb-0 text-center">暂无收货地址</p>
        </div>
      </div>
      <!--end::收货地址-->

      <!--begin::最近订单-->
      <div v-show="activeTab === 'orders'" class="card card-flush">
        <div class="card-header align-items-center py-5">
          <div class="card-title"><h2>最近订单</h2></div>
          <div class="card-toolbar">
            <span class="badge badge-light-info fs-7">{{ user.orders?.length || 0 }} 条</span>
          </div>
        </div>
        <div class="card-body pt-0">
          <table v-if="user.orders?.length" class="table align-middle table-row-dashed fs-6 gy-5">
            <thead>
              <tr class="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
                <th>订单号</th><th class="text-end">金额</th><th class="text-end">状态</th><th class="text-end">时间</th>
              </tr>
            </thead>
            <tbody class="fw-semibold text-gray-600">
              <tr v-for="order in user.orders" :key="order.id">
                <td>
                  <router-link :to="`/orders/${order.id}`" class="fw-bold text-gray-800 text-hover-primary">
                    {{ order.orderNo }}
                  </router-link>
                </td>
                <td class="text-end text-danger">¥{{ order.totalAmount }}</td>
                <td class="text-end">
                  <div :class="`badge badge-light-${orderStatusColor(order.status)}`">{{ orderStatusText(order.status) }}</div>
                </td>
                <td class="text-end">{{ new Date(order.createdAt).toLocaleString('zh-CN') }}</td>
              </tr>
            </tbody>
          </table>
          <p v-else class="text-muted py-5 mb-0 text-center">暂无订单</p>
        </div>
      </div>
      <!--end::最近订单-->
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/core/api'

const route = useRoute()
const router = useRouter()
const user = ref<any>(null)
const loading = ref(true)
const activeTab = ref('address')

const statusMap: Record<number, string> = { 0: '待付款', 1: '待发货', 2: '待收货', 3: '已完成', 4: '已取消', 5: '售后中' }
const statusColorMap: Record<number, string> = { 0: 'warning', 1: 'info', 2: 'primary', 3: 'success', 4: 'secondary', 5: 'danger' }

function orderStatusText(s: number) { return statusMap[s] || '未知' }
function orderStatusColor(s: number) { return statusColorMap[s] || 'secondary' }

async function loadUser() {
  loading.value = true
  try {
    const res: any = await api.get(`/admin/users/${route.params.id}`)
    user.value = res.data
  } catch {
    router.push('/users')
  } finally {
    loading.value = false
  }
}

async function toggleStatus(status: number) {
  const msg = status === 0 ? '确认禁用该用户？' : '确认启用该用户？'
  if (!confirm(msg)) return
  try {
    await api.put(`/admin/users/${route.params.id}/status`, { status })
    await loadUser()
  } catch {}
}

onMounted(() => loadUser())
</script>
