<template>
  <div>
    <div class="card">
      <div class="card-header">管理员信息</div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">账号</label>
              <input :value="authStore.user?.username" class="form-control" disabled />
            </div>
            <div class="mb-3">
              <label class="form-label">姓名</label>
              <input :value="authStore.user?.realName || '-'" class="form-control" disabled />
            </div>
            <div class="mb-3">
              <label class="form-label">角色</label>
              <input :value="authStore.user?.role" class="form-control" disabled />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
</script>
