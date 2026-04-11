<template>
  <div>
    <!--begin::推荐位管理卡片-->
    <div class="card card-flush">
      <!--begin::卡片头部-->
      <div class="card-header align-items-center py-5 gap-2 gap-md-5">
        <div class="card-title">
          <KTIcon icon-name="star" icon-class="fs-2 text-gray-500 me-2" />
          <span class="fw-bold text-gray-800">推荐位管理</span>
          <span class="text-muted fs-7 ms-3">共 {{ list.length }} 条</span>
        </div>
        <div class="card-toolbar gap-3">
          <!--begin::位置筛选-->
          <select v-model="filterPosition" class="form-select form-select-solid w-175px" @change="filterList">
            <option value="">全部位置</option>
            <option v-for="pos in positions" :key="pos.value" :value="pos.value">{{ pos.label }}</option>
          </select>
          <!--end::位置筛选-->
          <button class="btn btn-primary" @click="openAdd">
            <KTIcon icon-name="plus" icon-class="fs-2" />
            新增推荐
          </button>
        </div>
      </div>
      <!--end::卡片头部-->
      <!--begin::卡片内容-->
      <div class="card-body pt-0">
        <div v-if="loading" class="text-center py-10">
          <span class="spinner-border text-primary"></span>
        </div>
        <div v-else-if="!filteredList.length" class="text-center text-muted py-10">暂无推荐位数据</div>
        <div v-else class="table-responsive">
          <table class="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
            <thead>
              <tr class="fw-bold text-muted">
                <th class="min-w-50px">ID</th>
                <th class="min-w-150px">推荐名称</th>
                <th class="min-w-120px">位置</th>
                <th class="min-w-200px">关联商品</th>
                <th class="min-w-80px">排序</th>
                <th class="min-w-80px">状态</th>
                <th class="min-w-100px text-end">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredList" :key="item.id">
                <td>{{ item.id }}</td>
                <td>
                  <span class="text-gray-800 fw-bold">{{ item.title }}</span>
                </td>
                <td>
                  <span class="badge" :class="positionBadge(item.position)">{{ positionLabel(item.position) }}</span>
                </td>
                <td>
                  <div class="d-flex align-items-center">
                    <div class="symbol symbol-40px me-3">
                      <img v-if="item.image || item.product?.mainImage" :src="item.image || item.product?.mainImage" class="symbol-label" style="object-fit:cover" />
                      <span v-else class="symbol-label bg-light-primary text-primary fs-7 fw-bold">{{ (item.product?.name || '?')[0] }}</span>
                    </div>
                    <div>
                      <span class="text-gray-700 fs-7">{{ item.product?.name || '-' }}</span>
                      <div class="text-muted fs-8">ID: {{ item.productId }}</div>
                    </div>
                  </div>
                </td>
                <td>{{ item.sort }}</td>
                <td>
                  <span :class="`badge badge-light-${item.status === 1 ? 'success' : 'danger'}`">
                    {{ item.status === 1 ? '启用' : '禁用' }}
                  </span>
                </td>
                <td class="text-end">
                  <button class="btn btn-sm btn-icon btn-light-primary me-1" title="编辑" @click="openEdit(item)">
                    <KTIcon icon-name="pencil" icon-class="fs-5" />
                  </button>
                  <button class="btn btn-sm btn-icon btn-light-danger" title="删除" @click="handleDelete(item.id)">
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
    <!--end::推荐位管理卡片-->

    <!--begin::新增/编辑弹窗-->
    <div class="modal fade" ref="modalRef" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ form.id ? '编辑' : '新增' }}推荐位</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-5">
              <label class="form-label required">推荐名称</label>
              <input v-model="form.title" class="form-control form-control-solid" placeholder="如：首页精选推荐" />
            </div>
            <div class="mb-5">
              <label class="form-label required">推荐位置</label>
              <select v-model="form.position" class="form-select form-select-solid">
                <option value="">请选择位置</option>
                <option v-for="pos in positions" :key="pos.value" :value="pos.value">{{ pos.label }}</option>
              </select>
            </div>
            <div class="mb-5">
              <label class="form-label required">关联商品ID</label>
              <input v-model.number="form.productId" type="number" class="form-control form-control-solid" placeholder="输入商品ID" />
              <div class="form-text">请在商品管理中查看商品ID</div>
            </div>
            <div class="mb-5">
              <label class="form-label">自定义封面图</label>
              <input v-model="form.image" class="form-control form-control-solid" placeholder="留空使用商品主图" />
              <div v-if="form.image" class="mt-3">
                <img :src="form.image" class="rounded border" style="max-height:100px" />
              </div>
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
import { ref, computed, onMounted, nextTick } from 'vue'
import api from '@/core/api'

declare const bootstrap: any

const positions = [
  { value: 'home_featured', label: '首页精选', badge: 'badge-light-primary' },
  { value: 'home_hot', label: '首页热门', badge: 'badge-light-danger' },
  { value: 'home_new', label: '新品推荐', badge: 'badge-light-success' },
  { value: 'category_top', label: '分类页推荐', badge: 'badge-light-info' },
]

const list = ref<any[]>([])
const loading = ref(false)
const filterPosition = ref('')
const modalRef = ref<HTMLElement>()
const form = ref({ id: 0, title: '', position: '', productId: 0, image: '', sort: 0, status: 1 })
const saving = ref(false)
let modal: any = null

const filteredList = computed(() => {
  if (!filterPosition.value) return list.value
  return list.value.filter(item => item.position === filterPosition.value)
})

function positionLabel(pos: string) {
  return positions.find(p => p.value === pos)?.label || pos
}

function positionBadge(pos: string) {
  return positions.find(p => p.value === pos)?.badge || 'badge-light-secondary'
}

function filterList() {
  // computed 自动处理
}

async function loadData() {
  loading.value = true
  try {
    const res: any = await api.get('/recommendations/all')
    list.value = res.data || []
  } catch {
    list.value = []
  } finally {
    loading.value = false
  }
}

function openAdd() {
  form.value = { id: 0, title: '', position: '', productId: 0, image: '', sort: 0, status: 1 }
  nextTick(() => {
    if (!modal) modal = new bootstrap.Modal(modalRef.value)
    modal.show()
  })
}

function openEdit(item: any) {
  form.value = {
    id: item.id,
    title: item.title || '',
    position: item.position || '',
    productId: item.productId || 0,
    image: item.image || '',
    sort: item.sort || 0,
    status: item.status,
  }
  nextTick(() => {
    if (!modal) modal = new bootstrap.Modal(modalRef.value)
    modal.show()
  })
}

async function save() {
  saving.value = true
  try {
    const payload = {
      title: form.value.title,
      position: form.value.position,
      productId: form.value.productId,
      image: form.value.image || undefined,
      sort: form.value.sort,
      status: form.value.status,
    }
    if (form.value.id) {
      await api.put(`/recommendations/${form.value.id}`, payload)
    } else {
      await api.post('/recommendations', payload)
    }
    modal?.hide()
    await loadData()
  } catch {
  } finally {
    saving.value = false
  }
}

async function handleDelete(id: number) {
  if (!confirm('确认删除该推荐位？')) return
  try {
    await api.delete(`/recommendations/${id}`)
    await loadData()
  } catch {}
}

onMounted(() => loadData())
</script>
