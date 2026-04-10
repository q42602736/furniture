import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import * as productService from '../services/product.service.js'
import { success, paginated } from '../utils/response.js'
import { validate } from '../utils/validate.js'
import { notFound } from '../utils/errors.js'
import { paginationSchema } from '../utils/pagination.js'
import { merchantGuard } from '../middlewares/auth.js'

const productListSchema = paginationSchema.extend({
  categoryId: z.coerce.number().int().positive().optional(),
  brandId: z.coerce.number().int().positive().optional(),
  merchantId: z.coerce.number().int().positive().optional(),
  keyword: z.string().max(100).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  sort: z.enum(['default', 'sales', 'price_asc', 'price_desc', 'newest']).default('default'),
})

const createProductSchema = z.object({
  name: z.string().min(1, '商品名称不能为空').max(200),
  categoryId: z.number().int().positive(),
  brandId: z.number().int().positive().optional(),
  description: z.string().max(2000).optional(),
  content: z.string().optional(),
  mainImage: z.string().max(500).optional(),
  status: z.number().int().min(0).max(2).default(0),
})

const updateProductSchema = createProductSchema.partial().extend({
  sort: z.number().int().min(0).optional(),
})

const productSkusSchema = z.object({
  skus: z.array(z.object({
    id: z.number().int().positive().optional(),
    name: z.string().min(1).max(200),
    price: z.number().positive(),
    stock: z.number().int().min(0),
    image: z.string().max(500).optional(),
  })).min(1, '至少需要一个 SKU'),
})

const productImagesSchema = z.object({
  images: z.array(z.object({
    url: z.string().min(1).max(500),
    sort: z.number().int().min(0).optional(),
  })),
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

  // ==================== 商家端管理接口 ====================

  /** POST /api/v1/products — 商家创建商品 */
  app.post('/', { preHandler: [merchantGuard] }, async (request) => {
    const merchantId = (request.user as { id: number }).id
    const data = validate(createProductSchema, request.body)
    const product = await productService.createProduct(merchantId, data)
    return success(product, '创建成功')
  })

  /** PUT /api/v1/products/:id — 商家更新商品 */
  app.put<{ Params: { id: string } }>('/:id', { preHandler: [merchantGuard] }, async (request) => {
    const merchantId = (request.user as { id: number }).id
    const productId = Number(request.params.id)
    const data = validate(updateProductSchema, request.body)
    const product = await productService.updateProduct(merchantId, productId, data)
    return success(product, '更新成功')
  })

  /** PUT /api/v1/products/:id/skus — 管理商品 SKU */
  app.put<{ Params: { id: string } }>('/:id/skus', { preHandler: [merchantGuard] }, async (request) => {
    const merchantId = (request.user as { id: number }).id
    const productId = Number(request.params.id)
    const { skus } = validate(productSkusSchema, request.body)
    const result = await productService.upsertProductSkus(merchantId, productId, skus)
    return success(result, '更新成功')
  })

  /** PUT /api/v1/products/:id/images — 管理商品图片 */
  app.put<{ Params: { id: string } }>('/:id/images', { preHandler: [merchantGuard] }, async (request) => {
    const merchantId = (request.user as { id: number }).id
    const productId = Number(request.params.id)
    const { images } = validate(productImagesSchema, request.body)
    const result = await productService.upsertProductImages(merchantId, productId, images)
    return success(result, '更新成功')
  })
}
