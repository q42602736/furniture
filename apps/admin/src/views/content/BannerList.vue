<template>
  <div>
    <!--begin::Banner管理卡片-->
    <div class="card card-flush">
      <!--begin::卡片头部-->
      <div class="card-header align-items-center py-5 gap-2 gap-md-5">
        <div class="card-title">
          <KTIcon icon-name="picture" icon-class="fs-2 text-gray-500 me-2" />
          <span class="fw-bold text-gray-800">Banner 管理</span>
        </div>
        <div class="card-toolbar">
          <button class="btn btn-primary" @click="openAdd">
            <KTIcon icon-name="plus" icon-class="fs-2" />
            新增 Banner
          </button>
        </div>
      </div>
      <!--end::卡片头部-->
      <!--begin::卡片内容-->
      <div class="card-body pt-0">
        <div v-if="!list.length" class="text-center text-muted py-10">暂无 Banner 数据</div>
        <div class="row g-5">
          <div class="col-md-6 col-lg-4" v-for="item in list" :key="item.id">
            <div class="card card-flush border border-gray-300 h-100">
              <!--begin::图片-->
              <div class="card-body p-0">
                <div class="overlay overflow-hidden">
                  <div class="overlay-wrapper">
                    <img
                      v-if="item.imageUrl"
                      :src="item.imageUrl"
                      class="w-100 rounded-top"
                      style="height:180px;object-fit:cover"
                      @error="onImgError"
                    />
                    <div v-else class="w-100 rounded-top bg-light d-flex align-items-center justify-content-center" style="height:180px">
                      <KTIcon icon-name="picture" icon-class="fs-2x text-gray-400" />
                    </div>
                  </div>
                  <div class="overlay-layer bg-dark bg-opacity-25 align-items-end justify-content-center p-4">
                    <a href="javascript:;" class="btn btn-sm btn-primary me-2" @click="openEdit(item)">
                      <KTIcon icon-name="pencil" icon-class="fs-5" /> 编辑
                    </a>
                    <a href="javascript:;" class="btn btn-sm btn-danger" @click="handleDelete(item.id)">
                      <KTIcon icon-name="trash" icon-class="fs-5" /> 删除
                    </a>
                  </div>
                </div>
              </div>
              <!--end::图片-->
              <!--begin::信息-->
              <div class="card-footer d-flex flex-stack pt-4 pb-4">
                <div>
                  <span class="text-gray-800 fw-bold fs-6">{{ item.title || '无标题' }}</span>
                  <div class="text-muted fs-7 mt-1">
                    链接: {{ item.link || '-' }} · 排序: {{ item.sort }}
                  </div>
                </div>
                <div :class="`badge badge-light-${item.status === 1 ? 'success' : 'danger'}`">
                  {{ item.status === 1 ? '启用' : '禁用' }}
                </div>
              </div>
              <!--end::信息-->
            </div>
          </div>
        </div>
      </div>
      <!--end::卡片内容-->
    </div>
    <!--end::Banner管理卡片-->

    <!--begin::新增/编辑弹窗-->
    <div class="modal fade" ref="modalRef" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ form.id ? '编辑' : '新增' }} Banner</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-5">
              <label class="form-label">标题</label>
              <input v-model="form.title" class="form-control form-control-solid" />
            </div>
            <div class="mb-5">
              <label class="form-label required">图片URL</label>
              <input v-model="form.imageUrl" class="form-control form-control-solid" />
              <div v-if="form.imageUrl" class="mt-3">
                <img :src="form.imageUrl" class="rounded border" style="max-height:120px" @error="onImgError" />
              </div>
            </div>
            <div class="mb-5">
              <label class="form-label">链接</label>
              <input v-model="form.link" class="form-control form-control-solid" />
            </div>
            <div class="row mb-5">
              <div class="col-6">
                <label class="form-label">排序</label>
                <input v-model.number="form.sort" type="number" class="form-control form-control-solid" />
              </div>
              <div class="col-6">
                <label class="form-label">状态</label>
                <select v-model.number="form.status" class="form-select form-select-solid">
                  <option :value="1">启用</option>
                  <option :value="0">禁用</option>
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
import { ref, reactive, onMounted, nextTick } from 'vue'
import api from '@/core/api'

declare const bootstrap: any

const list = ref<any[]>([])
const modalRef = ref<HTMLElement>()
const form = reactive({ id: 0, title: '', imageUrl: '', link: '', sort: 0, status: 1 })
const saving = ref(false)
let modal: any = null

function onImgError(e: Event) {
  const el = e.target as HTMLImageElement
  el.style.display = 'none'
}

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
