import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import * as categoryService from '../services/category.service.js'
import { success } from '../utils/response.js'
import { validate } from '../utils/validate.js'
import { notFound } from '../utils/errors.js'
import { adminGuard } from '../middlewares/auth.js'

const createCategorySchema = z.object({
  name: z.string().min(1, '分类名称不能为空').max(50),
  slug: z.string().min(1, 'slug 不能为空').max(100).regex(/^[a-z0-9-]+$/, 'slug 只能包含小写字母、数字和连字符'),
  icon: z.string().max(500).optional(),
  parentId: z.number().int().positive().optional(),
  sort: z.number().int().min(0).default(0),
})

const updateCategorySchema = z.object({
  name: z.string().min(1).max(50).optional(),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/).optional(),
  icon: z.string().max(500).optional(),
  sort: z.number().int().min(0).optional(),
  status: z.number().int().min(0).max(1).optional(),
})

export default async function categoryRoutes(app: FastifyInstance) {
  /** GET /api/v1/categories/tree — 获取分类树 */
  app.get('/tree', async () => {
    const tree = await categoryService.getCategoryTree()
    return success(tree)
  })

  /** GET /api/v1/categories/:slug — 根据 slug 获取分类详情 */
  app.get<{ Params: { slug: string } }>('/:slug', async (request) => {
    const { slug } = request.params
    const category = await categoryService.getCategoryBySlug(slug)
    if (!category) notFound('分类不存在')
    return success(category)
  })

  /** GET /api/v1/categories — 获取所有分类（后台） */
  app.get('/', { preHandler: [adminGuard] }, async () => {
    const categories = await categoryService.getAllCategories()
    return success(categories)
  })

  /** POST /api/v1/categories — 创建分类（后台） */
  app.post('/', { preHandler: [adminGuard] }, async (request) => {
    const data = validate(createCategorySchema, request.body)
    const category = await categoryService.createCategory(data)
    return success(category, '创建成功')
  })

  /** PUT /api/v1/categories/:id — 更新分类（后台） */
  app.put<{ Params: { id: string } }>('/:id', { preHandler: [adminGuard] }, async (request) => {
    const id = Number(request.params.id)
    const data = validate(updateCategorySchema, request.body)
    const category = await categoryService.updateCategory(id, data)
    return success(category, '更新成功')
  })

  /** DELETE /api/v1/categories/:id — 删除分类（后台） */
  app.delete<{ Params: { id: string } }>('/:id', { preHandler: [adminGuard] }, async (request) => {
    const id = Number(request.params.id)
    await categoryService.deleteCategory(id)
    return success(null, '删除成功')
  })
}
