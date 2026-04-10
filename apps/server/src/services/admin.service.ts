import prisma from '../prisma/index.js'
import { getSkip } from '../utils/pagination.js'
import { notFound } from '../utils/errors.js'

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

/** 获取商家列表（管理员用） */
export async function getMerchantList(page: number, pageSize: number, status?: number) {
  const where: any = {}
  if (status !== undefined) where.status = status

  const [list, total] = await Promise.all([
    prisma.merchant.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: getSkip(page, pageSize),
      take: pageSize,
      include: {
        _count: { select: { products: true } },
      },
    }),
    prisma.merchant.count({ where }),
  ])
  return { list, total }
}

/** 审核商家 */
export async function updateMerchantStatus(merchantId: number, status: number) {
  return prisma.merchant.update({ where: { id: merchantId }, data: { status } })
}

/** 获取平台统计 */
export async function getPlatformStats() {
  const [userCount, merchantCount, productCount, orderCount] = await Promise.all([
    prisma.user.count(),
    prisma.merchant.count({ where: { status: 1 } }),
    prisma.product.count({ where: { status: 1 } }),
    prisma.order.count(),
  ])
  return { userCount, merchantCount, productCount, orderCount }
}

/** 获取全平台订单列表 */
export async function getAllOrders(page: number, pageSize: number, status?: number) {
  const where: any = {}
  if (status !== undefined) where.status = status

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

// ========== 商品管理 ==========

/** 获取商品列表（管理员，支持筛选） */
export async function getProductList(
  page: number,
  pageSize: number,
  filters?: { keyword?: string; categoryId?: number; status?: number; merchantId?: number },
) {
  const where: any = {}
  if (filters?.keyword) where.name = { contains: filters.keyword }
  if (filters?.categoryId) where.categoryId = filters.categoryId
  if (filters?.status !== undefined) where.status = filters.status
  if (filters?.merchantId) where.merchantId = filters.merchantId

  const [list, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: getSkip(page, pageSize),
      take: pageSize,
      include: {
        category: { select: { id: true, name: true } },
        merchant: { select: { id: true, name: true } },
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
      merchant: { select: { id: true, name: true } },
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

/** 创建商品 */
export async function createProduct(data: {
  name: string
  description?: string
  price: number
  originalPrice?: number
  categoryId: number
  merchantId: number
  brandId?: number
  images?: string[]
}) {
  const { images, ...productData } = data
  const product = await prisma.product.create({
    data: {
      ...productData,
      slug: `product-${Date.now()}`,
      stock: 0,
    },
  })
  // 创建默认 SKU
  await prisma.productSku.create({
    data: { productId: product.id, name: '默认规格', price: data.price, stock: 0 },
  })
  // 创建图片
  if (images?.length) {
    await prisma.productImage.createMany({
      data: images.map((url, i) => ({ productId: product.id, url, sort: i })),
    })
  }
  return product
}
