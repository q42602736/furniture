import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import * as productService from '../services/product.service.js'
import { success, paginated } from '../utils/response.js'
import { validate } from '../utils/validate.js'
import { notFound } from '../utils/errors.js'
import { paginationSchema } from '../utils/pagination.js'

const productListSchema = paginationSchema.extend({
  categoryId: z.coerce.number().int().positive().optional(),
  brandId: z.coerce.number().int().positive().optional(),
  keyword: z.string().max(100).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  sort: z.enum(['default', 'sales', 'price_asc', 'price_desc', 'newest']).default('default'),
})

export default async function productRoutes(app: FastifyInstance) {
  /** GET /api/v1/products — 商品列表（C端） */
  app.get('/', async (request) => {
    const params = validate(productListSchema, request.query)
    const { list, total } = await productService.getProductList(params)
    return paginated(list, total, params.page, params.pageSize)
  })

  /** GET /api/v1/products/:id — 商品详情 */
  app.get<{ Params: { id: string } }>('/:id', async (request) => {
    const id = Number(request.params.id)
    const product = await productService.getProductDetail(id)
    if (!product) notFound('商品不存在')
    return success(product)
  })

  /** GET /api/v1/products/:id/reviews — 商品评价 */
  app.get<{ Params: { id: string } }>('/:id/reviews', async (request) => {
    const productId = Number(request.params.id)
    const { page, pageSize } = validate(paginationSchema, request.query)
    const { list, total } = await productService.getProductReviews(productId, page, pageSize)
    return paginated(list, total, page, pageSize)
  })

  /** GET /api/v1/products/:id/recommend — 推荐商品 */
  app.get<{ Params: { id: string } }>('/:id/recommend', async (request) => {
    const id = Number(request.params.id)
    const product = await productService.getProductDetail(id)
    if (!product) notFound('商品不存在')
    const list = await productService.getRecommendProducts(product.categoryId, id)
    return success(list)
  })

}
