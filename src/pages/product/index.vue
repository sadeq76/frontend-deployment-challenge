<script setup lang="ts">
import FilterPanel from './components/filter-panel.vue'
import ProductCard from './components/product-card.vue'

type FilterKey = 'q' | 'category' | 'sort'

type ButtonExpose = {
  element: HTMLElement | null
}

const { t } = useI18n()
const config = useRuntimeConfig()

const { data: products, pending, error, refresh } = await useProducts()

const { query, selectedCategories, sort, categories, filteredProducts, update, clear } = useProductFilters(products)

const mobileFiltersOpen = ref(false)
const mobileFilterDialog = ref<HTMLElement | null>(null)
const mobileFilterCloseButton = ref<ButtonExpose | null>(null)

const mobileFilterInitialFocus = computed(() => mobileFilterCloseButton.value?.element ?? null)

const hasActiveFilters = computed(
  () => Boolean(query.value) || selectedCategories.value.length > 0 || sort.value !== 'default'
)

const categoryCounts = computed<Record<string, number>>(() =>
  (products.value ?? []).reduce<Record<string, number>>((counts, product) => {
    counts[product.category] = (counts[product.category] ?? 0) + 1

    return counts
  }, {})
)

const canonicalUrl = `${config.public.siteUrl.replace(/\/+$/, '')}/product`

useSeoMeta({
  title: () => `${t('listing.title')} | ${t('brand.name')}`,
  description: () => t('listing.filterSearch'),

  ogTitle: () => `${t('listing.title')} | ${t('brand.name')}`,
  ogDescription: () => t('listing.filterSearch'),

  robots: () => (hasActiveFilters.value ? 'noindex,follow' : 'index,follow')
})

useHead({
  link: [
    {
      rel: 'canonical',
      href: canonicalUrl
    }
  ]
})

function openMobileFilters() {
  mobileFiltersOpen.value = true
}

function closeMobileFilters() {
  mobileFiltersOpen.value = false
}

function removeFilter(key: FilterKey, category?: string) {
  switch (key) {
    case 'q':
      update({
        q: ''
      })
      break

    case 'sort':
      update({
        sort: 'default'
      })
      break

    case 'category':
      if (!category) return

      update({
        category: selectedCategories.value.filter((selectedCategory) => selectedCategory !== category)
      })
      break
  }
}

const { onKeydown: onMobileFilterKeydown } = useOverlayAccessibility({
  open: mobileFiltersOpen,
  container: mobileFilterDialog,
  initialFocus: mobileFilterInitialFocus,
  onClose: closeMobileFilters
})

let desktopMediaQuery: MediaQueryList | undefined

function handleDesktopBreakpoint(event: MediaQueryListEvent) {
  if (event.matches) closeMobileFilters()
}

onMounted(() => {
  desktopMediaQuery = window.matchMedia('(min-width: 1024px)')

  desktopMediaQuery.addEventListener('change', handleDesktopBreakpoint)
})

onBeforeUnmount(() => {
  desktopMediaQuery?.removeEventListener('change', handleDesktopBreakpoint)
})
</script>

<template>
  <div class="shell pt-6">
    <div dir="ltr" class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_266px]">
      <main dir="rtl" class="relative min-w-0">
        <ActiveFilters :query="query" :category="selectedCategories" :sort="sort" @remove="removeFilter" />

        <MBtn
          :text="t('listing.openFilters')"
          :aria-expanded="mobileFiltersOpen"
          prepend-icon="PhFunnel"
          class="mt-4 w-full lg:hidden!"
          aria-controls="mobile-filter-dialog"
          aria-haspopup="dialog"
          @click="openMobileFilters"
        />

        <div v-if="pending" class="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 lg:grid-cols-3" aria-busy="true">
          <div v-for="index in 6" :key="index" class="rounded-card bg-surface-muted h-[286px] animate-pulse" />
        </div>

        <StatePanel
          v-else-if="error"
          :title="t('state.errorTitle')"
          :body="t('state.errorBody')"
          :action="t('state.retry')"
          class="mt-6"
          @action="refresh"
        />

        <TransitionGroup
          v-else-if="filteredProducts.length"
          name="product-card"
          tag="div"
          class="product-list-grid mt-6 grid grid-cols-1 gap-x-4 gap-y-6 lg:grid-cols-3"
        >
          <div v-for="product in filteredProducts" :key="product.id" class="product-card-item">
            <ProductCard :product="product" />
          </div>
        </TransitionGroup>

        <StatePanel
          v-else
          :title="t('state.emptyTitle')"
          :body="t('state.emptyBody')"
          :action="t('listing.clearAll')"
          class="mt-6"
          @action="clear"
        />
      </main>

      <aside :aria-label="t('listing.filterProducts')" dir="rtl" class="hidden min-w-0 lg:block">
        <FilterPanel
          :query="query"
          :category="selectedCategories"
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
    <Transition name="bottom-sheet">
      <div
        v-if="mobileFiltersOpen"
        class="bg-ink/30 fixed inset-0 z-50 flex items-end lg:hidden"
        @click.self="closeMobileFilters"
      >
        <aside
          :aria-labelledby="'mobile-filter-title'"
          id="mobile-filter-dialog"
          ref="mobileFilterDialog"
          class="rounded-t-card bg-canvas shadow-floating flex max-h-[85dvh] w-full flex-col"
          tabindex="-1"
          role="dialog"
          aria-modal="true"
          @keydown="onMobileFilterKeydown"
        >
          <div class="bg-ink/20 mx-auto mt-2 h-1 w-10 shrink-0 rounded-full" aria-hidden="true" />

          <div class="flex shrink-0 items-center justify-between px-4 pt-3 pb-4">
            <h2 id="mobile-filter-title" class="title-md text-ink">
              {{ t('listing.filterProducts') }}
            </h2>

            <MBtn
              :icon-size="20"
              :aria-label="t('listing.closeFilters')"
              ref="mobileFilterCloseButton"
              variant="icon"
              prepend-icon="PhXCircle"
              class="!text-ink-muted !rounded-xl"
              @click="closeMobileFilters"
            />
          </div>

          <div class="overflow-y-auto px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <FilterPanel
              :query="query"
              :category="selectedCategories"
              :sort="sort"
              :categories="categories"
              :category-counts="categoryCounts"
              @update="update"
              @clear="clear"
            />
          </div>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.product-list-grid {
  position: relative;
}

.product-card-item {
  min-width: 0;
  will-change: transform, opacity;
}

.product-card-enter-active,
.product-card-leave-active {
  transition:
    opacity 180ms ease,
    transform 220ms cubic-bezier(0.2, 0, 0, 1);
}

.product-card-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}

.product-card-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}

.product-card-move {
  transition: transform 280ms cubic-bezier(0.2, 0, 0, 1);
}

.bottom-sheet-enter-active,
.bottom-sheet-leave-active {
  transition: opacity 200ms ease;
}

.bottom-sheet-enter-active > aside,
.bottom-sheet-leave-active > aside {
  transition: transform 280ms cubic-bezier(0.2, 0, 0, 1);
}

.bottom-sheet-enter-from,
.bottom-sheet-leave-to {
  opacity: 0;
}

.bottom-sheet-enter-from > aside,
.bottom-sheet-leave-to > aside {
  transform: translateY(100%);
}

@media (prefers-reduced-motion: reduce) {
  .product-card-enter-active,
  .product-card-leave-active,
  .product-card-move,
  .bottom-sheet-enter-active,
  .bottom-sheet-leave-active,
  .bottom-sheet-enter-active > aside,
  .bottom-sheet-leave-active > aside {
    transition: none;
  }
}
</style>
