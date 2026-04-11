import prisma from '../prisma/index.js'

/** 获取推荐位列表（后台） */
export async function getAllRecommendations() {
  return prisma.recommendation.findMany({
    orderBy: [{ position: 'asc' }, { sort: 'asc' }, { createdAt: 'desc' }],
    include: {
      product: {
        select: { id: true, name: true, mainImage: true, status: true },
      },
    },
  })
}

/** 按位置获取推荐列表（C端） */
export async function getRecommendationsByPosition(position: string) {
  return prisma.recommendation.findMany({
    where: { position, status: 1 },
    orderBy: [{ sort: 'asc' }, { createdAt: 'desc' }],
    include: {
      product: {
        select: {
          id: true,
          name: true,
          mainImage: true,
          skus: { select: { price: true }, take: 1, orderBy: { price: 'asc' } },
        },
      },
    },
  })
}

/** 创建推荐位 */
export async function createRecommendation(data: {
  title: string
  position: string
  productId: number
  image?: string
  sort?: number
}) {
  return prisma.recommendation.create({
    data,
    include: {
      product: { select: { id: true, name: true, mainImage: true } },
    },
  })
}

/** 更新推荐位 */
export async function updateRecommendation(
  id: number,
  data: {
    title?: string
    position?: string
    productId?: number
    image?: string
    sort?: number
    status?: number
  },
) {
  return prisma.recommendation.update({
    where: { id },
    data,
    include: {
      product: { select: { id: true, name: true, mainImage: true } },
    },
  })
}

/** 删除推荐位 */
export async function deleteRecommendation(id: number) {
  return prisma.recommendation.delete({ where: { id } })
}
