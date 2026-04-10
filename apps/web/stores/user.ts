import { defineStore } from 'pinia'

interface UserInfo {
  id: number
  phone: string
  nickname: string | null
  avatar: string | null
}

export const useUserStore = defineStore('user', () => {
  const token = useCookie('user_token', { maxAge: 60 * 60 * 24 * 7 })
  const user = ref<UserInfo | null>(null)
  const isLoggedIn = computed(() => !!token.value)

  const { get, post, put } = useApi()

  /** 登录 */
  async function login(phone: string, password: string) {
    const res: any = await post('/v1/auth/login', { phone, password })
    token.value = res.data.token
    user.value = res.data.user
  }

  /** 注册 */
  async function register(phone: string, password: string, nickname?: string) {
    const res: any = await post('/v1/auth/register', { phone, password, nickname })
    token.value = res.data.token
    user.value = res.data.user
  }

  /** 获取用户信息 */
  async function fetchProfile() {
    if (!token.value) return
    try {
      const res: any = await get('/v1/auth/profile')
      user.value = res.data
    } catch {
      // token 失效
      token.value = null
      user.value = null
    }
  }

  /** 更新用户信息 */
  async function updateProfile(data: { nickname?: string; avatar?: string }) {
    const res: any = await put('/v1/auth/profile', data)
    user.value = res.data
  }

  /** 退出 */
  function logout() {
    token.value = null
    user.value = null
    navigateTo('/login')
  }

  return { token, user, isLoggedIn, login, register, fetchProfile, updateProfile, logout }
})
