import type { FastifyInstance } from 'fastify'
import { AppError } from '../utils/errors.js'
import { fail } from '../utils/response.js'
import { ZodError } from 'zod'

/** 注册全局错误处理 */
export function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error, _request, reply) => {
    // 业务异常
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send(fail(error.message, error.code))
    }

    // Zod 校验错误
    if (error instanceof ZodError) {
      const message = error.errors.map((e) => e.message).join('; ')
      return reply.status(400).send(fail(message))
    }

    // Fastify 内置校验错误
    if (error.validation) {
      return reply.status(400).send(fail(error.message))
    }

    // 未知错误
    app.log.error(error)
    return reply.status(500).send(fail('服务内部错误'))
  })
}
