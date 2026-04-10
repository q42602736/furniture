import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { registerErrorHandler } from './middlewares/error-handler.js'
import authRoutes from './routes/auth.routes.js'
import categoryRoutes from './routes/category.routes.js'
import productRoutes from './routes/product.routes.js'
import cartRoutes from './routes/cart.routes.js'
import orderRoutes from './routes/order.routes.js'
import bannerRoutes from './routes/banner.routes.js'
import merchantRoutes from './routes/merchant.routes.js'
import addressRoutes from './routes/address.routes.js'
import favoriteRoutes from './routes/favorite.routes.js'
import adminAuthRoutes from './routes/admin-auth.routes.js'
import adminRoutes from './routes/admin.routes.js'

const app = Fastify({
  logger: true,
})

// 注册插件
await app.register(cors, {
  origin: [
    'http://localhost:3000', // C 端前台
    'http://localhost:3003', // 管理后台
  ],
})

await app.register(jwt, {
  secret: process.env.JWT_SECRET || 'furniture-platform-jwt-secret-dev',
})

// 全局错误处理
registerErrorHandler(app)

// 健康检查
app.get('/api/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() }
})

// API 路由索引
app.get('/api/v1', async () => {
  return {
    name: '美家优选 API',
    version: '0.1.0',
    endpoints: {
      auth: '/api/v1/auth',
      categories: '/api/v1/categories',
      products: '/api/v1/products',
      cart: '/api/v1/cart',
      orders: '/api/v1/orders',
      banners: '/api/v1/banners',
      merchants: '/api/v1/merchants',
      addresses: '/api/v1/addresses',
      favorites: '/api/v1/favorites',
      adminAuth: '/api/v1/admin-auth',
      admin: '/api/v1/admin',
    },
  }
})

// 注册业务路由
await app.register(authRoutes, { prefix: '/api/v1/auth' })
await app.register(categoryRoutes, { prefix: '/api/v1/categories' })
await app.register(productRoutes, { prefix: '/api/v1/products' })
await app.register(cartRoutes, { prefix: '/api/v1/cart' })
await app.register(orderRoutes, { prefix: '/api/v1/orders' })
await app.register(bannerRoutes, { prefix: '/api/v1/banners' })
await app.register(merchantRoutes, { prefix: '/api/v1/merchants' })
await app.register(addressRoutes, { prefix: '/api/v1/addresses' })
await app.register(favoriteRoutes, { prefix: '/api/v1/favorites' })
await app.register(adminAuthRoutes, { prefix: '/api/v1/admin-auth' })
await app.register(adminRoutes, { prefix: '/api/v1/admin' })

// 启动服务
const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3001
    await app.listen({ port, host: '0.0.0.0' })
    console.log(`🚀 服务已启动：http://localhost:${port}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
