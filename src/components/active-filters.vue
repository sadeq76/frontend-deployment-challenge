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
  <section :aria-label="t('listing.activeFilters')" class="active-filters-panel">
    <strong class="active-filters-panel__title label-md">
      {{ t('listing.activeFilters') }}
    </strong>

    <div v-if="filters.length" class="active-filters-panel__viewport">
      <div class="active-filters-panel__track">
        <MChip
          v-for="filter in filters"
          :key="`${filter.key}-${filter.category ?? filter.label}`"
          :text="filter.label"
          class="shrink-0"
          closable
          @close="emit('remove', filter.key, filter.category)"
        />
      </div>
    </div>

    <span v-else class="active-filters-panel__empty body-xs font-medium">
      {{ t('listing.activeFiltersEmpty') }}
    </span>
  </section>
</template>
<style scoped>
.active-filters-panel {
  display: flex;
  min-width: 0;
  min-height: 64px;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 24px;
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
}

.active-filters-panel__title {
  flex: none;
  color: var(--color-ink-muted);
}

.active-filters-panel__viewport {
  min-width: 0;
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
  overscroll-behavior-x: contain;
  scrollbar-width: none;
  scroll-snap-type: x proximity;
}

.active-filters-panel__viewport::-webkit-scrollbar {
  display: none;
}

.active-filters-panel__track {
  display: flex;
  width: max-content;
  min-width: 100%;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

.active-filters-panel__track > * {
  flex: none;
  scroll-snap-align: start;
}

.active-filters-panel__empty {
  margin-inline-start: auto;
  color: var(--color-ink-soft);
}
</style>
