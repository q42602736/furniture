import prisma from '../prisma/index.js'
import { AppError } from '../utils/errors.js'
import { getSkip } from '../utils/pagination.js'
import { Decimal } from '@prisma/client/runtime/library'

/** 生成订单号：日期 + 随机数 */
function generateOrderNo(): string {
  const now = new Date()
  const date = now.toISOString().slice(0, 10).replace(/-/g, '')
  const random = Math.random().toString(36).slice(2, 10).toUpperCase()
  return `FN${date}${random}`
}

interface CreateOrderParams {
  userId: number
  addressId: number
  cartItemIds: number[]
  remark?: string
}

/** 创建订单（从购物车） */
export async function createOrder(params: CreateOrderParams) {
  const { userId, addressId, cartItemIds, remark } = params

  // 获取收货地址
  const address = await prisma.userAddress.findFirst({ where: { id: addressId, userId } })
  if (!address) throw new AppError(400, '收货地址不存在')

  // 获取购物车商品
  const cartItems = await prisma.cartItem.findMany({
    where: { id: { in: cartItemIds }, userId },
    include: {
      product: { select: { id: true, name: true, mainImage: true, status: true, merchantId: true } },
      sku: { select: { id: true, name: true, price: true, stock: true, image: true } },
    },
  })

  if (cartItems.length === 0) throw new AppError(400, '请选择商品')

  // 校验商品状态和库存
  for (const item of cartItems) {
    if (item.product.status !== 1) {
      throw new AppError(400, `商品「${item.product.name}」已下架`)
    }
    if (item.sku.stock < item.quantity) {
      throw new AppError(400, `商品「${item.product.name}」库存不足`)
    }
  }

  // 计算总价
  let totalAmount = new Decimal(0)
  const orderItems = cartItems.map((item) => {
    const amount = item.sku.price.mul(item.quantity)
    totalAmount = totalAmount.add(amount)
    return {
      productId: item.productId,
      skuId: item.skuId,
      name: `${item.product.name} ${item.sku.name}`,
      image: item.sku.image || item.product.mainImage,
      price: item.sku.price,
      quantity: item.quantity,
    }
  })

  // 事务：创建订单 + 扣库存 + 清除购物车
  const order = await prisma.$transaction(async (tx) => {
    // 创建订单
    const newOrder = await tx.order.create({
      data: {
        orderNo: generateOrderNo(),
        userId,
        totalAmount,
        payAmount: totalAmount, // TODO: 优惠券抵扣
        status: 0,
        receiverName: address.name,
        receiverPhone: address.phone,
        receiverAddr: `${address.province}${address.city}${address.district}${address.address}`,
        remark,
        items: { create: orderItems },
      },
      include: { items: true },
    })

    // 扣减库存、增加销量
    for (const item of cartItems) {
      await tx.productSku.update({
        where: { id: item.skuId },
        data: { stock: { decrement: item.quantity } },
      })
      await tx.product.update({
        where: { id: item.productId },
        data: { salesCount: { increment: item.quantity } },
      })
    }

    // 清除购物车项
    await tx.cartItem.deleteMany({ where: { id: { in: cartItemIds } } })

    return newOrder
  })

  return order
}

/** 获取订单列表 */
export async function getOrders(userId: number, status: number | undefined, page: number, pageSize: number) {
  const where: { userId: number; status?: number } = { userId }
  if (status !== undefined) where.status = status

  const [list, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: getSkip(page, pageSize),
      take: pageSize,
      include: {
        items: {
          include: {
            product: { select: { id: true, merchantId: true } },
          },
        },
      },
    }),
    prisma.order.count({ where }),
  ])

  return { list, total }
}

/** 获取订单详情 */
export async function getOrderDetail(userId: number, orderNo: string) {
  const order = await prisma.order.findFirst({
    where: { orderNo, userId },
    include: {
      items: {
        include: {
          product: {
            include: { merchant: { select: { id: true, name: true, logo: true } } },
          },
        },
      },
      payments: true,
    },
  })
  return order
}

/** 取消订单（仅待付款可取消） */
export async function cancelOrder(userId: number, orderNo: string) {
  const order = await prisma.order.findFirst({ where: { orderNo, userId } })
  if (!order) throw new AppError(404, '订单不存在')
  if (order.status !== 0) throw new AppError(400, '只有待付款订单可以取消')

  // 恢复库存
  const items = await prisma.orderItem.findMany({ where: { orderId: order.id } })

  await prisma.$transaction(async (tx) => {
    await tx.order.update({ where: { id: order.id }, data: { status: 4 } })
    for (const item of items) {
      await tx.productSku.update({
        where: { id: item.skuId },
        data: { stock: { increment: item.quantity } },
      })
      await tx.product.update({
        where: { id: item.productId },
        data: { salesCount: { decrement: item.quantity } },
      })
    }
  })
}

/** 确认收货 */
export async function confirmReceipt(userId: number, orderNo: string) {
  const order = await prisma.order.findFirst({ where: { orderNo, userId } })
  if (!order) throw new AppError(404, '订单不存在')
  if (order.status !== 2) throw new AppError(400, '只有已发货订单可以确认收货')

  await prisma.order.update({
    where: { id: order.id },
    data: { status: 3, completedAt: new Date() },
  })
}

/** 获取各状态订单数量 */
export async function getOrderCounts(userId: number) {
  const [pending, shipped, delivering, completed] = await Promise.all([
    prisma.order.count({ where: { userId, status: 0 } }),
    prisma.order.count({ where: { userId, status: 1 } }),
    prisma.order.count({ where: { userId, status: 2 } }),
    prisma.order.count({ where: { userId, status: 3 } }),
  ])
  return { pending, shipped, delivering, completed }
}
