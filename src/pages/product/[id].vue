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
const figmaProductImage = '/images/figma/product-door.png'
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
const specs = computed(() => [
  { key: 'price', label: t('product.price'), value: t('product.designPrice') },
  { key: 'description', label: t('product.description'), value: t('product.designDescription') },
  { key: 'category', label: t('product.category'), value: t('product.designCategory') },
  { key: 'rating', label: t('product.rating'), value: t('product.designRating') },
  { key: 'votes', label: t('product.votes'), value: t('product.designVotes') }
])

useSeoMeta({
  title: () => `${t('product.designTitle')} | ${t('brand.name')}`,
  description: () => t('product.designDescription'),
  ogTitle: () => t('product.designTitle'),
  ogDescription: () => t('product.designDescription'),
  ogImage: () => `${config.public.siteUrl.replace(/\/$/, '')}${figmaProductImage}`,
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
              name: t('product.designTitle'),
              description: t('product.designDescription'),
              image: `${config.public.siteUrl.replace(/\/$/, '')}${figmaProductImage}`,
              category: t('product.designCategory'),
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: 2,
                reviewCount: 5
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
      <span class="hidden truncate text-[#30445b] md:inline">{{ t('product.designTitle') }}</span>
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
        <h1 class="product-hero-card__title">{{ t('product.designTitle') }}</h1>
        <div class="product-hero-card__image-wrap">
          <img
            :src="figmaProductImage"
            :alt="t('product.designTitle')"
            width="990"
            height="660"
            class="product-hero-card__image"
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
            <dd>{{ item.value }}</dd>
          </div>
        </dl>
      </article>

      <ProductImageDialog
        :open="imageOpen"
        :src="figmaProductImage"
        :alt="t('product.designTitle')"
        @close="imageOpen = false"
      />
    </template>
  </div>
</template>
