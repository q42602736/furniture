<template>
  <footer class="bg-[#2c2c2c] text-gray-400 mt-8">
    <!-- 服务条特征 -->
    <div class="border-b border-gray-700">
      <div class="max-w-[1200px] mx-auto px-4 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl">🧹</span>
          <div>
            <p class="text-white text-sm font-medium">家政到家</p>
            <p class="text-xs">保洁、收纳、月嫂等服务分类展示</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-3xl">🎨</span>
          <div>
            <p class="text-white text-sm font-medium">设计配套</p>
            <p class="text-xs">工装家装设计与空间方案集中展示</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-3xl">🏡</span>
          <div>
            <p class="text-white text-sm font-medium">自建房规划</p>
            <p class="text-xs">乡镇自建房、自建院落等主题分类</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-3xl">🌾</span>
          <div>
            <p class="text-white text-sm font-medium">助农展示</p>
            <p class="text-xs">企业责任、项目纪实与图片展示预留</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 链接区 -->
    <div class="max-w-[1200px] mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8">
      <div>
        <h3 class="text-white text-lg font-semibold mb-3">美家优选</h3>
        <p class="text-sm leading-7 text-gray-400 max-w-[560px]">
          平台以分类展示为主，集中呈现家政服务、工装·家装设计、乡镇自建房、建材配套与助农帮扶相关内容，方便按主题查看图片、示例和服务方向。
        </p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div>
          <h3 class="text-white text-sm font-semibold mb-3">核心分类</h3>
          <ul class="space-y-2 text-xs">
            <li><NuxtLink to="/category/housekeeping" class="hover:text-white transition">家政服务</NuxtLink></li>
            <li><NuxtLink to="/category/interior-design" class="hover:text-white transition">工装·家装设计</NuxtLink></li>
            <li><NuxtLink to="/category/township-self-build" class="hover:text-white transition">乡镇自建房</NuxtLink></li>
            <li><NuxtLink to="/category/building-materials" class="hover:text-white transition">建材配套</NuxtLink></li>
            <li><NuxtLink to="/category/rural-support" class="hover:text-white transition">助农帮扶</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h3 class="text-white text-sm font-semibold mb-3">联系我们</h3>
          <p class="text-xs mb-2">客服热线：400-888-0000</p>
          <p class="text-xs mb-2">工作时间：9:00 - 21:00</p>
          <p class="text-xs leading-6">当前页面以分类内容展示为主，后续可继续补充案例图片与详细介绍。</p>
        </div>
      </div>
    </div>

    <!-- 底部版权 -->
    <div class="border-t border-gray-700">
      <div class="max-w-[1200px] mx-auto px-4 py-4 text-center text-xs text-gray-500">
        <p>© 2026 美家优选 版权所有 · 家政服务 · 工装·家装设计 · 乡镇自建房 · 建材配套 · 助农展示</p>
      </div>
    </div>
  </footer>
</template>
