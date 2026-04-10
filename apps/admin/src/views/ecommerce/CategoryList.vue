<template>
  <div>
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <span>分类管理</span>
        <button class="btn btn-sm btn-primary" @click="openAdd">
          <i class="bi bi-plus"></i> 新增分类
        </button>
      </div>
      <div class="card-body p-0">
        <table class="table table-hover mb-0">
          <thead class="table-light">
            <tr>
              <th>分类名称</th>
              <th>Slug</th>
              <th>图标</th>
              <th>排序</th>
              <th>子分类</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!tree.length">
              <td colspan="6" class="text-center text-muted py-4">暂无数据</td>
            </tr>
            <template v-for="cat in tree" :key="cat.id">
              <tr class="table-light">
                <td class="fw-bold">{{ cat.name }}</td>
                <td>{{ cat.slug }}</td>
                <td>{{ cat.icon || '-' }}</td>
                <td>{{ cat.sort }}</td>
                <td>{{ cat.children?.length || 0 }}</td>
                <td>
                  <button class="btn btn-sm btn-outline-primary me-1" @click="openEdit(cat)">编辑</button>
                  <button class="btn btn-sm btn-outline-danger" @click="handleDelete(cat.id)">删除</button>
                </td>
              </tr>
              <tr v-for="child in cat.children" :key="child.id">
                <td class="ps-4">└ {{ child.name }}</td>
                <td>{{ child.slug }}</td>
                <td>{{ child.icon || '-' }}</td>
                <td>{{ child.sort }}</td>
                <td>-</td>
                <td>
                  <button class="btn btn-sm btn-outline-primary me-1" @click="openEdit(child)">编辑</button>
                  <button class="btn btn-sm btn-outline-danger" @click="handleDelete(child.id)">删除</button>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 新增/编辑弹窗 -->
    <div class="modal fade" ref="modalRef" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ form.id ? '编辑分类' : '新增分类' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">分类名称</label>
              <input v-model="form.name" class="form-control" />
            </div>
            <div class="mb-3">
              <label class="form-label">Slug</label>
              <input v-model="form.slug" class="form-control" />
            </div>
            <div class="mb-3">
              <label class="form-label">父分类</label>
              <select v-model="form.parentId" class="form-select">
                <option :value="null">无（一级分类）</option>
                <option v-for="cat in tree" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">图标（emoji/图片URL）</label>
              <input v-model="form.icon" class="form-control" />
            </div>
            <div class="mb-3">
              <label class="form-label">排序</label>
              <input v-model.number="form.sort" type="number" class="form-control" />
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

const tree = ref<any[]>([])
const modalRef = ref<HTMLElement>()
const form = reactive({ id: 0, name: '', slug: '', parentId: null as number | null, icon: '', sort: 0 })
const saving = ref(false)
let modal: any = null

async function loadData() {
  try {
    const res: any = await api.get('/categories/tree')
    tree.value = res.data
  } catch {}
}

function openAdd() {
  Object.assign(form, { id: 0, name: '', slug: '', parentId: null, icon: '', sort: 0 })
  nextTick(() => {
    if (!modal) modal = new bootstrap.Modal(modalRef.value)
    modal.show()
  })
}

function openEdit(cat: any) {
  Object.assign(form, { id: cat.id, name: cat.name, slug: cat.slug, parentId: cat.parentId || null, icon: cat.icon || '', sort: cat.sort || 0 })
  nextTick(() => {
    if (!modal) modal = new bootstrap.Modal(modalRef.value)
    modal.show()
  })
}

async function save() {
  saving.value = true
  try {
    const payload: any = { name: form.name, slug: form.slug, sort: form.sort }
    if (form.parentId) payload.parentId = form.parentId
    if (form.icon) payload.icon = form.icon

    if (form.id) {
      await api.put(`/categories/${form.id}`, payload)
    } else {
      await api.post('/categories', payload)
    }
    modal?.hide()
    await loadData()
  } catch {} finally {
    saving.value = false
  }
}

async function handleDelete(id: number) {
  if (!confirm('确认删除该分类？')) return
  try {
    await api.delete(`/categories/${id}`)
    await loadData()
  } catch {}
}

onMounted(() => loadData())
</script>
