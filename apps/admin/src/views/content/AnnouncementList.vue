<template>
  <div>
    <!--begin::公告管理卡片-->
    <div class="card card-flush">
      <!--begin::卡片头部-->
      <div class="card-header align-items-center py-5 gap-2 gap-md-5">
        <div class="card-title">
          <KTIcon icon-name="notification-on" icon-class="fs-2 text-gray-500 me-2" />
          <span class="fw-bold text-gray-800">公告管理</span>
        </div>
        <div class="card-toolbar gap-3">
          <!--begin::类型筛选-->
          <select v-model="filterType" class="form-select form-select-solid form-select-sm w-150px" @change="loadData">
            <option value="">全部类型</option>
            <option value="notice">公告</option>
            <option value="promotion">促销</option>
            <option value="system">系统通知</option>
          </select>
          <!--end::类型筛选-->
          <button class="btn btn-primary" @click="openAdd">
            <KTIcon icon-name="plus" icon-class="fs-2" />
            新增公告
          </button>
        </div>
      </div>
      <!--end::卡片头部-->
      <!--begin::卡片内容-->
      <div class="card-body pt-0">
        <div v-if="!filteredList.length" class="text-center text-muted py-10">暂无公告数据</div>
        <div class="table-responsive" v-else>
          <table class="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
            <thead>
              <tr class="fw-bold text-muted">
                <th class="min-w-50px">ID</th>
                <th class="min-w-200px">标题</th>
                <th class="min-w-100px">类型</th>
                <th class="min-w-60px">排序</th>
                <th class="min-w-80px">状态</th>
                <th class="min-w-120px">创建时间</th>
                <th class="min-w-100px text-end">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredList" :key="item.id">
                <td class="text-gray-600">{{ item.id }}</td>
                <td>
                  <span class="text-gray-800 fw-bold d-block fs-6">{{ item.title }}</span>
                  <span class="text-muted fs-7 d-block text-truncate" style="max-width:300px">{{ item.content }}</span>
                </td>
                <td>
                  <span :class="`badge badge-light-${typeColor(item.type)}`">{{ typeLabel(item.type) }}</span>
                </td>
                <td class="text-gray-600">{{ item.sort }}</td>
                <td>
                  <span :class="`badge badge-light-${item.status === 1 ? 'success' : 'danger'}`">
                    {{ item.status === 1 ? '已发布' : '草稿' }}
                  </span>
                </td>
                <td class="text-gray-600 fs-7">{{ formatDate(item.createdAt) }}</td>
                <td class="text-end">
                  <button class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1" @click="openEdit(item)" title="编辑">
                    <KTIcon icon-name="pencil" icon-class="fs-5" />
                  </button>
                  <button class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm" @click="handleDelete(item.id)" title="删除">
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
    <!--end::公告管理卡片-->

    <!--begin::新增/编辑弹窗-->
    <div class="modal fade" ref="modalRef" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ form.id ? '编辑' : '新增' }}公告</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-5">
              <label class="form-label required">标题</label>
              <input v-model="form.title" class="form-control form-control-solid" placeholder="请输入公告标题" />
            </div>
            <div class="mb-5">
              <label class="form-label required">内容</label>
              <textarea v-model="form.content" class="form-control form-control-solid" rows="6" placeholder="请输入公告内容"></textarea>
            </div>
            <div class="row mb-5">
              <div class="col-4">
                <label class="form-label">类型</label>
                <select v-model="form.type" class="form-select form-select-solid">
                  <option value="notice">公告</option>
                  <option value="promotion">促销</option>
                  <option value="system">系统通知</option>
                </select>
              </div>
              <div class="col-4">
                <label class="form-label">排序</label>
                <input v-model.number="form.sort" type="number" class="form-control form-control-solid" />
              </div>
              <div class="col-4">
                <label class="form-label">状态</label>
                <select v-model.number="form.status" class="form-select form-select-solid">
                  <option :value="1">发布</option>
                  <option :value="0">草稿</option>
                </select>
              </div>
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
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import api from '@/core/api'

declare const bootstrap: any

const list = ref<any[]>([])
const filterType = ref('')
const modalRef = ref<HTMLElement>()
const form = reactive({ id: 0, title: '', content: '', type: 'notice', sort: 0, status: 1 })
const saving = ref(false)
let modal: any = null

const filteredList = computed(() => {
  if (!filterType.value) return list.value
  return list.value.filter((item) => item.type === filterType.value)
})

const typeMap: Record<string, { label: string; color: string }> = {
  notice: { label: '公告', color: 'primary' },
  promotion: { label: '促销', color: 'warning' },
  system: { label: '系统通知', color: 'info' },
}

function typeLabel(type: string) {
  return typeMap[type]?.label || type
}

function typeColor(type: string) {
  return typeMap[type]?.color || 'secondary'
}

function formatDate(d: string) {
  return d ? new Date(d).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : '-'
}

async function loadData() {
  try {
    const res: any = await api.get('/announcements/all')
    list.value = res.data
  } catch {}
}

function openAdd() {
  Object.assign(form, { id: 0, title: '', content: '', type: 'notice', sort: 0, status: 1 })
  nextTick(() => {
    if (!modal) modal = new bootstrap.Modal(modalRef.value)
    modal.show()
  })
}

function openEdit(item: any) {
  Object.assign(form, {
    id: item.id,
    title: item.title || '',
    content: item.content || '',
    type: item.type || 'notice',
    sort: item.sort || 0,
    status: item.status,
  })
  nextTick(() => {
    if (!modal) modal = new bootstrap.Modal(modalRef.value)
    modal.show()
  })
}

async function save() {
  saving.value = true
  try {
    const payload = { title: form.title, content: form.content, type: form.type, sort: form.sort, status: form.status }
    if (form.id) {
      await api.put(`/announcements/${form.id}`, payload)
    } else {
      await api.post('/announcements', payload)
    }
    modal?.hide()
    await loadData()
  } catch {} finally {
    saving.value = false
  }
}

async function handleDelete(id: number) {
  if (!confirm('确认删除该公告？')) return
  try {
    await api.delete(`/announcements/${id}`)
    await loadData()
  } catch {}
}

onMounted(() => loadData())
</script>
