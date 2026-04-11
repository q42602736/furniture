import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import * as brandService from '../services/brand.service.js'
import { success } from '../utils/response.js'
import { validate } from '../utils/validate.js'
import { adminGuard } from '../middlewares/auth.js'

const createBrandSchema = z.object({
  name: z.string().min(1, '品牌名称不能为空').max(100),
  logo: z.string().max(500).optional(),
  sort: z.number().int().min(0).default(0),
})

const updateBrandSchema = createBrandSchema.partial()

export default async function brandRoutes(app: FastifyInstance) {
  /** GET /api/v1/brands — C端获取品牌列表 */
  app.get('/', async () => {
    const brands = await brandService.getActiveBrands()
    return success(brands)
  })

  /** GET /api/v1/brands/all — 后台获取所有品牌（含商品计数） */
  app.get('/all', { preHandler: [adminGuard] }, async () => {
    const brands = await brandService.getAllBrands()
    return success(brands)
  })

  /** GET /api/v1/brands/:id — 获取品牌详情 */
  app.get<{ Params: { id: string } }>('/:id', async (request) => {
    const id = Number(request.params.id)
    const brand = await brandService.getBrandById(id)
    if (!brand) return success(null, '品牌不存在')
    return success(brand)
  })

  /** POST /api/v1/brands — 创建品牌 */
  app.post('/', { preHandler: [adminGuard] }, async (request) => {
    const data = validate(createBrandSchema, request.body)
    const brand = await brandService.createBrand(data)
    return success(brand, '创建成功')
  })

  /** PUT /api/v1/brands/:id — 更新品牌 */
  app.put<{ Params: { id: string } }>('/:id', { preHandler: [adminGuard] }, async (request) => {
    const id = Number(request.params.id)
    const data = validate(updateBrandSchema, request.body)
    const brand = await brandService.updateBrand(id, data)
    return success(brand, '更新成功')
  })

  /** DELETE /api/v1/brands/:id — 删除品牌 */
  app.delete<{ Params: { id: string } }>('/:id', { preHandler: [adminGuard] }, async (request) => {
    const id = Number(request.params.id)
    await brandService.deleteBrand(id)
    return success(null, '删除成功')
  })
}
