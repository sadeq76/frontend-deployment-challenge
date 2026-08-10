<script setup lang="ts">
import { useId } from 'vue'
import type { ProductSort } from '~/types/product'

const props = defineProps<{ query: string; category: string; sort: ProductSort; categories: string[] }>()
const emit = defineEmits<{
  update: [changes: Partial<{ q: string; category: string; sort: ProductSort }>]
  clear: []
}>()
const { t } = useI18n()

const instanceId = useId()
const searchInputId = `product-search-${instanceId}`
const sortFieldName = `product-sort-${instanceId}`
const categoryFieldName = `product-category-${instanceId}`
const draftQuery = ref(props.query)

const sortOptions: { value: ProductSort; label: string }[] = [
  { value: 'default', label: 'sort.default' },
  { value: 'price-asc', label: 'sort.priceAsc' },
  { value: 'price-desc', label: 'sort.priceDesc' },
  { value: 'rating-desc', label: 'sort.ratingDesc' },
  { value: 'title-asc', label: 'sort.titleAsc' }
]

const displayedCategories = computed(() => props.categories.slice(0, 3))

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
  return props.categories.indexOf(category) + 2
}
</script>

<template>
  <form class="filter-panel" @submit.prevent="submit">
    <section class="filter-panel__section">
      <h2 class="filter-panel__heading">{{ t('listing.filterTitle') }}</h2>
      <label class="sr-only" :for="searchInputId">{{ t('listing.searchLabel') }}</label>
      <input
        :id="searchInputId"
        v-model="draftQuery"
        class="filter-panel__input"
        type="search"
        :placeholder="t('listing.searchPlaceholder')"
      />
      <button type="submit" class="filter-panel__search-button">{{ t('listing.applyFilters') }}</button>
    </section>

    <fieldset class="filter-panel__section">
      <legend class="filter-panel__heading">{{ t('listing.sortBy') }}</legend>
      <div class="filter-panel__options">
        <label v-for="option in sortOptions" :key="option.value" class="filter-panel__option">
          <span class="filter-panel__option-label">{{ t(option.label) }}</span>
          <input
            class="filter-panel__option-control"
            type="radio"
            :name="sortFieldName"
            :checked="props.sort === option.value"
            @change="emit('update', { sort: option.value })"
          />
        </label>
      </div>
    </fieldset>

    <fieldset class="filter-panel__section">
      <legend class="filter-panel__heading">{{ t('listing.categoryTitle') }}</legend>
      <div class="filter-panel__options">
        <label class="filter-panel__option">
          <span class="filter-panel__option-label">{{ t('listing.allCategories') }}</span>
          <input
            class="filter-panel__option-control"
            type="radio"
            :name="categoryFieldName"
            :checked="!props.category"
            @change="emit('update', { category: '' })"
          />
        </label>
        <label v-for="item in displayedCategories" :key="item" class="filter-panel__option">
          <span class="filter-panel__option-label" dir="auto">{{ item }}</span>
          <span class="flex items-center gap-2">
            <span class="filter-panel__count">{{ categoryCount(item) }}</span>
            <input
              class="filter-panel__option-control"
              type="radio"
              :name="categoryFieldName"
              :checked="props.category === item"
              @change="emit('update', { category: item })"
            />
          </span>
        </label>
      </div>
    </fieldset>
  </form>
</template>
