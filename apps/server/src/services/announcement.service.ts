import prisma from '../prisma/index.js'

/** 获取已发布公告列表（C端） */
export async function getActiveAnnouncements() {
  return prisma.announcement.findMany({
    where: { status: 1 },
    orderBy: [{ sort: 'asc' }, { createdAt: 'desc' }],
    select: { id: true, title: true, content: true, type: true, createdAt: true },
  })
}

/** 获取所有公告（后台管理） */
export async function getAllAnnouncements() {
  return prisma.announcement.findMany({
    orderBy: [{ sort: 'asc' }, { createdAt: 'desc' }],
  })
}

/** 创建公告 */
export async function createAnnouncement(data: {
  title: string
  content: string
  type?: string
  sort?: number
  status?: number
}) {
  return prisma.announcement.create({ data })
}

/** 更新公告 */
export async function updateAnnouncement(
  id: number,
  data: { title?: string; content?: string; type?: string; sort?: number; status?: number },
) {
  return prisma.announcement.update({ where: { id }, data })
}

/** 删除公告 */
export async function deleteAnnouncement(id: number) {
  return prisma.announcement.delete({ where: { id } })
}
