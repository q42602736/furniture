import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/core/api'

interface MerchantUser {
  id: number
  merchantId: number
  username: string
  realName: string | null
  role: string
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('merchant_token') || '')
  const user = ref<MerchantUser | null>(
    JSON.parse(localStorage.getItem('merchant_user') || 'null'),
  )

  const isLoggedIn = computed(() => !!token.value)

  async function login(username: string, password: string) {
    const res: any = await api.post('/auth/merchant/login', { username, password })
    token.value = res.data.token
    user.value = res.data.user
    localStorage.setItem('merchant_token', res.data.token)
    localStorage.setItem('merchant_user', JSON.stringify(res.data.user))
  }

  function logout() {
    token.value = ''
    user.value = null
    localStorage.removeItem('merchant_token')
    localStorage.removeItem('merchant_user')
  }

  return { token, user, isLoggedIn, login, logout }
})
