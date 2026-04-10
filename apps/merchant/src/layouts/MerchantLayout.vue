<template>
  <div class="d-flex">
    <!-- 侧边栏 -->
    <aside class="sidebar bg-dark text-white" style="width: 260px; min-height: 100vh;">
      <div class="p-4">
        <h4 class="text-white mb-0">美家优选</h4>
        <small class="text-muted">商家管理后台</small>
      </div>
      <nav class="mt-3">
        <router-link to="/" class="nav-link text-white px-4 py-2 d-block">
          📊 数据看板
        </router-link>
        <router-link to="/products" class="nav-link text-white px-4 py-2 d-block">
          📦 商品管理
        </router-link>
        <router-link to="/orders" class="nav-link text-white px-4 py-2 d-block">
          📋 订单管理
        </router-link>
        <router-link to="/settings" class="nav-link text-white px-4 py-2 d-block">
          ⚙️ 店铺设置
        </router-link>
      </nav>
    </aside>

    <!-- 主内容区 -->
    <div class="flex-grow-1">
      <header class="bg-white shadow-sm px-4 py-3 d-flex align-items-center justify-content-between">
        <h5 class="mb-0">{{ $route.meta.title }}</h5>
        <div>
          <span class="me-3">商家名称</span>
          <button class="btn btn-sm btn-outline-secondary">退出</button>
        </div>
      </header>
      <main class="p-4">
        <router-view />
      </main>
    </div>
  </div>
</template>
