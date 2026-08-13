<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'

const props = withDefaults(
  defineProps<{
    text: string
    color?: string
  }>(),
  {
    color: undefined
  }
)

const badgeStyle = computed<CSSProperties>(() => {
  if (!props.color) return {}

  return { '--m-badge-background': props.color }
})
</script>

<template>
  <span class="m-badge body-xs" :style="badgeStyle">{{ props.text }}</span>
</template>

<style scoped>
.m-badge {
  display: inline-flex;
  min-block-size: 1.5rem;
  align-items: center;
  justify-content: center;
  padding-inline: 0.5rem;
  border-radius: 0.375rem;
  background: var(--m-badge-background, var(--color-badge));
  color: #fff;
  font-weight: 600;
  white-space: nowrap;
}
</style>
