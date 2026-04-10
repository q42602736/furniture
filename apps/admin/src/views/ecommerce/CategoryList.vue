<template>
  <div>
    <!--begin::分类管理卡片-->
    <div class="card card-flush">
      <!--begin::卡片头部-->
      <div class="card-header align-items-center py-5 gap-2 gap-md-5">
        <div class="card-title">
          <KTIcon icon-name="category" icon-class="fs-2 text-gray-500 me-2" />
          <span class="fw-bold text-gray-800">分类管理</span>
        </div>
        <div class="card-toolbar">
          <button class="btn btn-primary" @click="openAdd">
            <KTIcon icon-name="plus" icon-class="fs-2" />
            新增分类
          </button>
        </div>
      </div>
      <!--end::卡片头部-->
      <!--begin::卡片内容-->
      <div class="card-body pt-0">
        <table class="table align-middle table-row-dashed fs-6 gy-5">
          <thead>
            <tr class="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
              <th class="min-w-200px">分类名称</th>
              <th class="min-w-100px">Slug</th>
              <th class="min-w-70px">图标</th>
              <th class="text-end min-w-70px">排序</th>
              <th class="text-end min-w-80px">子分类</th>
              <th class="text-end min-w-100px">操作</th>
            </tr>
          </thead>
          <tbody class="fw-semibold text-gray-600">
            <tr v-if="!tree.length">
              <td colspan="6" class="text-center text-muted py-8">暂无分类数据</td>
            </tr>
            <template v-for="cat in tree" :key="cat.id">
              <tr>
                <td>
                  <span class="text-gray-800 fw-bold">{{ cat.name }}</span>
                </td>
                <td>
                  <span class="badge badge-light-primary">{{ cat.slug }}</span>
                </td>
                <td>{{ cat.icon || '-' }}</td>
                <td class="text-end pe-0">{{ cat.sort }}</td>
                <td class="text-end pe-0">
                  <span class="badge badge-light-info">{{ cat.children?.length || 0 }}</span>
                </td>
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
                      <a href="javascript:;" class="menu-link px-3" @click="openEdit(cat)">编辑</a>
                    </div>
                    <div class="menu-item px-3">
                      <a href="javascript:;" class="menu-link px-3 text-danger" @click="handleDelete(cat.id)">删除</a>
                    </div>
                  </div>
                </td>
              </tr>
              <tr v-for="child in cat.children" :key="child.id">
                <td class="ps-10">
                  <span class="text-muted me-1">└</span>
                  <span class="text-gray-700">{{ child.name }}</span>
                </td>
                <td>
                  <span class="badge badge-light">{{ child.slug }}</span>
                </td>
                <td>{{ child.icon || '-' }}</td>
                <td class="text-end pe-0">{{ child.sort }}</td>
                <td class="text-end pe-0">-</td>
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
                      <a href="javascript:;" class="menu-link px-3" @click="openEdit(child)">编辑</a>
                    </div>
                    <div class="menu-item px-3">
                      <a href="javascript:;" class="menu-link px-3 text-danger" @click="handleDelete(child.id)">删除</a>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <!--end::卡片内容-->
    </div>
    <!--end::分类管理卡片-->

    <!--begin::新增/编辑弹窗-->
    <div class="modal fade" ref="modalRef" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ form.id ? '编辑分类' : '新增分类' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-5">
              <label class="form-label required">分类名称</label>
              <input v-model="form.name" class="form-control form-control-solid" />
            </div>
            <div class="mb-5">
              <label class="form-label required">Slug</label>
              <input v-model="form.slug" class="form-control form-control-solid" />
            </div>
            <div class="mb-5">
              <label class="form-label">父分类</label>
              <select v-model="form.parentId" class="form-select form-select-solid">
                <option :value="null">无（一级分类）</option>
                <option v-for="cat in tree" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>
            <div class="row mb-5">
              <div class="col-6">
                <label class="form-label">图标（emoji/URL）</label>
                <input v-model="form.icon" class="form-control form-control-solid" />
              </div>
              <div class="col-6">
                <label class="form-label">排序</label>
                <input v-model.number="form.sort" type="number" class="form-control form-control-solid" />
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
