import prisma from '../prisma/index.js'
import bcrypt from 'bcryptjs'
import { AppError } from '../utils/errors.js'

/** 管理员登录 */
export async function adminLogin(username: string, password: string) {
  const admin = await prisma.admin.findUnique({ where: { username } })
  if (!admin) throw new AppError(400, '账号或密码错误')

  const valid = await bcrypt.compare(password, admin.password)
  if (!valid) throw new AppError(400, '账号或密码错误')

  return {
    id: admin.id,
    username: admin.username,
    realName: admin.realName,
    role: admin.role,
  }

}

/** 修改管理员密码 */
export async function changePassword(adminId: number, oldPassword: string, newPassword: string) {
  const admin = await prisma.admin.findUnique({ where: { id: adminId } })
  if (!admin) throw new AppError(404, '管理员不存在')

  const valid = await bcrypt.compare(oldPassword, admin.password)
  if (!valid) throw new AppError(400, '原密码错误')

  const hashed = await bcrypt.hash(newPassword, 10)
  await prisma.admin.update({ where: { id: adminId }, data: { password: hashed } })
}

/** 获取管理员信息 */
export async function getAdminProfile(adminId: number) {
  const admin = await prisma.admin.findUnique({
    where: { id: adminId },
    select: { id: true, username: true, realName: true, role: true, createdAt: true },
  })
  if (!admin) throw new AppError(404, '管理员不存在')
  return admin
}
