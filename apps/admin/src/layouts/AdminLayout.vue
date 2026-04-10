<template>
  <div class="d-flex">
    <!-- 侧边栏 -->
    <aside class="sidebar bg-dark text-white" style="width: 260px; min-height: 100vh;">
      <div class="p-4">
        <h4 class="text-white mb-0">美家优选</h4>
        <small class="text-muted">平台管理后台</small>
      </div>
      <nav class="mt-3">
        <router-link v-for="menu in menus" :key="menu.path" :to="menu.path"
          class="nav-link px-4 py-2 d-block"
          :class="{ 'text-white': !isActive(menu.path), 'bg-primary text-white': isActive(menu.path) }">
          {{ menu.icon }} {{ menu.label }}
        </router-link>
      </nav>
    </aside>

    <!-- 主内容区 -->
    <div class="flex-grow-1">
      <header class="bg-white shadow-sm px-4 py-3 d-flex align-items-center justify-content-between">
        <h5 class="mb-0">{{ $route.meta.title }}</h5>
        <div>
          <span class="me-3">{{ authStore.user?.realName || authStore.user?.username || '管理员' }}</span>
          <button class="btn btn-sm btn-outline-secondary" @click="handleLogout">退出</button>
        </div>
      </header>
      <main class="p-4 bg-light" style="min-height: calc(100vh - 60px);">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const menus = [
  { path: '/', icon: '📊', label: '平台总览' },
  { path: '/merchants', icon: '🏪', label: '商家管理' },
  { path: '/products', icon: '📦', label: '商品管理' },
  { path: '/categories', icon: '📁', label: '分类管理' },
  { path: '/orders', icon: '📋', label: '订单管理' },
  { path: '/users', icon: '👤', label: '用户管理' },
  { path: '/banners', icon: '🖼️', label: 'Banner 管理' },
  { path: '/settings', icon: '⚙️', label: '系统设置' },
]

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>
