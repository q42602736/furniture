import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

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

  // ==================== 商家数据 ====================
  console.log('🏪 创建商家...')
  const merchants = [
    { name: '北欧简居', description: '专注北欧简约风格家具，让生活回归本真', contactName: '张经理', contactPhone: '13800001001', status: 1 },
    { name: '意式轻奢馆', description: '意大利设计，轻奢品质，打造高端居家体验', contactName: '李经理', contactPhone: '13800001002', status: 1 },
    { name: '新中式雅居', description: '传承东方美学，融合现代设计，国风家居首选', contactName: '王经理', contactPhone: '13800001003', status: 1 },
    { name: '美式乡村家居', description: '美式田园风格，温馨舒适的家居选择', contactName: '陈经理', contactPhone: '13800001004', status: 1 },
  ]

  const merchantRecords = []
  for (const m of merchants) {
    const merchant = await prisma.merchant.create({ data: m })
    merchantRecords.push(merchant)
    // 为每个商家创建管理员账号
    const pwd = await bcrypt.hash('merchant123', 10)
    await prisma.merchantUser.create({
      data: {
        merchantId: merchant.id,
        username: `merchant${merchant.id}`,
        password: pwd,
        realName: m.contactName,
        role: 'admin',
      },
    })
  }

  // ==================== 品牌数据 ====================
  console.log('🏷️ 创建品牌...')
  const brandData = [
    { name: 'MUJI 无印良品', merchantId: merchantRecords[0].id },
    { name: 'HAY', merchantId: merchantRecords[0].id },
    { name: 'Fendi Casa', merchantId: merchantRecords[1].id },
    { name: 'Poliform', merchantId: merchantRecords[1].id },
    { name: '梵几', merchantId: merchantRecords[2].id },
    { name: '半木', merchantId: merchantRecords[2].id },
    { name: 'Ethan Allen', merchantId: merchantRecords[3].id },
    { name: 'Ashley', merchantId: merchantRecords[3].id },
  ]

  const brandRecords = []
  for (const b of brandData) {
    const brand = await prisma.brand.create({ data: b })
    brandRecords.push(brand)
  }

  // ==================== 商品数据 ====================
  console.log('📦 创建商品...')
  // 获取分类
  const allCategories = await prisma.category.findMany({ where: { parentId: { not: null } } })

  const productData = [
    { name: '北欧实木沙发 三人位', merchantIdx: 0, brandIdx: 0, catSlug: 'living-room-1', price: 5999, desc: '精选北美白橡木，简约线条设计' },
    { name: '丹麦设计师茶几 圆形', merchantIdx: 0, brandIdx: 1, catSlug: 'living-room-2', price: 2899, desc: 'HAY 经典设计，实木桌面搭配金属支脚' },
    { name: '意式真皮沙发 L型', merchantIdx: 1, brandIdx: 2, catSlug: 'living-room-1', price: 28999, desc: '进口头层牛皮，意大利顶级工艺' },
    { name: '极简电视柜 悬浮式', merchantIdx: 1, brandIdx: 3, catSlug: 'living-room-3', price: 6599, desc: 'Poliform 极简设计，悬浮安装' },
    { name: '新中式实木大床 1.8米', merchantIdx: 2, brandIdx: 4, catSlug: 'bedroom-1', price: 8999, desc: '黑胡桃木框架，传统榫卯工艺' },
    { name: '新中式梳妆台', merchantIdx: 2, brandIdx: 5, catSlug: 'bedroom-5', price: 4599, desc: '国粹美学，实木雕花镜框' },
    { name: '美式乡村餐桌 六人位', merchantIdx: 3, brandIdx: 6, catSlug: 'dining-room-1', price: 7999, desc: '橡胶木实木，做旧复古工艺' },
    { name: '美式餐边柜 实木', merchantIdx: 3, brandIdx: 7, catSlug: 'dining-room-3', price: 5299, desc: 'Ashley 经典设计，大容量收纳' },
    { name: '北欧简约书桌 140cm', merchantIdx: 0, brandIdx: 0, catSlug: 'study-1', price: 3299, desc: '白橡木桌面，极简铁艺桌腿' },
    { name: '人体工学书椅', merchantIdx: 0, brandIdx: 1, catSlug: 'study-2', price: 2499, desc: '4D 扶手，腰部支撑可调' },
    { name: '意式极简衣柜 四门', merchantIdx: 1, brandIdx: 3, catSlug: 'bedroom-3', price: 12999, desc: '静音滑轨，LED 感应灯带' },
    { name: '实木儿童床 上下铺', merchantIdx: 2, brandIdx: 4, catSlug: 'children-1', price: 6599, desc: '新西兰松木，环保水性漆' },
    { name: '北欧吊灯 餐厅款', merchantIdx: 0, brandIdx: 1, catSlug: 'lighting-1', price: 1599, desc: 'HAY 设计师款，黄铜灯臂' },
    { name: '手工编织地毯 200x300', merchantIdx: 2, brandIdx: 5, catSlug: 'decor-4', price: 3999, desc: '印度手工编织，纯羊毛材质' },
    { name: '美式实木鞋柜', merchantIdx: 3, brandIdx: 7, catSlug: 'storage-1', price: 3899, desc: '翻斗设计，超大容量30双' },
    { name: '轻奢真皮床 1.5米', merchantIdx: 1, brandIdx: 2, catSlug: 'bedroom-1', price: 15999, desc: 'Fendi 同厂代工，科技布床头' },
  ]

  for (const p of productData) {
    const cat = allCategories.find((c) => c.slug === p.catSlug)
    if (!cat) continue

    const product = await prisma.product.create({
      data: {
        name: p.name,
        merchantId: merchantRecords[p.merchantIdx].id,
        categoryId: cat.id,
        brandId: brandRecords[p.brandIdx].id,
        description: p.desc,
        status: 1,
        salesCount: Math.floor(Math.random() * 500) + 10,
      },
    })

    // 创建 SKU
    const basePrice = p.price
    await prisma.productSku.createMany({
      data: [
        { productId: product.id, name: '标准款', price: basePrice, stock: Math.floor(Math.random() * 100) + 20 },
        { productId: product.id, name: '升级款', price: Math.round(basePrice * 1.2), stock: Math.floor(Math.random() * 50) + 10 },
      ],
    })
  }

  // ==================== Banner ====================
  console.log('🖼️ 创建 Banner...')
  await prisma.banner.createMany({
    data: [
      { title: '2024 新品上市', image: '/images/banner/banner1.jpg', link: '/category/living-room', sort: 1 },
      { title: '年中大促 全场5折起', image: '/images/banner/banner2.jpg', link: '/search?keyword=promotion', sort: 2 },
      { title: '设计师精选系列', image: '/images/banner/banner3.jpg', link: '/brand', sort: 3 },
      { title: '免费配送到家', image: '/images/banner/banner4.jpg', link: '/category/bedroom', sort: 4 },
    ],
  })

  // ==================== 测试用户 ====================
  console.log('👤 创建测试用户...')
  const userPassword = await bcrypt.hash('123456', 10)
  const testUser = await prisma.user.create({
    data: { phone: '13800000001', password: userPassword, nickname: '测试用户' },
  })

  // 测试用户地址
  await prisma.userAddress.create({
    data: {
      userId: testUser.id,
      name: '张三',
      phone: '13800000001',
      province: '广东省',
      city: '深圳市',
      district: '南山区',
      address: '科技园南路88号',
      isDefault: true,
    },
  })

  console.log('✅ 种子数据填充完成！')
  console.log('📋 账号信息：')
  console.log('  - 测试用户：13800000001 / 123456')
  console.log('  - 平台管理员：admin / admin123')
  console.log('  - 商家管理员：merchant1～4 / merchant123')
}

main()
  .catch((e) => {
    console.error('❌ 种子数据填充失败：', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
