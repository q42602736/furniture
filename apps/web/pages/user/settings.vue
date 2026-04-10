<template>
  <div>
    <div class="bg-white rounded-lg p-6">
      <h3 class="text-base font-medium text-gray-800 mb-6">账户设置</h3>

      <div class="max-w-[500px] space-y-6">
        <!-- 头像 -->
        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-500 w-20 shrink-0">头像</span>
          <div class="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-xl font-bold cursor-pointer">
            U
          </div>
          <button class="text-sm text-orange-500 hover:underline">更换头像</button>
        </div>

        <!-- 昵称 -->
        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-500 w-20 shrink-0">昵称</span>
          <input
            value="用户昵称"
            type="text"
            class="flex-1 h-10 border border-gray-200 rounded px-3 text-sm focus:outline-none focus:border-orange-500 transition"
          />
        </div>

        <!-- 性别 -->
        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-500 w-20 shrink-0">性别</span>
          <div class="flex gap-4 text-sm text-gray-600">
            <label class="flex items-center gap-1 cursor-pointer">
              <input type="radio" name="gender" value="male" class="accent-orange-500" checked /> 男
            </label>
            <label class="flex items-center gap-1 cursor-pointer">
              <input type="radio" name="gender" value="female" class="accent-orange-500" /> 女
            </label>
            <label class="flex items-center gap-1 cursor-pointer">
              <input type="radio" name="gender" value="secret" class="accent-orange-500" /> 保密
            </label>
          </div>
        </div>

        <!-- 手机号 -->
        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-500 w-20 shrink-0">手机号</span>
          <span class="text-sm text-gray-700">138****8888</span>
          <button class="text-sm text-orange-500 hover:underline">修改</button>
        </div>

        <!-- 邮箱 -->
        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-500 w-20 shrink-0">邮箱</span>
          <span class="text-sm text-gray-400">未绑定</span>
          <button class="text-sm text-orange-500 hover:underline">绑定</button>
        </div>

        <!-- 修改密码 -->
        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-500 w-20 shrink-0">登录密码</span>
          <span class="text-sm text-gray-700">已设置</span>
          <button class="text-sm text-orange-500 hover:underline">修改密码</button>
        </div>

        <div class="pt-4 border-t border-gray-100">
          <button class="h-10 px-8 bg-orange-500 text-white rounded hover:bg-orange-600 transition text-sm">保存修改</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'user' })
useHead({ title: '账户设置 - 美家优选' })
</script>
