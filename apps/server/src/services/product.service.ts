import prisma from '../prisma/index.js'
import { getSkip } from '../utils/pagination.js'
import type { Prisma } from '@prisma/client'

/** 商品列表查询参数 */
interface ProductListParams {
  page: number
  pageSize: number
  categoryId?: number
  brandId?: number
  keyword?: string
  minPrice?: number
  maxPrice?: number
  sort?: 'default' | 'sales' | 'price_asc' | 'price_desc' | 'newest'
  status?: number
}

/** 获取商品列表（分页+筛选） */
export async function getProductList(params: ProductListParams) {
  const { page, pageSize, categoryId, brandId, keyword, minPrice, maxPrice, sort = 'default', status = 1 } = params

  const where: Prisma.ProductWhereInput = { status }

  if (categoryId) {
    // 同时匹配父分类和子分类
    where.OR = [
      { categoryId },
      { category: { parentId: categoryId } },
    ]
  }
  if (brandId) where.brandId = brandId
  if (keyword) {
    where.name = { contains: keyword }
  }

  // 价格筛选 — 通过 SKU 的最低价过滤
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.skus = {
      some: {
        ...(minPrice !== undefined ? { price: { gte: minPrice } } : {}),
        ...(maxPrice !== undefined ? { price: { lte: maxPrice } } : {}),
      },
    }
  }

  // 排序
  let orderBy: Prisma.ProductOrderByWithRelationInput[]
  switch (sort) {
    case 'sales':
      orderBy = [{ salesCount: 'desc' }]
      break
    case 'price_asc':
      orderBy = [{ skus: { _count: 'asc' } }]
      break
    case 'price_desc':
      orderBy = [{ skus: { _count: 'desc' } }]
      break
    case 'newest':
      orderBy = [{ createdAt: 'desc' }]
      break
    default:
      orderBy = [{ sort: 'desc' }, { salesCount: 'desc' }]
  }

  const [list, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: getSkip(page, pageSize),
      take: pageSize,
      include: {
        skus: { select: { id: true, name: true, price: true, stock: true, image: true } },
        category: { select: { id: true, name: true, slug: true } },
        brand: { select: { id: true, name: true, logo: true } },
        _count: { select: { reviews: true } },
      },
    }),
    prisma.product.count({ where }),
  ])

  return { list, total }
}

/** 获取商品详情 */
export async function getProductDetail(id: number) {
  const product = await prisma.product.findUnique({
    where: { id, status: 1 },
    include: {
      skus: true,
      images: { orderBy: { sort: 'asc' } },
      attributes: true,
      category: { select: { id: true, name: true, slug: true } },
      brand: { select: { id: true, name: true, logo: true } },
      _count: { select: { reviews: true, favorites: true } },
    },
  })
  return product
}

/** 获取商品评价列表 */
export async function getProductReviews(productId: number, page: number, pageSize: number) {
  const where = { productId }
  const [list, total] = await Promise.all([
    prisma.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: getSkip(page, pageSize),
      take: pageSize,
      include: {
        user: { select: { id: true, nickname: true, avatar: true } },
      },
    }),
    prisma.review.count({ where }),
  ])
  return { list, total }
}

/** 获取推荐商品（同分类热销） */
export async function getRecommendProducts(categoryId: number, excludeId: number, limit = 6) {
  return prisma.product.findMany({
    where: {
      status: 1,
      id: { not: excludeId },
      OR: [{ categoryId }, { category: { parentId: categoryId } }],
    },
    orderBy: { salesCount: 'desc' },
    take: limit,
    include: {
      skus: { select: { price: true }, take: 1, orderBy: { price: 'asc' } },
    },
  })
}

// ==================== 商品管理 ====================

/** 创建商品 */
export async function createProduct(
  data: {
    name: string
    categoryId: number
    brandId?: number
    description?: string
    content?: string
    mainImage?: string
    status?: number
  },
) {
  return prisma.product.create({
    data,
    include: { category: true, brand: true },
  })
}

/** 更新商品 */
export async function updateProduct(
  productId: number,
  data: {
    name?: string
    categoryId?: number
    brandId?: number
    description?: string
    content?: string
    mainImage?: string
    status?: number
    sort?: number
  },
) {
  return prisma.product.update({ where: { id: productId }, data })
}

/** 管理商品 SKU */
export async function upsertProductSkus(
  productId: number,
  skus: { id?: number; name: string; price: number; stock: number; image?: string }[],
) {
  await prisma.$transaction([
    prisma.productSku.deleteMany({ where: { productId } }),
    ...skus.map((sku) =>
      prisma.productSku.create({
        data: { productId, name: sku.name, price: sku.price, stock: sku.stock, image: sku.image },
      }),
    ),
  ])
  return prisma.productSku.findMany({ where: { productId } })
}

/** 管理商品图片 */
export async function upsertProductImages(
  productId: number,
  images: { url: string; sort?: number }[],
) {
  await prisma.$transaction([
    prisma.productImage.deleteMany({ where: { productId } }),
    ...images.map((img, index) =>
      prisma.productImage.create({
        data: { productId, url: img.url, sort: img.sort ?? index },
      }),
    ),
  ])
  return prisma.productImage.findMany({ where: { productId }, orderBy: { sort: 'asc' } })
}
