<script setup lang="ts">
import { productsService } from '~/services/products-service'
import ProductImageDialog from './components/product-image-dialog.vue'

definePageMeta({
  validate: (route) => typeof route.params.id === 'string' && /^\d+$/.test(route.params.id)
})

const route = useRoute()
const { t } = useI18n()
const config = useRuntimeConfig()
const productId = computed(() => String(route.params.id))
const { number, price } = useProductFormat()
const {
  data: product,
  pending,
  error,
  refresh
} = await useAsyncData(`product:${productId.value}`, () => productsService.getById(productId.value))
const imageOpen = ref(false)

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode === 404 ? 404 : 502,
    statusMessage: error.value.statusCode === 404 ? 'Product not found' : 'Product service is unavailable'
  })
}

const canonical = computed(() => `${config.public.siteUrl.replace(/\/$/, '')}/product/${productId.value}`)
const specs = computed(() => {
  if (!product.value) return []

  return [
    { key: 'price', label: t('product.price'), value: price(product.value.price) },
    { key: 'description', label: t('product.description'), value: product.value.description },
    { key: 'category', label: t('product.category'), value: product.value.category },
    { key: 'rating', label: t('product.rating'), value: number(product.value.rating.rate) },
    { key: 'votes', label: t('product.votes'), value: number(product.value.rating.count) }
  ]
})

useSeoMeta({
  title: () => (product.value ? `${product.value.title} | ${t('brand.name')}` : t('state.loading')),
  description: () => product.value?.description ?? '',
  ogTitle: () => product.value?.title ?? t('brand.name'),
  ogDescription: () => product.value?.description ?? '',
  ogImage: () => product.value?.image,
  twitterCard: 'summary_large_image',
  robots: 'index,follow'
})
useHead({
  link: [{ rel: 'canonical', href: canonical }],
  script: computed(() =>
    product.value
      ? [
          {
            type: 'application/ld+json',
            children: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: product.value.title,
              description: product.value.description,
              image: product.value.image,
              category: product.value.category,
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: product.value.rating.rate,
                reviewCount: product.value.rating.count
              },
              offers: {
                '@type': 'Offer',
                price: product.value.price,
                priceCurrency: 'USD',
                availability: 'https://schema.org/InStock'
              }
            })
          }
        ]
      : []
  )
})
</script>

<template>
  <div class="shell product-detail-page">
    <nav class="product-breadcrumb" :aria-label="t('product.breadcrumbProducts')">
      <NuxtLink to="/" class="product-breadcrumb__link">
        <MIcon name="Home" :size="16" />
        {{ t('product.breadcrumbHome') }}
      </NuxtLink>
      <MIcon name="ArrowLeft" :size="14" />
      <NuxtLink to="/product" class="product-breadcrumb__link">{{ t('product.breadcrumbProducts') }}</NuxtLink>
      <MIcon name="ArrowLeft" :size="14" />
      <span class="hidden truncate text-[#30445b] md:inline" :title="product?.title" dir="auto">
        {{ product?.title ?? t('state.loading') }}
      </span>
    </nav>

    <div v-if="pending" class="space-y-6" aria-busy="true">
      <div class="h-[331px] animate-pulse rounded-card bg-white md:h-[414px]" />
      <div class="h-[600px] animate-pulse rounded-card bg-white" />
    </div>

    <StatePanel
      v-else-if="error"
      :title="t('state.errorTitle')"
      :body="t('state.errorBody')"
      :action="t('state.retry')"
      @action="refresh"
    />

    <template v-else-if="product">
      <article class="product-hero-card">
        <h1 class="product-hero-card__title" :title="product.title" dir="auto">{{ product.title }}</h1>
        <div class="product-hero-card__image-wrap">
          <img
            :src="product.image"
            :alt="product.title"
            width="1064"
            height="310"
            class="product-hero-card__image"
            decoding="async"
          />
          <button
            type="button"
            class="product-hero-card__zoom"
            :aria-label="t('product.zoom')"
            @click="imageOpen = true"
          >
            <MIcon name="SearchZoomIn" :size="24" />
          </button>
        </div>
      </article>

      <article class="product-specs-card">
        <h2 class="product-specs-card__title">{{ t('product.technical') }}</h2>
        <dl class="product-specs-list">
          <div
            v-for="item in specs"
            :key="item.key"
            class="product-spec-row"
            :class="{ 'product-spec-row--description': item.key === 'description' }"
          >
            <dt>{{ item.label }}</dt>
            <dd dir="auto">{{ item.value }}</dd>
          </div>
        </dl>
      </article>

      <ProductImageDialog :open="imageOpen" :src="product.image" :alt="product.title" @close="imageOpen = false" />
    </template>
  </div>
</template>
