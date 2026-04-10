import bcrypt from 'bcryptjs'
import prisma from '../prisma/index.js'
import { AppError } from '../utils/errors.js'

const SALT_ROUNDS = 10

/** 用户注册 */
export async function register(phone: string, password: string) {
  const exists = await prisma.user.findUnique({ where: { phone } })
  if (exists) {
    throw new AppError(400, '该手机号已注册')
  }
  const hashed = await bcrypt.hash(password, SALT_ROUNDS)
  const user = await prisma.user.create({
    data: {
      phone,
      password: hashed,
      nickname: `用户${phone.slice(-4)}`,
    },
    select: { id: true, phone: true, nickname: true, avatar: true, status: true, createdAt: true },
  })
  return user
}

/** 用户登录 */
export async function login(phone: string, password: string) {
  const user = await prisma.user.findUnique({ where: { phone } })
  if (!user) {
    throw new AppError(400, '手机号或密码错误')
  }
  if (user.status === 0) {
    throw new AppError(403, '账号已被禁用')
  }
  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    throw new AppError(400, '手机号或密码错误')
  }
  return {
    id: user.id,
    phone: user.phone,
    nickname: user.nickname,
    avatar: user.avatar,
    status: user.status,
  }
}

/** 获取用户信息 */
export async function getUserProfile(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, phone: true, nickname: true, avatar: true, status: true, createdAt: true },
  })
  return user
}

/** 更新用户信息 */
export async function updateUserProfile(
  userId: number,
  data: { nickname?: string; avatar?: string },
) {
  return prisma.user.update({
    where: { id: userId },
    data,
    select: { id: true, phone: true, nickname: true, avatar: true, status: true, createdAt: true },
  })
}

/** 修改密码 */
export async function changePassword(userId: number, oldPassword: string, newPassword: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    throw new AppError(404, '用户不存在')
  }
  const valid = await bcrypt.compare(oldPassword, user.password)
  if (!valid) {
    throw new AppError(400, '原密码错误')
  }
  const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS)
  await prisma.user.update({ where: { id: userId }, data: { password: hashed } })
}

// ==================== 收货地址 ====================

/** 获取用户收货地址列表 */
export async function getAddresses(userId: number) {
  return prisma.userAddress.findMany({
    where: { userId },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
  })
}

/** 创建收货地址 */
export async function createAddress(
  userId: number,
  data: {
    name: string
    phone: string
    province: string
    city: string
    district: string
    address: string
    isDefault?: boolean
  },
) {
  // 如果设为默认，先取消其他默认地址
  if (data.isDefault) {
    await prisma.userAddress.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    })
  }
  return prisma.userAddress.create({ data: { ...data, userId } })
}

/** 更新收货地址 */
export async function updateAddress(
  userId: number,
  addressId: number,
  data: {
    name?: string
    phone?: string
    province?: string
    city?: string
    district?: string
    address?: string
    isDefault?: boolean
  },
) {
  // 验证地址归属
  const addr = await prisma.userAddress.findFirst({ where: { id: addressId, userId } })
  if (!addr) throw new AppError(404, '地址不存在')

  if (data.isDefault) {
    await prisma.userAddress.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    })
  }
  return prisma.userAddress.update({ where: { id: addressId }, data })
}

/** 删除收货地址 */
export async function deleteAddress(userId: number, addressId: number) {
  const addr = await prisma.userAddress.findFirst({ where: { id: addressId, userId } })
  if (!addr) throw new AppError(404, '地址不存在')
  await prisma.userAddress.delete({ where: { id: addressId } })
}

/** 设为默认地址 */
export async function setDefaultAddress(userId: number, addressId: number) {
  const addr = await prisma.userAddress.findFirst({ where: { id: addressId, userId } })
  if (!addr) throw new AppError(404, '地址不存在')

  await prisma.$transaction([
    prisma.userAddress.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    }),
    prisma.userAddress.update({
      where: { id: addressId },
      data: { isDefault: true },
    }),
  ])
}
