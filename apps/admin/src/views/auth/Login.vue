<template>
  <!--begin::Authentication - Sign-in-->
  <div class="d-flex flex-column flex-lg-row flex-column-fluid">
    <!--begin::Body-->
    <div class="d-flex flex-column flex-lg-row-fluid w-lg-50 p-10 order-2 order-lg-1">
      <!--begin::Form-->
      <div class="d-flex flex-center flex-column flex-lg-row-fluid">
        <!--begin::Wrapper-->
        <div class="w-lg-500px p-10">
          <!--begin::Form-->
          <form class="form w-100" id="kt_login_signin_form" @submit.prevent="handleLogin">
            <!--begin::Heading-->
            <div class="text-center mb-11">
              <h1 class="text-gray-900 fw-bolder mb-3">美家优选管理后台</h1>
              <div class="text-gray-500 fw-semibold fs-6">请使用管理员账号登录</div>
            </div>
            <!--end::Heading-->

            <!--begin::Alert-->
            <div v-if="errorMsg" class="alert alert-danger d-flex align-items-center p-5 mb-10">
              <span class="svg-icon svg-icon-2hx svg-icon-danger me-3">
                <i class="bi bi-exclamation-triangle-fill fs-4 text-danger"></i>
              </span>
              <div class="d-flex flex-column">
                <span>{{ errorMsg }}</span>
              </div>
            </div>
            <!--end::Alert-->

            <!--begin::Input group-->
            <div class="fv-row mb-8">
              <label class="form-label fs-6 fw-bolder text-gray-900">账号</label>
              <input
                v-model="form.username"
                class="form-control bg-transparent"
                type="text"
                name="username"
                autocomplete="off"
                placeholder="请输入管理员账号"
                required
              />
            </div>
            <!--end::Input group-->

            <!--begin::Input group-->
            <div class="fv-row mb-3">
              <label class="form-label fw-bolder text-gray-900 fs-6 mb-0">密码</label>
              <input
                v-model="form.password"
                class="form-control bg-transparent"
                type="password"
                name="password"
                autocomplete="off"
                placeholder="请输入密码"
                required
              />
            </div>
            <!--end::Input group-->

            <!--begin::Actions-->
            <div class="d-grid mb-10 mt-8">
              <button
                type="submit"
                id="kt_sign_in_submit"
                class="btn btn-primary"
                :disabled="loading"
              >
                <span v-if="!loading" class="indicator-label">登录</span>
                <span v-else class="indicator-progress">
                  请稍候...
                  <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                </span>
              </button>
            </div>
            <!--end::Actions-->
          </form>
          <!--end::Form-->
        </div>
        <!--end::Wrapper-->
      </div>
      <!--end::Form-->

      <!--begin::Footer-->
      <div class="d-flex flex-center flex-wrap px-5">
        <div class="d-flex fw-semibold text-primary fs-base">
          <span class="px-5 text-muted">美家优选 © 2024</span>
        </div>
      </div>
      <!--end::Footer-->
    </div>
    <!--end::Body-->

    <!--begin::Aside-->
    <div
      class="d-flex flex-lg-row-fluid w-lg-50 bgi-size-cover bgi-position-center order-1 order-lg-2"
      style="background-image: url('/media/misc/auth-bg.png')"
    >
      <!--begin::Content-->
      <div class="d-flex flex-column flex-center py-7 py-lg-15 px-5 px-md-15 w-100">
        <!--begin::Logo-->
        <a href="/" class="mb-0 mb-lg-12">
          <img
            alt="美家优选"
            src="/media/logos/custom-1.png"
            class="h-60px h-lg-75px"
            onerror="this.style.display='none'"
          />
        </a>
        <!--end::Logo-->

        <!--begin::Title-->
        <h1 class="d-none d-lg-block text-white fs-2qx fw-bolder text-center mb-7">
          美家优选 · 管理平台
        </h1>
        <!--end::Title-->

        <!--begin::Text-->
        <div class="d-none d-lg-block text-white fs-base text-center">
          高效管理您的家居电商平台<br />
          商品 · 订单 · 用户 · 内容，一站式管控
        </div>
        <!--end::Text-->
      </div>
      <!--end::Content-->
    </div>
    <!--end::Aside-->
  </div>
  <!--end::Authentication - Sign-in-->
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const errorMsg = ref('')
const form = reactive({ username: '', password: '' })

async function handleLogin() {
  loading.value = true
  errorMsg.value = ''
  try {
    await authStore.login(form.username, form.password)
    router.push('/dashboard')
  } catch (e: any) {
    errorMsg.value = e.response?.data?.message || e.message || '登录失败，请检查账号密码'
  } finally {
    loading.value = false
  }
}
</script>

