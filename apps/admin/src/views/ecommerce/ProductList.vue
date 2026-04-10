<template>
  <div>
    <!--begin::商品列表卡片-->
    <div class="card card-flush">
      <!--begin::卡片头部-->
      <div class="card-header align-items-center py-5 gap-2 gap-md-5">
        <!--begin::搜索-->
        <div class="card-title">
          <div class="d-flex align-items-center position-relative my-1">
            <KTIcon icon-name="magnifier" icon-class="fs-3 position-absolute ms-4" />
            <input
              v-model="filters.keyword"
              type="text"
              class="form-control form-control-solid w-250px ps-12"
              placeholder="搜索商品名称"
              @keyup.enter="loadData(1)"
            />
          </div>
        </div>
        <!--end::搜索-->
        <!--begin::工具栏-->
        <div class="card-toolbar flex-row-fluid justify-content-end gap-5">
          <div class="w-100 mw-150px">
            <select
              v-model="filters.status"
              class="form-select form-select-solid"
              @change="loadData(1)"
            >
              <option value="">全部状态</option>
              <option value="1">上架</option>
              <option value="0">下架</option>
            </select>
          </div>
          <router-link to="/products/add" class="btn btn-primary">
            <KTIcon icon-name="plus" icon-class="fs-2" />
            新增商品
          </router-link>
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
              <th class="min-w-200px">商品</th>
              <th class="min-w-100px">分类</th>
              <th class="min-w-100px">商家</th>
              <th class="text-end min-w-80px">价格</th>
              <th class="text-end min-w-70px">库存</th>
              <th class="text-end min-w-80px">状态</th>
              <th class="text-end min-w-120px">操作</th>
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
              <td colspan="7" class="text-center text-muted py-8">暂无商品数据</td>
            </tr>
            <tr v-for="item in list" :key="item.id">
              <!--begin::商品信息-->
              <td>
                <div class="d-flex align-items-center">
                  <a class="symbol symbol-50px" href="javascript:;">
                    <span
                      v-if="item.images?.[0]"
                      class="symbol-label"
                      :style="{ backgroundImage: `url(${item.images[0].url})` }"
                    ></span>
                    <span v-else class="symbol-label bg-light">
                      <KTIcon icon-name="picture" icon-class="fs-2 text-muted" />
                    </span>
                  </a>
                  <div class="ms-5">
                    <span class="text-gray-800 text-hover-primary fs-5 fw-bold">{{ item.name }}</span>
                    <div class="fs-7 text-muted">ID: {{ item.id }}</div>
                  </div>
                </div>
              </td>
              <!--end::商品信息-->
              <td>{{ item.category?.name || '-' }}</td>
              <td>{{ item.merchant?.name || '-' }}</td>
              <td class="text-end pe-0">
                <span class="fw-bold text-danger">¥{{ item.price }}</span>
              </td>
              <td class="text-end pe-0">
                <span v-if="item.stock <= 10" class="badge badge-light-warning">低库存</span>
                <span class="fw-bold ms-2" :class="item.stock <= 10 ? 'text-warning' : ''">{{ item.stock }}</span>
              </td>
              <td class="text-end pe-0">
                <div
                  :class="`badge badge-light-${item.status === 1 ? 'success' : 'danger'}`"
                >
                  {{ item.status === 1 ? '上架' : '下架' }}
                </div>
              </td>
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
                    <router-link :to="`/products/${item.id}/edit`" class="menu-link px-3">编辑</router-link>
                  </div>
                  <div class="menu-item px-3">
                    <router-link :to="`/products/${item.id}/edit`" class="menu-link px-3">图片管理</router-link>
                  </div>
                  <div class="menu-item px-3">
                    <a
                      v-if="item.status === 1"
                      href="javascript:;"
                      class="menu-link px-3 text-warning"
                      @click="toggleStatus(item.id, 0)"
                    >下架</a>
                    <a
                      v-else
                      href="javascript:;"
                      class="menu-link px-3 text-success"
                      @click="toggleStatus(item.id, 1)"
                    >上架</a>
                  </div>
                  <div class="menu-item px-3">
                    <a href="javascript:;" class="menu-link px-3 text-danger" @click="handleDelete(item.id)">删除</a>
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
    <!--end::商品列表卡片-->
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import api from '@/core/api'

const list = ref<any[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = 10
const loading = ref(false)
const filters = reactive({ keyword: '', status: '' })

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

async function loadData(p = 1) {
  page.value = p
  loading.value = true
  const params: any = { page: p, pageSize }
  if (filters.keyword) params.keyword = filters.keyword
  if (filters.status !== '') params.status = Number(filters.status)
  try {
    const res: any = await api.get('/admin/products', { params })
    list.value = res.data.list
    total.value = res.data.total
  } catch {} finally {
    loading.value = false
  }
}

async function toggleStatus(id: number, status: number) {
  try {
    await api.put(`/admin/products/${id}/status`, { status })
    await loadData(page.value)
  } catch {}
}

async function handleDelete(id: number) {
  if (!confirm('确认删除该商品？删除后不可恢复。')) return
  try {
    await api.delete(`/admin/products/${id}`)
    await loadData(page.value)
  } catch {}
}

onMounted(() => loadData())
</script>
