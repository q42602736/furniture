<template>
  <footer class="bg-[#2c2c2c] text-gray-400 mt-8">
    <!-- 服务条特征 -->
    <div class="border-b border-gray-700">
      <div class="max-w-[1200px] mx-auto px-4 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl">🏠</span>
          <div>
            <p class="text-white text-sm font-medium">品质家居</p>
            <p class="text-xs">严选入驻品牌，品质保证</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-3xl">🚛</span>
          <div>
            <p class="text-white text-sm font-medium">全国配送</p>
            <p class="text-xs">专业物流，安全送达</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-3xl">🔧</span>
          <div>
            <p class="text-white text-sm font-medium">免费安装</p>
            <p class="text-xs">专业师傅上门安装</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-3xl">💬</span>
          <div>
            <p class="text-white text-sm font-medium">专属客服</p>
            <p class="text-xs">1对1售前售后服务</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 链接区 -->
    <div class="max-w-[1200px] mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-5 gap-8">
      <div>
        <h3 class="text-white text-sm font-semibold mb-3">购物指南</h3>
        <ul class="space-y-2 text-xs">
          <li><NuxtLink to="/help/register" class="hover:text-white transition">注册登录</NuxtLink></li>
          <li><NuxtLink to="/help/order" class="hover:text-white transition">购物流程</NuxtLink></li>
          <li><NuxtLink to="/help/payment" class="hover:text-white transition">支付方式</NuxtLink></li>
          <li><NuxtLink to="/help/coupon" class="hover:text-white transition">优惠券使用</NuxtLink></li>
        </ul>
      </div>
      <div>
        <h3 class="text-white text-sm font-semibold mb-3">配送服务</h3>
        <ul class="space-y-2 text-xs">
          <li><NuxtLink to="/help/delivery" class="hover:text-white transition">配送范围</NuxtLink></li>
          <li><NuxtLink to="/help/install" class="hover:text-white transition">安装服务</NuxtLink></li>
          <li><NuxtLink to="/help/freight" class="hover:text-white transition">运费说明</NuxtLink></li>
        </ul>
      </div>
      <div>
        <h3 class="text-white text-sm font-semibold mb-3">售后服务</h3>
        <ul class="space-y-2 text-xs">
          <li><NuxtLink to="/help/return" class="hover:text-white transition">退换货政策</NuxtLink></li>
          <li><NuxtLink to="/help/warranty" class="hover:text-white transition">质保说明</NuxtLink></li>
          <li><NuxtLink to="/help/complaint" class="hover:text-white transition">投诉建议</NuxtLink></li>
        </ul>
      </div>
      <div>
        <h3 class="text-white text-sm font-semibold mb-3">关于我们</h3>
        <ul class="space-y-2 text-xs">
          <li><NuxtLink to="/about" class="hover:text-white transition">平台介绍</NuxtLink></li>
          <li><NuxtLink to="/contact" class="hover:text-white transition">联系我们</NuxtLink></li>
          <li><NuxtLink to="/merchant/join" class="hover:text-white transition">商家入驻</NuxtLink></li>
          <li><NuxtLink to="/jobs" class="hover:text-white transition">加入我们</NuxtLink></li>
        </ul>
      </div>
      <div>
        <h3 class="text-white text-sm font-semibold mb-3">联系我们</h3>
        <p class="text-xs mb-2">客服热线：400-888-0000</p>
        <p class="text-xs mb-3">工作时间：9:00 - 21:00</p>
        <div class="w-24 h-24 bg-gray-600 rounded-lg flex items-center justify-center text-xs">
          微信二维码
        </div>
      </div>
    </div>

    <!-- 底部版权 -->
    <div class="border-t border-gray-700">
      <div class="max-w-[1200px] mx-auto px-4 py-4 text-center text-xs text-gray-500">
        <p>© 2026 美家优选 版权所有 · 多商家入驻家居电商平台</p>
        <p class="mt-1">
          <NuxtLink to="/privacy" class="hover:text-gray-400">隐私政策</NuxtLink>
          <span class="mx-2">|</span>
          <NuxtLink to="/terms" class="hover:text-gray-400">用户协议</NuxtLink>
          <span class="mx-2">|</span>
          <NuxtLink to="/sitemap" class="hover:text-gray-400">网站地图</NuxtLink>
        </p>
      </div>
    </div>
  </footer>
</template>
