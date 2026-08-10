<script setup lang="ts">
import type { ProductSort } from '~/types/product'

const props = defineProps<{ query: string; category: string; sort: ProductSort; categories: string[] }>()
const emit = defineEmits<{ update: [changes: Partial<{ q: string; category: string; sort: ProductSort }>]; clear: [] }>()
const { t } = useI18n()
const draftQuery = ref(props.query)
watch(() => props.query, (value: string) => { draftQuery.value = value })
const options: { value: ProductSort; label: string }[] = [
  { value: 'default', label: 'sort.default' }, { value: 'price-asc', label: 'sort.priceAsc' }, { value: 'price-desc', label: 'sort.priceDesc' }, { value: 'rating-desc', label: 'sort.ratingDesc' }, { value: 'title-asc', label: 'sort.titleAsc' }
]
function submit() { emit('update', { q: draftQuery.value.trim() }) }
</script>

<template>
  <form class="space-y-4" @submit.prevent="submit">
    <section class="surface-card p-4"><h2 class="mb-4 text-sm font-bold text-ink-muted">{{ t('listing.filterSearch') }}</h2><label class="sr-only" for="product-search">{{ t('listing.searchLabel') }}</label><input id="product-search" v-model="draftQuery" class="control" type="search" :placeholder="t('listing.searchPlaceholder')"><button class="brand-button mt-3 w-full" type="submit">{{ t('listing.search') }}</button></section>
    <section class="surface-card p-4"><h2 class="mb-4 text-sm font-bold text-ink-muted">{{ t('listing.sort') }}</h2><div class="space-y-3"><label v-for="option in options" :key="option.value" class="flex cursor-pointer items-center gap-2 text-sm text-ink-muted"><input class="size-4 accent-brand" type="radio" name="sort" :checked="props.sort === option.value" @change="emit('update', { sort: option.value })"><span>{{ t(option.label) }}</span></label></div></section>
    <section class="surface-card p-4"><h2 class="mb-4 text-sm font-bold text-ink-muted">{{ t('listing.category') }}</h2><div class="space-y-3"><label class="flex cursor-pointer items-center gap-2 text-sm text-ink-muted"><input class="size-4 accent-brand" type="radio" name="category" :checked="!props.category" @change="emit('update', { category: '' })"><span>{{ t('listing.allCategories') }}</span></label><label v-for="item in props.categories" :key="item" class="flex cursor-pointer items-center gap-2 text-sm text-ink-muted"><input class="size-4 accent-brand" type="radio" name="category" :checked="props.category === item" @change="emit('update', { category: item })"><span dir="auto">{{ item }}</span></label></div></section>
    <button type="button" class="secondary-button w-full" @click="emit('clear')">{{ t('listing.clearAll') }}</button>
  </form>
</template>
