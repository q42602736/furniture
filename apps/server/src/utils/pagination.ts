import { z } from 'zod'

/** 分页参数 schema */
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
})

export type PaginationParams = z.infer<typeof paginationSchema>

/** 计算 skip */
export function getSkip(page: number, pageSize: number): number {
  return (page - 1) * pageSize
}
