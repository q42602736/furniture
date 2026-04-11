<template>
  <div>
    <!--begin::品牌管理卡片-->
    <div class="card card-flush">
      <!--begin::卡片头部-->
      <div class="card-header align-items-center py-5 gap-2 gap-md-5">
        <div class="card-title">
          <KTIcon icon-name="abstract-26" icon-class="fs-2 text-gray-500 me-2" />
          <span class="fw-bold text-gray-800">品牌管理</span>
          <span class="text-muted fs-7 ms-3">共 {{ list.length }} 个品牌</span>
        </div>
        <div class="card-toolbar">
          <button class="btn btn-primary" @click="openAdd">
            <KTIcon icon-name="plus" icon-class="fs-2" />
            新增品牌
          </button>
        </div>
      </div>
      <!--end::卡片头部-->
      <!--begin::卡片内容-->
      <div class="card-body pt-0">
        <div v-if="loading" class="text-center py-10">
          <span class="spinner-border text-primary"></span>
        </div>
        <div v-else-if="!list.length" class="text-center text-muted py-10">暂无品牌数据</div>
        <div v-else class="table-responsive">
          <table class="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
            <thead>
              <tr class="fw-bold text-muted">
                <th class="w-25px">ID</th>
                <th class="min-w-150px">品牌信息</th>
                <th class="min-w-80px">商品数量</th>
                <th class="min-w-60px">排序</th>
                <th class="min-w-100px">创建时间</th>
                <th class="min-w-100px text-end">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in list" :key="item.id">
                <td>
                  <span class="text-gray-600 fw-bold">{{ item.id }}</span>
                </td>
                <td>
                  <div class="d-flex align-items-center">
                    <div class="symbol symbol-45px me-4">
                      <img v-if="item.logo" :src="item.logo" class="symbol-label" style="object-fit: contain" />
                      <div v-else class="symbol-label bg-light-primary">
                        <KTIcon icon-name="abstract-26" icon-class="fs-2 text-primary" />
                      </div>
                    </div>
                    <div>
                      <span class="text-gray-800 fw-bold fs-6">{{ item.name }}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="badge badge-light-info fs-7">{{ item._count?.products ?? 0 }} 件商品</span>
                </td>
                <td>
                  <span class="text-gray-600">{{ item.sort }}</span>
                </td>
                <td>
                  <span class="text-gray-600 fs-7">{{ formatDate(item.createdAt) }}</span>
                </td>
                <td class="text-end">
                  <button class="btn btn-sm btn-icon btn-light-primary me-2" title="编辑" @click="openEdit(item)">
                    <KTIcon icon-name="pencil" icon-class="fs-5" />
                  </button>
                  <button class="btn btn-sm btn-icon btn-light-danger" title="删除" @click="handleDelete(item)">
                    <KTIcon icon-name="trash" icon-class="fs-5" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!--end::卡片内容-->
    </div>
    <!--end::品牌管理卡片-->

    <!--begin::新增/编辑弹窗-->
    <div class="modal fade" ref="modalRef" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ form.id ? '编辑' : '新增' }}品牌</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-5">
              <label class="form-label required">品牌名称</label>
              <input v-model="form.name" class="form-control form-control-solid" placeholder="请输入品牌名称" />
            </div>
            <div class="mb-5">
              <label class="form-label">品牌 Logo URL</label>
              <input v-model="form.logo" class="form-control form-control-solid" placeholder="请输入 Logo 图片地址" />
              <div v-if="form.logo" class="mt-3">
                <img :src="form.logo" class="rounded border" style="max-height: 80px; object-fit: contain" />
              </div>
            </div>
            <div class="mb-5">
              <label class="form-label">排序（数值越小越靠前）</label>
              <input v-model.number="form.sort" type="number" class="form-control form-control-solid" />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-light" data-bs-dismiss="modal">取消</button>
            <button class="btn btn-primary" :disabled="saving" @click="save">
              <span v-if="saving" class="spinner-border spinner-border-sm align-middle me-1"></span>
              {{ saving ? '保存中...' : '保存' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <!--end::新增/编辑弹窗-->
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import api from '@/core/api'

declare const bootstrap: any

const list = ref<any[]>([])
const loading = ref(false)
const modalRef = ref<HTMLElement>()
const form = reactive({ id: 0, name: '', logo: '', sort: 0 })
const saving = ref(false)
let modal: any = null

function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

async function loadData() {
  loading.value = true
  try {
    const res: any = await api.get('/brands/all')
    list.value = res.data
  } catch {} finally {
    loading.value = false
  }
}

function openAdd() {
  Object.assign(form, { id: 0, name: '', logo: '', sort: 0 })
  nextTick(() => {
    if (!modal) modal = new bootstrap.Modal(modalRef.value)
    modal.show()
  })
}

function openEdit(item: any) {
  Object.assign(form, { id: item.id, name: item.name || '', logo: item.logo || '', sort: item.sort || 0 })
  nextTick(() => {
    if (!modal) modal = new bootstrap.Modal(modalRef.value)
    modal.show()
  })
}

async function save() {
  if (!form.name.trim()) return alert('请输入品牌名称')
  saving.value = true
  try {
    const payload = { name: form.name, logo: form.logo || undefined, sort: form.sort }
    if (form.id) {
      await api.put(`/brands/${form.id}`, payload)
    } else {
      await api.post('/brands', payload)
    }
    modal?.hide()
    await loadData()
  } catch {} finally {
    saving.value = false
  }
}

async function handleDelete(item: any) {
  if (!confirm(`确认删除品牌「${item.name}」？`)) return
  try {
    await api.delete(`/brands/${item.id}`)
    await loadData()
  } catch (e: any) {
    alert(e?.response?.data?.message || '删除失败')
  }
}

onMounted(() => loadData())
</script>
