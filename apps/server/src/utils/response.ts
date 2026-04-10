/** 统一 API 响应格式 */

export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

export interface PaginatedData<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

/** 成功响应 */
export function success<T>(data: T, message = 'ok'): ApiResponse<T> {
  return { code: 0, message, data }
}

/** 分页成功响应 */
export function paginated<T>(
  list: T[],
  total: number,
  page: number,
  pageSize: number,
): ApiResponse<PaginatedData<T>> {
  return success({
    list,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  })
}

/** 失败响应 */
export function fail(message: string, code = 1): ApiResponse<null> {
  return { code, message, data: null }
}
