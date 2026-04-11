import prisma from '../prisma/index.js'
import { getSkip } from '../utils/pagination.js'
import { notFound, badRequest } from '../utils/errors.js'

/** 获取用户列表（管理员用） */
export async function getUserList(page: number, pageSize: number, keyword?: string) {
  const where: any = {}
  if (keyword) {
    where.OR = [
      { phone: { contains: keyword } },
      { nickname: { contains: keyword } },
    ]
  }

  const [list, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: getSkip(page, pageSize),
      take: pageSize,
      select: {
        id: true, phone: true, nickname: true, avatar: true, status: true, createdAt: true,
        _count: { select: { orders: true } },
      },
    }),
    prisma.user.count({ where }),
  ])
  return { list, total }
}

/** 更新用户状态 */
export async function updateUserStatus(userId: number, status: number) {
  return prisma.user.update({ where: { id: userId }, data: { status } })
}

/** 管理端获取用户详情 */
export async function getUserDetail(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true, phone: true, nickname: true, avatar: true, status: true, createdAt: true,
      addresses: {
        select: { id: true, name: true, phone: true, province: true, city: true, district: true, address: true, isDefault: true },
        orderBy: { isDefault: 'desc' },
      },
      orders: {
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: { id: true, orderNo: true, totalAmount: true, status: true, createdAt: true },
      },
      _count: { select: { orders: true, favorites: true } },
    },
  })
  if (!user) notFound('用户不存在')
  return user
}

/** 获取平台统计 */
export async function getPlatformStats() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [
    userCount, productCount, orderCount,
    todayOrderCount, todayUserCount, todayRevenue,
    recentOrders,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.product.count({ where: { status: 1 } }),
    prisma.order.count(),
    prisma.order.count({ where: { createdAt: { gte: today } } }),
    prisma.user.count({ where: { createdAt: { gte: today } } }),
    prisma.order.aggregate({
      where: { createdAt: { gte: today }, status: { in: [1, 2, 3] } },
      _sum: { payAmount: true },
    }),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { user: { select: { nickname: true, phone: true } } },
    }),
  ])

  return {
    userCount,
    productCount,
    orderCount,
    todayOrderCount,
    todayUserCount,
    todayRevenue: todayRevenue._sum.payAmount?.toNumber() || 0,
    recentOrders,
  }
}

/** 获取全平台订单列表 */
export async function getAllOrders(page: number, pageSize: number, status?: number, keyword?: string) {
  const where: any = {}
  if (status !== undefined) where.status = status
  if (keyword) where.orderNo = { contains: keyword }

  const [list, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: getSkip(page, pageSize),
      take: pageSize,
      include: {
        user: { select: { id: true, nickname: true, phone: true } },
        items: { take: 1 },
      },
    }),
    prisma.order.count({ where }),
  ])
  return { list, total }
}

/** 管理端获取订单详情 */
export async function getOrderDetail(orderId: number) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: { select: { id: true, nickname: true, phone: true, avatar: true } },
      items: {
        include: {
          product: { select: { id: true, name: true, mainImage: true } },
          sku: { select: { id: true, name: true } },
        },
      },
      payments: true,
    },
  })
  if (!order) notFound('订单不存在')
  return order
}

/** 管理端更新订单状态 */
export async function updateOrderStatus(orderId: number, status: number) {
  const order = await prisma.order.findUnique({ where: { id: orderId } })
  if (!order) notFound('订单不存在')

  // 状态流转校验：0待付款→4取消, 1待发货→2发货/4取消, 2待收货→3完成, 5售后→3完成/4取消
  const allowedTransitions: Record<number, number[]> = {
    0: [4],
    1: [2, 4],
    2: [3],
    5: [3, 4],
  }
  const allowed = allowedTransitions[order!.status]
  if (!allowed || !allowed.includes(status)) {
    badRequest(`不允许从当前状态变更为目标状态`)
  }

  const updateData: any = { status }
  if (status === 2) updateData.shippedAt = new Date()
  if (status === 3) updateData.completedAt = new Date()

  // 取消订单时恢复库存
  if (status === 4 && [0, 1].includes(order!.status)) {
    const items = await prisma.orderItem.findMany({ where: { orderId } })
    await prisma.$transaction(async (tx) => {
      await tx.order.update({ where: { id: orderId }, data: updateData })
      for (const item of items) {
        await tx.productSku.update({
          where: { id: item.skuId },
          data: { stock: { increment: item.quantity } },
        })
      }
    })
    return
  }

  await prisma.order.update({ where: { id: orderId }, data: updateData })
}

/** 发货并填写物流信息 */
export async function shipOrder(
  orderId: number,
  shippingCompany: string,
  trackingNo: string,
) {
  const order = await prisma.order.findUnique({ where: { id: orderId } })
  if (!order) notFound('订单不存在')
  if (order!.status !== 1) badRequest('只有待发货订单可以发货')

  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: 2,
      shippedAt: new Date(),
      shippingCompany,
      trackingNo,
    },
  })
}

/** 更新物流信息（已发货订单修改单号） */
export async function updateShippingInfo(
  orderId: number,
  data: { shippingCompany?: string; trackingNo?: string },
) {
  const order = await prisma.order.findUnique({ where: { id: orderId } })
  if (!order) notFound('订单不存在')
  if (![2, 3].includes(order!.status)) badRequest('只有已发货/已完成订单可以修改物流信息')

  await prisma.order.update({ where: { id: orderId }, data })
}

// ========== 商品管理 ==========

/** 获取商品列表（管理员，支持筛选） */
export async function getProductList(
  page: number,
  pageSize: number,
  filters?: { keyword?: string; categoryId?: number; status?: number },
) {
  const where: any = {}
  if (filters?.keyword) where.name = { contains: filters.keyword }
  if (filters?.categoryId) where.categoryId = filters.categoryId
  if (filters?.status !== undefined) where.status = filters.status

  const [list, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: getSkip(page, pageSize),
      take: pageSize,
      include: {
        category: { select: { id: true, name: true } },
        images: { take: 1, orderBy: { sort: 'asc' } },
      },
    }),
    prisma.product.count({ where }),
  ])
  return { list, total }
}

/** 获取商品详情 */
export async function getProductDetail(productId: number) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      category: { select: { id: true, name: true } },
      brand: { select: { id: true, name: true } },
      images: { orderBy: { sort: 'asc' } },
      skus: true,
    },
  })
  if (!product) throw notFound('商品不存在')
  return product
}

/** 更新商品信息 */
export async function updateProduct(
  productId: number,
  data: {
    name?: string
    description?: string
    price?: number
    originalPrice?: number
    categoryId?: number
    brandId?: number
    status?: number
  },
) {
  return prisma.product.update({ where: { id: productId }, data })
}

/** 商品上下架 */
export async function updateProductStatus(productId: number, status: number) {
  return prisma.product.update({ where: { id: productId }, data: { status } })
}

/** 删除商品 */
export async function deleteProduct(productId: number) {
  // 级联删除：图片、SKU、属性
  await prisma.$transaction([
    prisma.productImage.deleteMany({ where: { productId } }),
    prisma.productSku.deleteMany({ where: { productId } }),
    prisma.productAttribute.deleteMany({ where: { productId } }),
    prisma.product.delete({ where: { id: productId } }),
  ])
}

/** 更新商品图片（全量替换） */
export async function updateProductImages(productId: number, images: { url: string; sort?: number }[]) {
  await prisma.$transaction([
    prisma.productImage.deleteMany({ where: { productId } }),
    prisma.productImage.createMany({
      data: images.map((img, i) => ({
        productId,
        url: img.url,
        sort: img.sort ?? i,
      })),
    }),
  ])
  return prisma.productImage.findMany({ where: { productId }, orderBy: { sort: 'asc' } })
}

// ========== 退款/售后管理 ==========

/** 获取退款列表 */
export async function getRefundList(page: number, pageSize: number, status?: number) {
  const where: any = {}
  if (status !== undefined) where.status = status

  const [list, total] = await Promise.all([
    prisma.refund.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: getSkip(page, pageSize),
      take: pageSize,
      include: {
        order: {
          select: {
            id: true,
            orderNo: true,
            totalAmount: true,
            status: true,
            user: { select: { id: true, nickname: true, phone: true } },
          },
        },
      },
    }),
    prisma.refund.count({ where }),
  ])
  return { list, total }
}

/** 获取退款详情 */
export async function getRefundDetail(refundId: number) {
  const refund = await prisma.refund.findUnique({
    where: { id: refundId },
    include: {
      order: {
        include: {
          user: { select: { id: true, nickname: true, phone: true } },
          items: {
            include: {
              product: { select: { id: true, name: true, mainImage: true } },
              sku: { select: { id: true, name: true } },
            },
          },
        },
      },
    },
  })
  if (!refund) notFound('退款记录不存在')
  return refund
}

/** 审批退款 — 同意 */
export async function approveRefund(refundId: number) {
  const refund = await prisma.refund.findUnique({ where: { id: refundId } })
  if (!refund) notFound('退款记录不存在')
  if (refund!.status !== 0) badRequest('只能审批申请中的退款')

  await prisma.$transaction(async (tx) => {
    // 更新退款状态为已同意
    await tx.refund.update({ where: { id: refundId }, data: { status: 1 } })
    // 将订单状态改为售后中
    await tx.order.update({ where: { id: refund!.orderId }, data: { status: 5 } })
  })
}

/** 审批退款 — 拒绝 */
export async function rejectRefund(refundId: number) {
  const refund = await prisma.refund.findUnique({ where: { id: refundId } })
  if (!refund) notFound('退款记录不存在')
  if (refund!.status !== 0) badRequest('只能审批申请中的退款')

  await prisma.refund.update({ where: { id: refundId }, data: { status: 2 } })
}

/** 确认退款完成 */
export async function completeRefund(refundId: number) {
  const refund = await prisma.refund.findUnique({ where: { id: refundId } })
  if (!refund) notFound('退款记录不存在')
  if (refund!.status !== 1) badRequest('只有已同意的退款可以确认退款')

  await prisma.$transaction(async (tx) => {
    await tx.refund.update({ where: { id: refundId }, data: { status: 3 } })
    // 恢复库存
    const items = await tx.orderItem.findMany({ where: { orderId: refund!.orderId } })
    for (const item of items) {
      await tx.productSku.update({
        where: { id: item.skuId },
        data: { stock: { increment: item.quantity } },
      })
    }
    // 订单状态改为已取消
    await tx.order.update({ where: { id: refund!.orderId }, data: { status: 4 } })
  })
}

// ========== 评价管理 ==========

/** 获取评价列表 */
export async function getReviewList(page: number, pageSize: number, productId?: number) {
  const where: any = {}
  if (productId) where.productId = productId

  const [list, total] = await Promise.all([
    prisma.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: getSkip(page, pageSize),
      take: pageSize,
      include: {
        user: { select: { id: true, nickname: true, phone: true, avatar: true } },
        product: { select: { id: true, name: true, mainImage: true } },
      },
    }),
    prisma.review.count({ where }),
  ])
  return { list, total }
}

/** 删除评价 */
export async function deleteReview(reviewId: number) {
  const review = await prisma.review.findUnique({ where: { id: reviewId } })
  if (!review) notFound('评价不存在')
  await prisma.review.delete({ where: { id: reviewId } })
}

/** 创建商品 */
export async function createProduct(data: {
  name: string
  description?: string
  price: number
  originalPrice?: number
  categoryId: number
  brandId?: number
  images?: string[]
}) {
  const { images, price, originalPrice, ...productData } = data
  const product = await prisma.product.create({
    data: {
      ...productData,
      status: 0, // 新建为草稿
    },
  })
  // 创建默认 SKU
  await prisma.productSku.create({
    data: {
      productId: product.id,
      name: '默认规格',
      price,
      stock: 0,
    },
  })
  // 创建图片
  if (images?.length) {
    await prisma.productImage.createMany({
      data: images.map((url, i) => ({ productId: product.id, url, sort: i })),
    })
  }
  return product
}
