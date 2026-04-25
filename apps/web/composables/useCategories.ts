export interface CategoryChild {
  id?: number
  name: string
  slug: string
  icon?: string
  image?: string
}

export interface CategoryItem {
  id?: number
  name: string
  slug: string
  icon?: string
  image?: string
  children: CategoryChild[]
}

const categoriesData: CategoryItem[] = [
  {
    name: '家政服务',
    slug: 'housekeeping',
    icon: '🧹',
    image: 'https://images.unsplash.com/photo-1758273705438-2bb9e0eb21b7?fm=jpg&q=60&w=1600&auto=format&fit=crop&ixlib=rb-4.1.0',
    children: [
      {
        name: '开荒保洁',
        slug: 'post-renovation-cleaning',
        image: 'https://images.unsplash.com/photo-1758273705438-2bb9e0eb21b7?auto=format&fit=crop&w=1600&q=80',
      },
      {
        name: '精保洁',
        slug: 'fine-cleaning',
        image: 'https://plus.unsplash.com/premium_photo-1663011218145-c1d0c3ba3542?auto=format&fit=crop&w=1600&q=80',
      },
      {
        name: '家政钟点工',
        slug: 'hourly-helper',
        image: 'https://www.curamaids.com/wp-content/uploads/2025/11/Professional-Post-Construction-Cleaning-Cura-Maids-Raleigh-Home-1024x474.jpg',
      },
      {
        name: '收纳师',
        slug: 'home-organizer',
        image: '/category-images/home-organizer.png',
      },
      {
        name: '厨娘',
        slug: 'home-cook',
        image: 'https://images.pexels.com/photos/4910234/pexels-photo-4910234.jpeg',
      },
      {
        name: '月嫂',
        slug: 'maternity-matron',
        image: '/category-images/maternity-matron.png',
      },
    ],
  },
  {
    name: '柜体定制',
    slug: 'cabinet-custom',
    icon: '🪵',
    image: 'https://images.unsplash.com/photo-1672137233327-37b0c1049e77?fm=jpg&q=60&w=1600&auto=format&fit=crop&ixlib=rb-4.1.0',
    children: [
      {
        name: '全屋定制',
        slug: 'whole-house-cabinet',
        image: 'https://images.unsplash.com/photo-1672137233327-37b0c1049e77?auto=format&fit=crop&w=1600&q=80',
      },
      {
        name: '衣柜定制',
        slug: 'wardrobe-custom',
        image: 'https://www.johnlouishome.com/cdn/shop/files/solid-wood-closet-organizer-with-6-drawers-shaker-closet-organizers-john-louis-home-jlh-350sh-w-295358.jpg?v=1737152123',
      },
      {
        name: '橱柜定制',
        slug: 'kitchen-cabinet-custom',
        image: 'https://georgecabinetry.com/wp-content/uploads/2025/07/white-light-luxury-rustic-kitchen-cabinets.webp',
      },
      {
        name: '阳台柜定制',
        slug: 'balcony-cabinet-custom',
        image: 'https://www.reboncabinets.com/Content/uploads/2022211506/202204201532237417d0d3902f46e6ba3a9efab1a2765c.jpg',
      },
    ],
  },
  {
    name: '卫浴五金',
    slug: 'bath-hardware',
    icon: '🚿',
    image: 'https://images.unsplash.com/photo-1718894070021-5d24d72a5437?fm=jpg&q=60&w=1600&auto=format&fit=crop&ixlib=rb-4.1.0',
    children: [
      {
        name: '花洒系统',
        slug: 'shower-system',
        image: 'https://assets.hansgrohe.com/celum/web/pulsify-s_showerpipe-chrome_light-bathroom-ambiance_4x3.jpg',
      },
      {
        name: '面盆龙头',
        slug: 'basin-faucet',
        image: 'https://m.media-amazon.com/images/I/61kHhun04CL._AC_SL1500_.jpg',
      },
      {
        name: '地漏下水',
        slug: 'floor-drain',
        image: 'https://images.signaturehardware.com/i/signaturehdwr/wetroom-accessbility?w=700&fmt=auto',
      },
      {
        name: '毛巾挂件',
        slug: 'bathroom-rack',
        image: 'https://m.media-amazon.com/images/I/91M51hG54QL._AC_UF1000,1000_QL80_.jpg',
      },
    ],
  },
  {
    name: '电器',
    slug: 'appliances',
    icon: '🔌',
    image: 'https://images.unsplash.com/photo-1588854337115-1c67d9247e4d?fm=jpg&q=60&w=1600&auto=format&fit=crop&ixlib=rb-4.1.0',
    children: [
      {
        name: '冰箱',
        slug: 'refrigerator',
        image: 'https://images.unsplash.com/photo-1588854337115-1c67d9247e4d?auto=format&fit=crop&w=1600&q=80',
      },
      {
        name: '洗衣机',
        slug: 'washing-machine',
        image: '/category-images/washing-machine.png',
      },
      {
        name: '油烟机',
        slug: 'range-hood',
        image: 'https://images.squarespace-cdn.com/content/v1/59f343eb7131a56f40ad24ab/1706713873397-CH7RWHLHZEIUU91EHAOR/chefs-kitchen-design-18.jpg',
      },
      {
        name: '热水器',
        slug: 'water-heater',
        image: '/category-images/water-heater.png',
      },
    ],
  },
  {
    name: '建材',
    slug: 'building-materials',
    icon: '🧱',
    image: 'https://images.unsplash.com/photo-1750500388486-dcc62e0690d4?fm=jpg&q=60&w=1600&auto=format&fit=crop&ixlib=rb-4.1.0',
    children: [
      {
        name: '瓷砖',
        slug: 'tiles',
        image: 'https://sampco.com/wp-content/uploads/2024/04/MSI-Image-1024x675.png',
      },
      {
        name: '地板',
        slug: 'flooring',
        image: 'https://images.squarespace-cdn.com/content/v1/5e3caecda487855c0d71e400/1619622069912-C94I58XGP01P28RXG2KX/Edited-1.jpg?format=original',
      },
      {
        name: '板材',
        slug: 'boards',
        image: 'https://i.pinimg.com/originals/30/cb/06/30cb067e112893f5a379f4a9f012d0f6.jpg',
      },
      {
        name: '涂料',
        slug: 'coatings',
        image: '/category-images/coatings.png',
      },
    ],
  },
  {
    name: '灯饰',
    slug: 'lighting',
    icon: '💡',
    image: 'https://images.unsplash.com/photo-1676103391619-8de758b28b53?fm=jpg&q=60&w=1600&auto=format&fit=crop&ixlib=rb-4.1.0',
    children: [
      {
        name: '吊灯',
        slug: 'chandelier',
        image: 'https://blog.1800lighting.com/wp-content/uploads/2022/03/TL_Lody_APP2_700LDY1820R-LED930-3-scaled.jpeg',
      },
      {
        name: '筒灯',
        slug: 'downlight',
        image: 'https://www.shine.lighting/products/wp-content/uploads/2022/06/Multi-head-Recessed-Lights.jpg',
      },
      {
        name: '壁灯',
        slug: 'wall-lamp',
        image: 'https://www.shine.lighting/products/wp-content/uploads/2022/06/Interior-Wall-Lights-for-Ambient-Lighting.jpg',
      },
      {
        name: '氛围灯',
        slug: 'ambient-light',
        image: 'https://hampshirelight.imgix.net/storage/uploads/case-studies/unique-modern-house/floating/coffer1a.jpg?w=1300&fit=crop&crop=edges,faces&q=90&auto=format',
      },
    ],
  },
  {
    name: '工装·家装设计',
    slug: 'interior-design',
    icon: '🎨',
    image: 'https://images.pexels.com/photos/20390760/pexels-photo-20390760.jpeg?auto=compress&cs=tinysrgb&w=1600',
    children: [
      {
        name: '全屋设计',
        slug: 'whole-house-design',
        image: 'https://images.pexels.com/photos/20390760/pexels-photo-20390760.jpeg?auto=compress&cs=tinysrgb&w=1600',
      },
      {
        name: '局部改造',
        slug: 'partial-renovation',
        image: 'https://images.pexels.com/photos/19899074/pexels-photo-19899074.jpeg?auto=compress&cs=tinysrgb&w=1600',
      },
      {
        name: '软装搭配',
        slug: 'soft-furnishing',
        image: 'https://images.pexels.com/photos/13675288/pexels-photo-13675288.jpeg?auto=compress&cs=tinysrgb&w=1600',
      },
      {
        name: '效果图深化',
        slug: 'design-visualization',
        image: 'https://images.pexels.com/photos/19899074/pexels-photo-19899074.jpeg?auto=compress&cs=tinysrgb&w=1600',
      },
    ],
  },
  {
    name: '乡镇自建房',
    slug: 'township-self-build',
    icon: '🏡',
    image: 'https://images.pexels.com/photos/8134821/pexels-photo-8134821.jpeg?auto=compress&cs=tinysrgb&w=1600',
    children: [
      {
        name: '户型规划',
        slug: 'house-layout-planning',
        image: 'https://images.pexels.com/photos/8134821/pexels-photo-8134821.jpeg?auto=compress&cs=tinysrgb&w=1600',
      },
      {
        name: '外立面设计',
        slug: 'facade-design',
        image: 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=1600',
      },
      {
        name: '施工建造',
        slug: 'self-build-construction',
        image: 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=1600',
      },
      {
        name: '院落配套',
        slug: 'courtyard-support',
        image: 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=1600',
      },
    ],
  },
  {
    name: '助农帮扶',
    slug: 'rural-support',
    icon: '🌾',
    image: 'https://images.unsplash.com/photo-1486328228599-85db4443971f?fm=jpg&q=60&w=1600&auto=format&fit=crop&ixlib=rb-4.1.0',
    children: [
      {
        name: '产地直连',
        slug: 'farm-produce',
        image: 'https://www.agrifarming.in/wp-content/uploads/Cooperatives-in-Agriculture_-Empowering-Farmers-and-Strengthening-Local-Economies5.jpg',
      },
      {
        name: '乡村共建',
        slug: 'rural-revitalization',
        image: 'https://vir.com.vn/stores/news_dataimages/hung/102019/24/10/croped/rural-economy-grows-steadily.jpg',
      },
      {
        name: '公益采购',
        slug: 'public-welfare-procurement',
        image: 'https://www.transportify.com.ph/wp-content/uploads/sites/5/2023/04/agriculture-supply-chain-challenges-and-opportunities-in-the-philippines-og.jpg',
      },
      {
        name: '企业责任',
        slug: 'corporate-responsibility',
        image: 'https://www.bivatec.com/storage/canvas/images/PPtlPjXdsTRusXC3jcdm4XgBrXXxiu2anqR8dpFH.jpg',
      },
    ],
  },
]

const prioritizedCategorySlugs = ['interior-design', 'township-self-build']
const categoryBaseOrder = new Map(categoriesData.map((category, index) => [category.slug, index]))

function sortTopCategories(items: CategoryItem[]): CategoryItem[] {
  const priorityOrder = new Map(prioritizedCategorySlugs.map((slug, index) => [slug, index]))

  return [...items].sort((left, right) => {
    const leftOrder = priorityOrder.has(left.slug)
      ? priorityOrder.get(left.slug)!
      : prioritizedCategorySlugs.length + (categoryBaseOrder.get(left.slug) ?? 999)
    const rightOrder = priorityOrder.has(right.slug)
      ? priorityOrder.get(right.slug)!
      : prioritizedCategorySlugs.length + (categoryBaseOrder.get(right.slug) ?? 999)

    return leftOrder - rightOrder
  })
}

function mergeCategories(remoteCategories: any[] = []): CategoryItem[] {
  return sortTopCategories(categoriesData.map((category) => {
    const remoteCategory = remoteCategories.find((item: any) => item.slug === category.slug)

    return {
      ...category,
      id: remoteCategory?.id,
      icon: remoteCategory?.icon || category.icon,
      children: category.children.map((child) => {
        const remoteChild = remoteCategory?.children?.find((item: any) => item.slug === child.slug)
        return {
          ...child,
          id: remoteChild?.id,
          icon: remoteChild?.icon || child.icon,
        }
      }),
    }
  }))
}

export function useCategories() {
  const categories = ref<CategoryItem[]>(mergeCategories())

  if (import.meta.client) {
    const { get } = useApi()
    get('/v1/categories/tree').then((res: any) => {
      if (res?.data?.length) {
        categories.value = mergeCategories(res.data)
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
