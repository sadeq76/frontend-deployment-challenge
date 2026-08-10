<script setup lang="ts">
const props = defineProps<{ open: boolean; src: string; alt: string }>()
const emit = defineEmits<{ close: [] }>()
const closeButton = ref<HTMLButtonElement>()

watch(() => props.open, async (open: boolean) => {
  document.body.style.overflow = open ? 'hidden' : ''
  if (open) { await nextTick(); closeButton.value?.focus() }
})
onBeforeUnmount(() => { document.body.style.overflow = '' })
</script>

<template>
  <Teleport to="body"><div v-if="props.open" class="fixed inset-0 z-50 grid place-items-center bg-ink/80 p-4" role="dialog" aria-modal="true" :aria-label="$t('product.zoom')" @click.self="emit('close')" @keydown.esc="emit('close')"><div class="relative max-h-full max-w-4xl rounded-card bg-white p-4"><button ref="closeButton" type="button" class="absolute left-3 top-3 z-10 grid size-10 place-items-center rounded-lg bg-white text-xl shadow-card" :aria-label="$t('product.closeImage')" @click="emit('close')">×</button><img :src="props.src" :alt="props.alt" class="max-h-[80vh] max-w-full object-contain"></div></div></Teleport>
</template>
