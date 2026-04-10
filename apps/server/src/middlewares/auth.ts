import type { FastifyRequest, FastifyReply } from 'fastify'
import { unauthorized } from '../utils/errors.js'

interface JwtPayload {
  id: number
  type: 'user' | 'merchant' | 'admin'
}

/** 验证 JWT token，解析后挂载到 request.user */
export async function authGuard(request: FastifyRequest, _reply: FastifyReply) {
  try {
    const decoded = await request.jwtVerify<JwtPayload>()
    request.user = decoded
  } catch {
    unauthorized()
  }
}

/** 仅允许消费者用户 */
export async function userGuard(request: FastifyRequest, reply: FastifyReply) {
  await authGuard(request, reply)
  if ((request.user as JwtPayload).type !== 'user') {
    unauthorized('此接口仅限消费者用户')
  }
}

/** 仅允许商家用户 */
export async function merchantGuard(request: FastifyRequest, reply: FastifyReply) {
  await authGuard(request, reply)
  if ((request.user as JwtPayload).type !== 'merchant') {
    unauthorized('此接口仅限商家用户')
  }
}

/** 仅允许平台管理员 */
export async function adminGuard(request: FastifyRequest, reply: FastifyReply) {
  await authGuard(request, reply)
  if ((request.user as JwtPayload).type !== 'admin') {
    unauthorized('此接口仅限平台管理员')
  }
}
