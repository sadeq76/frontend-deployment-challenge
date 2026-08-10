<script setup lang="ts">
import { computed, ref, useAttrs, useId } from 'vue'
import MIcon from './m-icon.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    /** Compact heading displayed in the disclosure trigger. */
    title?: string
    /** Plain-text fallback for the expanded body. */
    body?: string
    /** Controlled expanded state. */
    modelValue?: boolean
    /** Initial state when the disclosure is uncontrolled. */
    defaultExpanded?: boolean
    /** Stable root ID; the disclosure content is derived from it. */
    id?: string
    /** Accessible fallback used when the title is provided by a slot. */
    toggleLabel?: string
  }>(),
  {
    title: '',
    body: '',
    modelValue: undefined,
    defaultExpanded: false,
    id: undefined,
    toggleLabel: 'Toggle details'
  }
)

const emit = defineEmits<{
  'update:modelValue': [expanded: boolean]
  toggle: [expanded: boolean]
}>()

const attrs = useAttrs()
const generatedId = useId()
const rootId = computed(() => props.id ?? `m-expandable-card-${generatedId}`)
const triggerId = computed(() => `${rootId.value}-trigger`)
const contentId = computed(() => `${rootId.value}-content`)
const direction = computed(() => (typeof attrs.dir === 'string' ? attrs.dir : undefined))
const rootAttrs = computed(() => {
  const { dir: _dir, ...nativeAttrs } = attrs
  return nativeAttrs
})
const localExpanded = ref(props.defaultExpanded)
const isExpanded = computed(() => props.modelValue ?? localExpanded.value)

function toggle() {
  const nextValue = !isExpanded.value

  if (props.modelValue === undefined) localExpanded.value = nextValue

  emit('update:modelValue', nextValue)
  emit('toggle', nextValue)
}
</script>

<template>
  <section v-bind="rootAttrs" :id="rootId" :dir="direction" class="m-expandable-card">
    <h3 class="m-expandable-card__heading">
      <button
        :id="triggerId"
        type="button"
        class="m-expandable-card__trigger"
        :aria-controls="contentId"
        :aria-expanded="isExpanded"
        :aria-label="props.title || props.toggleLabel"
        @click="toggle"
      >
        <span class="m-expandable-card__title label-md">
          <slot name="header" :expanded="isExpanded">{{ props.title }}</slot>
        </span>
        <MIcon
          name="PhCaretDown"
          :size="20"
          weight="bold"
          class="m-expandable-card__indicator"
          :class="{ 'm-expandable-card__indicator--expanded': isExpanded }"
          aria-hidden="true"
        />
      </button>
    </h3>

    <div
      v-show="isExpanded"
      :id="contentId"
      class="m-expandable-card__body body-md"
      role="region"
      :aria-labelledby="triggerId"
    >
      <slot name="body" :expanded="isExpanded">{{ props.body }}</slot>
    </div>
  </section>
</template>

<style scoped>
.m-expandable-card {
  width: 100%;
  min-inline-size: 0;
  overflow: hidden;
  border-radius: 24px;
  background: rgb(var(--color-surface));
  color: rgb(var(--color-ink-muted));
}

.m-expandable-card__heading {
  margin: 0;
}

.m-expandable-card__trigger {
  display: flex;
  width: 100%;
  min-block-size: 48px;
  align-items: center;
  gap: 12px;
  border: 0;
  background: transparent;
  padding-block: 12px;
  padding-inline: 20px;
  color: inherit;
  font: inherit;
  text-align: start;
  transition: background-color 160ms ease;
}

.m-expandable-card__trigger:hover {
  background: rgb(var(--color-primary-soft) / 35%);
}

.m-expandable-card__trigger:focus-visible {
  outline: 2px solid rgb(var(--color-primary));
  outline-offset: -2px;
}

.m-expandable-card__title {
  min-inline-size: 0;
  overflow: hidden;
  color: rgb(var(--color-ink-muted));
  text-align: start;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.m-expandable-card__indicator {
  flex: none;
  margin-inline-start: auto;
  color: rgb(var(--color-ink-muted));
  transition: transform 160ms ease;
}

.m-expandable-card__indicator--expanded {
  transform: rotate(180deg);
}

.m-expandable-card__body {
  display: grid;
  gap: 16px;
  padding-block: 0 20px;
  padding-inline: 20px;
  color: rgb(var(--color-ink-muted));
  text-align: start;
  white-space: pre-line;
}

@media (prefers-reduced-motion: reduce) {
  .m-expandable-card__trigger,
  .m-expandable-card__indicator {
    transition: none;
  }
}
</style>
