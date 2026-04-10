import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import * as adminService from '../services/admin.service.js'
import { success, paginated } from '../utils/response.js'
import { validate } from '../utils/validate.js'
import { paginationSchema } from '../utils/pagination.js'
import { adminGuard } from '../middlewares/auth.js'

export default async function adminRoutes(app: FastifyInstance) {
  // 所有管理接口需要管理员权限
  app.addHook('preHandler', adminGuard)

  // ========== 平台统计 ==========

  /** GET /api/v1/admin/stats — 平台统计 */
  app.get('/stats', async () => {
    const stats = await adminService.getPlatformStats()
    return success(stats)
  })

  // ========== 用户管理 ==========

  /** GET /api/v1/admin/users — 用户列表 */
  app.get('/users', async (request) => {
    const params = validate(
      paginationSchema.extend({ keyword: z.string().optional() }),
      request.query,
    )
    const { list, total } = await adminService.getUserList(params.page, params.pageSize, params.keyword)
    return paginated(list, total, params.page, params.pageSize)
  })

  /** PUT /api/v1/admin/users/:id/status — 更新用户状态 */
  app.put<{ Params: { id: string } }>('/users/:id/status', async (request) => {
    const userId = Number(request.params.id)
    const { status } = validate(z.object({ status: z.number().int().min(0).max(1) }), request.body)
    await adminService.updateUserStatus(userId, status)
    return success(null, '更新成功')
  })

  // ========== 商家管理 ==========

  /** GET /api/v1/admin/merchants — 商家列表 */
  app.get('/merchants', async (request) => {
    const params = validate(
      paginationSchema.extend({ status: z.coerce.number().int().optional() }),
      request.query,
    )
    const { list, total } = await adminService.getMerchantList(params.page, params.pageSize, params.status)
    return paginated(list, total, params.page, params.pageSize)
  })

  /** PUT /api/v1/admin/merchants/:id/status — 审核/更新商家状态 */
  app.put<{ Params: { id: string } }>('/merchants/:id/status', async (request) => {
    const merchantId = Number(request.params.id)
    const { status } = validate(z.object({ status: z.number().int().min(0).max(2) }), request.body)
    await adminService.updateMerchantStatus(merchantId, status)
    return success(null, '更新成功')
  })

  // ========== 订单管理 ==========

  /** GET /api/v1/admin/orders — 全平台订单 */
  app.get('/orders', async (request) => {
    const params = validate(
      paginationSchema.extend({ status: z.coerce.number().int().optional() }),
      request.query,
    )
    const { list, total } = await adminService.getAllOrders(params.page, params.pageSize, params.status)
    return paginated(list, total, params.page, params.pageSize)
  })

  // ========== 商品管理 ==========

  /** GET /api/v1/admin/products — 商品列表 */
  app.get('/products', async (request) => {
    const params = validate(
      paginationSchema.extend({
        keyword: z.string().optional(),
        categoryId: z.coerce.number().int().optional(),
        status: z.coerce.number().int().optional(),
        merchantId: z.coerce.number().int().optional(),
      }),
      request.query,
    )
    const { list, total } = await adminService.getProductList(params.page, params.pageSize, {
      keyword: params.keyword,
      categoryId: params.categoryId,
      status: params.status,
      merchantId: params.merchantId,
    })
    return paginated(list, total, params.page, params.pageSize)
  })

  /** GET /api/v1/admin/products/:id — 商品详情 */
  app.get<{ Params: { id: string } }>('/products/:id', async (request) => {
    const product = await adminService.getProductDetail(Number(request.params.id))
    return success(product)
  })

  /** POST /api/v1/admin/products — 创建商品 */
  app.post('/products', async (request) => {
    const data = validate(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        price: z.number().positive(),
        originalPrice: z.number().positive().optional(),
        categoryId: z.number().int(),
        merchantId: z.number().int(),
        brandId: z.number().int().optional(),
        images: z.array(z.string()).optional(),
      }),
      request.body,
    )
    const product = await adminService.createProduct(data)
    return success(product, '创建成功')
  })

  /** PUT /api/v1/admin/products/:id — 更新商品 */
  app.put<{ Params: { id: string } }>('/products/:id', async (request) => {
    const productId = Number(request.params.id)
    const data = validate(
      z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        price: z.number().positive().optional(),
        originalPrice: z.number().positive().optional(),
        categoryId: z.number().int().optional(),
        brandId: z.number().int().optional(),
        status: z.number().int().optional(),
      }),
      request.body,
    )
    const product = await adminService.updateProduct(productId, data)
    return success(product, '更新成功')
  })

  /** PUT /api/v1/admin/products/:id/status — 商品上下架 */
  app.put<{ Params: { id: string } }>('/products/:id/status', async (request) => {
    const productId = Number(request.params.id)
    const { status } = validate(z.object({ status: z.number().int().min(0).max(2) }), request.body)
    await adminService.updateProductStatus(productId, status)
    return success(null, '更新成功')
  })

  /** PUT /api/v1/admin/products/:id/images — 更新商品图片 */
  app.put<{ Params: { id: string } }>('/products/:id/images', async (request) => {
    const productId = Number(request.params.id)
    const { images } = validate(
      z.object({
        images: z.array(z.object({ url: z.string(), sort: z.number().int().optional() })),
      }),
      request.body,
    )
    const result = await adminService.updateProductImages(productId, images)
    return success(result, '图片更新成功')
  })

  /** DELETE /api/v1/admin/products/:id — 删除商品 */
  app.delete<{ Params: { id: string } }>('/products/:id', async (request) => {
    await adminService.deleteProduct(Number(request.params.id))
    return success(null, '删除成功')
  })
}
