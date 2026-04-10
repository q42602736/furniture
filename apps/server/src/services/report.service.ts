import prisma from '../prisma/index.js'
import { Prisma } from '@prisma/client'

// ========== 销售报表 ==========

interface SalesReportParams {
  startDate?: string
  endDate?: string
  groupBy?: 'day' | 'week' | 'month'
}

/** 销售报表：按日期聚合订单数据 */
export async function getSalesReport(params: SalesReportParams) {
  const { startDate, endDate, groupBy = 'day' } = params

  const where: Prisma.OrderWhereInput = {
    status: { in: [1, 2, 3] }, // 已支付的订单
  }
  if (startDate) where.createdAt = { ...(where.createdAt as any), gte: new Date(startDate) }
  if (endDate) where.createdAt = { ...(where.createdAt as any), lte: new Date(endDate + 'T23:59:59') }

  // 日期格式化 SQL 片段
  const dateFormat = groupBy === 'month'
    ? `DATE_FORMAT(created_at, '%Y-%m')`
    : groupBy === 'week'
      ? `DATE_FORMAT(DATE_SUB(created_at, INTERVAL WEEKDAY(created_at) DAY), '%Y-%m-%d')`
      : `DATE(created_at)`

  // 使用原生 SQL 进行日期分组聚合
  const dailyData = await prisma.$queryRawUnsafe<Array<{
    date: string
    orderCount: bigint
    productCount: bigint
    totalAmount: number
    payAmount: number
  }>>(`
    SELECT
      ${dateFormat} as date,
      COUNT(DISTINCT o.id) as orderCount,
      COALESCE(SUM(oi.quantity), 0) as productCount,
      COALESCE(SUM(o.total_amount), 0) as totalAmount,
      COALESCE(SUM(o.pay_amount), 0) as payAmount
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    WHERE o.status IN (1, 2, 3)
    ${startDate ? `AND o.created_at >= '${startDate}'` : ''}
    ${endDate ? `AND o.created_at <= '${endDate} 23:59:59'` : ''}
    GROUP BY date
    ORDER BY date DESC
    LIMIT 60
  `)

  // 汇总统计
  const summary = await prisma.order.aggregate({
    where,
    _count: true,
    _sum: { payAmount: true, totalAmount: true },
  })

  // 转换 bigint 为 number
  const list = dailyData.map(row => ({
    date: String(row.date),
    orderCount: Number(row.orderCount),
    productCount: Number(row.productCount),
    totalAmount: Number(row.totalAmount),
    payAmount: Number(row.payAmount),
  }))

  return {
    list,
    summary: {
      totalOrders: summary._count,
      totalAmount: summary._sum.totalAmount?.toNumber() || 0,
      totalPayAmount: summary._sum.payAmount?.toNumber() || 0,
    },
  }
}

// ========== 客户订单报表 ==========

interface CustomerReportParams {
  startDate?: string
  endDate?: string
  page: number
  pageSize: number
}

/** 客户订单报表：按用户聚合消费数据 */
export async function getCustomerOrdersReport(params: CustomerReportParams) {
  const { startDate, endDate, page, pageSize } = params
  const offset = (page - 1) * pageSize

  let dateFilter = ''
  if (startDate) dateFilter += ` AND o.created_at >= '${startDate}'`
  if (endDate) dateFilter += ` AND o.created_at <= '${endDate} 23:59:59'`

  const list = await prisma.$queryRawUnsafe<Array<{
    userId: number
    nickname: string
    phone: string
    status: number
    createdAt: Date
    orderCount: bigint
    productCount: bigint
    totalAmount: number
  }>>(`
    SELECT
      u.id as userId,
      u.nickname,
      u.phone,
      u.status,
      u.created_at as createdAt,
      COUNT(DISTINCT o.id) as orderCount,
      COALESCE(SUM(oi.quantity), 0) as productCount,
      COALESCE(SUM(o.pay_amount), 0) as totalAmount
    FROM users u
    LEFT JOIN orders o ON o.user_id = u.id AND o.status IN (1, 2, 3) ${dateFilter}
    LEFT JOIN order_items oi ON oi.order_id = o.id
    GROUP BY u.id
    HAVING orderCount > 0
    ORDER BY totalAmount DESC
    LIMIT ${pageSize} OFFSET ${offset}
  `)

  const countResult = await prisma.$queryRawUnsafe<[{ total: bigint }]>(`
    SELECT COUNT(*) as total FROM (
      SELECT u.id
      FROM users u
      INNER JOIN orders o ON o.user_id = u.id AND o.status IN (1, 2, 3) ${dateFilter}
      GROUP BY u.id
    ) t
  `)

  return {
    list: list.map(row => ({
      userId: Number(row.userId),
      nickname: row.nickname,
      phone: row.phone,
      status: Number(row.status),
      createdAt: row.createdAt,
      orderCount: Number(row.orderCount),
      productCount: Number(row.productCount),
      totalAmount: Number(row.totalAmount),
    })),
    total: Number(countResult[0]?.total || 0),
  }
}

// ========== 物流/发货报表 ==========

/** 物流报表：订单状态分布 + 配送时效 */
export async function getShippingReport(startDate?: string, endDate?: string) {
  const where: Prisma.OrderWhereInput = {}
  if (startDate) where.createdAt = { ...(where.createdAt as any), gte: new Date(startDate) }
  if (endDate) where.createdAt = { ...(where.createdAt as any), lte: new Date(endDate + 'T23:59:59') }

  // 各状态订单数量
  const statusCounts = await prisma.order.groupBy({
    by: ['status'],
    where,
    _count: true,
  })

  const statusMap: Record<number, string> = {
    0: '待付款', 1: '待发货', 2: '已发货', 3: '已完成', 4: '已取消', 5: '售后中',
  }
  const statusDistribution = statusCounts.map(s => ({
    status: s.status,
    label: statusMap[s.status] || `状态${s.status}`,
    count: s._count,
  }))

  // 配送时效统计（已完成订单：发货→完成的平均天数）
  const deliveryStats = await prisma.$queryRawUnsafe<[{
    avgDays: number | null
    minDays: number | null
    maxDays: number | null
    totalShipped: bigint
  }]>(`
    SELECT
      AVG(DATEDIFF(completed_at, shipped_at)) as avgDays,
      MIN(DATEDIFF(completed_at, shipped_at)) as minDays,
      MAX(DATEDIFF(completed_at, shipped_at)) as maxDays,
      COUNT(*) as totalShipped
    FROM orders
    WHERE status = 3 AND shipped_at IS NOT NULL AND completed_at IS NOT NULL
    ${startDate ? `AND created_at >= '${startDate}'` : ''}
    ${endDate ? `AND created_at <= '${endDate} 23:59:59'` : ''}
  `)

  // 发货趋势（按天统计发货数）
  let dateFilter = ''
  if (startDate) dateFilter += ` AND shipped_at >= '${startDate}'`
  if (endDate) dateFilter += ` AND shipped_at <= '${endDate} 23:59:59'`

  const shippingTrend = await prisma.$queryRawUnsafe<Array<{
    date: string
    count: bigint
  }>>(`
    SELECT DATE(shipped_at) as date, COUNT(*) as count
    FROM orders
    WHERE shipped_at IS NOT NULL ${dateFilter}
    GROUP BY date
    ORDER BY date DESC
    LIMIT 30
  `)

  return {
    statusDistribution,
    deliveryStats: {
      avgDays: Number(deliveryStats[0]?.avgDays || 0),
      minDays: Number(deliveryStats[0]?.minDays || 0),
      maxDays: Number(deliveryStats[0]?.maxDays || 0),
      totalShipped: Number(deliveryStats[0]?.totalShipped || 0),
    },
    shippingTrend: shippingTrend.map(row => ({
      date: String(row.date),
      count: Number(row.count),
    })),
  }
}

// ========== 退货/售后报表 ==========

/** 退货报表：退款统计 + 状态分布 */
export async function getReturnsReport(startDate?: string, endDate?: string) {
  const where: Prisma.RefundWhereInput = {}
  if (startDate) where.createdAt = { ...(where.createdAt as any), gte: new Date(startDate) }
  if (endDate) where.createdAt = { ...(where.createdAt as any), lte: new Date(endDate + 'T23:59:59') }

  // 退款状态分布
  const statusCounts = await prisma.refund.groupBy({
    by: ['status'],
    where,
    _count: true,
    _sum: { amount: true },
  })

  const statusMap: Record<number, string> = {
    0: '申请中', 1: '已同意', 2: '已拒绝', 3: '已退款',
  }
  const statusDistribution = statusCounts.map(s => ({
    status: s.status,
    label: statusMap[s.status] || `状态${s.status}`,
    count: s._count,
    amount: s._sum.amount?.toNumber() || 0,
  }))

  // 汇总
  const summary = await prisma.refund.aggregate({
    where,
    _count: true,
    _sum: { amount: true },
  })

  // 退款趋势（按天）
  let dateFilter = ''
  if (startDate) dateFilter += ` AND created_at >= '${startDate}'`
  if (endDate) dateFilter += ` AND created_at <= '${endDate} 23:59:59'`

  const trend = await prisma.$queryRawUnsafe<Array<{
    date: string
    count: bigint
    amount: number
  }>>(`
    SELECT DATE(created_at) as date, COUNT(*) as count, COALESCE(SUM(amount), 0) as amount
    FROM refunds
    WHERE 1=1 ${dateFilter}
    GROUP BY date
    ORDER BY date DESC
    LIMIT 30
  `)

  // 近期退款列表
  const recentRefunds = await prisma.refund.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 20,
    include: {
      order: {
        select: { orderNo: true, totalAmount: true, user: { select: { nickname: true, phone: true } } },
      },
    },
  })

  return {
    statusDistribution,
    summary: {
      totalCount: summary._count,
      totalAmount: summary._sum.amount?.toNumber() || 0,
    },
    trend: trend.map(row => ({
      date: String(row.date),
      count: Number(row.count),
      amount: Number(row.amount),
    })),
    recentRefunds,
  }
}
