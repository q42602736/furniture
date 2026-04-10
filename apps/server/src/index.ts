import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'

const app = Fastify({
  logger: true,
})

// 注册插件
await app.register(cors, {
  origin: [
    'http://localhost:3000', // C 端前台
    'http://localhost:3002', // 商家后台
    'http://localhost:3003', // 平台后台
  ],
})

await app.register(jwt, {
  secret: process.env.JWT_SECRET || 'furniture-platform-jwt-secret-dev',
})

// 健康检查
app.get('/api/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() }
})

// API 路由占位
app.get('/api/v1', async () => {
  return {
    name: '美家优选 API',
    version: '0.0.1',
    endpoints: {
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      merchants: '/api/v1/merchants',
      products: '/api/v1/products',
      categories: '/api/v1/categories',
      orders: '/api/v1/orders',
      cart: '/api/v1/cart',
      banners: '/api/v1/banners',
    },
  }
})

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
