<script setup lang="ts">
const { t } = useI18n()
const config = useRuntimeConfig()
const { data: products, pending, error, refresh } = await useProducts()
const { query, category, sort, categories, filteredProducts, update, clear } = useProductFilters(products)
const mobileFiltersOpen = ref(false)
const route = useRoute()
const isFiltered = computed(() => Boolean(query.value || category.value || sort.value !== 'default'))

useSeoMeta({
  title: () => `${t('listing.title')} | نوبتینو`,
  description: () => t('listing.filterSearch'),
  ogTitle: () => `${t('listing.title')} | نوبتینو`,
  ogDescription: () => t('listing.filterSearch'),
  robots: () => isFiltered.value ? 'noindex,follow' : 'index,follow'
})
useHead({ link: [{ rel: 'canonical', href: `${config.public.siteUrl}/` }] })
function removeFilter(key: 'q' | 'category' | 'sort') { update({ [key]: key === 'sort' ? 'default' : '' }) }
</script>

<template>
  <div class="shell py-8 md:py-12">
    <div class="mb-6 flex items-center justify-between"><div><h1 class="text-2xl font-bold text-ink md:text-3xl">{{ t('listing.title') }}</h1><p v-if="!pending && !error" class="mt-2 text-sm text-ink-muted">{{ t('listing.results', { count: filteredProducts.length }) }}</p></div><button type="button" class="secondary-button lg:hidden" @click="mobileFiltersOpen = true">{{ t('listing.openFilters') }}</button></div>
    <div v-if="pending" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"><div v-for="index in 6" :key="index" class="h-[310px] animate-pulse rounded-card bg-white" /></div>
    <StatePanel v-else-if="error" :title="t('state.errorTitle')" :body="t('state.errorBody')" :action="t('state.retry')" @action="refresh" />
    <div v-else class="grid gap-6 lg:grid-cols-[1fr_266px]">
      <div class="min-w-0"><ActiveFilters class="mb-6" :query="query" :category="category" :sort="sort" @remove="removeFilter" /><div v-if="filteredProducts.length" class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"><ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" /></div><StatePanel v-else :title="t('state.emptyTitle')" :body="t('state.emptyBody')" :action="t('listing.clearAll')" @action="clear" /></div>
      <aside class="hidden lg:block"><FilterPanel :query="query" :category="category" :sort="sort" :categories="categories" @update="update" @clear="clear" /></aside>
    </div>
  </div>
  <Teleport to="body"><div v-if="mobileFiltersOpen" class="fixed inset-0 z-50 bg-ink/30 p-4" @click.self="mobileFiltersOpen = false"><aside class="mr-auto h-full w-full max-w-sm overflow-y-auto bg-canvas p-4 shadow-floating"><div class="mb-4 flex justify-between"><h2 class="text-lg font-bold">{{ t('listing.openFilters') }}</h2><button type="button" class="grid size-10 place-items-center rounded-lg border border-line text-xl" aria-label="بستن" @click="mobileFiltersOpen = false">×</button></div><FilterPanel :query="query" :category="category" :sort="sort" :categories="categories" @update="update" @clear="clear" /></aside></div></Teleport>
</template>
