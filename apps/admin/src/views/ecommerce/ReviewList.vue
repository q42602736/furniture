<template>
  <div>
    <!--begin::评价管理卡片-->
    <div class="card card-flush">
      <!--begin::卡片头部-->
      <div class="card-header align-items-center py-5 gap-2 gap-md-5">
        <div class="card-title">
          <KTIcon icon-name="message-text-2" icon-class="fs-2 text-gray-500 me-2" />
          <span class="fw-bold text-gray-800">评价管理</span>
        </div>
        <div class="card-toolbar">
          <div class="d-flex align-items-center position-relative">
            <KTIcon icon-name="magnifier" icon-class="fs-3 position-absolute ms-4" />
            <input
              v-model="filterKeyword"
              type="text"
              class="form-control form-control-solid form-control-sm w-250px ps-12"
              placeholder="搜索商品名称"
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
              <th class="min-w-150px">商品</th>
              <th class="min-w-100px">用户</th>
              <th class="min-w-60px">评分</th>
              <th class="min-w-200px">评价内容</th>
              <th class="min-w-80px">图片</th>
              <th class="text-end min-w-120px">评价时间</th>
              <th class="text-end min-w-80px">操作</th>
            </tr>
          </thead>
          <tbody class="fw-semibold text-gray-600">
            <tr v-if="loading">
              <td colspan="8" class="text-center py-8">
                <span class="spinner-border spinner-border-sm align-middle me-2"></span>
                加载中...
              </td>
            </tr>
            <tr v-else-if="!list.length">
              <td colspan="8" class="text-center text-muted py-8">暂无评价数据</td>
            </tr>
            <tr v-for="item in list" :key="item.id">
              <td class="text-gray-600">{{ item.id }}</td>
              <td>
                <div class="d-flex align-items-center">
                  <div class="symbol symbol-40px me-3">
                    <img v-if="item.product?.mainImage" :src="item.product.mainImage" class="object-fit-cover" alt="" @error="onImgError" />
                    <span v-else class="symbol-label bg-light-primary text-primary fw-bold">
                      {{ item.product?.name?.charAt(0) || '?' }}
                    </span>
                  </div>
                  <span class="text-gray-800 fw-bold text-truncate" style="max-width:150px">
                    {{ item.product?.name || '-' }}
                  </span>
                </div>
              </td>
              <td>{{ item.user?.nickname || item.user?.phone || '-' }}</td>
              <td>
                <span v-for="s in 5" :key="s" :class="s <= item.rating ? 'text-warning' : 'text-gray-300'">
                  ★
                </span>
              </td>
              <td>
                <span class="text-gray-800 d-block text-truncate" style="max-width:250px" :title="item.content">
                  {{ item.content || '无文字评价' }}
                </span>
              </td>
              <td>
                <template v-if="parseImages(item.images).length">
                  <div class="d-flex gap-1">
                    <img
                      v-for="(img, idx) in parseImages(item.images).slice(0, 3)"
                      :key="idx"
                      :src="img"
                      class="rounded"
                      style="width:32px;height:32px;object-fit:cover"
                      @error="onImgError"
                    />
                    <span v-if="parseImages(item.images).length > 3" class="badge badge-light align-self-center">
                      +{{ parseImages(item.images).length - 3 }}
                    </span>
                  </div>
                </template>
                <span v-else class="text-muted">-</span>
              </td>
              <td class="text-end text-gray-600 fs-7">{{ formatDate(item.createdAt) }}</td>
              <td class="text-end">
                <button class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm" @click="handleDelete(item.id)" title="删除">
                  <KTIcon icon-name="trash" icon-class="fs-5" />
                </button>
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
    <!--end::评价管理卡片-->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '@/core/api'

const list = ref<any[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = 10
const loading = ref(false)
const filterKeyword = ref('')

function onImgError(e: Event) {
  const el = e.target as HTMLImageElement
  el.style.display = 'none'
}

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

function formatDate(d: string) {
  return d ? new Date(d).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : '-'
}

function parseImages(images: string | null): string[] {
  if (!images) return []
  try { return JSON.parse(images) } catch { return [] }
}

async function loadData(p = 1) {
  page.value = p
  loading.value = true
  const params: any = { page: p, pageSize }
  // 搜索商品名称需后端支持，此处先使用前端筛选不传 keyword
  try {
    const res: any = await api.get('/admin/reviews', { params })
    list.value = res.data.list
    total.value = res.data.total
  } catch {} finally {
    loading.value = false
  }
}

async function handleDelete(id: number) {
  if (!confirm('确认删除该评价？删除后不可恢复。')) return
  try {
    await api.delete(`/admin/reviews/${id}`)
    await loadData(page.value)
  } catch {}
}

onMounted(() => loadData())
</script>
