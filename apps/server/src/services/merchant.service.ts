import prisma from '../prisma/index.js'
import { getSkip } from '../utils/pagination.js'

/** 获取商家详情（C端） */
export async function getMerchantDetail(id: number) {
  const merchant = await prisma.merchant.findUnique({
    where: { id, status: 1 },
    select: {
      id: true,
      name: true,
      logo: true,
      description: true,
      createdAt: true,
      _count: { select: { products: { where: { status: 1 } } } },
    },
  })
  return merchant
}

/** 获取商家的商品列表 */
export async function getMerchantProducts(
  merchantId: number,
  page: number,
  pageSize: number,
  sort: 'default' | 'sales' | 'newest' | 'price_asc' | 'price_desc' = 'default',
) {
  const where = { merchantId, status: 1 }

  let orderBy: any[]
  switch (sort) {
    case 'sales':
      orderBy = [{ salesCount: 'desc' }]
      break
    case 'newest':
      orderBy = [{ createdAt: 'desc' }]
      break
    case 'price_asc':
      orderBy = [{ sort: 'asc' }]
      break
    case 'price_desc':
      orderBy = [{ sort: 'desc' }]
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
        skus: { select: { price: true }, take: 1, orderBy: { price: 'asc' } },
        _count: { select: { reviews: true } },
      },
    }),
    prisma.product.count({ where }),
  ])

  return { list, total }
}

/** 获取商家品牌列表 */
export async function getMerchantBrands(merchantId: number) {
  return prisma.brand.findMany({
    where: { merchantId },
    orderBy: { sort: 'asc' },
  })
}
