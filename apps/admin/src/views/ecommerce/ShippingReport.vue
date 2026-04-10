<template>
  <div>
    <!--begin::工具栏-->
    <div class="card card-flush mb-7">
      <div class="card-header align-items-center py-5 gap-2 gap-md-5">
        <div class="card-title">
          <h3 class="card-label fw-bold text-gray-900">物流报表</h3>
        </div>
        <div class="card-toolbar flex-row-fluid justify-content-end gap-5">
          <input
            v-model="startDate"
            type="date"
            class="form-control form-control-solid w-150px"
          />
          <input
            v-model="endDate"
            type="date"
            class="form-control form-control-solid w-150px"
          />
          <button class="btn btn-primary" @click="loadData">
            <KTIcon icon-name="magnifier" icon-class="fs-4 me-1" />查询
          </button>
        </div>
      </div>
    </div>

    <!--begin::配送时效统计-->
    <div class="row g-5 g-xl-10 mb-7">
      <div class="col-md-3">
        <div class="card card-flush h-100">
          <div class="card-header pt-5">
            <div class="card-title d-flex flex-column">
              <span class="fs-2hx fw-bold text-gray-900 me-2 lh-1 ls-n2">
                {{ deliveryStats.totalShipped }}
              </span>
              <span class="text-gray-500 pt-1 fw-semibold fs-6">已发货订单</span>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card card-flush h-100">
          <div class="card-header pt-5">
            <div class="card-title d-flex flex-column">
              <span class="fs-2hx fw-bold text-primary me-2 lh-1 ls-n2">
                {{ deliveryStats.avgDays.toFixed(1) }}
              </span>
              <span class="text-gray-500 pt-1 fw-semibold fs-6">平均配送天数</span>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card card-flush h-100">
          <div class="card-header pt-5">
            <div class="card-title d-flex flex-column">
              <span class="fs-2hx fw-bold text-success me-2 lh-1 ls-n2">
                {{ deliveryStats.minDays }}
              </span>
              <span class="text-gray-500 pt-1 fw-semibold fs-6">最快配送天数</span>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card card-flush h-100">
          <div class="card-header pt-5">
            <div class="card-title d-flex flex-column">
              <span class="fs-2hx fw-bold text-warning me-2 lh-1 ls-n2">
                {{ deliveryStats.maxDays }}
              </span>
              <span class="text-gray-500 pt-1 fw-semibold fs-6">最慢配送天数</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-5 g-xl-10 mb-7">
      <!--begin::订单状态分布饼图-->
      <div class="col-lg-6">
        <div class="card card-flush h-100">
          <div class="card-header pt-5">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold text-gray-900">订单状态分布</span>
            </h3>
          </div>
          <div class="card-body pt-5">
            <apexchart
              v-if="chartReady"
              type="donut"
              height="300"
              :options="statusChartOptions"
              :series="statusChartSeries"
            />
          </div>
        </div>
      </div>

      <!--begin::发货趋势-->
      <div class="col-lg-6">
        <div class="card card-flush h-100">
          <div class="card-header pt-5">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold text-gray-900">发货趋势</span>
            </h3>
          </div>
          <div class="card-body pt-5">
            <apexchart
              v-if="chartReady"
              type="bar"
              height="300"
              :options="trendChartOptions"
              :series="trendChartSeries"
            />
          </div>
        </div>
      </div>
    </div>

    <!--begin::状态明细表格-->
    <div class="card card-flush">
      <div class="card-header align-items-center py-5">
        <div class="card-title">
          <h3 class="card-label fw-bold text-gray-900">订单状态明细</h3>
        </div>
      </div>
      <div class="card-body pt-0">
        <table class="table align-middle table-row-dashed fs-6 gy-5">
          <thead>
            <tr class="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
              <th class="min-w-100px">状态</th>
              <th class="text-end min-w-100px">订单数量</th>
              <th class="text-end min-w-100px">占比</th>
            </tr>
          </thead>
          <tbody class="fw-semibold text-gray-600">
            <tr v-for="item in statusDistribution" :key="item.status">
              <td>
                <span :class="`badge badge-light-${statusColor(item.status)}`">
                  {{ item.label }}
                </span>
              </td>
              <td class="text-end pe-0">{{ item.count }}</td>
              <td class="text-end">{{ totalOrders ? ((item.count / totalOrders) * 100).toFixed(1) : 0 }}%</td>
            </tr>
            <tr v-if="!statusDistribution.length">
              <td colspan="3" class="text-center text-muted py-10">暂无数据</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getCSSVariableValue } from '@/assets/ts/_utils'
import api from '@/core/api'
import type { ApexOptions } from 'apexcharts'

const startDate = ref('')
const endDate = ref('')
const chartReady = ref(false)

const statusDistribution = ref<Array<{
  status: number
  label: string
  count: number
}>>([])

const deliveryStats = ref({
  avgDays: 0,
  minDays: 0,
  maxDays: 0,
  totalShipped: 0,
})

const shippingTrend = ref<Array<{ date: string; count: number }>>([])

const totalOrders = computed(() => statusDistribution.value.reduce((sum, s) => sum + s.count, 0))

function statusColor(status: number) {
  const map: Record<number, string> = {
    0: 'warning', 1: 'info', 2: 'primary', 3: 'success', 4: 'danger', 5: 'dark',
  }
  return map[status] || 'secondary'
}

function setDefaultDates() {
  const now = new Date()
  endDate.value = now.toISOString().slice(0, 10)
  now.setDate(now.getDate() - 30)
  startDate.value = now.toISOString().slice(0, 10)
}

async function loadData() {
  chartReady.value = false
  try {
    const params: Record<string, string> = {}
    if (startDate.value) params.startDate = startDate.value
    if (endDate.value) params.endDate = endDate.value
    const res: any = await api.get('/admin/reports/shipping', { params })
    statusDistribution.value = res.data.statusDistribution || []
    deliveryStats.value = res.data.deliveryStats || { avgDays: 0, minDays: 0, maxDays: 0, totalShipped: 0 }
    shippingTrend.value = res.data.shippingTrend || []
  } catch {
    statusDistribution.value = []
  }
  chartReady.value = true
}

// 状态分布饼图
const statusChartSeries = computed(() => statusDistribution.value.map(s => s.count))
const statusChartOptions = computed<ApexOptions>(() => ({
  chart: { fontFamily: 'inherit', type: 'donut' },
  labels: statusDistribution.value.map(s => s.label),
  colors: [
    getCSSVariableValue('--bs-warning'),
    getCSSVariableValue('--bs-info'),
    getCSSVariableValue('--bs-primary'),
    getCSSVariableValue('--bs-success'),
    getCSSVariableValue('--bs-danger'),
    getCSSVariableValue('--bs-dark'),
  ],
  legend: { position: 'bottom' },
  dataLabels: { enabled: true, formatter: (val: number) => `${val.toFixed(1)}%` },
  plotOptions: {
    pie: {
      donut: {
        size: '55%',
        labels: {
          show: true,
          total: { show: true, label: '总订单', formatter: () => String(totalOrders.value) },
        },
      },
    },
  },
}))

// 发货趋势柱状图
const trendChartSeries = computed(() => {
  const sorted = [...shippingTrend.value].sort((a, b) => a.date.localeCompare(b.date))
  return [{ name: '发货数', data: sorted.map(r => r.count) }]
})
const trendChartOptions = computed<ApexOptions>(() => {
  const sorted = [...shippingTrend.value].sort((a, b) => a.date.localeCompare(b.date))
  const primaryColor = getCSSVariableValue('--bs-primary')
  const labelColor = getCSSVariableValue('--bs-gray-500')
  const borderColor = getCSSVariableValue('--bs-border-dashed-color')
  return {
    chart: { fontFamily: 'inherit', type: 'bar', height: 300, toolbar: { show: false } },
    xaxis: {
      categories: sorted.map(r => r.date),
      labels: { style: { colors: labelColor, fontSize: '12px' }, rotate: -45 },
      axisBorder: { show: false },
    },
    yaxis: { labels: { style: { colors: labelColor, fontSize: '12px' } } },
    colors: [primaryColor],
    grid: { borderColor, strokeDashArray: 4 },
    plotOptions: { bar: { borderRadius: 4, columnWidth: '60%' } },
    dataLabels: { enabled: false },
  }
})

onMounted(() => {
  setDefaultDates()
  loadData()
})
</script>
