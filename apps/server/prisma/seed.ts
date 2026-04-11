import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// picsum.photos 固定种子图片 — 相同 seed 始终返回同一张图
const img = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`

// 订单号生成器
let orderSeq = 0
function genOrderNo() {
  orderSeq++
  return `ORD20241201${orderSeq.toString().padStart(4, '0')}`
}

async function main() {
  console.log('🌱 开始填充种子数据...')

  // ==================== 分类数据 ====================
  console.log('📁 创建分类...')
  const categories = [
    { name: '客厅家具', slug: 'living-room', icon: '🛋️', sort: 1, children: ['沙发', '茶几', '电视柜', '边几', '展示柜'] },
    { name: '卧室家具', slug: 'bedroom', icon: '🛏️', sort: 2, children: ['床', '床垫', '衣柜', '床头柜', '梳妆台'] },
    { name: '餐厅家具', slug: 'dining-room', icon: '🍽️', sort: 3, children: ['餐桌', '餐椅', '餐边柜', '酒柜'] },
    { name: '书房家具', slug: 'study', icon: '📚', sort: 4, children: ['书桌', '书椅', '书柜', '文件柜'] },
    { name: '儿童家具', slug: 'children', icon: '🧸', sort: 5, children: ['儿童床', '儿童桌椅', '儿童衣柜', '玩具收纳'] },
    { name: '户外家具', slug: 'outdoor', icon: '🌿', sort: 6, children: ['户外桌椅', '遮阳伞', '花园椅', '秋千'] },
    { name: '灯具照明', slug: 'lighting', icon: '💡', sort: 7, children: ['吊灯', '台灯', '落地灯', '壁灯', '射灯'] },
    { name: '家居饰品', slug: 'decor', icon: '🖼️', sort: 8, children: ['花瓶', '摆件', '挂画', '地毯', '窗帘'] },
    { name: '收纳整理', slug: 'storage', icon: '📦', sort: 9, children: ['鞋柜', '收纳箱', '衣帽架', '置物架'] },
  ]

  for (const cat of categories) {
    const parent = await prisma.category.create({
      data: { name: cat.name, slug: cat.slug, icon: cat.icon, sort: cat.sort },
    })
    for (let i = 0; i < cat.children.length; i++) {
      await prisma.category.create({
        data: {
          name: cat.children[i],
          slug: `${cat.slug}-${i + 1}`,
          parentId: parent.id,
          sort: i + 1,
        },
      })
    }
  }

  // ==================== 管理员账号 ====================
  console.log('👤 创建管理员...')
  const adminPassword = await bcrypt.hash('admin123', 10)
  await prisma.admin.create({
    data: { username: 'admin', password: adminPassword, realName: '超级管理员', role: 'super_admin' },
  })

  // ==================== 品牌数据（含 Logo） ====================
  console.log('🏷️ 创建品牌...')
  const brandData = [
    { name: 'MUJI 无印良品', logo: img('brand-muji', 200, 200) },
    { name: 'HAY', logo: img('brand-hay', 200, 200) },
    { name: 'Fendi Casa', logo: img('brand-fendi', 200, 200) },
    { name: 'Poliform', logo: img('brand-poliform', 200, 200) },
    { name: '梵几', logo: img('brand-fanj', 200, 200) },
    { name: '半木', logo: img('brand-banmu', 200, 200) },
    { name: 'Ethan Allen', logo: img('brand-ethan', 200, 200) },
    { name: 'Ashley', logo: img('brand-ashley', 200, 200) },
  ]

  const brandRecords = []
  for (const b of brandData) {
    const brand = await prisma.brand.create({ data: b })
    brandRecords.push(brand)
  }

  // ==================== 商品数据（含主图 + 图册） ====================
  console.log('📦 创建商品...')
  const allCategories = await prisma.category.findMany({ where: { parentId: { not: null } } })

  const productData = [
    { name: '北欧实木沙发 三人位', brandIdx: 0, catSlug: 'living-room-1', price: 5999, desc: '精选北美白橡木，简约线条设计', seed: 'sofa-nordic' },
    { name: '丹麦设计师茶几 圆形', brandIdx: 1, catSlug: 'living-room-2', price: 2899, desc: 'HAY 经典设计，实木桌面搭配金属支脚', seed: 'table-danish' },
    { name: '意式真皮沙发 L型', brandIdx: 2, catSlug: 'living-room-1', price: 28999, desc: '进口头层牛皮，意大利顶级工艺', seed: 'sofa-italian' },
    { name: '极简电视柜 悬浮式', brandIdx: 3, catSlug: 'living-room-3', price: 6599, desc: 'Poliform 极简设计，悬浮安装', seed: 'tvstand-minimal' },
    { name: '新中式实木大床 1.8米', brandIdx: 4, catSlug: 'bedroom-1', price: 8999, desc: '黑胡桃木框架，传统榫卯工艺', seed: 'bed-chinese' },
    { name: '新中式梳妆台', brandIdx: 5, catSlug: 'bedroom-5', price: 4599, desc: '国粹美学，实木雕花镜框', seed: 'dresser-chinese' },
    { name: '美式乡村餐桌 六人位', brandIdx: 6, catSlug: 'dining-room-1', price: 7999, desc: '橡胶木实木，做旧复古工艺', seed: 'table-american' },
    { name: '美式餐边柜 实木', brandIdx: 7, catSlug: 'dining-room-3', price: 5299, desc: 'Ashley 经典设计，大容量收纳', seed: 'cabinet-american' },
    { name: '北欧简约书桌 140cm', brandIdx: 0, catSlug: 'study-1', price: 3299, desc: '白橡木桌面，极简铁艺桌腿', seed: 'desk-nordic' },
    { name: '人体工学书椅', brandIdx: 1, catSlug: 'study-2', price: 2499, desc: '4D 扶手，腰部支撑可调', seed: 'chair-ergonomic' },
    { name: '意式极简衣柜 四门', brandIdx: 3, catSlug: 'bedroom-3', price: 12999, desc: '静音滑轨，LED 感应灯带', seed: 'wardrobe-italian' },
    { name: '实木儿童床 上下铺', brandIdx: 4, catSlug: 'children-1', price: 6599, desc: '新西兰松木，环保水性漆', seed: 'bed-children' },
    { name: '北欧吊灯 餐厅款', brandIdx: 1, catSlug: 'lighting-1', price: 1599, desc: 'HAY 设计师款，黄铜灯臂', seed: 'lamp-nordic' },
    { name: '手工编织地毯 200x300', brandIdx: 5, catSlug: 'decor-4', price: 3999, desc: '印度手工编织，纯羊毛材质', seed: 'carpet-handmade' },
    { name: '美式实木鞋柜', brandIdx: 7, catSlug: 'storage-1', price: 3899, desc: '翻斗设计，超大容量30双', seed: 'shoecabinet-american' },
    { name: '轻奢真皮床 1.5米', brandIdx: 2, catSlug: 'bedroom-1', price: 15999, desc: 'Fendi 同厂代工，科技布床头', seed: 'bed-luxury' },
  ]

  const productRecords: any[] = []

  for (const p of productData) {
    const cat = allCategories.find((c) => c.slug === p.catSlug)
    if (!cat) continue

    const mainImage = img(p.seed, 800, 800)

    const product = await prisma.product.create({
      data: {
        name: p.name,
        categoryId: cat.id,
        brandId: brandRecords[p.brandIdx].id,
        description: p.desc,
        mainImage,
        status: 1,
        salesCount: Math.floor(Math.random() * 500) + 10,
      },
    })
    productRecords.push(product)

    // 商品图册（3-5 张）
    const imgCount = 3 + Math.floor(Math.random() * 3)
    for (let i = 0; i < imgCount; i++) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: img(`${p.seed}-gallery-${i + 1}`, 800, 800),
          sort: i,
        },
      })
    }

    // 创建 SKU
    const basePrice = p.price
    await prisma.productSku.createMany({
      data: [
        { productId: product.id, name: '标准款', price: basePrice, stock: Math.floor(Math.random() * 100) + 20 },
        { productId: product.id, name: '升级款', price: Math.round(basePrice * 1.2), stock: Math.floor(Math.random() * 50) + 10 },
      ],
    })
  }

  // ==================== Banner（在线图片） ====================
  console.log('🖼️ 创建 Banner...')
  await prisma.banner.createMany({
    data: [
      { title: '2024 新品上市', image: img('banner-newproduct', 1200, 400), link: '/category/living-room', sort: 1 },
      { title: '年中大促 全场5折起', image: img('banner-sale', 1200, 400), link: '/search?keyword=promotion', sort: 2 },
      { title: '设计师精选系列', image: img('banner-designer', 1200, 400), link: '/brand', sort: 3 },
      { title: '免费配送到家', image: img('banner-delivery', 1200, 400), link: '/category/bedroom', sort: 4 },
    ],
  })

  // ==================== 测试用户 ====================
  console.log('👤 创建测试用户...')
  const userPassword = await bcrypt.hash('123456', 10)

  const userList = [
    { phone: '13800000001', nickname: '张小花', avatar: img('avatar-user1', 200, 200) },
    { phone: '13800000002', nickname: '李明远', avatar: img('avatar-user2', 200, 200) },
    { phone: '13800000003', nickname: '王家居', avatar: img('avatar-user3', 200, 200) },
  ]

  const testUsers: any[] = []
  for (const u of userList) {
    const user = await prisma.user.create({
      data: { phone: u.phone, password: userPassword, nickname: u.nickname, avatar: u.avatar },
    })
    testUsers.push(user)
  }

  await prisma.userAddress.createMany({
    data: [
      { userId: testUsers[0].id, name: '张小花', phone: '13800000001', province: '广东省', city: '深圳市', district: '南山区', address: '科技园南路88号', isDefault: true },
      { userId: testUsers[1].id, name: '李明远', phone: '13800000002', province: '北京市', city: '北京市', district: '朝阳区', address: '建国路93号万达广场', isDefault: true },
      { userId: testUsers[2].id, name: '王家居', phone: '13800000003', province: '上海市', city: '上海市', district: '浦东新区', address: '陆家嘴环路1000号', isDefault: true },
    ],
  })

  // ==================== 测试订单 ====================
  console.log('📋 创建测试订单...')
  // 查询所有 SKU（按 id 排序，确保顺序一致）
  const allSkus = await prisma.productSku.findMany({
    include: { product: true },
    orderBy: { id: 'asc' },
  })

  // 6 个订单覆盖 6 种状态：待付款 / 待发货 / 已发货 / 已完成 / 已取消 / 售后中
  const orderConfigs = [
    {
      userId: testUsers[0].id, status: 0,
      receiver: { name: '张小花', phone: '13800000001', addr: '广东省深圳市南山区科技园南路88号' },
      skuIdxs: [0, 3], // 第 1、2 个商品各一款
    },
    {
      userId: testUsers[1].id, status: 1,
      receiver: { name: '李明远', phone: '13800000002', addr: '北京市朝阳区建国路93号万达广场' },
      skuIdxs: [4, 7],
      paidAt: new Date('2024-12-15'),
    },
    {
      userId: testUsers[0].id, status: 2,
      receiver: { name: '张小花', phone: '13800000001', addr: '广东省深圳市南山区科技园南路88号' },
      skuIdxs: [8, 11],
      paidAt: new Date('2024-12-10'), shippedAt: new Date('2024-12-12'),
      shipping: { company: '顺丰速运', trackingNo: 'SF1234567890' },
    },
    {
      userId: testUsers[2].id, status: 3,
      receiver: { name: '王家居', phone: '13800000003', addr: '上海市浦东新区陆家嘴环路1000号' },
      skuIdxs: [12, 15],
      paidAt: new Date('2024-11-20'), shippedAt: new Date('2024-11-22'), completedAt: new Date('2024-11-28'),
      shipping: { company: '中通快递', trackingNo: 'ZT9876543210' },
    },
    {
      userId: testUsers[1].id, status: 4,
      receiver: { name: '李明远', phone: '13800000002', addr: '北京市朝阳区建国路93号万达广场' },
      skuIdxs: [16],
      remark: '不想要了',
    },
    {
      userId: testUsers[2].id, status: 5,
      receiver: { name: '王家居', phone: '13800000003', addr: '上海市浦东新区陆家嘴环路1000号' },
      skuIdxs: [20, 22],
      paidAt: new Date('2024-12-01'), shippedAt: new Date('2024-12-03'),
      shipping: { company: '京东物流', trackingNo: 'JD1122334455' },
    },
  ]

  const orderRecords: any[] = []

  for (const oc of orderConfigs) {
    // 构建订单明细
    let totalAmount = 0
    const items: any[] = []

    for (const idx of oc.skuIdxs) {
      const sku = allSkus[idx % allSkus.length]
      const qty = 1 + Math.floor(Math.random() * 2)
      const price = Number(sku.price)
      totalAmount += price * qty

      items.push({
        productId: sku.productId,
        skuId: sku.id,
        name: `${sku.product.name} - ${sku.name}`,
        image: sku.product.mainImage,
        price: sku.price,
        quantity: qty,
      })
    }

    const order = await prisma.order.create({
      data: {
        orderNo: genOrderNo(),
        userId: oc.userId,
        totalAmount,
        payAmount: totalAmount,
        status: oc.status,
        receiverName: oc.receiver.name,
        receiverPhone: oc.receiver.phone,
        receiverAddr: oc.receiver.addr,
        remark: oc.remark ?? null,
        shippingCompany: oc.shipping?.company ?? null,
        trackingNo: oc.shipping?.trackingNo ?? null,
        paidAt: oc.paidAt ?? null,
        shippedAt: oc.shippedAt ?? null,
        completedAt: oc.completedAt ?? null,
        items: { create: items },
      },
    })
    orderRecords.push(order)
  }

  // ==================== 测试评价 ====================
  console.log('⭐ 创建测试评价...')
  const reviewData = [
    { userId: testUsers[0].id, pIdx: 0, rating: 5, content: '沙发质量非常好，坐着很舒服，木材纹理也很漂亮，推荐购买！', hasImg: true },
    { userId: testUsers[1].id, pIdx: 1, rating: 4, content: '茶几设计感很强，就是实际尺寸比想象的小一点。整体满意。', hasImg: false },
    { userId: testUsers[2].id, pIdx: 4, rating: 5, content: '大床非常稳固，榫卯工艺确实不一样。睡眠质量都提升了！', hasImg: true },
    { userId: testUsers[0].id, pIdx: 6, rating: 3, content: '餐桌还行，但做旧痕迹有些不自然，期望更高一些。', hasImg: false },
    { userId: testUsers[1].id, pIdx: 8, rating: 5, content: '书桌简约大气，桌面很宽敞，办公学习都很合适。五星好评！', hasImg: true },
    { userId: testUsers[2].id, pIdx: 9, rating: 4, content: '椅子坐感不错，腰部支撑到位。就是扶手调节稍显僵硬。', hasImg: false },
    { userId: testUsers[0].id, pIdx: 12, rating: 5, content: '吊灯安装后效果超出预期，黄铜质感太美了！朋友来都夸。', hasImg: true },
    { userId: testUsers[1].id, pIdx: 15, rating: 4, content: '真皮床触感很好，1.5米刚好适合小卧室。皮质柔软有光泽。', hasImg: true },
  ]

  for (let i = 0; i < reviewData.length; i++) {
    const r = reviewData[i]
    const product = productRecords[r.pIdx]
    if (!product) continue

    let images: string | null = null
    if (r.hasImg) {
      images = JSON.stringify([
        img(`review-${i + 1}-a`, 400, 400),
        img(`review-${i + 1}-b`, 400, 400),
      ])
    }

    await prisma.review.create({
      data: {
        userId: r.userId,
        productId: product.id,
        rating: r.rating,
        content: r.content,
        images,
      },
    })
  }

  // ==================== 测试退款 ====================
  console.log('💰 创建测试退款...')
  // 对「已发货」订单创建一笔申请中退款
  if (orderRecords[2]) {
    await prisma.refund.create({
      data: {
        orderId: orderRecords[2].id,
        reason: '收到的商品有轻微划痕，希望退款处理',
        amount: 2000,
        status: 0, // 申请中
      },
    })
  }
  // 对「售后中」订单创建一笔已同意退款
  if (orderRecords[5]) {
    await prisma.refund.create({
      data: {
        orderId: orderRecords[5].id,
        reason: '商品与描述不符，颜色有明显色差',
        amount: 5000,
        status: 1, // 已同意
      },
    })
  }

  // ==================== 完成 ====================
  console.log('')
  console.log('✅ 种子数据填充完成！')
  console.log('📋 账号信息：')
  console.log('  - 测试用户1：13800000001 / 123456（张小花）')
  console.log('  - 测试用户2：13800000002 / 123456（李明远）')
  console.log('  - 测试用户3：13800000003 / 123456（王家居）')
  console.log('  - 平台管理员：admin / admin123')
  console.log('')
  console.log('📊 数据统计：')
  console.log(`  - 品牌: ${brandRecords.length} 个`)
  console.log(`  - 商品: ${productRecords.length} 个（含图册 + 双 SKU）`)
  console.log(`  - Banner: 4 张`)
  console.log(`  - 订单: ${orderRecords.length} 个（6 种状态）`)
  console.log(`  - 评价: ${reviewData.length} 条`)
  console.log(`  - 退款: 2 条`)
}

main()
  .catch((e) => {
    console.error('❌ 种子数据填充失败：', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
