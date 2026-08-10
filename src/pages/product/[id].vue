<script setup lang="ts">
import type { Product } from '~/types/product'
import { productsService } from '~/services/products-service'

definePageMeta({
  validate: (route) => typeof route.params.id === 'string' && /^\d+$/.test(route.params.id)
})

const route = useRoute()
const { t } = useI18n()
const config = useRuntimeConfig()
const productId = computed(() => String(route.params.id))
const { data: product, pending, error, refresh } = await useAsyncData(`product:${productId.value}`, () => productsService.getById(productId.value))
const { price, number } = useProductFormat()
const imageOpen = ref(false)

if (error.value) throw createError({ statusCode: error.value.statusCode === 404 ? 404 : 502, statusMessage: error.value.statusCode === 404 ? 'Product not found' : 'Product service is unavailable' })

const canonical = computed(() => `${config.public.siteUrl.replace(/\/$/, '')}/product/${productId.value}`)
useSeoMeta({
  title: () => product.value ? `${product.value.title} | نوبتینو` : t('state.loading'),
  description: () => product.value?.description ?? '',
  ogTitle: () => product.value?.title ?? '',
  ogDescription: () => product.value?.description ?? '',
  ogImage: () => product.value?.image ?? '',
  twitterCard: 'summary_large_image',
  robots: 'index,follow'
})
useHead({
  link: [{ rel: 'canonical', href: canonical }],
  script: computed(() => product.value ? [{ type: 'application/ld+json', children: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Product', name: product.value.title, description: product.value.description, image: product.value.image, category: product.value.category, aggregateRating: { '@type': 'AggregateRating', ratingValue: product.value.rating.rate, reviewCount: product.value.rating.count } }) }] : [])
})
</script>

<template>
  <div class="shell py-6 md:py-12">
    <NuxtLink to="/" class="mb-6 inline-flex items-center gap-2 text-sm font-bold text-ink-soft hover:text-brand">← {{ t('product.back') }}</NuxtLink>
    <div v-if="pending" class="space-y-6"><div class="h-96 animate-pulse rounded-card bg-white" /><div class="h-96 animate-pulse rounded-card bg-white" /></div>
    <StatePanel v-else-if="error" :title="t('state.errorTitle')" :body="t('state.errorBody')" :action="t('state.retry')" @action="refresh" />
    <template v-else-if="product">
      <article class="surface-card overflow-hidden p-4 md:p-6"><h1 class="mb-6 text-xl font-bold text-ink md:text-2xl" dir="auto">{{ product.title }}</h1><div class="relative aspect-[3/1] min-h-64 overflow-hidden rounded-control bg-surface-muted"><NuxtImg :src="product.image" :alt="product.title" width="1064" height="310" sizes="(min-width: 1120px) 1064px, 92vw" class="size-full object-contain p-6" preload /><button type="button" class="absolute left-3 top-3 grid size-10 place-items-center rounded-xl bg-ink/70 text-white" :aria-label="t('product.zoom')" @click="imageOpen = true">⌕</button></div></article>
      <article class="surface-card mt-6 p-4 md:p-6"><h2 class="text-xl font-bold text-ink">{{ t('product.technical') }}</h2><dl class="mt-6 grid gap-3 md:grid-cols-[172px_1fr]"><template v-for="item in [{ label: t('product.price'), value: price(product.price) }, { label: t('product.description'), value: product.description }, { label: t('product.category'), value: product.category }, { label: t('product.rating'), value: number(product.rating.rate) }, { label: t('product.votes'), value: number(product.rating.count) }]" :key="item.label"><dt class="rounded-[4px_16px_4px_16px] bg-surface-muted px-4 py-3 text-sm font-medium text-ink-soft">{{ item.label }}</dt><dd class="m-0 whitespace-pre-wrap rounded-[16px_4px_16px_4px] bg-surface-muted px-4 py-3 text-sm font-bold leading-7 text-ink-muted" dir="auto">{{ item.value }}</dd></template></dl></article>
      <ProductImageDialog :open="imageOpen" :src="product.image" :alt="product.title" @close="imageOpen = false" />
    </template>
  </div>
</template>
