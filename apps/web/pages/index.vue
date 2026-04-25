<template>
  <div>
    <section class="bg-[#f5f5f5]">
      <div class="max-w-[1200px] mx-auto px-4 py-4">
        <div class="flex gap-4">
          <div
            class="hidden lg:block w-[210px] h-[420px] shrink-0 relative z-20"
            @mouseleave="activeSidebarSlug = ''"
          >
            <div class="bg-[#3d3d3f] rounded-lg overflow-hidden h-full">
              <div
                v-for="cat in categories"
                :key="cat.slug"
                @mouseenter="activeSidebarSlug = cat.slug"
              >
                <NuxtLink
                  :to="`/category/${cat.slug}`"
                  class="flex items-center justify-between px-4 py-[10px] text-gray-200 text-sm hover:bg-[#555] hover:text-white transition"
                >
                  <span>{{ cat.name }}</span>
                  <svg class="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </NuxtLink>
              </div>
            </div>

            <div
              v-if="activeSidebarCategory?.children?.length"
              class="absolute top-0 left-[222px] w-[420px] rounded-[28px] bg-white border border-gray-100 shadow-2xl p-6"
            >
              <div class="flex items-center justify-between gap-4 mb-4">
                <div>
                  <p class="text-lg font-semibold text-gray-800">{{ activeSidebarCategory.name }}</p>
                  <p class="mt-1 text-xs text-gray-400">{{ activeSidebarCategory.children.length }} 项服务</p>
                </div>
                <NuxtLink
                  :to="`/category/${activeSidebarCategory.slug}`"
                  class="shrink-0 rounded-full border border-gray-200 px-3 py-1.5 text-xs text-gray-500 hover:border-orange-500 hover:text-orange-500 transition"
                >
                  查看全部
                </NuxtLink>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <NuxtLink
                  v-for="child in activeSidebarCategory.children"
                  :key="child.slug"
                  :to="`/category/${child.slug}`"
                  class="rounded-2xl bg-[#f7f7f7] px-4 py-3 hover:bg-orange-50 transition"
                >
                  <p class="text-sm font-medium text-gray-800">{{ child.name }}</p>
                  <p class="mt-1 text-xs text-gray-400">{{ activeSidebarCategory.name }}</p>
                </NuxtLink>
              </div>
            </div>
          </div>

          <div class="flex-1 relative rounded-[24px] overflow-hidden bg-slate-900 h-[420px]">
            <template v-if="heroBanners.length">
              <div
                v-for="(banner, idx) in heroBanners"
                :key="banner.link"
                :class="[
                  'absolute inset-0 transition-opacity duration-700',
                  idx === currentBanner ? 'opacity-100 z-10' : 'opacity-0 z-0',
                ]"
              >
                <img :src="banner.image" :alt="banner.title" class="h-full w-full object-cover" @error="onImgError" />
                <div class="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/45 to-slate-950/10" />
                <div class="relative h-full flex items-end md:items-center">
                  <div class="p-8 md:p-10 max-w-[720px] text-white">
                    <p class="text-xs font-semibold tracking-[0.35em] text-orange-300">{{ banner.label }}</p>
                    <h2 class="mt-4 text-3xl md:text-4xl font-bold leading-tight">{{ banner.title }}</h2>
                    <div class="mt-5 flex flex-wrap gap-2">
                      <span
                        v-for="item in banner.tags"
                        :key="item"
                        class="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/85 backdrop-blur-sm"
                      >
                        {{ item }}
                      </span>
                    </div>
                    <NuxtLink
                      :to="banner.link"
                      class="mt-6 inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-600 transition"
                    >
                      查看
                      <span>→</span>
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </template>

            <div class="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
              <button
                v-for="(_, idx) in heroBanners"
                :key="idx"
                :class="[
                  'h-1.5 rounded-full transition-all',
                  idx === currentBanner ? 'w-10 bg-white' : 'w-6 bg-white/40',
                ]"
                @click="currentBanner = idx"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="max-w-[1200px] mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
        <h2 class="text-xl font-bold text-gray-800">平台精选</h2>
        <div class="flex flex-wrap gap-3 text-sm">
          <span
            v-for="style in categoryTabs"
            :key="style"
            class="px-3 py-1 rounded-full border cursor-pointer transition"
            :class="activeStyle === style ? 'bg-orange-500 text-white border-orange-500' : 'text-gray-500 border-gray-200 hover:border-orange-500 hover:text-orange-500'"
            @click="activeStyle = style"
          >
            {{ style }}
          </span>
        </div>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <NuxtLink
          v-for="item in featuredItems"
          :key="item.slug"
          :to="`/category/${item.slug}`"
          class="group bg-white rounded-[24px] overflow-hidden border border-gray-100 hover:shadow-lg transition-all"
        >
          <div class="relative aspect-[4/3] overflow-hidden bg-slate-100">
            <img
              v-if="item.image"
              :src="item.image"
              :alt="item.name"
              class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              @error="onImgError"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
            <div class="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-gray-700">
              {{ item.parentName }}
            </div>
          </div>
          <div class="p-4">
            <h3 class="text-base font-semibold text-gray-800 leading-6">{{ item.name }}</h3>
          </div>
        </NuxtLink>
      </div>
    </section>

    <section class="bg-[#fafafa] py-8">
      <div class="max-w-[1200px] mx-auto px-4">
        <div class="mb-5">
          <h2 class="text-xl font-bold text-gray-800">分类轮播</h2>
        </div>

        <div class="overflow-hidden">
          <div class="flex gap-4 animate-marquee">
            <NuxtLink
              v-for="category in carouselCategories"
              :key="`${category.slug}-${category.name}`"
              :to="`/category/${category.slug}`"
              class="group relative shrink-0 w-[320px] h-[200px] rounded-[24px] overflow-hidden border border-gray-100 bg-white"
            >
              <img
                v-if="category.image"
                :src="category.image"
                :alt="category.name"
                class="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                @error="onImgError"
              />
              <div class="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/45 to-transparent" />
              <div class="relative h-full p-5 text-white flex flex-col justify-between">
                <div>
                  <p class="text-[11px] tracking-[0.25em] text-orange-200">{{ category.children.length }} 项</p>
                  <h3 class="mt-2 text-lg font-semibold">{{ category.name }}</h3>
                </div>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="child in category.children"
                    :key="child.slug"
                    class="rounded-full border border-white/15 bg-black/15 px-3 py-1 text-xs text-white/85 backdrop-blur-sm"
                  >
                    {{ child.name }}
                  </span>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section class="max-w-[1200px] mx-auto px-4 py-8">
      <div class="flex items-center justify-between gap-4 mb-6">
        <h2 class="text-2xl font-bold text-gray-800">全部分类</h2>
        <span class="text-sm text-gray-400">{{ showcaseCategories.length }} 个分类</span>
      </div>

      <div class="grid lg:grid-cols-2 gap-4">
        <article
          v-for="category in showcaseCategories"
          :key="category.slug"
          class="group relative overflow-hidden rounded-[28px] min-h-[360px] border border-black/5 shadow-sm cursor-pointer"
          role="link"
          tabindex="0"
          @click="openCategory(category.slug)"
          @keydown.enter="openCategory(category.slug)"
          @keydown.space.prevent="openCategory(category.slug)"
        >
          <img
            v-if="category.image"
            :src="category.image"
            :alt="category.name"
            class="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
            @error="onImgError"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/35 to-transparent" />

          <div class="relative h-full p-6 md:p-7 text-white flex flex-col justify-between">
            <div class="flex items-start justify-between gap-4">
              <div class="flex items-center gap-3">
                <span class="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/12 text-xl backdrop-blur-sm">
                  {{ category.icon }}
                </span>
                <div>
                  <h3 class="text-2xl font-semibold tracking-[0.02em]">{{ category.name }}</h3>
                  <p class="mt-1 text-xs text-white/75">{{ category.children.length }} 项</p>
                </div>
              </div>
              <NuxtLink
                :to="`/category/${category.slug}`"
                class="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs text-white hover:bg-white/15 transition"
                @click.stop
              >
                查看
              </NuxtLink>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-6">
              <NuxtLink
                v-for="sub in category.children"
                :key="sub.slug"
                :to="`/category/${sub.slug}`"
                class="overflow-hidden rounded-2xl border border-white/15 bg-black/15 backdrop-blur-sm"
                @click.stop
              >
                <div class="h-20 bg-white/10">
                  <img
                    v-if="sub.image"
                    :src="sub.image"
                    :alt="sub.name"
                    class="h-full w-full object-cover"
                    @error="onImgError"
                  />
                </div>
                <p class="px-3 py-2 text-xs text-white/90">{{ sub.name }}</p>
              </NuxtLink>
            </div>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
interface HomeBanner {
  label: string
  title: string
  image: string
  link: string
  tags: string[]
}

const currentBanner = ref(0)
const activeStyle = ref('全部')
const activeSidebarSlug = ref('')
const bannerSeed = useState<number>('home-banner-seed', () => Math.floor(Math.random() * 2147483647))

function createSeededRandom(seed: number) {
  let value = seed % 2147483647

  if (value <= 0) {
    value += 2147483646
  }

  return () => {
    value = (value * 16807) % 2147483647
    return (value - 1) / 2147483646
  }
}

function shuffleWithSeed<T>(items: T[], seed: number) {
  const random = createSeededRandom(seed)
  const shuffled = [...items]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(random() * (index + 1))
    const currentItem = shuffled[index]
    shuffled[index] = shuffled[randomIndex]
    shuffled[randomIndex] = currentItem
  }

  return shuffled
}

function onImgError(e: Event) {
  (e.target as HTMLImageElement).style.display = 'none'
}

function openCategory(slug: string) {
  navigateTo(`/category/${slug}`)
}

const { categories } = useCategories()

const activeSidebarCategory = computed(() =>
  categories.value.find(category => category.slug === activeSidebarSlug.value) || null,
)

const showcaseCategories = computed(() => categories.value)

const categoryTabs = computed(() => ['全部', ...categories.value.map(category => category.name)])

const featuredItems = computed(() => {
  const visibleCategories = activeStyle.value === '全部'
    ? categories.value
    : categories.value.filter(category => category.name === activeStyle.value)

  if (activeStyle.value === '全部') {
    return visibleCategories.slice(0, 2).flatMap(category =>
      category.children.slice(0, 2).map(child => ({
        ...child,
        parentName: category.name,
        parentSlug: category.slug,
      })),
    ).slice(0, 4)
  }

  return visibleCategories.flatMap(category =>
    category.children.map(child => ({
      ...child,
      parentName: category.name,
      parentSlug: category.slug,
    })),
  ).slice(0, 4)
})

const heroBannerCandidates = computed<HomeBanner[]>(() =>
  categories.value.flatMap((category) => {
    const banners: HomeBanner[] = []

    if (category.image) {
      banners.push({
        label: '分类',
        title: category.name,
        image: category.image,
        link: `/category/${category.slug}`,
        tags: category.children.slice(0, 4).map(child => child.name),
      })
    }

    category.children
      .filter(child => Boolean(child.image))
      .slice(0, 4)
      .forEach((child) => {
        const siblingTags = category.children
          .filter(item => item.slug !== child.slug)
          .slice(0, 2)
          .map(item => item.name)

        banners.push({
          label: category.name,
          title: `${category.name} · ${child.name}`,
          image: child.image!,
          link: `/category/${child.slug}`,
          tags: [child.name, ...siblingTags].slice(0, 4),
        })
      })

    return banners
  }),
)

const heroBanners = computed<HomeBanner[]>(() => {
  const dedupedBanners = heroBannerCandidates.value.filter((banner, index, list) =>
    list.findIndex(item => item.image === banner.image) === index,
  )

  return shuffleWithSeed(dedupedBanners, bannerSeed.value).slice(0, 6)
})

const carouselCategories = computed(() => [...categories.value, ...categories.value])

watch(heroBanners, (banners) => {
  if (!banners.length) {
    currentBanner.value = 0
    return
  }

  if (currentBanner.value >= banners.length) {
    currentBanner.value = 0
  }
})

let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timer = setInterval(() => {
    if (!heroBanners.value.length) return
    currentBanner.value = (currentBanner.value + 1) % heroBanners.value.length
  }, 4000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.animate-marquee {
  animation: marquee 28s linear infinite;
}

.animate-marquee:hover {
  animation-play-state: paused;
}
</style>
