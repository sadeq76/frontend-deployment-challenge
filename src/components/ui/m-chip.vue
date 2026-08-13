<script setup lang="ts">
import { computed } from 'vue'
import MIcon from './m-icon.vue'

const props = withDefaults(
  defineProps<{
    text: string
    /** Name of the optional leading MIcon. */
    icon?: string
    /** Shows a close control and emits close when activated. */
    closable?: boolean
    /** Alias for closable, retained for concise template usage. */
    close?: boolean
  }>(),
  {
    icon: undefined,
    closable: false,
    close: false
  }
)

const emit = defineEmits<{ close: [] }>()
const isClosable = computed(() => props.closable || props.close)
</script>

<template>
  <span class="m-chip body-xs">
    <MIcon v-if="props.icon" class="m-chip__icon" :name="props.icon" :size="16" aria-hidden="true" />
    <span class="m-chip__text">{{ props.text }}</span>
    <button
      v-if="isClosable"
      class="m-chip__close"
      type="button"
      :aria-label="`Remove ${props.text}`"
      @click="emit('close')"
    >
      <MIcon name="PhX" :size="14" aria-hidden="true" />
    </button>
  </span>
</template>

<style scoped>
.m-chip {
  display: inline-flex;
  min-block-size: 2rem;
  max-inline-size: 100%;
  align-items: center;
  gap: 0.25rem;
  padding-inline: 0.5rem;
  border-radius: 1rem;
  background: #fce5ee;
  color: rgb(var(--primary-ink-color));
  font-weight: 500;
}

.m-chip__icon,
.m-chip__close {
  flex: none;
}

.m-chip__text {
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.m-chip__close {
  display: grid;
  inline-size: 1.25rem;
  block-size: 1.25rem;
  margin-inline-end: -0.25rem;
  padding: 0;
  border: 0;
  border-radius: 999px;
  place-items: center;
  background: transparent;
  color: currentColor;
  cursor: pointer;
}

.m-chip__close:hover {
  background: rgb(var(--primary-color) / 12%);
}

.m-chip__close:focus-visible {
  outline: 2px solid rgb(var(--primary-color));
  outline-offset: 1px;
}
</style>
