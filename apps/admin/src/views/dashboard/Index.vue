<template>
  <div>
    <!--begin::Row - 顶部统计卡片-->
    <div class="row gx-5 gx-xl-10 mb-5 mb-xl-10">
      <!--begin::Col - 今日销售额 + 本月订单-->
      <div class="col-md-6 col-lg-6 col-xl-6 col-xxl-3 mb-md-5 mb-xl-10">
        <!--begin::今日销售额-->
        <div class="card card-flush h-md-50 mb-5 mb-xl-10">
          <div class="card-header pt-5">
            <div class="card-title d-flex flex-column">
              <div class="d-flex align-items-center">
                <span class="fs-4 fw-semibold text-gray-500 me-1 align-self-start">¥</span>
                <span class="fs-2hx fw-bold text-gray-900 me-2 lh-1 ls-n2">
                  {{ formatNumber(stats.todayRevenue) }}
                </span>
              </div>
              <span class="text-gray-500 pt-1 fw-semibold fs-6">今日销售额</span>
            </div>
          </div>
          <div class="card-body pt-2 pb-4 d-flex align-items-center">
            <div class="d-flex flex-column content-justify-center w-100">
              <div class="d-flex fs-6 fw-semibold align-items-center">
                <div class="bullet w-8px h-6px rounded-2 bg-success me-3"></div>
                <div class="text-gray-500 flex-grow-1 me-4">已完成</div>
                <div class="fw-bolder text-gray-700 text-xxl-end">
                  {{ stats.orderStatusCounts?.completed || 0 }} 单
                </div>
              </div>
              <div class="d-flex fs-6 fw-semibold align-items-center my-3">
                <div class="bullet w-8px h-6px rounded-2 bg-primary me-3"></div>
                <div class="text-gray-500 flex-grow-1 me-4">待发货</div>
                <div class="fw-bolder text-gray-700 text-xxl-end">
                  {{ stats.orderStatusCounts?.pending || 0 }} 单
                </div>
              </div>
              <div class="d-flex fs-6 fw-semibold align-items-center">
                <div class="bullet w-8px h-6px rounded-2 bg-warning me-3"></div>
                <div class="text-gray-500 flex-grow-1 me-4">待付款</div>
                <div class="fw-bolder text-gray-700 text-xxl-end">
                  {{ stats.orderStatusCounts?.unpaid || 0 }} 单
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--end::今日销售额-->

        <!--begin::本月订单-->
        <div class="card card-flush h-md-50 mb-xl-10">
          <div class="card-header pt-5">
            <div class="card-title d-flex flex-column">
              <div class="d-flex align-items-center">
                <span class="fs-2hx fw-bold text-gray-900 me-2 lh-1 ls-n2">
                  {{ stats.orderCount.toLocaleString() }}
                </span>
                <span class="badge badge-light-success fs-base" v-if="stats.todayOrderCount > 0">
                  <KTIcon icon-name="arrow-up" icon-class="fs-5 text-success ms-n1" />
                  +{{ stats.todayOrderCount }}
                </span>
              </div>
              <span class="text-gray-500 pt-1 fw-semibold fs-6">累计总订单</span>
            </div>
          </div>
          <div class="card-body d-flex align-items-end pt-0">
            <div class="d-flex align-items-center flex-column mt-3 w-100">
              <div class="d-flex justify-content-between w-100 mt-auto mb-2">
                <span class="fw-bolder fs-6 text-gray-900">今日 {{ stats.todayOrderCount }} 单</span>
                <span class="fw-bold fs-6 text-gray-500">
                  {{ stats.orderCount > 0 ? Math.round((stats.todayOrderCount / stats.orderCount) * 100) : 0 }}%
                </span>
              </div>
              <div class="h-8px mx-3 w-100 bg-light-success rounded">
                <div
                  class="bg-success rounded h-8px"
                  role="progressbar"
                  :style="{ width: (stats.orderCount > 0 ? Math.min((stats.todayOrderCount / stats.orderCount) * 100, 100) : 0) + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
        <!--end::本月订单-->
      </div>
      <!--end::Col-->

      <!--begin::Col - 今日数据 + 新用户-->
      <div class="col-md-6 col-lg-6 col-xl-6 col-xxl-3 mb-md-5 mb-xl-10">
        <!--begin::今日订单-->
        <div class="card card-flush h-md-50 mb-5 mb-xl-10">
          <div class="card-header pt-5">
            <div class="card-title d-flex flex-column">
              <div class="d-flex align-items-center">
                <span class="fs-2hx fw-bold text-gray-900 me-2 lh-1 ls-n2">
                  {{ stats.todayOrderCount }}
                </span>
                <span class="badge badge-light-primary fs-base">
                  <KTIcon icon-name="handcart" icon-class="fs-5 text-primary ms-n1" />
                  今日
                </span>
              </div>
              <span class="text-gray-500 pt-1 fw-semibold fs-6">今日新订单</span>
            </div>
          </div>
          <div class="card-body d-flex align-items-end px-0 pb-0">
            <apexchart
              v-if="todayChartReady"
              class="w-100"
              type="area"
              :options="todayOrderChartOptions"
              :series="todayOrderSeries"
              height="80"
            />
          </div>
        </div>
        <!--end::今日订单-->

        <!--begin::新用户-->
        <div class="card card-flush h-md-50 mb-xl-10">
          <div class="card-header pt-5">
            <div class="card-title d-flex flex-column">
              <span class="fs-2hx fw-bold text-gray-900 me-2 lh-1 ls-n2">
                {{ stats.userCount.toLocaleString() }}
              </span>
              <span class="text-gray-500 pt-1 fw-semibold fs-6">注册用户总数</span>
            </div>
          </div>
          <div class="card-body d-flex flex-column justify-content-end pe-0">
            <span class="fs-6 fw-bolder text-gray-800 d-block mb-2">今日新增</span>
            <div class="d-flex align-items-center">
              <span class="fs-2 fw-bold text-success me-3">+{{ stats.todayUserCount }}</span>
              <span class="badge badge-light-info fs-7">
                <KTIcon icon-name="people" icon-class="fs-6 text-info me-1" />
                活跃用户
              </span>
            </div>
          </div>
        </div>
        <!--end::新用户-->
      </div>
      <!--end::Col-->

      <!--begin::Col - 销售趋势图-->
      <div class="col-lg-12 col-xl-12 col-xxl-6 mb-5 mb-xl-0">
        <div class="card card-flush overflow-hidden h-md-100">
          <div class="card-header py-5">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold text-gray-900">平台数据概览</span>
              <span class="text-gray-500 mt-1 fw-semibold fs-6">商品与订单统计</span>
            </h3>
          </div>
          <div class="card-body d-flex justify-content-between flex-column pb-1 px-0">
            <!--begin::统计行-->
            <div class="px-9 mb-5">
              <div class="d-flex mb-2">
                <span class="fs-4 fw-semibold text-gray-500 me-1 align-self-start">¥</span>
                <span class="fs-2x fw-bold text-gray-800 me-2 lh-1 ls-n2">
                  {{ formatNumber(stats.todayRevenue) }}
                </span>
              </div>
              <span class="fs-6 fw-semibold text-gray-500">今日销售总额</span>
            </div>
            <!--end::统计行-->
            <!--begin::汇总指标-->
            <div class="px-9 mb-5">
              <div class="row g-3">
                <div class="col-4">
                  <div class="d-flex align-items-center">
                    <div class="symbol symbol-40px me-3">
                      <div class="symbol-label bg-light-primary">
                        <KTIcon icon-name="package" icon-class="fs-2 text-primary" />
                      </div>
                    </div>
                    <div>
                      <div class="fs-4 fw-bold text-gray-900">{{ stats.productCount }}</div>
                      <div class="fs-7 text-gray-500">上架商品</div>
                    </div>
                  </div>
                </div>
                <div class="col-4">
                  <div class="d-flex align-items-center">
                    <div class="symbol symbol-40px me-3">
                      <div class="symbol-label bg-light-success">
                        <KTIcon icon-name="basket" icon-class="fs-2 text-success" />
                      </div>
                    </div>
                    <div>
                      <div class="fs-4 fw-bold text-gray-900">{{ stats.orderCount }}</div>
                      <div class="fs-7 text-gray-500">累计订单</div>
                    </div>
                  </div>
                </div>
                <div class="col-4">
                  <div class="d-flex align-items-center">
                    <div class="symbol symbol-40px me-3">
                      <div class="symbol-label bg-light-warning">
                        <KTIcon icon-name="people" icon-class="fs-2 text-warning" />
                      </div>
                    </div>
                    <div>
                      <div class="fs-4 fw-bold text-gray-900">{{ stats.userCount }}</div>
                      <div class="fs-7 text-gray-500">注册用户</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!--end::汇总指标-->
          </div>
        </div>
      </div>
      <!--end::Col-->
    </div>
    <!--end::Row-->

    <!--begin::Row - 最近订单-->
    <div class="card card-flush">
      <div class="card-header align-items-center py-5 gap-2 gap-md-5">
        <h3 class="card-title align-items-start flex-column">
          <span class="card-label fw-bold text-gray-900">最近订单</span>
          <span class="text-gray-500 mt-1 fw-semibold fs-6">最新 {{ stats.recentOrders.length }} 条订单</span>
        </h3>
        <div class="card-toolbar">
          <router-link to="/orders" class="btn btn-sm btn-light-primary">
            <KTIcon icon-name="arrow-right" icon-class="fs-4 me-1" />
            查看全部
          </router-link>
        </div>
      </div>
      <div class="card-body pt-0">
        <table class="table align-middle table-row-dashed fs-6 gy-5">
          <thead>
            <tr class="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
              <th class="min-w-100px">订单号</th>
              <th class="min-w-100px">买家</th>
              <th class="min-w-70px">金额</th>
              <th class="min-w-70px">状态</th>
              <th class="min-w-100px text-end">下单时间</th>
            </tr>
          </thead>
          <tbody class="fw-semibold text-gray-600">
            <tr v-if="!stats.recentOrders.length">
              <td colspan="5" class="text-center text-gray-500 py-10">暂无订单数据</td>
            </tr>
            <tr v-for="order in stats.recentOrders" :key="order.id">
              <td>
                <span class="text-gray-800 fw-bold text-hover-primary">{{ order.orderNo }}</span>
              </td>
              <td>{{ order.user?.nickname || order.user?.phone || '-' }}</td>
              <td class="fw-bold text-danger">¥{{ order.totalAmount }}</td>
              <td>
                <span class="badge" :class="orderBadgeClass(order.status)">
                  {{ orderStatusText(order.status) }}
                </span>
              </td>
              <td class="text-end">
                {{ new Date(order.createdAt).toLocaleString('zh-CN') }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!--end::Row-->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getCSSVariableValue } from '@/assets/ts/_utils'
import api from '@/core/api'
import type { ApexOptions } from 'apexcharts'

const todayChartReady = ref(false)

const stats = ref({
  userCount: 0,
  productCount: 0,
  orderCount: 0,
  todayOrderCount: 0,
  todayUserCount: 0,
  todayRevenue: 0,
  recentOrders: [] as any[],
  orderStatusCounts: { unpaid: 0, pending: 0, completed: 0 } as any,
})

function formatNumber(num: number): string {
  if (num >= 10000) return (num / 10000).toFixed(1) + '万'
  return num.toFixed(2)
}

const statusMap: Record<number, string> = {
  0: '待付款', 1: '待发货', 2: '待收货', 3: '已完成', 4: '已取消', 5: '售后中',
}

const badgeClassMap: Record<number, string> = {
  0: 'badge-light-warning',
  1: 'badge-light-info',
  2: 'badge-light-primary',
  3: 'badge-light-success',
  4: 'badge-light-secondary',
  5: 'badge-light-danger',
}

function orderStatusText(s: number) { return statusMap[s] || '未知' }
function orderBadgeClass(s: number) { return badgeClassMap[s] || 'badge-light-secondary' }

// 今日订单迷你面积图
const todayOrderSeries = computed(() => [
  { name: '订单', data: [0, stats.value.todayOrderCount, 0] },
])

const todayOrderChartOptions = computed<ApexOptions>(() => ({
  chart: { fontFamily: 'inherit', type: 'area', height: 80, toolbar: { show: false }, sparkline: { enabled: true } },
  stroke: { curve: 'smooth', width: 2, colors: [getCSSVariableValue('--bs-primary')] },
  fill: {
    type: 'gradient',
    gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0, stops: [0, 80, 100] },
  },
  colors: [getCSSVariableValue('--bs-primary')],
  xaxis: { labels: { show: false }, axisBorder: { show: false }, axisTicks: { show: false } },
  yaxis: { labels: { show: false } },
  tooltip: { enabled: false },
  grid: { show: false },
}))

onMounted(async () => {
  try {
    const res: any = await api.get('/admin/stats')
    stats.value = {
      ...stats.value,
      ...res.data,
      orderStatusCounts: res.data.orderStatusCounts || { unpaid: 0, pending: 0, completed: 0 },
    }
  } catch {
    // 静默处理
  }
  todayChartReady.value = true
})
</script>
