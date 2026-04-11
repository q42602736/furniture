import prisma from '../prisma/index.js'
import { AppError } from '../utils/errors.js'

/** 获取购物车列表 */
export async function getCartItems(userId: number) {
  const items = await prisma.cartItem.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      product: true,
      sku: true,
    },
  })
  return items
}

/** 添加商品到购物车 */
export async function addToCart(userId: number, productId: number, skuId: number, quantity: number) {
  // 验证商品和 SKU
  const sku = await prisma.productSku.findFirst({
    where: { id: skuId, productId },
    include: { product: { select: { status: true } } },
  })
  if (!sku) throw new AppError(400, '商品规格不存在')
  if (sku.product.status !== 1) throw new AppError(400, '商品已下架')
  if (sku.stock < quantity) throw new AppError(400, '库存不足')

  // 存在则更新数量，不存在则创建
  const existing = await prisma.cartItem.findUnique({
    where: { userId_skuId: { userId, skuId } },
  })

  if (existing) {
    const newQty = existing.quantity + quantity
    if (newQty > sku.stock) throw new AppError(400, '超出库存数量')
    return prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: newQty },
    })
  }

  return prisma.cartItem.create({
    data: { userId, productId, skuId, quantity },
  })
}

/** 更新购物车商品数量 */
export async function updateCartQuantity(userId: number, cartItemId: number, quantity: number) {
  const item = await prisma.cartItem.findFirst({
    where: { id: cartItemId, userId },
    include: { sku: { select: { stock: true } } },
  })
  if (!item) throw new AppError(404, '购物车商品不存在')
  if (quantity > item.sku.stock) throw new AppError(400, '超出库存数量')

  return prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
  })
}

/** 删除购物车商品（支持批量） */
export async function removeFromCart(userId: number, cartItemIds: number[]) {
  await prisma.cartItem.deleteMany({
    where: { id: { in: cartItemIds }, userId },
  })
}

/** 清空购物车 */
export async function clearCart(userId: number) {
  await prisma.cartItem.deleteMany({ where: { userId } })
}

/** 获取购物车商品数量 */
export async function getCartCount(userId: number) {
  return prisma.cartItem.count({ where: { userId } })
}
