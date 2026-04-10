export interface CategoryChild {
  id?: number
  name: string
  slug: string
  icon?: string
}

export interface CategoryItem {
  id?: number
  name: string
  slug: string
  icon?: string
  children: CategoryChild[]
}

const categoriesData: CategoryItem[] = [
  {
    name: '客厅', slug: 'living-room', icon: '🛋️',
    children: [
      { name: '沙发', slug: 'sofa' },
      { name: '茶几', slug: 'coffee-table' },
      { name: '电视柜', slug: 'tv-cabinet' },
      { name: '休闲椅', slug: 'lounge-chair' },
    ],
  },
  {
    name: '卧室', slug: 'bedroom', icon: '🛏️',
    children: [
      { name: '床', slug: 'bed' },
      { name: '床头柜', slug: 'nightstand' },
      { name: '床垫', slug: 'mattress' },
      { name: '妆台/妆凳', slug: 'vanity' },
    ],
  },
  {
    name: '餐厅', slug: 'dining-room', icon: '🍽️',
    children: [
      { name: '餐桌', slug: 'dining-table' },
      { name: '餐椅', slug: 'dining-chair' },
      { name: '餐边柜', slug: 'sideboard' },
      { name: '岛台', slug: 'kitchen-island' },
    ],
  },
  {
    name: '儿童房', slug: 'kids-room', icon: '🧒',
    children: [
      { name: '儿童床', slug: 'kids-bed' },
      { name: '儿童桌', slug: 'kids-desk' },
      { name: '儿童床头柜', slug: 'kids-nightstand' },
    ],
  },
  {
    name: '书房', slug: 'study', icon: '📚',
    children: [
      { name: '书桌', slug: 'desk' },
      { name: '书柜', slug: 'bookcase' },
      { name: '茶台', slug: 'tea-table' },
      { name: '书椅/转椅', slug: 'office-chair' },
    ],
  },
  {
    name: '灯饰', slug: 'lighting', icon: '💡',
    children: [
      { name: '吊灯', slug: 'chandelier' },
      { name: '吸顶灯', slug: 'ceiling-light' },
      { name: 'LED筒/射灯', slug: 'led-spotlight' },
    ],
  },
  {
    name: '卫浴', slug: 'bathroom', icon: '🚿',
    children: [
      { name: '浴室柜', slug: 'bathroom-cabinet' },
      { name: '马桶', slug: 'toilet' },
      { name: '花洒', slug: 'shower' },
      { name: '龙头', slug: 'faucet' },
    ],
  },
  {
    name: '家饰家纺', slug: 'decor', icon: '🎨',
    children: [
      { name: '装饰字画', slug: 'wall-art' },
      { name: '装饰摆件', slug: 'ornament' },
      { name: '床品', slug: 'bedding' },
    ],
  },
  {
    name: '建材电器', slug: 'material', icon: '🔌',
    children: [
      { name: '地板', slug: 'flooring' },
      { name: '烟灶套装', slug: 'range-hood' },
      { name: '厨盆水槽', slug: 'kitchen-sink' },
    ],
  },
]

export function useCategories() {
  const categories = ref<CategoryItem[]>(categoriesData)

  // 异步从 API 获取分类树（不阻塞渲染，静态数据作为降级）
  if (import.meta.client) {
    const { get } = useApi()
    get('/v1/categories/tree').then((res: any) => {
      if (res?.data?.length) {
        categories.value = res.data
      }
    }).catch(() => {})
  }

  const getCategoryBySlug = (slug: string) => {
    return categories.value.find(c => c.slug === slug)
  }

  const flatCategories = computed(() => {
    return categories.value.flatMap(c => [
      { name: c.name, slug: c.slug, parentSlug: undefined as string | undefined },
      ...c.children.map(sub => ({ name: sub.name, slug: sub.slug, parentSlug: c.slug })),
    ])
  })

  return {
    categories,
    getCategoryBySlug,
    flatCategories,
  }
}
