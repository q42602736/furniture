<template>
  <div>
    <!-- 筛选栏 -->
    <div class="card mb-3">
      <div class="card-body py-2">
        <form class="row g-2 align-items-end" @submit.prevent="loadData(1)">
          <div class="col-auto">
            <input v-model="filters.keyword" class="form-control form-control-sm" placeholder="搜索商品名称" />
          </div>
          <div class="col-auto">
            <select v-model="filters.status" class="form-select form-select-sm">
              <option value="">全部状态</option>
              <option value="1">上架</option>
              <option value="0">下架</option>
            </select>
          </div>
          <div class="col-auto">
            <button class="btn btn-sm btn-primary" type="submit">搜索</button>
          </div>
        </form>
      </div>
    </div>

    <!-- 商品列表 -->
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <span>共 {{ total }} 个商品</span>
      </div>
      <div class="card-body p-0">
        <table class="table table-hover mb-0">
          <thead class="table-light">
            <tr>
              <th>商品</th>
              <th>分类</th>
              <th>商家</th>
              <th>价格</th>
              <th>库存</th>
              <th>状态</th>
              <th style="width: 200px">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!list.length">
              <td colspan="7" class="text-center text-muted py-4">暂无数据</td>
            </tr>
            <tr v-for="item in list" :key="item.id">
              <td>
                <div class="d-flex align-items-center">
                  <img v-if="item.images?.[0]" :src="item.images[0].url" class="rounded me-2" style="width:40px;height:40px;object-fit:cover" />
                  <div>
                    <div class="fw-medium">{{ item.name }}</div>
                    <small class="text-muted">ID: {{ item.id }}</small>
                  </div>
                </div>
              </td>
              <td>{{ item.category?.name || '-' }}</td>
              <td>{{ item.merchant?.name || '-' }}</td>
              <td class="text-danger fw-medium">¥{{ item.price }}</td>
              <td>{{ item.stock }}</td>
              <td>
                <span :class="`badge ${item.status === 1 ? 'bg-success' : 'bg-secondary'}`">
                  {{ item.status === 1 ? '上架' : '下架' }}
                </span>
              </td>
              <td>
                <button class="btn btn-sm btn-outline-primary me-1" @click="openEdit(item)">
                  <i class="bi bi-pencil"></i> 编辑
                </button>
                <button class="btn btn-sm btn-outline-info me-1" @click="openImages(item)">
                  <i class="bi bi-image"></i>
                </button>
                <button v-if="item.status === 1" class="btn btn-sm btn-outline-warning me-1" @click="toggleStatus(item.id, 0)">下架</button>
                <button v-else class="btn btn-sm btn-outline-success me-1" @click="toggleStatus(item.id, 1)">上架</button>
                <button class="btn btn-sm btn-outline-danger" @click="handleDelete(item.id)">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card-footer d-flex justify-content-end" v-if="total > pageSize">
        <nav>
          <ul class="pagination pagination-sm mb-0">
            <li class="page-item" :class="{ disabled: page <= 1 }">
              <a class="page-link" href="#" @click.prevent="page > 1 && loadData(page - 1)">上一页</a>
            </li>
            <li class="page-item" :class="{ disabled: page * pageSize >= total }">
              <a class="page-link" href="#" @click.prevent="page * pageSize < total && loadData(page + 1)">下一页</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- 编辑弹窗 -->
    <div class="modal fade" ref="editModalRef" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">编辑商品</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">商品名称</label>
              <input v-model="editForm.name" class="form-control" />
            </div>
            <div class="mb-3">
              <label class="form-label">价格</label>
              <input v-model.number="editForm.price" type="number" step="0.01" class="form-control" />
            </div>
            <div class="mb-3">
              <label class="form-label">原价</label>
              <input v-model.number="editForm.originalPrice" type="number" step="0.01" class="form-control" />
            </div>
            <div class="mb-3">
              <label class="form-label">描述</label>
              <textarea v-model="editForm.description" class="form-control" rows="3"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
            <button class="btn btn-primary" :disabled="saving" @click="saveEdit">
              {{ saving ? '保存中...' : '保存' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 图片管理弹窗 -->
    <div class="modal fade" ref="imageModalRef" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">管理图片 — {{ imageProduct?.name }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-4" v-for="(img, i) in imageList" :key="i">
                <div class="position-relative">
                  <img :src="img.url" class="img-fluid rounded" style="height:120px;width:100%;object-fit:cover" />
                  <button class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1" @click="imageList.splice(i, 1)">
                    <i class="bi bi-x"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="mt-3">
              <label class="form-label">添加图片URL</label>
              <div class="input-group">
                <input v-model="newImageUrl" class="form-control" placeholder="输入图片链接" />
                <button class="btn btn-outline-primary" @click="addImage">添加</button>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
            <button class="btn btn-primary" :disabled="savingImages" @click="saveImages">
              {{ savingImages ? '保存中...' : '保存图片' }}
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
const total = ref(0)
const page = ref(1)
const pageSize = 10
const filters = reactive({ keyword: '', status: '' })

// 编辑
const editModalRef = ref<HTMLElement>()
const editForm = reactive({ id: 0, name: '', price: 0, originalPrice: 0, description: '' })
const saving = ref(false)
let editModal: any = null

// 图片
const imageModalRef = ref<HTMLElement>()
const imageProduct = ref<any>(null)
const imageList = ref<{ url: string }[]>([])
const newImageUrl = ref('')
const savingImages = ref(false)
let imageModal: any = null

async function loadData(p = 1) {
  page.value = p
  const params: any = { page: p, pageSize }
  if (filters.keyword) params.keyword = filters.keyword
  if (filters.status !== '') params.status = Number(filters.status)
  try {
    const res: any = await api.get('/admin/products', { params })
    list.value = res.data.list
    total.value = res.data.total
  } catch {}
}

function openEdit(item: any) {
  Object.assign(editForm, { id: item.id, name: item.name, price: item.price, originalPrice: item.originalPrice || 0, description: item.description || '' })
  nextTick(() => {
    if (!editModal) editModal = new bootstrap.Modal(editModalRef.value)
    editModal.show()
  })
}

async function saveEdit() {
  saving.value = true
  try {
    await api.put(`/admin/products/${editForm.id}`, {
      name: editForm.name,
      price: editForm.price,
      originalPrice: editForm.originalPrice || undefined,
      description: editForm.description || undefined,
    })
    editModal?.hide()
    await loadData(page.value)
  } catch {} finally {
    saving.value = false
  }
}

function openImages(item: any) {
  imageProduct.value = item
  // 加载商品详情获取完整图片列表
  api.get(`/admin/products/${item.id}`).then((res: any) => {
    imageList.value = (res.data.images || []).map((img: any) => ({ url: img.url }))
  })
  nextTick(() => {
    if (!imageModal) imageModal = new bootstrap.Modal(imageModalRef.value)
    imageModal.show()
  })
}

function addImage() {
  if (newImageUrl.value.trim()) {
    imageList.value.push({ url: newImageUrl.value.trim() })
    newImageUrl.value = ''
  }
}

async function saveImages() {
  if (!imageProduct.value) return
  savingImages.value = true
  try {
    await api.put(`/admin/products/${imageProduct.value.id}/images`, {
      images: imageList.value.map((img, i) => ({ url: img.url, sort: i })),
    })
    imageModal?.hide()
    await loadData(page.value)
  } catch {} finally {
    savingImages.value = false
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
