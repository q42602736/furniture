<template>
  <footer class="bg-gray-800 text-gray-300 mt-12">
    <div class="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
      <div>
        <h3 class="text-white font-semibold mb-3">购物指南</h3>
        <ul class="space-y-1 text-sm">
          <li><NuxtLink to="/help/register" class="hover:text-white">注册登录</NuxtLink></li>
          <li><NuxtLink to="/help/order" class="hover:text-white">购物流程</NuxtLink></li>
          <li><NuxtLink to="/help/payment" class="hover:text-white">支付方式</NuxtLink></li>
        </ul>
      </div>
      <div>
        <h3 class="text-white font-semibold mb-3">配送服务</h3>
        <ul class="space-y-1 text-sm">
          <li><NuxtLink to="/help/delivery" class="hover:text-white">配送说明</NuxtLink></li>
          <li><NuxtLink to="/help/install" class="hover:text-white">安装服务</NuxtLink></li>
        </ul>
      </div>
      <div>
        <h3 class="text-white font-semibold mb-3">售后服务</h3>
        <ul class="space-y-1 text-sm">
          <li><NuxtLink to="/help/return" class="hover:text-white">退换货政策</NuxtLink></li>
          <li><NuxtLink to="/help/warranty" class="hover:text-white">质保说明</NuxtLink></li>
        </ul>
      </div>
      <div>
        <h3 class="text-white font-semibold mb-3">关于我们</h3>
        <ul class="space-y-1 text-sm">
          <li><NuxtLink to="/about" class="hover:text-white">平台介绍</NuxtLink></li>
          <li><NuxtLink to="/contact" class="hover:text-white">联系我们</NuxtLink></li>
          <li><NuxtLink to="/merchant/join" class="hover:text-white">商家入驻</NuxtLink></li>
        </ul>
      </div>
    </div>
    <div class="border-t border-gray-700 text-center py-4 text-sm text-gray-500">
      © 2026 美家优选 版权所有
    </div>
  </footer>
</template>
