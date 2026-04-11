import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import * as adminAuthService from '../services/admin-auth.service.js'
import { success } from '../utils/response.js'
import { validate } from '../utils/validate.js'
import { adminGuard } from '../middlewares/auth.js'

const loginSchema = z.object({
  username: z.string().min(1, '请输入账号'),
  password: z.string().min(1, '请输入密码'),
})

export default async function adminAuthRoutes(app: FastifyInstance) {
  /** POST /api/v1/auth/admin/login — 管理员登录 */
  app.post('/login', async (request) => {
    const { username, password } = validate(loginSchema, request.body)
    const user = await adminAuthService.adminLogin(username, password)
    const token = app.jwt.sign({ id: user.id, type: 'admin' }, { expiresIn: '7d' })
    return success({ user, token }, '登录成功')
  })

  /** GET /api/v1/auth/admin/profile — 管理员信息 */
  app.get('/profile', { preHandler: [adminGuard] }, async (request) => {
    const { id } = request.user as { id: number }
    const admin = await adminAuthService.getAdminProfile(id)
    return success(admin)
  })

  /** PUT /api/v1/admin-auth/password — 修改密码 */
  app.put('/password', { preHandler: [adminGuard] }, async (request) => {
    const { id } = request.user as { id: number }
    const { oldPassword, newPassword } = validate(
      z.object({
        oldPassword: z.string().min(1, '请输入原密码'),
        newPassword: z.string().min(6, '新密码至少6位'),
      }),
      request.body,
    )
    await adminAuthService.changePassword(id, oldPassword, newPassword)
    return success(null, '密码修改成功')
  })
}
