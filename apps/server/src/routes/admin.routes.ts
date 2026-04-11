import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import * as adminService from '../services/admin.service.js'
import * as reportService from '../services/report.service.js'
import * as settingService from '../services/setting.service.js'
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

  /** GET /api/v1/admin/users/:id — 用户详情 */
  app.get<{ Params: { id: string } }>('/users/:id', async (request) => {
    const user = await adminService.getUserDetail(Number(request.params.id))
    return success(user)
  })

  /** PUT /api/v1/admin/users/:id/status — 更新用户状态 */
  app.put<{ Params: { id: string } }>('/users/:id/status', async (request) => {
    const userId = Number(request.params.id)
    const { status } = validate(z.object({ status: z.number().int().min(0).max(1) }), request.body)
    await adminService.updateUserStatus(userId, status)
    return success(null, '更新成功')
  })

  // ========== 订单管理 ==========

  /** GET /api/v1/admin/orders — 全平台订单 */
  app.get('/orders', async (request) => {
    const params = validate(
      paginationSchema.extend({
        status: z.coerce.number().int().optional(),
        keyword: z.string().optional(),
      }),
      request.query,
    )
    const { list, total } = await adminService.getAllOrders(params.page, params.pageSize, params.status, params.keyword)
    return paginated(list, total, params.page, params.pageSize)
  })

  /** GET /api/v1/admin/orders/:id — 订单详情 */
  app.get<{ Params: { id: string } }>('/orders/:id', async (request) => {
    const order = await adminService.getOrderDetail(Number(request.params.id))
    return success(order)
  })

  /** PUT /api/v1/admin/orders/:id/status — 更新订单状态 */
  app.put<{ Params: { id: string } }>('/orders/:id/status', async (request) => {
    const orderId = Number(request.params.id)
    const { status } = validate(
      z.object({ status: z.number().int().min(0).max(5) }),
      request.body,
    )
    await adminService.updateOrderStatus(orderId, status)
    return success(null, '状态更新成功')
  })

  /** PUT /api/v1/admin/orders/:id/ship — 确认发货（含物流信息） */
  app.put<{ Params: { id: string } }>('/orders/:id/ship', async (request) => {
    const orderId = Number(request.params.id)
    const data = validate(
      z.object({
        shippingCompany: z.string().min(1, '请填写物流公司'),
        trackingNo: z.string().min(1, '请填写物流单号'),
      }),
      request.body,
    )
    await adminService.shipOrder(orderId, data.shippingCompany, data.trackingNo)
    return success(null, '发货成功')
  })

  /** PUT /api/v1/admin/orders/:id/shipping — 更新物流信息 */
  app.put<{ Params: { id: string } }>('/orders/:id/shipping', async (request) => {
    const orderId = Number(request.params.id)
    const data = validate(
      z.object({
        shippingCompany: z.string().optional(),
        trackingNo: z.string().optional(),
      }),
      request.body,
    )
    await adminService.updateShippingInfo(orderId, data)
    return success(null, '物流信息已更新')
  })

  // ========== 商品管理 ==========

  /** GET /api/v1/admin/products — 商品列表 */
  app.get('/products', async (request) => {
    const params = validate(
      paginationSchema.extend({
        keyword: z.string().optional(),
        categoryId: z.coerce.number().int().optional(),
        status: z.coerce.number().int().optional(),
      }),
      request.query,
    )
    const { list, total } = await adminService.getProductList(params.page, params.pageSize, {
      keyword: params.keyword,
      categoryId: params.categoryId,
      status: params.status,
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

  // ========== 报表 ==========

  const reportDateSchema = z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  })

  /** GET /api/v1/admin/reports/sales — 销售报表 */
  app.get('/reports/sales', async (request) => {
    const params = validate(
      reportDateSchema.extend({
        groupBy: z.enum(['day', 'week', 'month']).optional(),
      }),
      request.query,
    )
    const data = await reportService.getSalesReport(params)
    return success(data)
  })

  /** GET /api/v1/admin/reports/customers — 客户订单报表 */
  app.get('/reports/customers', async (request) => {
    const params = validate(
      paginationSchema.merge(reportDateSchema),
      request.query,
    )
    const { list, total } = await reportService.getCustomerOrdersReport(params)
    return paginated(list, total, params.page, params.pageSize)
  })

  /** GET /api/v1/admin/reports/shipping — 物流报表 */
  app.get('/reports/shipping', async (request) => {
    const params = validate(reportDateSchema, request.query)
    const data = await reportService.getShippingReport(params.startDate, params.endDate)
    return success(data)
  })

  /** GET /api/v1/admin/reports/returns — 退货报表 */
  app.get('/reports/returns', async (request) => {
    const params = validate(reportDateSchema, request.query)
    const data = await reportService.getReturnsReport(params.startDate, params.endDate)
    return success(data)
  })

  // ========== 系统配置 ==========

  /** GET /api/v1/admin/settings — 获取所有系统配置 */
  app.get('/settings', async () => {
    const configs = await settingService.getAllConfigs()
    return success(configs)
  })

  /** GET /api/v1/admin/settings/:group — 获取指定分组配置 */
  app.get<{ Params: { group: string } }>('/settings/:group', async (request) => {
    const configs = await settingService.getConfigsByGroup(request.params.group)
    return success(configs)
  })

  /** PUT /api/v1/admin/settings/:group — 更新指定分组配置 */
  app.put<{ Params: { group: string } }>('/settings/:group', async (request) => {
    const group = request.params.group
    const allowedGroups = ['payment', 'shipping']
    if (!allowedGroups.includes(group)) {
      return success(null, '不支持的配置分组')
    }
    const data = validate(z.record(z.string(), z.any()), request.body)
    await settingService.updateConfigs(group, data)
    return success(null, '保存成功')
  })

  // ========== 退款/售后管理 ==========

  /** GET /api/v1/admin/refunds — 退款列表 */
  app.get('/refunds', async (request) => {
    const params = validate(
      paginationSchema.extend({
        status: z.coerce.number().int().optional(),
      }),
      request.query,
    )
    const { list, total } = await adminService.getRefundList(params.page, params.pageSize, params.status)
    return paginated(list, total, params.page, params.pageSize)
  })

  /** GET /api/v1/admin/refunds/:id — 退款详情 */
  app.get<{ Params: { id: string } }>('/refunds/:id', async (request) => {
    const refund = await adminService.getRefundDetail(Number(request.params.id))
    return success(refund)
  })

  /** PUT /api/v1/admin/refunds/:id/approve — 同意退款 */
  app.put<{ Params: { id: string } }>('/refunds/:id/approve', async (request) => {
    await adminService.approveRefund(Number(request.params.id))
    return success(null, '已同意退款')
  })

  /** PUT /api/v1/admin/refunds/:id/reject — 拒绝退款 */
  app.put<{ Params: { id: string } }>('/refunds/:id/reject', async (request) => {
    await adminService.rejectRefund(Number(request.params.id))
    return success(null, '已拒绝退款')
  })

  /** PUT /api/v1/admin/refunds/:id/complete — 确认退款完成 */
  app.put<{ Params: { id: string } }>('/refunds/:id/complete', async (request) => {
    await adminService.completeRefund(Number(request.params.id))
    return success(null, '退款已完成')
  })

  // ========== 评价管理 ==========

  /** GET /api/v1/admin/reviews — 评价列表 */
  app.get('/reviews', async (request) => {
    const params = validate(
      paginationSchema.extend({
        productId: z.coerce.number().int().optional(),
      }),
      request.query,
    )
    const { list, total } = await adminService.getReviewList(params.page, params.pageSize, params.productId)
    return paginated(list, total, params.page, params.pageSize)
  })

  /** DELETE /api/v1/admin/reviews/:id — 删除评价 */
  app.delete<{ Params: { id: string } }>('/reviews/:id', async (request) => {
    await adminService.deleteReview(Number(request.params.id))
    return success(null, '删除成功')
  })
}
