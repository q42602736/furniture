import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import * as favoriteService from '../services/favorite.service.js'
import { success, paginated } from '../utils/response.js'
import { validate } from '../utils/validate.js'
import { paginationSchema } from '../utils/pagination.js'
import { userGuard } from '../middlewares/auth.js'

export default async function favoriteRoutes(app: FastifyInstance) {
  // 所有收藏接口需要用户认证
  app.addHook('preHandler', userGuard)

  /** GET /api/v1/favorites — 收藏列表 */
  app.get('/', async (request) => {
    const userId = (request.user as { id: number }).id
    const { page, pageSize } = validate(paginationSchema, request.query)
    const { list, total } = await favoriteService.getFavorites(userId, page, pageSize)
    return paginated(list, total, page, pageSize)
  })

  /** POST /api/v1/favorites/:productId — 收藏商品 */
  app.post<{ Params: { productId: string } }>('/:productId', async (request) => {
    const userId = (request.user as { id: number }).id
    const productId = Number(request.params.productId)
    await favoriteService.addFavorite(userId, productId)
    return success(null, '收藏成功')
  })

  /** DELETE /api/v1/favorites/:productId — 取消收藏 */
  app.delete<{ Params: { productId: string } }>('/:productId', async (request) => {
    const userId = (request.user as { id: number }).id
    const productId = Number(request.params.productId)
    await favoriteService.removeFavorite(userId, productId)
    return success(null, '取消收藏')
  })

  /** GET /api/v1/favorites/:productId/check — 检查是否收藏 */
  app.get<{ Params: { productId: string } }>('/:productId/check', async (request) => {
    const userId = (request.user as { id: number }).id
    const productId = Number(request.params.productId)
    const favorited = await favoriteService.isFavorited(userId, productId)
    return success({ favorited })
  })
}
