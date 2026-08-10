<script setup lang="ts">
import type { Product } from '~/types/product'

const props = defineProps<{ product: Product }>()
const { t } = useI18n()
</script>

<template>
  <article class="product-card">
    <NuxtLink :to="`/product/${props.product.id}`" class="product-card__image-link" :aria-label="props.product.title">
      <img
        :src="props.product.image"
        :alt="props.product.title"
        width="263"
        height="170"
        class="product-card__image"
        loading="lazy"
        decoding="async"
      />
    </NuxtLink>
    <h2 class="product-card__title" :title="props.product.title" dir="auto">{{ props.product.title }}</h2>
    <NuxtLink :to="`/product/${props.product.id}`" class="product-card__action">
      {{ t('product.viewDetails') }}
      <MIcon name="ArrowLeft" :size="16" />
    </NuxtLink>
  </article>
</template>
