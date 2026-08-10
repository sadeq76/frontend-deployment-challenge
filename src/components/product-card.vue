<script setup lang="ts">
import type { Product } from '~/types/product'
const props = defineProps<{ product: Product }>()
const { t } = useI18n()
const { price, number } = useProductFormat()
</script>

<template>
  <article class="surface-card group flex h-full flex-col overflow-hidden border border-transparent p-2 transition hover:-translate-y-1 hover:border-line hover:shadow-floating">
    <NuxtLink :to="`/product/${props.product.id}`" class="relative block aspect-[1.45] overflow-hidden rounded-control bg-[#d0ddec]">
      <NuxtImg :src="props.product.image" :alt="props.product.title" width="320" height="220" sizes="(min-width: 1024px) 263px, (min-width: 640px) 45vw, 92vw" class="size-full object-contain p-4 transition duration-300 group-hover:scale-105" loading="lazy" />
    </NuxtLink>
    <div class="flex flex-1 flex-col px-2 pb-2 pt-4"><h2 class="line-clamp-2 min-h-12 text-sm font-bold leading-6 text-ink" dir="auto">{{ props.product.title }}</h2><p class="mt-2 text-xs text-ink-soft" dir="auto">{{ props.product.category }}</p><div class="mt-3 flex items-center justify-between text-xs text-ink-muted"><span>{{ price(props.product.price) }}</span><span>★ {{ number(props.product.rating.rate) }}</span></div><NuxtLink :to="`/product/${props.product.id}`" class="secondary-button mt-4 w-full">{{ t('product.viewDetails') }}</NuxtLink></div>
  </article>
</template>
