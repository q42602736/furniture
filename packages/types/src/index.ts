// ==================== 用户 ====================

export interface User {
  id: number
  phone: string
  nickname: string | null
  avatar: string | null
  status: number
  createdAt: string
}

export interface UserAddress {
  id: number
  userId: number
  name: string
  phone: string
  province: string
  city: string
  district: string
  address: string
  isDefault: boolean
}

// ==================== 商家 ====================

export interface Merchant {
  id: number
  name: string
  logo: string | null
  description: string | null
  contactName: string
  contactPhone: string
  status: number // 0=待审核 1=正常 2=禁用
  createdAt: string
}

// ==================== 商品 ====================

export interface Category {
  id: number
  name: string
  slug: string
  icon: string | null
  parentId: number | null
  sort: number
  children?: Category[]
}

export interface Brand {
  id: number
  name: string
  logo: string | null
  merchantId: number
}

export interface Product {
  id: number
  merchantId: number
  categoryId: number
  brandId: number | null
  name: string
  description: string | null
  mainImage: string | null
  status: number // 0=草稿 1=在售 2=已下架
  salesCount: number
  skus?: ProductSku[]
  images?: ProductImage[]
  brand?: Brand
  category?: Category
  createdAt: string
}

export interface ProductSku {
  id: number
  productId: number
  name: string
  price: number
  stock: number
  image: string | null
}

export interface ProductImage {
  id: number
  productId: number
  url: string
  sort: number
}

// ==================== 订单 ====================

export interface Order {
  id: number
  orderNo: string
  userId: number
  totalAmount: number
  payAmount: number
  status: number // 0=待付款 1=待发货 2=已发货 3=已完成 4=已取消 5=售后中
  receiverName: string
  receiverPhone: string
  receiverAddr: string
  remark: string | null
  items?: OrderItem[]
  createdAt: string
}

export interface OrderItem {
  id: number
  orderId: number
  productId: number
  skuId: number
  name: string
  image: string | null
  price: number
  quantity: number
}

// ==================== 购物车 ====================

export interface CartItem {
  id: number
  userId: number
  productId: number
  skuId: number
  quantity: number
  product?: Product
  sku?: ProductSku
}

// ==================== 通用 ====================

export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

export interface PaginatedResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  refreshToken: string
  user: {
    id: number
    name: string
    role: string
  }
}
