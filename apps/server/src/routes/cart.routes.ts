import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import * as cartService from '../services/cart.service.js'
import { success } from '../utils/response.js'
import { validate } from '../utils/validate.js'
import { userGuard } from '../middlewares/auth.js'

const addToCartSchema = z.object({
  productId: z.number().int().positive(),
  skuId: z.number().int().positive(),
  quantity: z.number().int().min(1).max(999).default(1),
})

const updateQuantitySchema = z.object({
  quantity: z.number().int().min(1).max(999),
})

const removeItemsSchema = z.object({
  ids: z.array(z.number().int().positive()).min(1),
})

export default async function cartRoutes(app: FastifyInstance) {
  // 所有购物车接口需要用户认证
  app.addHook('preHandler', userGuard)

  /** GET /api/v1/cart — 获取购物车 */
  app.get('/', async (request) => {
    const userId = (request.user as { id: number }).id
    const items = await cartService.getCartItems(userId)
    return success(items)
  })

  /** GET /api/v1/cart/count — 购物车数量 */
  app.get('/count', async (request) => {
    const userId = (request.user as { id: number }).id
    const count = await cartService.getCartCount(userId)
    return success({ count })
  })

  /** POST /api/v1/cart — 加入购物车 */
  app.post('/', async (request) => {
    const userId = (request.user as { id: number }).id
    const data = validate(addToCartSchema, request.body)
    const item = await cartService.addToCart(userId, data.productId, data.skuId, data.quantity)
    return success(item, '已加入购物车')
  })

  /** PUT /api/v1/cart/:id — 更新数量 */
  app.put<{ Params: { id: string } }>('/:id', async (request) => {
    const userId = (request.user as { id: number }).id
    const cartItemId = Number(request.params.id)
    const { quantity } = validate(updateQuantitySchema, request.body)
    const item = await cartService.updateCartQuantity(userId, cartItemId, quantity)
    return success(item)
  })

  /** DELETE /api/v1/cart — 批量删除 */
  app.delete('/', async (request) => {
    const userId = (request.user as { id: number }).id
    const { ids } = validate(removeItemsSchema, request.body)
    await cartService.removeFromCart(userId, ids)
    return success(null, '删除成功')
  })

  /** DELETE /api/v1/cart/clear — 清空购物车 */
  app.delete('/clear', async (request) => {
    const userId = (request.user as { id: number }).id
    await cartService.clearCart(userId)
    return success(null, '已清空')
  })
}
