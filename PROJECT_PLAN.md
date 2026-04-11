# 家居电商平台 — 项目计划书

> 项目名称：美家优选（暂定）  
> 创建日期：2026-04-10  
> 参考网站：https://www.meijiaing.com/  
> 项目定位：平台自营家具家居在线购物平台

---

## 一、项目概述

打造一个家居电商平台，平台自营模式，按品牌组织商品，消费者可在线浏览、对比、购买家具及家居产品。平台涵盖 C 端购物前台和平台管理后台两大入口。

### 1.1 核心角色

| 角色 | 描述 |
|------|------|
| **消费者** | 注册/登录、浏览商品、搜索筛选、加购物车、下单支付、评价晒单、售后退换 |
| **平台运营** | 商品管理、分类管理、品牌管理、Banner/活动管理、订单管理、用户管理、数据报表、系统配置 |

### 1.2 场景范围

- 客厅（沙发、茶几、电视柜、休闲椅）
- 卧室（床、床头柜、床垫、妆台/妆凳）
- 餐厅（餐桌、餐椅、餐边柜、岛台）
- 儿童房（儿童床、儿童桌、儿童床头柜）
- 书房（书桌、书柜、茶台、书椅/转椅）
- 灯饰（吊灯、吸顶灯、LED 筒/射灯）
- 卫浴（浴室柜、马桶、花洒、龙头）
- 家饰家纺（装饰字画、装饰摆件、床品）
- 建材电器（地板、烟灶套装、厨盆水槽）

---

## 二、技术架构

### 2.1 总体架构

```
Monorepo (pnpm workspace)
├── apps/
│   ├── web/          # C 端购物前台
│   ├── admin/        # 平台管理后台
│   └── server/       # 后端 API 服务
├── packages/
│   ├── types/        # 共享 TypeScript 类型定义
│   └── utils/        # 共享工具函数
├── pnpm-workspace.yaml
├── package.json
└── .gitignore
```

### 2.2 技术栈选型

| 模块 | 技术选型 | 说明 |
|------|---------|------|
| **C 端前台 (web)** | Vue 3 + Nuxt 3 + TailwindCSS | SSR 服务端渲染保证 SEO，响应式适配 PC + 移动端 |
| **平台后台 (admin)** | Vue 3 + Vite + Metronic Vue 8.2.6 | SPA，基于 Metronic 电商模板快速搭建 |
| **后端 API (server)** | Node.js + Fastify 5 + TypeScript | RESTful API，高性能 |
| **ORM** | Prisma | 类型安全，自动迁移 |
| **数据库** | MySQL 8.0 | 主数据存储（商品/订单/用户等） |
| **缓存** | Redis | 购物车、库存扣减、Session、热门商品缓存 |
| **文件存储** | 阿里云 OSS / MinIO | 商品图片、品牌 Logo、买家秀图片 |
| **认证** | JWT (Access Token + Refresh Token) | 双端统一认证体系 |
| **支付** | 微信支付 + 支付宝 | 消费者在线支付 |

### 2.3 Metronic 模板对应关系

#### 平台管理后台用到的模板（Metronic HTML 路径参考）

| 功能 | Metronic 模板路径 |
|------|------------------|
| 平台数据总览 | `dashboards/ecommerce.html` |
| 商品列表 | `apps/ecommerce/catalog/products.html` |
| 新增/编辑商品 | `apps/ecommerce/catalog/add-product.html` / `edit-product.html` |
| 分类管理 | `apps/ecommerce/catalog/categories.html` |
| 订单列表 | `apps/ecommerce/sales/listing.html` |
| 订单详情 | `apps/ecommerce/sales/details.html` |
| 用户管理 | `apps/ecommerce/customers/listing.html` |
| 用户详情 | `apps/ecommerce/customers/details.html` |
| 销售报表 | `apps/ecommerce/reports/sales.html` |
| 退货报表 | `apps/ecommerce/reports/returns.html` |
| 物流报表 | `apps/ecommerce/reports/shipping.html` |
| 系统设置 | `apps/ecommerce/settings.html` |

#### C 端前台（不使用 Metronic，独立设计）

参考 meijiaing.com 页面结构，需手动实现：
- 首页：Header 导航 + 分类菜单 + Banner 轮播 + 品牌区 + 商品推荐列表
- 商品分类列表页（按空间/品牌/价格筛选）
- 商品详情页（图片轮播、规格选择、加入购物车）
- 购物车页
- 结算/支付页
- 个人中心（订单、收货地址、收藏、买家秀）
- 品牌馆页
- 登录/注册页
- 搜索结果页

---

## 三、数据库设计（核心表）

### 3.1 用户体系

| 表名 | 说明 |
|------|------|
| `users` | 消费者用户表（手机号/密码/昵称/头像） |
| `admins` | 平台管理员表 |
| `user_addresses` | 消费者收货地址 |

### 3.2 商品体系

| 表名 | 说明 |
|------|------|
| `categories` | 商品分类表（支持多级：客厅 > 沙发） |
| `brands` | 品牌表（品牌名/Logo） |
| `products` | 商品主表（名称/品牌/分类/状态） |
| `product_skus` | 商品 SKU 表（规格/价格/库存） |
| `product_images` | 商品图片表 |
| `product_attributes` | 商品属性表（材质/尺寸/颜色等） |

### 3.3 交易体系

| 表名 | 说明 |
|------|------|
| `orders` | 订单主表（订单号/用户/状态/金额） |
| `order_items` | 订单明细表（关联 SKU/数量/单价） |
| `payments` | 支付记录表 |
| `refunds` | 退款/售后表 |
| `cart_items` | 购物车表 |

### 3.4 运营体系

| 表名 | 说明 |
|------|------|
| `banners` | 首页 Banner 管理 |
| `reviews` | 商品评价表（评分/内容/图片） |
| `favorites` | 用户收藏表 |
| `search_keywords` | 热门搜索词 |

---

## 四、功能模块清单

### 4.1 C 端购物前台

| 模块 | 功能点 |
|------|--------|
| **首页** | 分类导航、Banner 轮播、品牌秀场、推荐商品、热门分类 |
| **搜索** | 关键词搜索、搜索建议、搜索历史、热门搜索 |
| **分类浏览** | 多级分类导航、价格/品牌/属性筛选、排序（销量/价格/新品） |
| **商品详情** | 图片轮播、规格选择、库存展示、评价列表、相似推荐 |
| **购物车** | 添加/删除/修改数量、库存校验、选择结算 |
| **下单结算** | 地址选择、运费计算、优惠券、订单确认 |
| **支付** | 微信支付、支付宝支付 |
| **个人中心** | 订单列表（待付款/待发货/待收货/已完成）、收货地址管理、收藏夹、评价管理 |
| **买家秀** | 买家晒单图片展示 |
| **品牌馆** | 品牌列表、品牌详情页（品牌下商品列表） |

### 4.2 平台管理后台

| 模块 | 功能点 |
|------|--------|
| **全局看板** | 平台整体数据（GMV/订单量/用户数/商品数） |
| **商品管理** | 发布/编辑/上架/下架商品、SKU 管理、库存管理 |
| **分类管理** | 全局商品分类 CRUD |
| **品牌管理** | 品牌 CRUD（已完成） |
| **订单管理** | 订单列表、发货、物流跟踪、售后处理 |
| **用户管理** | 消费者列表、详情、封禁 |
| **内容管理** | 首页 Banner、推荐位、公告 |
| **报表** | 销售报表、退货报表、物流报表 |
| **系统设置** | 管理员信息、修改密码、支付配置、物流配置（已完成） |

---

## 五、开发计划（按阶段）

### 第一阶段：项目初始化 & 基础框架

- [x] 项目计划书编写
- [x] Monorepo 初始化（pnpm workspace + pnpm v10）
- [x] 后端基础框架搭建（Fastify 5 + Prisma + MySQL 连接）
- [x] 数据库 Schema 设计 & 迁移（用户/商品/分类/订单/Banner 等完整表结构）
- [x] 用户认证模块（JWT 注册/登录，含管理员 Admin 认证）
- [x] C 端 Nuxt 3 项目初始化
- [x] 平台后台 Vue 3 + Metronic Vue 8.2.6 Demo1 集成完成

### 第一阶段补充：基础设施

- [x] Docker Compose 本地开发环境（MySQL 8.0 + Redis 7）
- [x] `pnpm dev` 一键启动三个服务（concurrently）
- [x] 生产 Docker Compose（`--profile prod`，含 Nginx 反向代理）

### 第二阶段：核心业务

- [x] 商品分类 CRUD（后端 API + 平台后台页面）
- [x] 商品管理 CRUD（后端 API + 平台后台页面）
- [x] 订单管理（后端 API + 平台后台页面）
- [x] 用户管理（后端 API + 平台后台页面）
- [x] Banner 管理（后端 API + 平台后台页面）
- [x] 平台统计看板（用户数/商品数/订单数）
- [x] C 端首页（分类导航 + Banner + 商品推荐列表）
- [x] C 端商品详情页
- [x] C 端搜索功能
- [x] C 端分类浏览页
- [x] C 端品牌馆页面

### 第二阶段补充：管理后台功能完善

- [x] 修复商品创建 Bug（Product 模型无 slug/stock/price 字段，已修正 createProduct 逻辑）
- [x] 修复全局 TypeScript 类型错误（validate 泛型推导 + error-handler 类型收窄）
- [x] 商品管理 — 新增商品功能（弹窗表单 + 分类下拉选择）
- [x] 订单管理 — 订单详情查看（后端 `GET /admin/orders/:id` + 前端详情弹窗）
- [x] 订单管理 — 订单状态变更（后端 `PUT /admin/orders/:id/status`，支持发货/完成/取消 + 库存回滚）
- [x] 订单管理 — 订单号搜索、售后状态支持
- [x] 平台总览增强 — 今日订单/新用户/销售额 + 最近订单列表
- [x] 用户管理 — 用户详情查看（后端 `GET /admin/users/:id` + 前端详情弹窗：地址/订单/统计）
- [x] 系统设置 — 修改密码功能（后端 `PUT /admin-auth/password` + 前端表单校验）
- [x] 全栈移除商家概念 — 删除 Merchant/MerchantUser 模型、商家路由/服务、商家管理员认证
- [x] 品牌独立化 — Brand 模型去除 merchantId，品牌作为平台统一管理的维度
- [x] C 端品牌馆详情页 — 新建 `brand/[id].vue`，替代原商家店铺页
- [x] 购物车扁平化 — 取消按商家分组，改为直接展示商品列表

### 第三阶段：交易闭环

- [x] 购物车功能（含登录态同步）
- [x] 订单创建（后端 API + C 端结算页）
- [ ] 支付集成（微信/支付宝）
- [x] 物流发货（后端发货 API + OrderList/OrderDetail 发货弹窗 + 物流信息展示）
- [x] 售后退款（后端退款审批/拒绝/完成 API + RefundList.vue 售后管理页面）

### 第三阶段补充：管理后台功能完善（全部完成）

- [x] 品牌管理 CRUD — 全栈实现（Brand 模型 + brand.service/routes + BrandList.vue）
- [x] 系统设置完善 — 支付配置 + 物流配置（SystemConfig 模型 + setting.service.ts + Settings.vue 4 标签页）
- [x] 推荐位管理 — 全栈实现（Recommendation 模型 + recommendation.service/routes + RecommendationList.vue）
- [x] 公告管理 — 全栈实现（Announcement 模型 + announcement.service/routes + AnnouncementList.vue）
- [x] 物流跟踪 — Order 模型新增 shippingCompany/trackingNo 字段 + shipOrder/updateShippingInfo API
- [x] 订单发货弹窗 — OrderList.vue + OrderDetail.vue 均支持物流公司下拉+单号输入
- [x] 评价管理 — 后端 Review 列表/删除 API + ReviewList.vue（商品缩略图+星级+评价图片）

### 第四阶段：运营 & 完善

- [x] 数据报表（销售报表 + 客户订单报表 + 物流报表 + 退货报表，4 个报表页全部完成）
- [x] 商品评价 & 买家秀（管理后台评价管理已完成，C 端展示待实现）
- [ ] 性能优化 & SEO 优化
- [ ] 上线部署

---

## 六、部署方案（参考）

| 组件 | 部署方式 |
|------|---------|
| C 端前台 (Nuxt 3) | 云服务器 Node.js 进程 / Docker |
| 平台后台 (SPA) | Nginx 静态文件托管 |
| 后端 API (Fastify) | 云服务器 Node.js 进程 / Docker |
| MySQL | 云数据库 RDS |
| Redis | 云 Redis |
| 文件存储 | 阿里云 OSS |
| 域名 & SSL | 阿里云 / 腾讯云 |

---

## 七、Metronic 资源路径

```
HTML 版本（参考设计）：
/Volumes/系统/Metronic/Metronic 8.2.6/html/metronic/html/metronic_html_v8.2.6_demo1/demo1/

Vue 3 版本（实际使用）：
/Volumes/系统/Metronic/Metronic 8.2.6/vue/metronic/vue/metronic_vue_v8.2.6_demo1/

核心电商模板目录：
├── apps/ecommerce/
│   ├── catalog/       # 商品/分类管理
│   ├── sales/         # 订单管理
│   ├── customers/     # 客户管理
│   ├── reports/       # 报表
│   └── settings.html  # 设置
├── dashboards/
│   ├── ecommerce.html       # 电商看板
│   └── store-analytics.html # 店铺分析
```

---

## 八、管理后台 Metronic 集成实现记录

### 选型决策

- **使用版本**：Metronic 8.2.6 Vue Demo 1
- **主题风格**：深色侧边栏（dark-sidebar），主色调 `#50CD89`（绿色）
- **参考源码路径**：`/Volumes/系统/Metronic/Metronic 8.2.6/vue/metronic/vue/metronic_vue_v8.2.6_demo1/`

### 集成方案

将 Metronic Demo1 核心目录整体迁入 `apps/admin/src/`，保留原有业务逻辑页面：

```
apps/admin/src/
├── core/           # 从 Metronic 复制：ApiService、JwtService、LayoutService、plugins
├── layouts/        # 从 Metronic 复制：DefaultLayout（含 Header、Sidebar、Toolbar、Footer）
│   └── default-layout/
│       ├── DefaultLayout.vue
│       ├── components/       # header/sidebar/toolbar/footer/drawers/modals 等
│       └── config/
│           ├── DefaultLayoutConfig.ts   # layout: "dark-sidebar", primaryColor: "#50CD89"
│           └── MainMenuConfig.ts        # 已替换为中文 7 页菜单
├── assets/
│   ├── keenicons/  # KeenThemes 图标字体
│   ├── sass/       # Metronic 全量 SCSS（style.scss + plugins.scss）
│   └── ts/         # KeenThemes 原生 TS 组件（Drawer、Menu、Scroll 等）
├── stores/
│   ├── auth.ts     # 自定义：localStorage token 管理，已添加 isAuthenticated 别名
│   ├── config.ts   # Metronic：布局配置 store
│   ├── body.ts     # Metronic：body class 管理
│   └── theme.ts    # Metronic：主题模式管理（light/dark）
└── views/          # 保留原有 8 个业务页面（使用标准 Bootstrap 5 类，兼容 Metronic）
```

### 路由结构

```
/               → 重定向到 /dashboard
/dashboard      → 平台总览（DefaultLayout 包裹）
/products       → 商品管理
/products/add   → 新增商品
/products/:id/edit → 编辑商品
/categories     → 分类管理
/brands         → 品牌管理
/orders         → 订单管理
/orders/:id     → 订单详情
/refunds        → 售后管理
/reviews        → 评价管理
/users          → 用户管理
/users/:id      → 用户详情
/banners        → Banner 管理
/recommendations → 推荐位管理
/announcements  → 公告管理
/settings       → 系统设置
/reports/sales  → 销售报表
/reports/customers → 客户订单报表
/reports/shipping  → 物流报表
/reports/returns   → 退货报表
/sign-in        → 登录页（独立，不在 DefaultLayout 内）
```

### 新增依赖

| 包名 | 版本 | 用途 |
|------|------|------|
| vue-i18n | 9.2.2 | Metronic 多语言支持 |
| line-awesome | ^1.3.0 | 图标库 |
| socicon | ^3.0.5 | 社交图标 |
| @fortawesome/fontawesome-free | ^6.7.2 | FontAwesome 图标 |
| animate.css | ^4.1.1 | 动画库 |
| prismjs | ^1.30.0 | 代码高亮 |
| clipboard | ^2.0.11 | 剪贴板操作 |
| vee-validate | ^4.5.11 | 表单验证 |
| yup | ^1.2.0 | Schema 验证 |

### 注意事项

- `apps/admin/src/core/api.ts` 为自定义 axios 实例，所有业务请求使用此实例（非 Metronic ApiService）
- `admin_token` 存储 key 与 Metronic 默认 `id_token` 不同，两者互不影响
- `AuthLayout.vue` 已保留但未使用（登录页为独立路由，自带两栏布局）
- 业务页面使用 Bootstrap 5 原生类，与 Metronic SCSS 完全兼容，无需特殊改造

---

> **文档版本**：v2.0（已移除商家概念，改为平台自营 + 品牌模式）
> **下次更新**：完成支付集成后同步更新
