import prisma from '../prisma/index.js'
import { AppError } from '../utils/errors.js'
import { getSkip } from '../utils/pagination.js'

/** 收藏商品 */
export async function addFavorite(userId: number, productId: number) {
  const product = await prisma.product.findUnique({ where: { id: productId, status: 1 } })
  if (!product) throw new AppError(400, '商品不存在')

  const exists = await prisma.favorite.findFirst({ where: { userId, productId } })
  if (exists) throw new AppError(400, '已收藏该商品')

  return prisma.favorite.create({ data: { userId, productId } })
}

/** 取消收藏 */
export async function removeFavorite(userId: number, productId: number) {
  const fav = await prisma.favorite.findFirst({ where: { userId, productId } })
  if (!fav) throw new AppError(404, '未收藏该商品')
  await prisma.favorite.delete({ where: { id: fav.id } })
}

/** 获取收藏列表 */
export async function getFavorites(userId: number, page: number, pageSize: number) {
  const where = { userId }
  const [list, total] = await Promise.all([
    prisma.favorite.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: getSkip(page, pageSize),
      take: pageSize,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            mainImage: true,
            status: true,
            salesCount: true,
            merchant: { select: { id: true, name: true } },
          },
          include: {
            skus: { select: { price: true }, take: 1, orderBy: { price: 'asc' } },
          },
        },
      },
    }),
    prisma.favorite.count({ where }),
  ])
  return { list, total }
}

/** 检查是否已收藏 */
export async function isFavorited(userId: number, productId: number) {
  const fav = await prisma.favorite.findFirst({ where: { userId, productId } })
  return !!fav
}
