# 家居多商家入驻电商平台 — 项目计划书

> 项目名称：美家优选（暂定）  
> 创建日期：2026-04-10  
> 参考网站：https://www.meijiaing.com/  
> 项目定位：多商家入驻的家具家居在线购物平台

---

## 一、项目概述

打造一个类似"美家人"的家居电商平台，支持多个家具品牌/商家入驻，消费者可在线浏览、对比、购买家具及家居产品。平台涵盖 C 端购物前台、商家管理后台、平台运营超级后台三大入口。

### 1.1 核心角色

| 角色 | 描述 |
|------|------|
| **消费者** | 注册/登录、浏览商品、搜索筛选、加购物车、下单支付、评价晒单、售后退换 |
| **商家** | 入驻申请、店铺管理、商品上架/下架、订单处理、物流发货、数据统计 |
| **平台运营** | 商家审核、分类管理、Banner/活动管理、平台数据报表、系统配置 |

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
│   ├── merchant/     # 商家管理后台
│   ├── admin/        # 平台超级后台
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
| **商家后台 (merchant)** | Vue 3 + Vite + Metronic Vue 8.2.6 | SPA，基于 Metronic 电商模板快速搭建 |
| **平台后台 (admin)** | Vue 3 + Vite + Metronic Vue 8.2.6 | SPA，基于 Metronic 全管理模块 |
| **后端 API (server)** | Node.js + Fastify + TypeScript | RESTful API，高性能 |
| **ORM** | Prisma | 类型安全，自动迁移 |
| **数据库** | MySQL 8.0 | 主数据存储（商品/订单/用户/商家） |
| **缓存** | Redis | 购物车、库存扣减、Session、热门商品缓存 |
| **文件存储** | 阿里云 OSS / MinIO | 商品图片、店铺 Logo、买家秀图片 |
| **认证** | JWT (Access Token + Refresh Token) | 三端统一认证体系 |
| **支付** | 微信支付 + 支付宝 | 消费者在线支付 |

### 2.3 Metronic 模板对应关系

#### 商家后台用到的模板（Metronic HTML 路径参考）

| 功能 | Metronic 模板路径 |
|------|------------------|
| 店铺数据看板 | `dashboards/ecommerce.html` |
| 店铺流量分析 | `dashboards/store-analytics.html` |
| 我的商品列表 | `apps/ecommerce/catalog/products.html` |
| 发布商品 | `apps/ecommerce/catalog/add-product.html` |
| 编辑商品 | `apps/ecommerce/catalog/edit-product.html` |
| 分类管理 | `apps/ecommerce/catalog/categories.html` |
| 订单列表 | `apps/ecommerce/sales/listing.html` |
| 订单详情 | `apps/ecommerce/sales/details.html` |
| 店铺设置 | `apps/ecommerce/settings.html` |

#### 平台超级后台额外用到的模板

| 功能 | Metronic 模板路径 |
|------|------------------|
| 全平台数据总览 | `dashboards/ecommerce.html` |
| 消费者管理 | `apps/ecommerce/customers/listing.html` |
| 消费者详情 | `apps/ecommerce/customers/details.html` |
| 全平台销售报表 | `apps/ecommerce/reports/sales.html` |
| 退货管理 | `apps/ecommerce/reports/returns.html` |
| 物流报表 | `apps/ecommerce/reports/shipping.html` |
| 商家入驻管理 | `apps/ecommerce/customers/listing.html` (改造) |
| 平台配置 | `apps/ecommerce/settings.html` |

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
| `merchants` | 商家表（企业名/营业执照/联系人/审核状态） |
| `merchant_users` | 商家账号表（一个商家可有多个管理员） |
| `admins` | 平台管理员表 |
| `user_addresses` | 消费者收货地址 |

### 3.2 商品体系

| 表名 | 说明 |
|------|------|
| `categories` | 商品分类表（支持多级：客厅 > 沙发） |
| `brands` | 品牌表 |
| `products` | 商品主表（名称/品牌/分类/商家 ID/状态） |
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
| **品牌馆** | 入驻品牌列表、品牌详情页 |

### 4.2 商家管理后台

| 模块 | 功能点 |
|------|--------|
| **数据看板** | 今日订单/销售额/访客数、趋势图表 |
| **商品管理** | 发布/编辑/上架/下架商品、SKU 管理、库存管理 |
| **订单管理** | 订单列表、发货、物流跟踪、售后处理 |
| **店铺设置** | 店铺信息、Logo、简介、联系方式 |
| **财务** | 结算记录、提现申请 |

### 4.3 平台超级后台

| 模块 | 功能点 |
|------|--------|
| **全局看板** | 平台整体数据（GMV/订单量/商家数/用户数） |
| **商家管理** | 入驻审核、商家列表、商家详情、启用/禁用 |
| **商品审核** | 商品上架审核（可选） |
| **分类管理** | 全局商品分类 CRUD |
| **用户管理** | 消费者列表、详情、封禁 |
| **内容管理** | 首页 Banner、推荐位、公告 |
| **报表** | 销售报表、退货报表、物流报表 |
| **系统设置** | 支付配置、物流配置、平台信息 |

---

## 五、开发计划（按阶段）

### 第一阶段：项目初始化 & 基础框架

- [x] 项目计划书编写
- [ ] Monorepo 初始化（pnpm workspace）
- [ ] 后端基础框架搭建（Fastify + Prisma + MySQL 连接）
- [ ] 数据库 Schema 设计 & 迁移
- [ ] 用户认证模块（JWT 注册/登录）
- [ ] C 端 Nuxt 3 项目初始化
- [ ] 商家后台 Vue 3 + Metronic 项目初始化
- [ ] 平台后台 Vue 3 + Metronic 项目初始化

### 第二阶段：核心业务

- [ ] 商品分类 CRUD（后端 API + 平台后台页面）
- [ ] 商品管理 CRUD（后端 API + 商家后台页面）
- [ ] C 端首页（分类导航 + Banner + 商品列表）
- [ ] C 端商品详情页
- [ ] C 端搜索功能

### 第三阶段：交易闭环

- [ ] 购物车功能
- [ ] 订单创建 & 管理
- [ ] 支付集成（微信/支付宝）
- [ ] 物流发货
- [ ] 售后退款

### 第四阶段：运营 & 完善

- [ ] 商品评价 & 买家秀
- [ ] 品牌馆
- [ ] 数据报表（销售/退货/物流）
- [ ] 性能优化 & SEO 优化
- [ ] 上线部署

---

## 六、部署方案（参考）

| 组件 | 部署方式 |
|------|---------|
| C 端前台 (Nuxt 3) | 云服务器 Node.js 进程 / Docker |
| 商家后台 (SPA) | Nginx 静态文件托管 |
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

> **文档版本**：v1.0  
> **下次更新**：项目初始化完成后同步更新开发进度
