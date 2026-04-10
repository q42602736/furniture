import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import * as merchantService from '../services/merchant.service.js'
import { success, paginated } from '../utils/response.js'
import { validate } from '../utils/validate.js'
import { notFound } from '../utils/errors.js'
import { paginationSchema } from '../utils/pagination.js'

const merchantProductsSchema = paginationSchema.extend({
  sort: z.enum(['default', 'sales', 'newest', 'price_asc', 'price_desc']).default('default'),
})

export default async function merchantRoutes(app: FastifyInstance) {
  /** GET /api/v1/merchants/:id — 商家详情 */
  app.get<{ Params: { id: string } }>('/:id', async (request) => {
    const id = Number(request.params.id)
    const merchant = await merchantService.getMerchantDetail(id)
    if (!merchant) notFound('商家不存在')
    return success(merchant)
  })

  /** GET /api/v1/merchants/:id/products — 商家商品列表 */
  app.get<{ Params: { id: string } }>('/:id/products', async (request) => {
    const merchantId = Number(request.params.id)
    const { page, pageSize, sort } = validate(merchantProductsSchema, request.query)
    const { list, total } = await merchantService.getMerchantProducts(merchantId, page, pageSize, sort)
    return paginated(list, total, page, pageSize)
  })

  /** GET /api/v1/merchants/:id/brands — 商家品牌列表 */
  app.get<{ Params: { id: string } }>('/:id/brands', async (request) => {
    const merchantId = Number(request.params.id)
    const brands = await merchantService.getMerchantBrands(merchantId)
    return success(brands)
  })
}
