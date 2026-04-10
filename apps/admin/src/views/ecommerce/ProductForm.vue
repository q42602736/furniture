<template>
  <div>
    <!--begin::加载-->
    <div v-if="loading" class="d-flex justify-content-center py-20">
      <span class="spinner-border text-primary"></span>
    </div>

    <template v-else>
      <!--begin::顶部操作栏-->
      <div class="d-flex flex-wrap gap-5 mb-7">
        <router-link to="/products" class="btn btn-icon btn-light btn-active-secondary btn-sm">
          <KTIcon icon-name="left" icon-class="fs-2" />
        </router-link>
        <div class="d-flex align-items-center flex-grow-1">
          <h1 class="fs-3 fw-bold text-gray-800 mb-0">{{ isEdit ? '编辑商品' : '新增商品' }}</h1>
        </div>
        <div class="d-flex gap-3">
          <router-link to="/products" class="btn btn-light btn-sm">取消</router-link>
          <button class="btn btn-primary btn-sm" :disabled="saving" @click="handleSave">
            <span v-if="saving" class="spinner-border spinner-border-sm align-middle me-1"></span>
            {{ saving ? '保存中...' : '保存' }}
          </button>
        </div>
      </div>
      <!--end::顶部操作栏-->

      <div class="d-flex flex-column flex-lg-row">
        <!--begin::主栏-->
        <div class="flex-lg-row-fluid me-lg-7 mb-7 mb-lg-0">
          <!--begin::基本信息-->
          <div class="card card-flush py-4 mb-7">
            <div class="card-header">
              <div class="card-title"><h2>基本信息</h2></div>
            </div>
            <div class="card-body pt-0">
              <div class="mb-7">
                <label class="required form-label">商品名称</label>
                <input v-model="form.name" type="text" class="form-control form-control-solid mb-2" placeholder="请输入商品名称" />
              </div>
              <div class="mb-0">
                <label class="form-label">商品描述</label>
                <textarea v-model="form.description" class="form-control form-control-solid" rows="5" placeholder="请输入商品描述"></textarea>
              </div>
            </div>
          </div>
          <!--end::基本信息-->

          <!--begin::图片管理-->
          <div class="card card-flush py-4 mb-7">
            <div class="card-header">
              <div class="card-title"><h2>商品图片</h2></div>
            </div>
            <div class="card-body pt-0">
              <div class="row g-4 mb-5">
                <div class="col-md-3 col-sm-4 col-6" v-for="(img, i) in form.images" :key="i">
                  <div class="position-relative border border-dashed border-gray-300 rounded overflow-hidden" style="aspect-ratio:1">
                    <img :src="img.url" class="w-100 h-100" style="object-fit:cover" />
                    <button
                      class="btn btn-icon btn-sm btn-color-danger btn-active-light-danger position-absolute top-0 end-0 m-2"
                      @click="form.images.splice(i, 1)"
                    >
                      <KTIcon icon-name="cross" icon-class="fs-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div class="d-flex gap-3">
                <input v-model="newImageUrl" class="form-control form-control-solid flex-grow-1" placeholder="输入图片链接" @keyup.enter="addImage" />
                <button class="btn btn-light-primary" @click="addImage">
                  <KTIcon icon-name="plus" icon-class="fs-4 me-1" />
                  添加
                </button>
              </div>
            </div>
          </div>
          <!--end::图片管理-->

          <!--begin::价格-->
          <div class="card card-flush py-4">
            <div class="card-header">
              <div class="card-title"><h2>价格设置</h2></div>
            </div>
            <div class="card-body pt-0">
              <div class="row">
                <div class="col-md-6 mb-5">
                  <label class="required form-label">销售价格</label>
                  <input v-model.number="form.price" type="number" step="0.01" min="0" class="form-control form-control-solid" placeholder="0.00" />
                </div>
                <div class="col-md-6 mb-5">
                  <label class="form-label">原价（划线价）</label>
                  <input v-model.number="form.originalPrice" type="number" step="0.01" min="0" class="form-control form-control-solid" placeholder="0.00" />
                </div>
              </div>
            </div>
          </div>
          <!--end::价格-->
        </div>
        <!--end::主栏-->

        <!--begin::侧栏-->
        <div class="flex-lg-auto min-w-lg-300px">
          <!--begin::分类-->
          <div class="card card-flush py-4 mb-7">
            <div class="card-header">
              <div class="card-title"><h2>分类</h2></div>
            </div>
            <div class="card-body pt-0">
              <label class="required form-label">商品分类</label>
              <select v-model.number="form.categoryId" class="form-select form-select-solid">
                <option :value="0" disabled>请选择分类</option>
                <template v-for="cat in categories" :key="cat.id">
                  <option :value="cat.id">{{ cat.name }}</option>
                  <option v-for="child in cat.children" :key="child.id" :value="child.id">
                    &nbsp;&nbsp;└ {{ child.name }}
                  </option>
                </template>
              </select>
            </div>
          </div>
          <!--end::分类-->

          <!--begin::商家-->
          <div class="card card-flush py-4 mb-7">
            <div class="card-header">
              <div class="card-title"><h2>商家</h2></div>
            </div>
            <div class="card-body pt-0">
              <label class="required form-label">所属商家</label>
              <select v-model.number="form.merchantId" class="form-select form-select-solid">
                <option :value="0" disabled>请选择商家</option>
                <option v-for="m in merchants" :key="m.id" :value="m.id">{{ m.name }}</option>
              </select>
            </div>
          </div>
          <!--end::商家-->

          <!--begin::状态-->
          <div class="card card-flush py-4">
            <div class="card-header">
              <div class="card-title"><h2>状态</h2></div>
            </div>
            <div class="card-body pt-0">
              <select v-model.number="form.status" class="form-select form-select-solid">
                <option :value="1">上架</option>
                <option :value="0">下架</option>
              </select>
              <div class="text-muted fs-7 mt-2">设置商品上下架状态</div>
            </div>
          </div>
          <!--end::状态-->
        </div>
        <!--end::侧栏-->
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/core/api'

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.id)
const loading = ref(false)
const saving = ref(false)

const form = reactive({
  name: '',
  description: '',
  price: 0,
  originalPrice: 0,
  categoryId: 0,
  merchantId: 0,
  status: 1,
  images: [] as { url: string }[],
})
const newImageUrl = ref('')

const categories = ref<any[]>([])
const merchants = ref<any[]>([])

function addImage() {
  const url = newImageUrl.value.trim()
  if (url) {
    form.images.push({ url })
    newImageUrl.value = ''
  }
}

async function loadDropdowns() {
  try {
    const [catRes, merRes]: any[] = await Promise.all([
      api.get('/categories/tree'),
      api.get('/admin/merchants', { params: { page: 1, pageSize: 100 } }),
    ])
    categories.value = catRes.data
    merchants.value = merRes.data.list
  } catch {}
}

async function loadProduct() {
  if (!isEdit.value) return
  loading.value = true
  try {
    const res: any = await api.get(`/admin/products/${route.params.id}`)
    const p = res.data
    Object.assign(form, {
      name: p.name,
      description: p.description || '',
      price: p.price,
      originalPrice: p.originalPrice || 0,
      categoryId: p.categoryId,
      merchantId: p.merchantId,
      status: p.status ?? 1,
      images: (p.images || []).map((img: any) => ({ url: img.url })),
    })
  } catch {
    router.push('/products')
  } finally {
    loading.value = false
  }
}

async function handleSave() {
  if (!form.name || !form.price || !form.categoryId || !form.merchantId) {
    alert('请填写完整必填信息（名称、价格、分类、商家）')
    return
  }
  saving.value = true
  try {
    const payload: any = {
      name: form.name,
      price: form.price,
      originalPrice: form.originalPrice || undefined,
      description: form.description || undefined,
      categoryId: form.categoryId,
      merchantId: form.merchantId,
      status: form.status,
    }
    if (isEdit.value) {
      await api.put(`/admin/products/${route.params.id}`, payload)
      // 同步图片
      await api.put(`/admin/products/${route.params.id}/images`, {
        images: form.images.map((img, i) => ({ url: img.url, sort: i })),
      })
    } else {
      const res: any = await api.post('/admin/products', payload)
      // 新建后设置图片
      if (form.images.length && res.data?.id) {
        await api.put(`/admin/products/${res.data.id}/images`, {
          images: form.images.map((img, i) => ({ url: img.url, sort: i })),
        })
      }
    }
    router.push('/products')
  } catch {} finally {
    saving.value = false
  }
}

onMounted(async () => {
  await loadDropdowns()
  await loadProduct()
})
</script>
