<script setup lang="ts">
import { computed, ref, toRef } from 'vue'

const props = defineProps<{ open: boolean; src: string; alt: string }>()
const emit = defineEmits<{ close: [] }>()
const dialogPanel = ref<HTMLElement | null>(null)
const closeButton = ref<{ element: HTMLElement | null } | null>(null)
const closeButtonElement = computed(() => closeButton.value?.element ?? null)

function closeDialog() {
  emit('close')
}

const { onKeydown } = useOverlayAccessibility({
  open: toRef(props, 'open'),
  container: dialogPanel,
  initialFocus: closeButtonElement,
  onClose: closeDialog
})
</script>

<template>
  <Teleport to="body">
    <div v-if="props.open" class="fixed inset-0 z-50 grid place-items-center bg-ink/80 p-4" @click.self="closeDialog">
      <div
        ref="dialogPanel"
        tabindex="-1"
        role="dialog"
        aria-modal="true"
        :aria-label="$t('product.zoom')"
        class="relative max-h-full max-w-4xl rounded-card bg-surface p-4"
        @keydown="onKeydown"
      >
        <MBtn
          ref="closeButton"
          variant="icon"
          prepend-icon="PhXCircle"
          :icon-size="22"
          class="absolute left-3 top-3 z-10 !rounded-lg !border-0 !bg-surface !text-ink-muted shadow-card"
          :aria-label="$t('product.closeImage')"
          @click="closeDialog"
        />
        <img :src="props.src" :alt="props.alt" class="max-h-[80vh] max-w-full object-contain" />
      </div>
    </div>
  </Teleport>
</template>
