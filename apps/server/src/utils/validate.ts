import { type ZodType, type output, ZodError } from 'zod'
import { AppError } from './errors.js'

/** 校验请求数据，失败时抛出 AppError */
export function validate<T extends ZodType>(schema: T, data: unknown): output<T> {
  try {
    return schema.parse(data)
  } catch (err) {
    if (err instanceof ZodError) {
      const message = err.errors.map((e) => e.message).join('; ')
      throw new AppError(400, message)
    }
    throw err
  }
}
