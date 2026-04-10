import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import * as orderService from '../services/order.service.js'
import { success, paginated } from '../utils/response.js'
import { validate } from '../utils/validate.js'
import { notFound } from '../utils/errors.js'
import { paginationSchema } from '../utils/pagination.js'
import { userGuard } from '../middlewares/auth.js'

const createOrderSchema = z.object({
  addressId: z.number().int().positive(),
  cartItemIds: z.array(z.number().int().positive()).min(1, '请选择商品'),
  remark: z.string().max(500).optional(),
})

const orderListSchema = paginationSchema.extend({
  status: z.coerce.number().int().min(0).max(5).optional(),
})

export default async function orderRoutes(app: FastifyInstance) {
  // 所有订单接口需要用户认证
  app.addHook('preHandler', userGuard)

  /** POST /api/v1/orders — 创建订单 */
  app.post('/', async (request) => {
    const userId = (request.user as { id: number }).id
    const data = validate(createOrderSchema, request.body)
    const order = await orderService.createOrder({ userId, ...data })
    return success(order, '下单成功')
  })

  /** GET /api/v1/orders — 订单列表 */
  app.get('/', async (request) => {
    const userId = (request.user as { id: number }).id
    const { page, pageSize, status } = validate(orderListSchema, request.query)
    const { list, total } = await orderService.getOrders(userId, status, page, pageSize)
    return paginated(list, total, page, pageSize)
  })

  /** GET /api/v1/orders/counts — 各状态订单数量 */
  app.get('/counts', async (request) => {
    const userId = (request.user as { id: number }).id
    const counts = await orderService.getOrderCounts(userId)
    return success(counts)
  })

  /** GET /api/v1/orders/:orderNo — 订单详情 */
  app.get<{ Params: { orderNo: string } }>('/:orderNo', async (request) => {
    const userId = (request.user as { id: number }).id
    const order = await orderService.getOrderDetail(userId, request.params.orderNo)
    if (!order) notFound('订单不存在')
    return success(order)
  })

  /** PUT /api/v1/orders/:orderNo/cancel — 取消订单 */
  app.put<{ Params: { orderNo: string } }>('/:orderNo/cancel', async (request) => {
    const userId = (request.user as { id: number }).id
    await orderService.cancelOrder(userId, request.params.orderNo)
    return success(null, '取消成功')
  })

  /** PUT /api/v1/orders/:orderNo/confirm — 确认收货 */
  app.put<{ Params: { orderNo: string } }>('/:orderNo/confirm', async (request) => {
    const userId = (request.user as { id: number }).id
    await orderService.confirmReceipt(userId, request.params.orderNo)
    return success(null, '确认收货成功')
  })
}
