<script setup lang="ts">
withDefaults(defineProps<{ variant?: 'primary' | 'secondary'; type?: 'button' | 'submit' | 'reset' }>(), {
  variant: 'primary',
  type: 'button'
})
</script>

<template>
  <button :type="type" :class="variant === 'primary' ? 'brand-button' : 'secondary-button'"><slot /></button>
</template>
