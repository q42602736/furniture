import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Unsplash 免费家居图片 — 按 photo ID 返回真实家居主题图片，永不过期
const unsplash = (photoId: string, w: number, h: number) =>
  `https://images.unsplash.com/photo-${photoId}?w=${w}&h=${h}&fit=crop&auto=format`

// 精选家居主题 Unsplash 图片池（均已验证可用）
const furniturePhotos = [
  '1540574163026-643ea20ade25', '1550581190-9c1c48d21d6c', '1556909114-f6e7ad7d3136',
  '1583847268964-b28dc8f51f92', '1592078615290-033ee584e267', '1631049307264-da0ec9d70304',
  '1505693416388-ac5ce068fe85', '1560448204-e02f11c3d0e2', '1519710164239-da123dc03ef4',
  '1558997519-83ea9252edf8', '1617806118233-18e1de247200', '1556228578-8c89e6adf883',
  '1506439773649-6e0eb8cfb237', '1567538096630-e0c55bd6374c', '1595526114035-0d45ed16cfbf',
  '1566665797739-1674de7a421a', '1580587771525-78b9dba3b914', '1513694203232-719a280e022f',
  '1543248939-4296e1fea89b', '1616594039964-ae9021a400a0', '1618221195710-dd6b41faaea6',
  '1524758631624-e2822e304c36', '1493663284031-b7e3aefcae8e', '1484154218962-a197022b5858',
  '1721395285142-6294e68b6fbf', '1723257132161-7e1072eef2f8',
]
const pick = (idx: number) => furniturePhotos[idx % furniturePhotos.length]
let photoIdx = 0

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
    { name: 'MUJI 无印良品', logo: unsplash('1616594039964-ae9021a400a0', 200, 200) },
    { name: 'HAY', logo: unsplash('1524758631624-e2822e304c36', 200, 200) },
    { name: 'Fendi Casa', logo: unsplash('1618221195710-dd6b41faaea6', 200, 200) },
    { name: 'Poliform', logo: unsplash('1493663284031-b7e3aefcae8e', 200, 200) },
    { name: '梵几', logo: unsplash('1556228578-8c89e6adf883', 200, 200) },
    { name: '半木', logo: unsplash('1580587771525-78b9dba3b914', 200, 200) },
    { name: 'Ethan Allen', logo: unsplash('1484154218962-a197022b5858', 200, 200) },
    { name: 'Ashley', logo: unsplash('1721395285142-6294e68b6fbf', 200, 200) },
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
    { name: '北欧实木沙发 三人位', brandIdx: 0, catSlug: 'living-room-1', price: 5999, desc: '精选北美白橡木，简约线条设计', imgId: 10 },
    { name: '丹麦设计师茶几 圆形', brandIdx: 1, catSlug: 'living-room-2', price: 2899, desc: 'HAY 经典设计，实木桌面搭配金属支脚', imgId: 20 },
    { name: '意式真皮沙发 L型', brandIdx: 2, catSlug: 'living-room-1', price: 28999, desc: '进口头层牛皮，意大利顶级工艺', imgId: 30 },
    { name: '极简电视柜 悬浮式', brandIdx: 3, catSlug: 'living-room-3', price: 6599, desc: 'Poliform 极简设计，悬浮安装', imgId: 40 },
    { name: '新中式实木大床 1.8米', brandIdx: 4, catSlug: 'bedroom-1', price: 8999, desc: '黑胡桃木框架，传统榫卯工艺', imgId: 50 },
    { name: '新中式梳妆台', brandIdx: 5, catSlug: 'bedroom-5', price: 4599, desc: '国粹美学，实木雕花镜框', imgId: 60 },
    { name: '美式乡村餐桌 六人位', brandIdx: 6, catSlug: 'dining-room-1', price: 7999, desc: '橡胶木实木，做旧复古工艺', imgId: 70 },
    { name: '美式餐边柜 实木', brandIdx: 7, catSlug: 'dining-room-3', price: 5299, desc: 'Ashley 经典设计，大容量收纳', imgId: 80 },
    { name: '北欧简约书桌 140cm', brandIdx: 0, catSlug: 'study-1', price: 3299, desc: '白橡木桌面，极简铁艺桌腿', imgId: 90 },
    { name: '人体工学书椅', brandIdx: 1, catSlug: 'study-2', price: 2499, desc: '4D 扶手，腰部支撑可调', imgId: 100 },
    { name: '意式极简衣柜 四门', brandIdx: 3, catSlug: 'bedroom-3', price: 12999, desc: '静音滑轨，LED 感应灯带', imgId: 110 },
    { name: '实木儿童床 上下铺', brandIdx: 4, catSlug: 'children-1', price: 6599, desc: '新西兰松木，环保水性漆', imgId: 120 },
    { name: '北欧吊灯 餐厅款', brandIdx: 1, catSlug: 'lighting-1', price: 1599, desc: 'HAY 设计师款，黄铜灯臂', imgId: 130 },
    { name: '手工编织地毯 200x300', brandIdx: 5, catSlug: 'decor-4', price: 3999, desc: '印度手工编织，纯羊毛材质', imgId: 140 },
    { name: '美式实木鞋柜', brandIdx: 7, catSlug: 'storage-1', price: 3899, desc: '翻斗设计，超大容量30双', imgId: 150 },
    { name: '轻奢真皮床 1.5米', brandIdx: 2, catSlug: 'bedroom-1', price: 15999, desc: 'Fendi 同厂代工，科技布床头', imgId: 160 },
    // ---- 补充客厅家具（凑满 8 个） ----
    { name: '奶油风布艺沙发 双人位', brandIdx: 0, catSlug: 'living-room-1', price: 4299, desc: '高密度海绵填充，可拆洗棉麻面料', imgId: 170 },
    { name: '轻奢岩板茶几 长方形', brandIdx: 3, catSlug: 'living-room-2', price: 3599, desc: '天然岩板台面，不锈钢镀钛金支架', imgId: 180 },
    { name: '实木展示柜 格栅款', brandIdx: 4, catSlug: 'living-room-5', price: 5299, desc: '白橡木框架，玻璃柜门展示收纳', imgId: 190 },
    { name: '轻奢单人休闲椅', brandIdx: 6, catSlug: 'living-room-4', price: 3899, desc: '头层牛皮面料，实木框架稳固舒适', imgId: 210 },
    // ---- 补充卧室家具（凑满 8 个） ----
    { name: '乳胶弹簧床垫 1.8米', brandIdx: 7, catSlug: 'bedroom-2', price: 3999, desc: '泰国进口乳胶，独立袋装弹簧静音', imgId: 220 },
    { name: '北欧实木床头柜', brandIdx: 0, catSlug: 'bedroom-4', price: 1299, desc: '圆润倒角设计，双抽大容量收纳', imgId: 230 },
    { name: '现代简约衣柜 推拉门', brandIdx: 1, catSlug: 'bedroom-3', price: 9999, desc: '定制尺寸，内部分区合理', imgId: 240 },
    { name: '日式梳妆台 翻盖式', brandIdx: 5, catSlug: 'bedroom-5', price: 3299, desc: '翻盖镜面，多格分类收纳', imgId: 250 },
    // ---- 补充餐厅家具（凑满 8 个） ----
    { name: '岩板餐桌 1.6米 六人位', brandIdx: 2, catSlug: 'dining-room-1', price: 6999, desc: '意大利进口岩板，耐高温防刮花', imgId: 260 },
    { name: '意式餐椅 软包款 2把', brandIdx: 3, catSlug: 'dining-room-2', price: 2599, desc: '科技布面料，一体成型椅背', imgId: 270 },
    { name: '北欧实木餐边柜 推拉门', brandIdx: 0, catSlug: 'dining-room-3', price: 4599, desc: '白橡木质地，隐藏式把手', imgId: 280 },
    { name: '轻奢酒柜 恒温款', brandIdx: 6, catSlug: 'dining-room-4', price: 7899, desc: '恒温设计，可存放36瓶红酒', imgId: 290 },
    { name: '圆形大理石餐桌 1.3米', brandIdx: 2, catSlug: 'dining-room-1', price: 8599, desc: '天然大理石桌面，不锈钢底座', imgId: 310 },
    { name: '北欧餐椅 实木 4把装', brandIdx: 1, catSlug: 'dining-room-2', price: 3299, desc: '北美白蜡木，人体工学曲线靠背', imgId: 320 },
    // ---- 补充书房家具（凑满 8 个） ----
    { name: '实木书柜 五层 开放式', brandIdx: 4, catSlug: 'study-3', price: 4899, desc: '黑胡桃木框架，开放式设计', imgId: 330 },
    { name: '简约文件柜 三抽', brandIdx: 7, catSlug: 'study-4', price: 1899, desc: '钢制柜体，A4文件分类存放', imgId: 340 },
    { name: '电动升降书桌 140cm', brandIdx: 1, catSlug: 'study-1', price: 4699, desc: '双电机驱动，四挡记忆高度', imgId: 350 },
    { name: '网布办公椅 全功能', brandIdx: 3, catSlug: 'study-2', price: 3599, desc: '全网透气设计，多维调节扶手', imgId: 360 },
    { name: '日式实木书桌 120cm', brandIdx: 5, catSlug: 'study-1', price: 2899, desc: '樱桃木桌面，隐藏式走线孔', imgId: 370 },
    { name: '转椅 头枕升级款', brandIdx: 0, catSlug: 'study-2', price: 2199, desc: '可调头枕，W型分区腰托', imgId: 380 },
  ]

  const productRecords: any[] = []

  for (let pIdx = 0; pIdx < productData.length; pIdx++) {
    const p = productData[pIdx]
    const cat = allCategories.find((c) => c.slug === p.catSlug)
    if (!cat) continue

    const mainImage = unsplash(pick(photoIdx++), 800, 800)

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
          url: unsplash(pick(photoIdx++), 800, 800),
          sort: i,
        },
      })
    }

    // 创建 SKU（含图片）
    const basePrice = p.price
    await prisma.productSku.createMany({
      data: [
        { productId: product.id, name: '标准款', price: basePrice, stock: Math.floor(Math.random() * 100) + 20, image: unsplash(pick(photoIdx++), 400, 400) },
        { productId: product.id, name: '升级款', price: Math.round(basePrice * 1.2), stock: Math.floor(Math.random() * 50) + 10, image: unsplash(pick(photoIdx++), 400, 400) },
      ],
    })
  }

  // ==================== Banner（在线图片） ====================
  console.log('🖼️ 创建 Banner...')
  await prisma.banner.createMany({
    data: [
      { title: '2024 新品上市 实木家居全新升级', image: unsplash('1616594039964-ae9021a400a0', 1200, 400), link: '/category/living-room', sort: 1 },
      { title: '年中大係 全场5折起', image: unsplash('1524758631624-e2822e304c36', 1200, 400), link: '/search?keyword=promotion', sort: 2 },
      { title: '设计师精选系列', image: unsplash('1618221195710-dd6b41faaea6', 1200, 400), link: '/brand', sort: 3 },
      { title: '卓越卧居空间 免费配送到家', image: unsplash('1505693416388-ac5ce068fe85', 1200, 400), link: '/category/bedroom', sort: 4 },
    ],
  })

  // ==================== 测试用户 ====================
  console.log('👤 创建测试用户...')
  const userPassword = await bcrypt.hash('123456', 10)

  const userList = [
    { phone: '13800000001', nickname: '张小花', avatar: 'https://i.pravatar.cc/200?img=1' },
    { phone: '13800000002', nickname: '李明远', avatar: 'https://i.pravatar.cc/200?img=3' },
    { phone: '13800000003', nickname: '王家居', avatar: 'https://i.pravatar.cc/200?img=5' },
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
        unsplash(pick(i * 2), 400, 400),
        unsplash(pick(i * 2 + 1), 400, 400),
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
  console.log(`  - 商品: ${productRecords.length} 个（含图册 + 双 SKU，各楼层 ≥8 个）`)
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
