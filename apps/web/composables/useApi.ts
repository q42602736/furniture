/**
 * C 端 API 请求工具
 * 基于 Nuxt $fetch，支持 token 自动附加
 */
export function useApi() {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase as string
  const token = useCookie('user_token')

  /** 通用请求 */
  async function request<T = any>(url: string, options: any = {}): Promise<T> {
    const headers: Record<string, string> = { ...(options.headers || {}) }
    if (token.value) {
      headers.Authorization = `Bearer ${token.value}`
    }
    const res: any = await $fetch(url, {
      baseURL: apiBase,
      ...options,
      headers,
    })
    return res
  }

  const get = <T = any>(url: string, params?: Record<string, any>) =>
    request<T>(url, { method: 'GET', params })

  const post = <T = any>(url: string, body?: any) =>
    request<T>(url, { method: 'POST', body })

  const put = <T = any>(url: string, body?: any) =>
    request<T>(url, { method: 'PUT', body })

  const del = <T = any>(url: string) =>
    request<T>(url, { method: 'DELETE' })

  return { request, get, post, put, del, apiBase }
}
