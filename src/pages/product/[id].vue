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
    { key: 'description', label: t('product.description'), value: product.value.description, multiline: true },
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
        <MIcon name="PhHouse" :size="16" />
        {{ t('product.breadcrumbHome') }}
      </NuxtLink>
      <MIcon name="PhArrowLeft" :size="14" />
      <NuxtLink to="/product" class="product-breadcrumb__link">{{ t('product.breadcrumbProducts') }}</NuxtLink>
      <MIcon name="PhArrowLeft" :size="14" />
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
        <h1 class="product-hero-card__title title-md" :title="product.title" dir="auto">{{ product.title }}</h1>
        <div class="product-hero-card__image-wrap">
          <img
            :src="product.image"
            :alt="product.title"
            width="1064"
            height="310"
            class="product-hero-card__image"
            decoding="async"
          />
          <MBtn
            variant="icon"
            prepend-icon="PhMagnifyingGlassPlus"
            class="product-hero-card__zoom !rounded-[13px] !border-0 !bg-black/50 !text-white"
            :aria-label="t('product.zoom')"
            @click="imageOpen = true"
          />
        </div>
      </article>

      <article class="product-specs-card">
        <h2 class="product-specs-card__title title-lg">{{ t('product.technical') }}</h2>
        <MDataTable class="product-specs-list" :label="t('product.technical')" :rows="specs" />
      </article>

      <ProductImageDialog :open="imageOpen" :src="product.image" :alt="product.title" @close="imageOpen = false" />
    </template>
  </div>
</template>

<style scoped>
.product-detail-page {
  padding-block: 24px 0;
}

.product-breadcrumb {
  display: flex;
  min-height: 24px;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
  margin-bottom: 24px;
  color: #57728e;
  font-size: 13px;
  font-weight: 500;
  line-height: 24px;
}

.product-breadcrumb__link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: inherit;
}

.product-breadcrumb__link:hover,
.product-breadcrumb__link:focus-visible {
  color: #e20054;
}

.product-hero-card {
  overflow: hidden;
  padding: 16px 16px 24px;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 1px 2px rgb(0 0 0 / 6%);
}

.product-hero-card__title {
  height: 24px;
  margin: 0 0 32px;
  overflow: hidden;
  color: #0a2a51;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-hero-card__image-wrap {
  position: relative;
  height: 235px;
  overflow: hidden;
  border-radius: 16px;
  background: #e20054;
}

.product-hero-card__image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.product-hero-card__zoom {
  position: absolute;
  top: 8px;
  right: 8px;
}

.product-specs-card {
  margin-top: 24px;
  padding: 16px;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 1px 2px rgb(0 0 0 / 6%);
}

.product-specs-card__title {
  margin: 0;
  color: #0a2a51;
}

.product-specs-list {
  margin: 24px 0 0;
}

@media (min-width: 768px) {
  .product-detail-page {
    padding-top: 24px;
  }

  .product-hero-card {
    height: 414px;
    padding: 24px;
  }

  .product-hero-card__image-wrap {
    height: 310px;
  }

  .product-specs-card {
    padding: 24px;
  }
}
</style>
