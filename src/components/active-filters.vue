<script setup lang="ts">
import type { ProductSort } from '~/types/product'

const props = defineProps<{ query: string; category: string[]; sort: ProductSort }>()
const emit = defineEmits<{ remove: [key: 'q' | 'category' | 'sort', category?: string] }>()
const { t } = useI18n()

const sortLabels: Partial<Record<ProductSort, string>> = {
  'price-asc': 'sort.priceAsc',
  'price-desc': 'sort.priceDesc',
  'rating-desc': 'sort.ratingDesc',
  'title-asc': 'sort.titleAsc'
}

const filters = computed(() => {
  const entries: { key: 'q' | 'category' | 'sort'; label: string; category?: string }[] = []

  if (props.query) entries.push({ key: 'q', label: props.query })
  props.category.forEach((category) => entries.push({ key: 'category', label: category, category }))
  if (props.sort !== 'default') entries.push({ key: 'sort', label: t(sortLabels[props.sort] ?? '') })

  return entries
})
</script>

<template>
  <section class="active-filters-panel" :aria-label="t('listing.activeFilters')">
    <strong class="active-filters-panel__title label-md">{{ t('listing.activeFilters') }}</strong>
    <div v-if="filters.length" class="active-filters-panel__chips">
      <MChip
        v-for="filter in filters"
        :key="`${filter.key}-${filter.category ?? filter.label}`"
        :text="filter.label"
        closable
        @close="emit('remove', filter.key, filter.category)"
      />
    </div>
    <span v-else class="body-xs font-medium text-[#9badc1]">{{ t('listing.activeFiltersEmpty') }}</span>
  </section>
</template>

<style scoped>
.active-filters-panel {
  display: flex;
  min-height: 64px;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 2px 3px rgb(0 0 0 / 3%);
}

.active-filters-panel__title {
  flex: none;
  color: #445a74;
}

.active-filters-panel__chips {
  display: flex;
  min-width: 0;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}
</style>
