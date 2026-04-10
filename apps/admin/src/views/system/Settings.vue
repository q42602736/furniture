<template>
  <div>
    <!--begin::导航标签-->
    <ul class="nav nav-custom nav-tabs nav-line-tabs nav-line-tabs-2x border-0 fs-4 fw-semibold mb-8">
      <li class="nav-item">
        <a
          class="nav-link text-active-primary pb-4"
          :class="{ active: activeTab === 'profile' }"
          href="javascript:;"
          @click="activeTab = 'profile'"
        >
          <KTIcon icon-name="profile-circle" icon-class="fs-4 me-1" />
          管理员信息
        </a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link text-active-primary pb-4"
          :class="{ active: activeTab === 'password' }"
          href="javascript:;"
          @click="activeTab = 'password'"
        >
          <KTIcon icon-name="lock-2" icon-class="fs-4 me-1" />
          修改密码
        </a>
      </li>
    </ul>
    <!--end::导航标签-->

    <!--begin::管理员信息-->
    <div v-show="activeTab === 'profile'" class="card card-flush">
      <div class="card-header">
        <div class="card-title">
          <h3 class="fw-bold m-0">管理员资料</h3>
        </div>
      </div>
      <div class="card-body pt-2">
        <div class="d-flex align-items-center mb-8">
          <div class="symbol symbol-60px me-5">
            <span class="symbol-label bg-light-primary fs-1 fw-bold text-primary">
              {{ (authStore.user?.username || 'A')[0].toUpperCase() }}
            </span>
          </div>
          <div>
            <span class="text-gray-800 fs-3 fw-bold">{{ authStore.user?.realName || authStore.user?.username }}</span>
            <div class="text-muted fs-7">{{ authStore.user?.role === 'superadmin' ? '超级管理员' : '管理员' }}</div>
          </div>
        </div>
        <div class="separator my-5"></div>
        <div class="row mb-5">
          <label class="col-lg-4 col-form-label fw-semibold text-muted fs-6">账号</label>
          <div class="col-lg-8">
            <span class="fw-bold fs-6 text-gray-800">{{ authStore.user?.username }}</span>
          </div>
        </div>
        <div class="row mb-5">
          <label class="col-lg-4 col-form-label fw-semibold text-muted fs-6">姓名</label>
          <div class="col-lg-8">
            <span class="fw-bold fs-6 text-gray-800">{{ authStore.user?.realName || '-' }}</span>
          </div>
        </div>
        <div class="row mb-5">
          <label class="col-lg-4 col-form-label fw-semibold text-muted fs-6">角色</label>
          <div class="col-lg-8">
            <span class="badge badge-light-primary fs-7 fw-semibold">{{ authStore.user?.role }}</span>
          </div>
        </div>
      </div>
    </div>
    <!--end::管理员信息-->

    <!--begin::修改密码-->
    <div v-show="activeTab === 'password'" class="card card-flush">
      <div class="card-header">
        <div class="card-title">
          <h3 class="fw-bold m-0">修改密码</h3>
        </div>
      </div>
      <div class="card-body pt-2">
        <div class="mw-450px">
          <div class="mb-5">
            <label class="form-label required fw-semibold fs-6">原密码</label>
            <input v-model="pwdForm.oldPassword" type="password" class="form-control form-control-solid" />
          </div>
          <div class="mb-5">
            <label class="form-label required fw-semibold fs-6">新密码</label>
            <input v-model="pwdForm.newPassword" type="password" class="form-control form-control-solid" />
            <div class="form-text">密码至少 6 位字符</div>
          </div>
          <div class="mb-5">
            <label class="form-label required fw-semibold fs-6">确认新密码</label>
            <input v-model="pwdForm.confirmPassword" type="password" class="form-control form-control-solid" />
          </div>
          <!--begin::提示消息-->
          <div v-if="pwdError" class="alert alert-danger d-flex align-items-center p-5 mb-5">
            <KTIcon icon-name="information-5" icon-class="fs-2hx text-danger me-4" />
            <div class="d-flex flex-column">
              <span>{{ pwdError }}</span>
            </div>
          </div>
          <div v-if="pwdSuccess" class="alert alert-success d-flex align-items-center p-5 mb-5">
            <KTIcon icon-name="check-circle" icon-class="fs-2hx text-success me-4" />
            <div class="d-flex flex-column">
              <span>{{ pwdSuccess }}</span>
            </div>
          </div>
          <!--end::提示消息-->
          <div class="d-flex gap-3">
            <button class="btn btn-primary" :disabled="pwdSaving" @click="changePassword">
              <span v-if="pwdSaving" class="spinner-border spinner-border-sm align-middle me-1"></span>
              {{ pwdSaving ? '修改中...' : '修改密码' }}
            </button>
            <button class="btn btn-light" @click="resetPwdForm">重置</button>
          </div>
        </div>
      </div>
    </div>
    <!--end::修改密码-->
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/core/api'

const authStore = useAuthStore()
const activeTab = ref('profile')

const pwdForm = reactive({ oldPassword: '', newPassword: '', confirmPassword: '' })
const pwdSaving = ref(false)
const pwdError = ref('')
const pwdSuccess = ref('')

function resetPwdForm() {
  Object.assign(pwdForm, { oldPassword: '', newPassword: '', confirmPassword: '' })
  pwdError.value = ''
  pwdSuccess.value = ''
}

async function changePassword() {
  pwdError.value = ''
  pwdSuccess.value = ''

  if (!pwdForm.oldPassword || !pwdForm.newPassword) {
    pwdError.value = '请填写完整'
    return
  }
  if (pwdForm.newPassword.length < 6) {
    pwdError.value = '新密码至少6位'
    return
  }
  if (pwdForm.newPassword !== pwdForm.confirmPassword) {
    pwdError.value = '两次密码不一致'
    return
  }

  pwdSaving.value = true
  try {
    await api.put('/admin-auth/password', {
      oldPassword: pwdForm.oldPassword,
      newPassword: pwdForm.newPassword,
    })
    pwdSuccess.value = '密码修改成功'
    Object.assign(pwdForm, { oldPassword: '', newPassword: '', confirmPassword: '' })
  } catch (err: any) {
    pwdError.value = err.message || '修改失败'
  } finally {
    pwdSaving.value = false
  }
}
</script>
