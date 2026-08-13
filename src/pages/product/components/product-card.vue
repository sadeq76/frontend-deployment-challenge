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
    <h2 class="product-card__title title-sm" :title="props.product.title" dir="auto">{{ props.product.title }}</h2>
    <MBtn
      :href="`/product/${props.product.id}`"
      variant="secondary"
      append-icon="PhArrowLeft"
      :icon-size="16"
      :text="t('product.viewDetails')"
      class="product-card__action !text-primary !rounded-2xl"
    />
  </article>
</template>

<style scoped>
.product-card {
  display: flex;
  height: 286px;
  flex-direction: column;
  overflow: hidden;
  padding: 8px;
  border: 1px solid #e9edf5;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 10px 40px rgb(0 0 0 / 5%);
}

.product-card__image-link {
  display: block;
  height: 170px;
  flex: none;
  overflow: hidden;
  border-radius: 16px;
  background: rgb(var(--media-color));
}

.product-card__image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 180ms ease;
}

.product-card:hover .product-card__image,
.product-card:focus-within .product-card__image {
  transform: scale(1.025);
}

.product-card__title {
  height: 24px;
  margin: 12px 4px 0;
  overflow: hidden;
  color: #0a2a51;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-card__action {
  width: 100%;
  margin-top: auto;
}
</style>
