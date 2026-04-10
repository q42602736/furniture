<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-10">
    <div class="flex w-[900px] bg-white rounded-2xl shadow-xl overflow-hidden">
      <!-- 左侧品牌区 -->
      <div class="hidden md:flex w-[400px] bg-gradient-to-br from-orange-400 to-orange-600 p-10 flex-col justify-between text-white shrink-0">
        <div>
          <div class="flex items-center gap-3 mb-8">
            <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur">
              <span class="text-2xl font-bold">美</span>
            </div>
            <div>
              <div class="text-xl font-bold leading-tight">美家优选</div>
              <div class="text-xs opacity-80 tracking-wider">MEIJIA SELECT</div>
            </div>
          </div>
          <h2 class="text-2xl font-bold mb-3">品质家居 一站购齐</h2>
          <p class="text-sm opacity-80 leading-relaxed">汇聚全球精选家居品牌，为您打造理想的生活空间。正品保障、全国配送、专业安装。</p>
        </div>
        <div class="space-y-3 text-sm opacity-80">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            100+ 品牌入驻
          </div>
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            7天无理由退换
          </div>
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            全国免费配送安装
          </div>
        </div>
      </div>

      <!-- 右侧表单区 -->
      <div class="flex-1 p-10">
        <!-- Tab 切换 -->
        <div class="flex border-b border-gray-100 mb-8">
          <button
            :class="[
              'pb-3 px-4 text-base font-medium transition relative',
              isLogin ? 'text-gray-800' : 'text-gray-400 hover:text-gray-600'
            ]"
            @click="isLogin = true"
          >
            登录
            <div v-if="isLogin" class="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"/>
          </button>
          <button
            :class="[
              'pb-3 px-4 text-base font-medium transition relative',
              !isLogin ? 'text-gray-800' : 'text-gray-400 hover:text-gray-600'
            ]"
            @click="isLogin = false"
          >
            注册
            <div v-if="!isLogin" class="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"/>
          </button>
        </div>

        <!-- 登录表单 -->
        <form v-if="isLogin" class="space-y-5" @submit.prevent="handleLogin">
          <div>
            <label class="block text-sm text-gray-600 mb-1.5">手机号 / 邮箱</label>
            <input
              v-model="loginForm.account"
              type="text"
              placeholder="请输入手机号或邮箱"
              class="w-full h-11 border border-gray-200 rounded-lg px-4 text-sm focus:outline-none focus:border-orange-500 transition"
            />
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1.5">密码</label>
            <input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              class="w-full h-11 border border-gray-200 rounded-lg px-4 text-sm focus:outline-none focus:border-orange-500 transition"
            />
          </div>
          <div class="flex items-center justify-between text-sm">
            <label class="flex items-center gap-2 cursor-pointer text-gray-500">
              <input type="checkbox" v-model="loginForm.remember" class="w-4 h-4 accent-orange-500" />
              记住我
            </label>
            <NuxtLink to="/forgot-password" class="text-orange-500 hover:underline">忘记密码？</NuxtLink>
          </div>
          <button type="submit" class="w-full h-11 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition">
            登录
          </button>
        </form>

        <!-- 注册表单 -->
        <form v-else class="space-y-4" @submit.prevent="handleRegister">
          <div>
            <label class="block text-sm text-gray-600 mb-1.5">手机号</label>
            <input
              v-model="registerForm.phone"
              type="tel"
              placeholder="请输入手机号"
              class="w-full h-11 border border-gray-200 rounded-lg px-4 text-sm focus:outline-none focus:border-orange-500 transition"
            />
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1.5">验证码</label>
            <div class="flex gap-3">
              <input
                v-model="registerForm.code"
                type="text"
                placeholder="请输入验证码"
                class="flex-1 h-11 border border-gray-200 rounded-lg px-4 text-sm focus:outline-none focus:border-orange-500 transition"
              />
              <button
                type="button"
                :class="[
                  'shrink-0 h-11 px-5 rounded-lg text-sm transition',
                  codeCooldown > 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'border border-orange-500 text-orange-500 hover:bg-orange-50'
                ]"
                :disabled="codeCooldown > 0"
                @click="sendCode"
              >
                {{ codeCooldown > 0 ? `${codeCooldown}s` : '获取验证码' }}
              </button>
            </div>
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1.5">设置密码</label>
            <input
              v-model="registerForm.password"
              type="password"
              placeholder="请设置6-20位密码"
              class="w-full h-11 border border-gray-200 rounded-lg px-4 text-sm focus:outline-none focus:border-orange-500 transition"
            />
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1.5">确认密码</label>
            <input
              v-model="registerForm.confirmPassword"
              type="password"
              placeholder="请再次输入密码"
              class="w-full h-11 border border-gray-200 rounded-lg px-4 text-sm focus:outline-none focus:border-orange-500 transition"
            />
          </div>
          <label class="flex items-start gap-2 text-xs text-gray-400">
            <input type="checkbox" v-model="registerForm.agree" class="w-4 h-4 accent-orange-500 mt-0.5" />
            <span>我已阅读并同意 <NuxtLink to="/terms" class="text-orange-500">《用户协议》</NuxtLink> 和 <NuxtLink to="/privacy" class="text-orange-500">《隐私政策》</NuxtLink></span>
          </label>
          <button type="submit" class="w-full h-11 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition">
            注册
          </button>
        </form>

        <!-- 第三方登录 -->
        <div class="mt-8 pt-6 border-t border-gray-100">
          <p class="text-center text-xs text-gray-400 mb-4">其他登录方式</p>
          <div class="flex items-center justify-center gap-6">
            <button class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-lg hover:bg-green-600 transition" title="微信登录">
              微
            </button>
            <button class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-lg hover:bg-blue-600 transition" title="QQ登录">
              Q
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const isLogin = ref(true)
const codeCooldown = ref(0)

const loginForm = reactive({
  account: '',
  password: '',
  remember: false,
})

const registerForm = reactive({
  phone: '',
  code: '',
  password: '',
  confirmPassword: '',
  agree: false,
})

function handleLogin() {
  // TODO: 接入登录 API
  navigateTo('/')
}

function handleRegister() {
  // TODO: 接入注册 API
  navigateTo('/')
}

function sendCode() {
  if (codeCooldown.value > 0) return
  codeCooldown.value = 60
  const timer = setInterval(() => {
    codeCooldown.value--
    if (codeCooldown.value <= 0) clearInterval(timer)
  }, 1000)
}

useHead({ title: '登录/注册 - 美家优选' })
</script>
