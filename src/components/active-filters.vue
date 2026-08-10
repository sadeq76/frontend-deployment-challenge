<script setup lang="ts">
import type { ProductSort } from '~/types/product'

const props = defineProps<{ query: string; category: string; sort: ProductSort }>()
const emit = defineEmits<{ remove: [key: 'q' | 'category' | 'sort'] }>()
const { t } = useI18n()

const sortLabels: Partial<Record<ProductSort, string>> = {
  'price-asc': 'sort.priceAsc',
  'price-desc': 'sort.priceDesc',
  'rating-desc': 'sort.ratingDesc',
  'title-asc': 'sort.titleAsc'
}

const filters = computed(() => {
  const entries: { key: 'q' | 'category' | 'sort'; label: string }[] = []

  if (props.query) entries.push({ key: 'q', label: props.query })
  if (props.category) entries.push({ key: 'category', label: props.category })
  if (props.sort !== 'default') entries.push({ key: 'sort', label: t(sortLabels[props.sort] ?? '') })

  return entries
})
</script>

<template>
  <section class="active-filters-panel" :aria-label="t('listing.activeFilters')">
    <strong class="active-filters-panel__title">{{ t('listing.activeFilters') }}</strong>
    <div v-if="filters.length" class="active-filters-panel__chips">
      <button
        v-for="filter in filters"
        :key="filter.key"
        type="button"
        class="active-filters-panel__chip"
        @click="emit('remove', filter.key)"
      >
        <span class="truncate" dir="auto">{{ filter.label }}</span>
        <MIcon name="CloseCircle" :size="14" />
      </button>
    </div>
    <span v-else class="text-xs font-medium leading-4 text-[#9badc1]">{{ t('listing.activeFiltersEmpty') }}</span>
  </section>
</template>
