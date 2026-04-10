<template>
  <div>
    <!--begin::工具栏-->
    <div class="card card-flush mb-7">
      <div class="card-header align-items-center py-5 gap-2 gap-md-5">
        <div class="card-title">
          <h3 class="card-label fw-bold text-gray-900">销售报表</h3>
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
          <select v-model="groupBy" class="form-select form-select-solid w-150px">
            <option value="day">按天</option>
            <option value="week">按周</option>
            <option value="month">按月</option>
          </select>
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
              <span class="fs-2hx fw-bold text-gray-900 me-2 lh-1 ls-n2">{{ summary.totalOrders }}</span>
              <span class="text-gray-500 pt-1 fw-semibold fs-6">总订单数</span>
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
                <span class="fs-2hx fw-bold text-gray-900 me-2 lh-1 ls-n2">{{ formatMoney(summary.totalAmount) }}</span>
              </div>
              <span class="text-gray-500 pt-1 fw-semibold fs-6">订单总金额</span>
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
                <span class="fs-2hx fw-bold text-gray-900 me-2 lh-1 ls-n2">{{ formatMoney(summary.totalPayAmount) }}</span>
              </div>
              <span class="text-gray-500 pt-1 fw-semibold fs-6">实际支付金额</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--begin::销售趋势图-->
    <div class="card card-flush mb-7">
      <div class="card-header pt-5">
        <h3 class="card-title align-items-start flex-column">
          <span class="card-label fw-bold text-gray-900">销售趋势</span>
          <span class="text-gray-500 mt-1 fw-semibold fs-6">按{{ groupByLabel }}统计</span>
        </h3>
      </div>
      <div class="card-body pt-5">
        <apexchart
          v-if="chartReady"
          type="area"
          height="350"
          :options="chartOptions"
          :series="chartSeries"
        />
        <div v-else class="d-flex justify-content-center py-10">
          <span class="spinner-border text-primary"></span>
        </div>
      </div>
    </div>

    <!--begin::销售数据表格-->
    <div class="card card-flush">
      <div class="card-header align-items-center py-5 gap-2 gap-md-5">
        <div class="card-title">
          <h3 class="card-label fw-bold text-gray-900">销售明细</h3>
        </div>
      </div>
      <div class="card-body pt-0">
        <table class="table align-middle table-row-dashed fs-6 gy-5">
          <thead>
            <tr class="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
              <th class="min-w-100px">日期</th>
              <th class="text-end min-w-75px">订单数</th>
              <th class="text-end min-w-75px">商品数</th>
              <th class="text-end min-w-100px">订单金额</th>
              <th class="text-end min-w-100px">支付金额</th>
            </tr>
          </thead>
          <tbody class="fw-semibold text-gray-600">
            <tr v-for="row in list" :key="row.date">
              <td>{{ row.date }}</td>
              <td class="text-end pe-0">{{ row.orderCount }}</td>
              <td class="text-end pe-0">{{ row.productCount }}</td>
              <td class="text-end pe-0">¥{{ formatMoney(row.totalAmount) }}</td>
              <td class="text-end">¥{{ formatMoney(row.payAmount) }}</td>
            </tr>
            <tr v-if="!list.length">
              <td colspan="5" class="text-center text-muted py-10">暂无数据</td>
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
const groupBy = ref<'day' | 'week' | 'month'>('day')
const loading = ref(false)
const chartReady = ref(false)

const list = ref<Array<{
  date: string
  orderCount: number
  productCount: number
  totalAmount: number
  payAmount: number
}>>([])

const summary = ref({ totalOrders: 0, totalAmount: 0, totalPayAmount: 0 })

const groupByLabel = computed(() => {
  const map = { day: '天', week: '周', month: '月' }
  return map[groupBy.value]
})

function formatMoney(n: number) {
  return n.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function setDefaultDates() {
  const now = new Date()
  endDate.value = now.toISOString().slice(0, 10)
  now.setDate(now.getDate() - 30)
  startDate.value = now.toISOString().slice(0, 10)
}

async function loadData() {
  loading.value = true
  chartReady.value = false
  try {
    const params: Record<string, string> = { groupBy: groupBy.value }
    if (startDate.value) params.startDate = startDate.value
    if (endDate.value) params.endDate = endDate.value
    const res: any = await api.get('/admin/reports/sales', { params })
    list.value = res.data.list || []
    summary.value = res.data.summary || { totalOrders: 0, totalAmount: 0, totalPayAmount: 0 }
  } catch {
    list.value = []
  }
  loading.value = false
  chartReady.value = true
}

const chartSeries = computed(() => {
  const sorted = [...list.value].sort((a, b) => a.date.localeCompare(b.date))
  return [
    { name: '支付金额', data: sorted.map(r => r.payAmount) },
    { name: '订单数', data: sorted.map(r => r.orderCount) },
  ]
})

const chartOptions = computed<ApexOptions>(() => {
  const sorted = [...list.value].sort((a, b) => a.date.localeCompare(b.date))
  const primaryColor = getCSSVariableValue('--bs-primary')
  const successColor = getCSSVariableValue('--bs-success')
  const labelColor = getCSSVariableValue('--bs-gray-500')
  const borderColor = getCSSVariableValue('--bs-border-dashed-color')

  return {
    chart: { fontFamily: 'inherit', type: 'area', height: 350, toolbar: { show: false } },
    xaxis: {
      categories: sorted.map(r => r.date),
      labels: { style: { colors: labelColor, fontSize: '12px' } },
      axisBorder: { show: false },
    },
    yaxis: [
      { title: { text: '金额 (¥)' }, labels: { style: { colors: labelColor, fontSize: '12px' } } },
      { opposite: true, title: { text: '订单数' }, labels: { style: { colors: labelColor, fontSize: '12px' } } },
    ],
    stroke: { curve: 'smooth', width: [2, 2] },
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0.05, stops: [0, 90, 100] },
    },
    colors: [primaryColor, successColor],
    grid: { borderColor, strokeDashArray: 4 },
    tooltip: {
      y: {
        formatter: (val: number, opts: any) => {
          return opts.seriesIndex === 0 ? `¥${val.toFixed(2)}` : `${val} 单`
        },
      },
    },
    legend: { position: 'top' },
  }
})

onMounted(() => {
  setDefaultDates()
  loadData()
})
</script>
