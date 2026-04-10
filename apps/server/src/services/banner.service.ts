import prisma from '../prisma/index.js'

/** 获取首页 Banner 列表（C端） */
export async function getActiveBanners() {
  return prisma.banner.findMany({
    where: { status: 1 },
    orderBy: { sort: 'asc' },
    select: { id: true, title: true, image: true, link: true },
  })
}

/** 获取所有 Banner（后台管理） */
export async function getAllBanners() {
  return prisma.banner.findMany({
    orderBy: [{ sort: 'asc' }, { createdAt: 'desc' }],
  })
}

/** 创建 Banner */
export async function createBanner(data: { title: string; image: string; link?: string; sort?: number }) {
  return prisma.banner.create({ data })
}

/** 更新 Banner */
export async function updateBanner(
  id: number,
  data: { title?: string; image?: string; link?: string; sort?: number; status?: number },
) {
  return prisma.banner.update({ where: { id }, data })
}

/** 删除 Banner */
export async function deleteBanner(id: number) {
  return prisma.banner.delete({ where: { id } })
}
