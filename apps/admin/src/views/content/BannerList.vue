<template>
  <div>
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <span>Banner 管理</span>
        <button class="btn btn-sm btn-primary" @click="openAdd">
          <i class="bi bi-plus"></i> 新增 Banner
        </button>
      </div>
      <div class="card-body">
        <div class="row g-3">
          <div v-if="!list.length" class="col-12 text-center text-muted py-4">暂无 Banner</div>
          <div class="col-md-6" v-for="item in list" :key="item.id">
            <div class="card">
              <img :src="item.imageUrl" class="card-img-top" style="height:180px;object-fit:cover" />
              <div class="card-body p-3">
                <h6>{{ item.title || '无标题' }}</h6>
                <small class="text-muted">链接: {{ item.link || '-' }} · 排序: {{ item.sort }}</small>
                <div class="mt-2">
                  <span :class="`badge ${item.status === 1 ? 'bg-success' : 'bg-secondary'} me-2`">
                    {{ item.status === 1 ? '启用' : '禁用' }}
                  </span>
                  <button class="btn btn-sm btn-outline-primary me-1" @click="openEdit(item)">编辑</button>
                  <button class="btn btn-sm btn-outline-danger" @click="handleDelete(item.id)">删除</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增/编辑弹窗 -->
    <div class="modal fade" ref="modalRef" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ form.id ? '编辑' : '新增' }} Banner</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">标题</label>
              <input v-model="form.title" class="form-control" />
            </div>
            <div class="mb-3">
              <label class="form-label">图片URL</label>
              <input v-model="form.imageUrl" class="form-control" required />
              <img v-if="form.imageUrl" :src="form.imageUrl" class="mt-2 rounded" style="max-height:120px" />
            </div>
            <div class="mb-3">
              <label class="form-label">链接</label>
              <input v-model="form.link" class="form-control" />
            </div>
            <div class="row">
              <div class="col-6 mb-3">
                <label class="form-label">排序</label>
                <input v-model.number="form.sort" type="number" class="form-control" />
              </div>
              <div class="col-6 mb-3">
                <label class="form-label">状态</label>
                <select v-model.number="form.status" class="form-select">
                  <option :value="1">启用</option>
                  <option :value="0">禁用</option>
                </select>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
            <button class="btn btn-primary" :disabled="saving" @click="save">
              {{ saving ? '保存中...' : '保存' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import api from '@/core/api'

declare const bootstrap: any

const list = ref<any[]>([])
const modalRef = ref<HTMLElement>()
const form = reactive({ id: 0, title: '', imageUrl: '', link: '', sort: 0, status: 1 })
const saving = ref(false)
let modal: any = null

async function loadData() {
  try {
    const res: any = await api.get('/banners/all')
    list.value = res.data
  } catch {}
}

function openAdd() {
  Object.assign(form, { id: 0, title: '', imageUrl: '', link: '', sort: 0, status: 1 })
  nextTick(() => {
    if (!modal) modal = new bootstrap.Modal(modalRef.value)
    modal.show()
  })
}

function openEdit(item: any) {
  Object.assign(form, { id: item.id, title: item.title || '', imageUrl: item.imageUrl, link: item.link || '', sort: item.sort || 0, status: item.status })
  nextTick(() => {
    if (!modal) modal = new bootstrap.Modal(modalRef.value)
    modal.show()
  })
}

async function save() {
  saving.value = true
  try {
    const payload = { title: form.title, imageUrl: form.imageUrl, link: form.link, sort: form.sort, status: form.status }
    if (form.id) {
      await api.put(`/banners/${form.id}`, payload)
    } else {
      await api.post('/banners', payload)
    }
    modal?.hide()
    await loadData()
  } catch {} finally {
    saving.value = false
  }
}

async function handleDelete(id: number) {
  if (!confirm('确认删除该 Banner？')) return
  try {
    await api.delete(`/banners/${id}`)
    await loadData()
  } catch {}
}

onMounted(() => loadData())
</script>
