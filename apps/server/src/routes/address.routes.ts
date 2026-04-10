import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import * as userService from '../services/user.service.js'
import { success } from '../utils/response.js'
import { validate } from '../utils/validate.js'
import { userGuard } from '../middlewares/auth.js'

const createAddressSchema = z.object({
  name: z.string().min(1, '收货人不能为空').max(50),
  phone: z.string().regex(/^1[3-9]\d{9}$/, '手机号格式不正确'),
  province: z.string().min(1, '省份不能为空').max(50),
  city: z.string().min(1, '城市不能为空').max(50),
  district: z.string().min(1, '区县不能为空').max(50),
  address: z.string().min(1, '详细地址不能为空').max(255),
  isDefault: z.boolean().default(false),
})

const updateAddressSchema = createAddressSchema.partial()

export default async function addressRoutes(app: FastifyInstance) {
  // 所有地址接口都需要用户认证
  app.addHook('preHandler', userGuard)

  /** GET /api/v1/addresses — 获取地址列表 */
  app.get('/', async (request) => {
    const userId = (request.user as { id: number }).id
    const addresses = await userService.getAddresses(userId)
    return success(addresses)
  })

  /** POST /api/v1/addresses — 创建地址 */
  app.post('/', async (request) => {
    const userId = (request.user as { id: number }).id
    const data = validate(createAddressSchema, request.body)
    const address = await userService.createAddress(userId, data)
    return success(address, '创建成功')
  })

  /** PUT /api/v1/addresses/:id — 更新地址 */
  app.put<{ Params: { id: string } }>('/:id', async (request) => {
    const userId = (request.user as { id: number }).id
    const addressId = Number(request.params.id)
    const data = validate(updateAddressSchema, request.body)
    const address = await userService.updateAddress(userId, addressId, data)
    return success(address, '更新成功')
  })

  /** DELETE /api/v1/addresses/:id — 删除地址 */
  app.delete<{ Params: { id: string } }>('/:id', async (request) => {
    const userId = (request.user as { id: number }).id
    const addressId = Number(request.params.id)
    await userService.deleteAddress(userId, addressId)
    return success(null, '删除成功')
  })

  /** PUT /api/v1/addresses/:id/default — 设为默认地址 */
  app.put<{ Params: { id: string } }>('/:id/default', async (request) => {
    const userId = (request.user as { id: number }).id
    const addressId = Number(request.params.id)
    await userService.setDefaultAddress(userId, addressId)
    return success(null, '设置成功')
  })
}
