<template>
  <div class="d-flex justify-content-center align-items-center" style="min-height: 100vh; background: #f5f8fa;">
    <div class="card shadow-sm" style="width: 420px;">
      <div class="card-body p-5">
        <h3 class="text-center mb-1">美家优选</h3>
        <p class="text-center text-muted mb-4">平台管理后台</p>
        <div v-if="errorMsg" class="alert alert-danger py-2">{{ errorMsg }}</div>
        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label class="form-label">账号</label>
            <input v-model="form.username" type="text" class="form-control" placeholder="请输入管理员账号" required />
          </div>
          <div class="mb-3">
            <label class="form-label">密码</label>
            <input v-model="form.password" type="password" class="form-control" placeholder="请输入密码" required />
          </div>
          <button type="submit" class="btn btn-primary w-100" :disabled="loading">
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </form>
      </div>
    </div>
  </div>
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
    router.push('/')
  } catch (e: any) {
    errorMsg.value = e.message || '登录失败'
  } finally {
    loading.value = false
  }
}
</script>
