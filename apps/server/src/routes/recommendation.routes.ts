import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import * as recommendationService from '../services/recommendation.service.js'
import { success } from '../utils/response.js'
import { validate } from '../utils/validate.js'
import { adminGuard } from '../middlewares/auth.js'

const createRecommendationSchema = z.object({
  title: z.string().min(1, '名称不能为空'),
  position: z.string().min(1, '位置不能为空'),
  productId: z.number().int().positive('请选择商品'),
  image: z.string().optional(),
  sort: z.number().int().optional(),
})

const updateRecommendationSchema = createRecommendationSchema.partial().extend({
  status: z.number().int().min(0).max(1).optional(),
})

export default async function recommendationRoutes(app: FastifyInstance) {
  /** GET /api/v1/recommendations — C端按位置获取推荐 */
  app.get('/', async (request) => {
    const { position } = validate(
      z.object({ position: z.string().min(1) }),
      request.query,
    )
    const list = await recommendationService.getRecommendationsByPosition(position)
    return success(list)
  })

  /** GET /api/v1/recommendations/all — 后台获取所有推荐位 */
  app.get('/all', { preHandler: [adminGuard] }, async () => {
    const list = await recommendationService.getAllRecommendations()
    return success(list)
  })

  /** POST /api/v1/recommendations — 创建推荐位 */
  app.post('/', { preHandler: [adminGuard] }, async (request) => {
    const data = validate(createRecommendationSchema, request.body)
    const item = await recommendationService.createRecommendation(data)
    return success(item, '创建成功')
  })

  /** PUT /api/v1/recommendations/:id — 更新推荐位 */
  app.put<{ Params: { id: string } }>('/:id', { preHandler: [adminGuard] }, async (request) => {
    const id = Number(request.params.id)
    const data = validate(updateRecommendationSchema, request.body)
    const item = await recommendationService.updateRecommendation(id, data)
    return success(item, '更新成功')
  })

  /** DELETE /api/v1/recommendations/:id — 删除推荐位 */
  app.delete<{ Params: { id: string } }>('/:id', { preHandler: [adminGuard] }, async (request) => {
    await recommendationService.deleteRecommendation(Number(request.params.id))
    return success(null, '删除成功')
  })
}
