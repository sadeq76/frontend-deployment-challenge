<script setup lang="ts">
import type { Product } from '~/types/product'

const props = defineProps<{ product: Product }>()
const { t } = useI18n()
</script>

<template>
  <article class="product-card">
    <NuxtLink
      :to="`/product/${props.product.id}`"
      class="product-card__image-link"
      :aria-label="t('product.designTitle')"
    >
      <img
        src="/images/figma/product-door.png"
        :alt="t('product.designTitle')"
        width="990"
        height="660"
        class="product-card__image"
        loading="lazy"
      />
    </NuxtLink>
    <h2 class="product-card__title">{{ t('product.designTitle') }}</h2>
    <NuxtLink :to="`/product/${props.product.id}`" class="product-card__action">
      {{ t('product.viewDetails') }}
      <MIcon name="ArrowLeft" :size="16" />
    </NuxtLink>
  </article>
</template>
