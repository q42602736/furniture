/**
 * 格式化价格（分 → 元，或直接格式化）
 */
export function formatPrice(price: number): string {
  return `¥${price.toFixed(2)}`
}

/**
 * 生成订单号
 * 格式: 年月日时分秒 + 4位随机数
 */
export function generateOrderNo(): string {
  const now = new Date()
  const prefix = now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0') +
    String(now.getHours()).padStart(2, '0') +
    String(now.getMinutes()).padStart(2, '0') +
    String(now.getSeconds()).padStart(2, '0')
  const suffix = Math.floor(1000 + Math.random() * 9000).toString()
  return prefix + suffix
}

/**
 * 订单状态文本映射
 */
export function getOrderStatusText(status: number): string {
  const map: Record<number, string> = {
    0: '待付款',
    1: '待发货',
    2: '已发货',
    3: '已完成',
    4: '已取消',
    5: '售后中',
  }
  return map[status] ?? '未知'
}

/**
 * 商品状态文本映射
 */
export function getProductStatusText(status: number): string {
  const map: Record<number, string> = {
    0: '草稿',
    1: '在售',
    2: '已下架',
  }
  return map[status] ?? '未知'
}

/**
 * 商家审核状态文本映射
 */
export function getMerchantStatusText(status: number): string {
  const map: Record<number, string> = {
    0: '待审核',
    1: '正常',
    2: '已禁用',
  }
  return map[status] ?? '未知'
}
