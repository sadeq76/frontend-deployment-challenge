<script setup lang="ts">
import type { ProductSort } from '~/types/product'
const props = defineProps<{ query: string; category: string; sort: ProductSort }>()
const emit = defineEmits<{ remove: [key: 'q' | 'category' | 'sort'] }>()
const { t } = useI18n()
const sortLabels: Partial<Record<ProductSort, string>> = { 'price-asc': 'sort.priceAsc', 'price-desc': 'sort.priceDesc', 'rating-desc': 'sort.ratingDesc', 'title-asc': 'sort.titleAsc' }
const sortLabel = computed(() => sortLabels[props.sort] ?? '')
</script>
<template>
  <section v-if="props.query || props.category || props.sort !== 'default'" class="surface-card flex flex-wrap items-center gap-2 p-4" :aria-label="t('listing.activeFilters')"><strong class="ml-2 text-sm text-ink">{{ t('listing.activeFilters') }}</strong><button v-if="props.query" type="button" class="rounded-full bg-brand-soft px-3 py-1 text-xs text-ink" @click="emit('remove', 'q')">{{ props.query }} ×</button><button v-if="props.category" type="button" class="rounded-full bg-brand-soft px-3 py-1 text-xs text-ink" @click="emit('remove', 'category')"><span dir="auto">{{ props.category }}</span> ×</button><button v-if="sortLabel" type="button" class="rounded-full bg-brand-soft px-3 py-1 text-xs text-ink" @click="emit('remove', 'sort')">{{ t(sortLabel) }} ×</button></section>
</template>
