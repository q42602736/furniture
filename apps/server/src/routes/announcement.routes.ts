import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import * as announcementService from '../services/announcement.service.js'
import { success } from '../utils/response.js'
import { validate } from '../utils/validate.js'
import { adminGuard } from '../middlewares/auth.js'

const createAnnouncementSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(200),
  content: z.string().min(1, '内容不能为空'),
  type: z.enum(['notice', 'promotion', 'system']).default('notice'),
  sort: z.number().int().min(0).default(0),
  status: z.number().int().min(0).max(1).default(1),
})

const updateAnnouncementSchema = createAnnouncementSchema.partial()

export default async function announcementRoutes(app: FastifyInstance) {
  /** GET /api/v1/announcements — C端获取已发布公告 */
  app.get('/', async () => {
    const list = await announcementService.getActiveAnnouncements()
    return success(list)
  })

  /** GET /api/v1/announcements/all — 后台获取所有公告 */
  app.get('/all', { preHandler: [adminGuard] }, async () => {
    const list = await announcementService.getAllAnnouncements()
    return success(list)
  })

  /** POST /api/v1/announcements — 创建公告 */
  app.post('/', { preHandler: [adminGuard] }, async (request) => {
    const data = validate(createAnnouncementSchema, request.body)
    const item = await announcementService.createAnnouncement(data)
    return success(item, '创建成功')
  })

  /** PUT /api/v1/announcements/:id — 更新公告 */
  app.put<{ Params: { id: string } }>('/:id', { preHandler: [adminGuard] }, async (request) => {
    const id = Number(request.params.id)
    const data = validate(updateAnnouncementSchema, request.body)
    const item = await announcementService.updateAnnouncement(id, data)
    return success(item, '更新成功')
  })

  /** DELETE /api/v1/announcements/:id — 删除公告 */
  app.delete<{ Params: { id: string } }>('/:id', { preHandler: [adminGuard] }, async (request) => {
    const id = Number(request.params.id)
    await announcementService.deleteAnnouncement(id)
    return success(null, '删除成功')
  })
}
