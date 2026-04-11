import prisma from '../prisma/index.js'

/** 获取指定分组的所有配置 */
export async function getConfigsByGroup(group: string) {
  const configs = await prisma.systemConfig.findMany({
    where: { group },
    select: { key: true, value: true },
  })
  // 将配置列表转为对象，value 自动 JSON.parse
  const result: Record<string, any> = {}
  for (const c of configs) {
    try {
      result[c.key] = JSON.parse(c.value)
    } catch {
      result[c.key] = c.value
    }
  }
  return result
}

/** 获取所有分组的配置 */
export async function getAllConfigs() {
  const configs = await prisma.systemConfig.findMany({
    select: { group: true, key: true, value: true },
  })
  const result: Record<string, Record<string, any>> = {}
  for (const c of configs) {
    if (!result[c.group]) result[c.group] = {}
    try {
      result[c.group][c.key] = JSON.parse(c.value)
    } catch {
      result[c.group][c.key] = c.value
    }
  }
  return result
}

/** 批量更新指定分组的配置 */
export async function updateConfigs(group: string, data: Record<string, any>) {
  const ops = Object.entries(data).map(([key, value]) =>
    prisma.systemConfig.upsert({
      where: { key },
      update: { value: JSON.stringify(value) },
      create: { group, key, value: JSON.stringify(value) },
    }),
  )
  await prisma.$transaction(ops)
}
