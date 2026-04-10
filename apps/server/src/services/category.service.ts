import prisma from '../prisma/index.js'

/** 获取分类树（含子分类） */
export async function getCategoryTree() {
  const categories = await prisma.category.findMany({
    where: { status: 1, parentId: null },
    orderBy: { sort: 'asc' },
    include: {
      children: {
        where: { status: 1 },
        orderBy: { sort: 'asc' },
      },
    },
  })
  return categories
}

/** 获取单个分类详情（含子分类） */
export async function getCategoryBySlug(slug: string) {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      children: {
        where: { status: 1 },
        orderBy: { sort: 'asc' },
      },
      parent: true,
    },
  })
  return category
}

/** 获取所有分类（后台管理用） */
export async function getAllCategories() {
  const categories = await prisma.category.findMany({
    orderBy: [{ parentId: 'asc' }, { sort: 'asc' }],
    include: {
      children: {
        orderBy: { sort: 'asc' },
      },
    },
  })
  return categories
}

/** 创建分类 */
export async function createCategory(data: {
  name: string
  slug: string
  icon?: string
  parentId?: number
  sort?: number
}) {
  return prisma.category.create({ data })
}

/** 更新分类 */
export async function updateCategory(
  id: number,
  data: { name?: string; slug?: string; icon?: string; sort?: number; status?: number },
) {
  return prisma.category.update({ where: { id }, data })
}

/** 删除分类 */
export async function deleteCategory(id: number) {
  // 先检查是否有子分类
  const children = await prisma.category.count({ where: { parentId: id } })
  if (children > 0) {
    throw new Error('请先删除子分类')
  }
  // 检查是否有关联商品
  const products = await prisma.product.count({ where: { categoryId: id } })
  if (products > 0) {
    throw new Error('该分类下有商品，不能删除')
  }
  return prisma.category.delete({ where: { id } })
}
