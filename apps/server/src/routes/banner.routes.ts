import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import * as bannerService from '../services/banner.service.js'
import { success } from '../utils/response.js'
import { validate } from '../utils/validate.js'
import { adminGuard } from '../middlewares/auth.js'

const createBannerSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(100),
  image: z.string().min(1, '图片不能为空').max(500),
  link: z.string().max(500).optional(),
  sort: z.number().int().min(0).default(0),
})

const updateBannerSchema = createBannerSchema.partial().extend({
  status: z.number().int().min(0).max(1).optional(),
})

export default async function bannerRoutes(app: FastifyInstance) {
  /** GET /api/v1/banners — C端获取 Banner 列表 */
  app.get('/', async () => {
    const banners = await bannerService.getActiveBanners()
    return success(banners)
  })

  /** GET /api/v1/banners/all — 后台获取所有 Banner */
  app.get('/all', { preHandler: [adminGuard] }, async () => {
    const banners = await bannerService.getAllBanners()
    return success(banners)
  })

  /** POST /api/v1/banners — 创建 Banner */
  app.post('/', { preHandler: [adminGuard] }, async (request) => {
    const data = validate(createBannerSchema, request.body)
    const banner = await bannerService.createBanner(data)
    return success(banner, '创建成功')
  })

  /** PUT /api/v1/banners/:id — 更新 Banner */
  app.put<{ Params: { id: string } }>('/:id', { preHandler: [adminGuard] }, async (request) => {
    const id = Number(request.params.id)
    const data = validate(updateBannerSchema, request.body)
    const banner = await bannerService.updateBanner(id, data)
    return success(banner, '更新成功')
  })

  /** DELETE /api/v1/banners/:id — 删除 Banner */
  app.delete<{ Params: { id: string } }>('/:id', { preHandler: [adminGuard] }, async (request) => {
    const id = Number(request.params.id)
    await bannerService.deleteBanner(id)
    return success(null, '删除成功')
  })
}
