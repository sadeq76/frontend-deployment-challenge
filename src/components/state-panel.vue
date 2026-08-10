<script setup lang="ts">
defineProps<{ title: string; body: string; action?: string }>()
defineEmits<{ action: [] }>()
</script>

<template>
  <section class="surface-card mx-auto max-w-xl p-8 text-center" role="status">
    <h2 class="text-xl font-bold text-ink">{{ title }}</h2>
    <p class="mt-3 text-sm leading-7 text-ink-muted">{{ body }}</p>
    <MBtn v-if="action" class="mt-6" :text="action" @click="$emit('action')" />
  </section>
</template>
