import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import * as userService from '../services/user.service.js'
import { success } from '../utils/response.js'
import { validate } from '../utils/validate.js'
import { userGuard } from '../middlewares/auth.js'

const registerSchema = z.object({
  phone: z.string().regex(/^1[3-9]\d{9}$/, '手机号格式不正确'),
  password: z.string().min(6, '密码至少6位').max(20, '密码最多20位'),
})

const loginSchema = z.object({
  phone: z.string().regex(/^1[3-9]\d{9}$/, '手机号格式不正确'),
  password: z.string().min(1, '请输入密码'),
})

export default async function authRoutes(app: FastifyInstance) {
  /** POST /api/v1/auth/register — 用户注册 */
  app.post('/register', async (request, reply) => {
    const { phone, password } = validate(registerSchema, request.body)
    const user = await userService.register(phone, password)
    const token = app.jwt.sign({ id: user.id, type: 'user' }, { expiresIn: '7d' })
    return success({ user, token }, '注册成功')
  })

  /** POST /api/v1/auth/login — 用户登录 */
  app.post('/login', async (request, reply) => {
    const { phone, password } = validate(loginSchema, request.body)
    const user = await userService.login(phone, password)
    const token = app.jwt.sign({ id: user.id, type: 'user' }, { expiresIn: '7d' })
    return success({ user, token }, '登录成功')
  })

  /** GET /api/v1/auth/profile — 获取当前用户信息 */
  app.get('/profile', { preHandler: [userGuard] }, async (request) => {
    const userId = (request.user as { id: number }).id
    const user = await userService.getUserProfile(userId)
    return success(user)
  })

  /** PUT /api/v1/auth/profile — 更新用户信息 */
  app.put('/profile', { preHandler: [userGuard] }, async (request) => {
    const userId = (request.user as { id: number }).id
    const data = validate(
      z.object({
        nickname: z.string().min(1).max(50).optional(),
        avatar: z.string().max(500).optional(),
      }),
      request.body,
    )
    const user = await userService.updateUserProfile(userId, data)
    return success(user, '更新成功')
  })

  /** PUT /api/v1/auth/password — 修改密码 */
  app.put('/password', { preHandler: [userGuard] }, async (request) => {
    const userId = (request.user as { id: number }).id
    const { oldPassword, newPassword } = validate(
      z.object({
        oldPassword: z.string().min(1, '请输入原密码'),
        newPassword: z.string().min(6, '新密码至少6位').max(20),
      }),
      request.body,
    )
    await userService.changePassword(userId, oldPassword, newPassword)
    return success(null, '密码修改成功')
  })
}
