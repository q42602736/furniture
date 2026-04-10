<template>
  <div>
    <!--begin::工具栏-->
    <div class="card card-flush mb-7">
      <div class="card-header align-items-center py-5 gap-2 gap-md-5">
        <div class="card-title">
          <h3 class="card-label fw-bold text-gray-900">退货/售后报表</h3>
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

    <!--begin::汇总统计-->
    <div class="row g-5 g-xl-10 mb-7">
      <div class="col-md-4">
        <div class="card card-flush h-100">
          <div class="card-header pt-5">
            <div class="card-title d-flex flex-column">
              <span class="fs-2hx fw-bold text-gray-900 me-2 lh-1 ls-n2">{{ summary.totalCount }}</span>
              <span class="text-gray-500 pt-1 fw-semibold fs-6">退款申请总数</span>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card card-flush h-100">
          <div class="card-header pt-5">
            <div class="card-title d-flex flex-column">
              <div class="d-flex align-items-center">
                <span class="fs-4 fw-semibold text-gray-500 me-1 align-self-start">¥</span>
                <span class="fs-2hx fw-bold text-danger me-2 lh-1 ls-n2">{{ formatMoney(summary.totalAmount) }}</span>
              </div>
              <span class="text-gray-500 pt-1 fw-semibold fs-6">退款总金额</span>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card card-flush h-100">
          <div class="card-header pt-5">
            <div class="card-title d-flex flex-column">
              <span class="fs-2hx fw-bold text-warning me-2 lh-1 ls-n2">
                {{ pendingCount }}
              </span>
              <span class="text-gray-500 pt-1 fw-semibold fs-6">待处理退款</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-5 g-xl-10 mb-7">
      <!--begin::退款状态分布-->
      <div class="col-lg-6">
        <div class="card card-flush h-100">
          <div class="card-header pt-5">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold text-gray-900">退款状态分布</span>
            </h3>
          </div>
          <div class="card-body pt-5">
            <apexchart
              v-if="chartReady"
              type="pie"
              height="300"
              :options="statusChartOptions"
              :series="statusChartSeries"
            />
          </div>
        </div>
      </div>

      <!--begin::退款趋势-->
      <div class="col-lg-6">
        <div class="card card-flush h-100">
          <div class="card-header pt-5">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold text-gray-900">退款趋势</span>
            </h3>
          </div>
          <div class="card-body pt-5">
            <apexchart
              v-if="chartReady"
              type="area"
              height="300"
              :options="trendChartOptions"
              :series="trendChartSeries"
            />
          </div>
        </div>
      </div>
    </div>

    <!--begin::退款状态明细-->
    <div class="card card-flush mb-7">
      <div class="card-header align-items-center py-5">
        <div class="card-title">
          <h3 class="card-label fw-bold text-gray-900">退款状态明细</h3>
        </div>
      </div>
      <div class="card-body pt-0">
        <table class="table align-middle table-row-dashed fs-6 gy-5">
          <thead>
            <tr class="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
              <th class="min-w-100px">状态</th>
              <th class="text-end min-w-75px">数量</th>
              <th class="text-end min-w-100px">金额</th>
            </tr>
          </thead>
          <tbody class="fw-semibold text-gray-600">
            <tr v-for="item in statusDistribution" :key="item.status">
              <td>
                <span :class="`badge badge-light-${refundStatusColor(item.status)}`">{{ item.label }}</span>
              </td>
              <td class="text-end pe-0">{{ item.count }}</td>
              <td class="text-end">¥{{ formatMoney(item.amount) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!--begin::近期退款列表-->
    <div class="card card-flush">
      <div class="card-header align-items-center py-5">
        <div class="card-title">
          <h3 class="card-label fw-bold text-gray-900">近期退款记录</h3>
        </div>
      </div>
      <div class="card-body pt-0">
        <table class="table align-middle table-row-dashed fs-6 gy-5">
          <thead>
            <tr class="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
              <th class="min-w-100px">订单号</th>
              <th class="min-w-100px">客户</th>
              <th class="min-w-150px">退款原因</th>
              <th class="text-end min-w-75px">退款金额</th>
              <th class="min-w-80px">状态</th>
              <th class="min-w-100px">申请时间</th>
            </tr>
          </thead>
          <tbody class="fw-semibold text-gray-600">
            <tr v-for="r in recentRefunds" :key="r.id">
              <td>
                <router-link
                  :to="`/orders/${r.orderId}`"
                  class="text-gray-900 text-hover-primary"
                >{{ r.order?.orderNo || '-' }}</router-link>
              </td>
              <td>{{ r.order?.user?.nickname || '-' }}</td>
              <td>
                <span class="text-gray-600 text-truncate d-inline-block" style="max-width: 200px;">
                  {{ r.reason }}
                </span>
              </td>
              <td class="text-end pe-0">¥{{ formatMoney(Number(r.amount)) }}</td>
              <td>
                <span :class="`badge badge-light-${refundStatusColor(r.status)}`">
                  {{ refundStatusLabel(r.status) }}
                </span>
              </td>
              <td>{{ formatDate(r.createdAt) }}</td>
            </tr>
            <tr v-if="!recentRefunds.length">
              <td colspan="6" class="text-center text-muted py-10">暂无退款记录</td>
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

const summary = ref({ totalCount: 0, totalAmount: 0 })
const statusDistribution = ref<Array<{
  status: number
  label: string
  count: number
  amount: number
}>>([])
const trend = ref<Array<{ date: string; count: number; amount: number }>>([])
const recentRefunds = ref<any[]>([])

const pendingCount = computed(() => {
  const pending = statusDistribution.value.find(s => s.status === 0)
  return pending?.count || 0
})

function formatMoney(n: number) {
  return n.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatDate(d: string) {
  if (!d) return ''
  return new Date(d).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

function refundStatusColor(status: number) {
  const map: Record<number, string> = { 0: 'warning', 1: 'info', 2: 'danger', 3: 'success' }
  return map[status] || 'secondary'
}

function refundStatusLabel(status: number) {
  const map: Record<number, string> = { 0: '申请中', 1: '已同意', 2: '已拒绝', 3: '已退款' }
  return map[status] || `状态${status}`
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
    const res: any = await api.get('/admin/reports/returns', { params })
    summary.value = res.data.summary || { totalCount: 0, totalAmount: 0 }
    statusDistribution.value = res.data.statusDistribution || []
    trend.value = res.data.trend || []
    recentRefunds.value = res.data.recentRefunds || []
  } catch {
    statusDistribution.value = []
    recentRefunds.value = []
  }
  chartReady.value = true
}

// 状态分布饼图
const statusChartSeries = computed(() => statusDistribution.value.map(s => s.count))
const statusChartOptions = computed<ApexOptions>(() => ({
  chart: { fontFamily: 'inherit', type: 'pie' },
  labels: statusDistribution.value.map(s => s.label),
  colors: [
    getCSSVariableValue('--bs-warning'),
    getCSSVariableValue('--bs-info'),
    getCSSVariableValue('--bs-danger'),
    getCSSVariableValue('--bs-success'),
  ],
  legend: { position: 'bottom' },
  dataLabels: { enabled: true },
}))

// 退款趋势
const trendChartSeries = computed(() => {
  const sorted = [...trend.value].sort((a, b) => a.date.localeCompare(b.date))
  return [
    { name: '退款金额', data: sorted.map(r => r.amount) },
    { name: '退款笔数', data: sorted.map(r => r.count) },
  ]
})
const trendChartOptions = computed<ApexOptions>(() => {
  const sorted = [...trend.value].sort((a, b) => a.date.localeCompare(b.date))
  const dangerColor = getCSSVariableValue('--bs-danger')
  const warningColor = getCSSVariableValue('--bs-warning')
  const labelColor = getCSSVariableValue('--bs-gray-500')
  const borderColor = getCSSVariableValue('--bs-border-dashed-color')
  return {
    chart: { fontFamily: 'inherit', type: 'area', height: 300, toolbar: { show: false } },
    xaxis: {
      categories: sorted.map(r => r.date),
      labels: { style: { colors: labelColor, fontSize: '12px' }, rotate: -45 },
      axisBorder: { show: false },
    },
    yaxis: [
      { title: { text: '金额 (¥)' }, labels: { style: { colors: labelColor, fontSize: '12px' } } },
      { opposite: true, title: { text: '笔数' }, labels: { style: { colors: labelColor, fontSize: '12px' } } },
    ],
    stroke: { curve: 'smooth', width: [2, 2] },
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0.05, stops: [0, 90, 100] },
    },
    colors: [dangerColor, warningColor],
    grid: { borderColor, strokeDashArray: 4 },
    legend: { position: 'top' },
  }
})

onMounted(() => {
  setDefaultDates()
  loadData()
})
</script>
