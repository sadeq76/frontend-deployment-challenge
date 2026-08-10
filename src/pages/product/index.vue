<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import FilterPanel from './components/filter-panel.vue'
import ProductCard from './components/product-card.vue'

const { t } = useI18n()
const config = useRuntimeConfig()
const { data: products, pending, error, refresh } = await useProducts()
const { query, category, sort, categories, filteredProducts, update, clear } = useProductFilters(products)
const mobileFiltersOpen = ref(false)
const mobileFilterDialog = ref<HTMLElement | null>(null)
const mobileFilterCloseButton = ref<HTMLElement | null>(null)
const isDesktop = ref(false)
const isFiltered = computed(() => Boolean(query.value || category.value || sort.value !== 'default'))
const categoryCounts = computed<Record<string, number>>(() =>
  products.value.reduce<Record<string, number>>((counts, product) => {
    counts[product.category] = (counts[product.category] ?? 0) + 1
    return counts
  }, {})
)
let desktopMediaQuery: MediaQueryList | undefined

useSeoMeta({
  title: () => `${t('listing.title')} | ${t('brand.name')}`,
  description: () => t('listing.filterSearch'),
  ogTitle: () => `${t('listing.title')} | ${t('brand.name')}`,
  ogDescription: () => t('listing.filterSearch'),
  robots: () => (isFiltered.value ? 'noindex,follow' : 'index,follow')
})
useHead({ link: [{ rel: 'canonical', href: `${config.public.siteUrl.replace(/\/$/, '')}/product` }] })

function removeFilter(key: 'q' | 'category' | 'sort') {
  update({ [key]: key === 'sort' ? 'default' : '' })
}

function closeMobileFilters() {
  mobileFiltersOpen.value = false
}

function updateDesktopMode(event?: MediaQueryListEvent) {
  isDesktop.value = event?.matches ?? desktopMediaQuery?.matches ?? false
}

onMounted(() => {
  desktopMediaQuery = window.matchMedia('(min-width: 1024px)')
  updateDesktopMode()
  desktopMediaQuery.addEventListener('change', updateDesktopMode)
})

onBeforeUnmount(() => {
  desktopMediaQuery?.removeEventListener('change', updateDesktopMode)
})

watch(isDesktop, (desktop) => {
  if (desktop) closeMobileFilters()
})

const { onKeydown: onMobileFilterKeydown } = useOverlayAccessibility({
  open: mobileFiltersOpen,
  container: mobileFilterDialog,
  initialFocus: mobileFilterCloseButton,
  onClose: closeMobileFilters
})
</script>

<template>
  <div class="shell product-list-page">
    <div class="product-list-layout">
      <div class="product-list-main relative">
        <ActiveFilters :query="query" :category="category" :sort="sort" @remove="removeFilter" />
        <button
          v-if="!isDesktop"
          type="button"
          class="absolute left-3 top-3 inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-3 text-xs font-bold text-white lg:hidden"
          :aria-expanded="mobileFiltersOpen"
          aria-controls="mobile-filter-dialog"
          aria-haspopup="dialog"
          @click="mobileFiltersOpen = true"
        >
          <MIcon name="Filter" :size="16" />
          {{ t('listing.openFilters') }}
        </button>

        <div v-if="pending" class="product-list-grid mt-6" aria-busy="true">
          <div v-for="index in 6" :key="index" class="h-[286px] animate-pulse rounded-card bg-white" />
        </div>
        <StatePanel
          v-else-if="error"
          class="mt-6"
          :title="t('state.errorTitle')"
          :body="t('state.errorBody')"
          :action="t('state.retry')"
          @action="refresh"
        />
        <div v-else-if="filteredProducts.length" class="product-list-grid mt-6">
          <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" />
        </div>
        <StatePanel
          v-else
          class="mt-6"
          :title="t('state.emptyTitle')"
          :body="t('state.emptyBody')"
          :action="t('listing.clearAll')"
          @action="clear"
        />
      </div>

      <aside v-if="isDesktop" class="product-list-sidebar" :aria-label="t('listing.filterProducts')">
        <FilterPanel
          :query="query"
          :category="category"
          :sort="sort"
          :categories="categories"
          :category-counts="categoryCounts"
          @update="update"
          @clear="clear"
        />
      </aside>
    </div>
  </div>

  <Teleport to="body">
    <div
      v-if="mobileFiltersOpen && !isDesktop"
      class="fixed inset-0 z-50 bg-[#0a2a51]/30 p-4"
      @click.self="closeMobileFilters"
    >
      <aside
        id="mobile-filter-dialog"
        ref="mobileFilterDialog"
        tabindex="-1"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-filter-title"
        class="mr-auto h-full w-full max-w-sm overflow-y-auto rounded-r-card bg-canvas p-4 shadow-floating"
        @keydown="onMobileFilterKeydown"
      >
        <div class="mb-4 flex items-center justify-between">
          <h2 id="mobile-filter-title" class="text-lg font-bold text-ink">{{ t('listing.filterProducts') }}</h2>
          <button
            ref="mobileFilterCloseButton"
            type="button"
            class="grid size-10 place-items-center rounded-xl border border-line bg-white text-ink-muted"
            :aria-label="t('listing.closeFilters')"
            @click="closeMobileFilters"
          >
            <MIcon name="CloseCircle" :size="20" />
          </button>
        </div>
        <FilterPanel
          :query="query"
          :category="category"
          :sort="sort"
          :categories="categories"
          :category-counts="categoryCounts"
          @update="update"
          @clear="clear"
        />
      </aside>
    </div>
  </Teleport>
</template>
