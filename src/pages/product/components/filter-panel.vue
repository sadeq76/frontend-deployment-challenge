<script setup lang="ts">
import type { ProductSort } from '~/types/product'

const props = defineProps<{
  query: string
  category: string[]
  sort: ProductSort
  categories: string[]
  categoryCounts: Record<string, number>
  defaultExpanded?: boolean
}>()
const emit = defineEmits<{
  update: [changes: Partial<{ q: string; category: string[]; sort: ProductSort }>]
  clear: []
}>()
const { t } = useI18n()

const draftQuery = ref(props.query)

const sortOptions: { value: ProductSort; label: string }[] = [
  { value: 'default', label: 'sort.default' },
  { value: 'price-asc', label: 'sort.priceAsc' },
  { value: 'price-desc', label: 'sort.priceDesc' },
  { value: 'rating-desc', label: 'sort.ratingDesc' },
  { value: 'title-asc', label: 'sort.titleAsc' }
]
const translatedSortOptions = computed(() => sortOptions.map((option) => ({ ...option, label: t(option.label) })))
const categoryOptions = computed(() => props.categories.map((category) => ({ value: category, label: category })))

watch(
  () => props.query,
  (value: string) => {
    draftQuery.value = value
  }
)

function submit() {
  emit('update', { q: draftQuery.value.trim() })
}

function categoryCount(category: string) {
  return props.categoryCounts[category] ?? 0
}

function updateSort(value: string | number | boolean) {
  if (typeof value !== 'string') return

  const option = sortOptions.find((item) => item.value === value)
  if (option) emit('update', { sort: option.value })
}

function updateCategories(value: boolean | (string | number)[]) {
  if (!Array.isArray(value)) return

  const category = value.filter((item): item is string => typeof item === 'string')

  emit('update', { category })
}
</script>

<template>
  <form class="filter-panel" @submit.prevent="submit">
    <MExpandableCard class="filter-panel__card" :title="t('listing.filterTitle')" :default-expanded="defaultExpanded">
      <template #body>
        <div class="filter-panel__content">
          <MText
            v-model="draftQuery"
            class="filter-panel__search"
            type="search"
            :placeholder="t('listing.searchPlaceholder')"
            :aria-label="t('listing.searchLabel')"
            prepend-icon="PhMagnifyingGlass"
          />
          <MBtn type="submit" class="filter-panel__search-button" :text="t('listing.applyFilters')" />
        </div>
      </template>
    </MExpandableCard>

    <MExpandableCard class="filter-panel__card" :title="t('listing.sortBy')" :default-expanded="defaultExpanded">
      <template #body>
        <MRadioGroup
          class="filter-panel__options"
          :model-value="props.sort"
          :aria-label="t('listing.sortBy')"
          name="sort"
          @update:model-value="updateSort"
        >
          <MRadio
            v-for="option in translatedSortOptions"
            :key="option.value"
            :value="option.value"
            :label="option.label"
          />
        </MRadioGroup>
      </template>
    </MExpandableCard>

    <MExpandableCard class="filter-panel__card" :title="t('listing.categoryTitle')" :default-expanded="defaultExpanded">
      <template #body>
        <div
          class="filter-panel__options filter-panel__category-options"
          role="group"
          :aria-label="t('listing.categoryTitle')"
        >
          <div v-for="option in categoryOptions" :key="option.value" class="filter-panel__category-option">
            <MCheckbox
              class="filter-panel__category-checkbox"
              :model-value="props.category"
              :value="String(option.value)"
              name="category"
              @update:model-value="updateCategories"
            >
              <span class="filter-panel__category-label" dir="auto">{{ option.label }}</span>
            </MCheckbox>
            <MBadge
              :text="String(categoryCount(String(option.value)))"
              :color="props.category.includes(String(option.value)) ? '#e20054' : undefined"
            />
          </div>
        </div>
      </template>
    </MExpandableCard>
  </form>
</template>

<style scoped>
.filter-panel {
  display: grid;
  gap: 12px;
}

.filter-panel__content {
  display: grid;
  gap: 12px;
}

.filter-panel__search-button {
  display: flex;
  width: 100%;
}

.filter-panel__options {
  display: grid;
  gap: 12px;
}

.filter-panel__category-options {
  gap: 16px;
  padding-top: 4px;
}

.filter-panel__category-option {
  display: flex;
  min-height: 24px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.filter-panel__category-checkbox {
  flex: 1;
  min-width: 0;
}

.filter-panel__category-label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
