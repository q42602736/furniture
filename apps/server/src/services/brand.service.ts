import prisma from '../prisma/index.js'

/** 获取品牌列表（C端，仅启用状态） */
export async function getActiveBrands() {
  return prisma.brand.findMany({
    orderBy: { sort: 'asc' },
    select: { id: true, name: true, logo: true },
  })
}

/** 获取所有品牌（后台管理，含商品计数） */
export async function getAllBrands() {
  return prisma.brand.findMany({
    orderBy: [{ sort: 'asc' }, { createdAt: 'desc' }],
    include: {
      _count: { select: { products: true } },
    },
  })
}

/** 获取品牌详情 */
export async function getBrandById(id: number) {
  return prisma.brand.findUnique({
    where: { id },
    include: {
      _count: { select: { products: true } },
    },
  })
}

/** 创建品牌 */
export async function createBrand(data: { name: string; logo?: string; sort?: number }) {
  return prisma.brand.create({ data })
}

/** 更新品牌 */
export async function updateBrand(id: number, data: { name?: string; logo?: string; sort?: number }) {
  return prisma.brand.update({ where: { id }, data })
}

/** 删除品牌（检查是否有关联商品） */
export async function deleteBrand(id: number) {
  const brand = await prisma.brand.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  })
  if (!brand) throw new Error('品牌不存在')
  if (brand._count.products > 0) {
    throw new Error(`该品牌下还有 ${brand._count.products} 个商品，无法删除`)
  }
  return prisma.brand.delete({ where: { id } })
}
