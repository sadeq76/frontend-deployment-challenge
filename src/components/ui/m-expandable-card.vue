<script setup lang="ts">
import { computed, ref, useAttrs, useId } from 'vue'
import MIcon from './m-icon.vue'

defineOptions({
  inheritAttrs: false
})

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

const localExpanded = ref(props.defaultExpanded)

const rootId = computed(() => props.id ?? `m-expandable-card-${generatedId}`)

const triggerId = computed(() => `${rootId.value}-trigger`)

const contentId = computed(() => `${rootId.value}-content`)

const direction = computed(() => (typeof attrs.dir === 'string' ? attrs.dir : undefined))

const rootAttrs = computed(() => {
  const { dir: _dir, ...nativeAttrs } = attrs

  return nativeAttrs
})

const isControlled = computed(() => props.modelValue !== undefined)

const isExpanded = computed(() => (isControlled.value ? props.modelValue! : localExpanded.value))

function toggle() {
  const nextExpanded = !isExpanded.value

  if (!isControlled.value) localExpanded.value = nextExpanded

  emit('update:modelValue', nextExpanded)
  emit('toggle', nextExpanded)
}
</script>

<template>
  <section :id="rootId" :dir="direction" v-bind="rootAttrs" class="m-expandable-card">
    <h3 class="m-expandable-card__heading">
      <button
        :id="triggerId"
        :aria-controls="contentId"
        :aria-expanded="isExpanded"
        :aria-label="props.title || props.toggleLabel"
        type="button"
        class="m-expandable-card__trigger"
        @click="toggle"
      >
        <span class="m-expandable-card__title label-md">
          <slot :expanded="isExpanded" name="header">
            {{ props.title }}
          </slot>
        </span>

        <MIcon
          :size="20"
          :class="{ 'm-expandable-card__indicator--expanded': isExpanded }"
          name="PhCaretDown"
          weight="bold"
          class="m-expandable-card__indicator"
          aria-hidden="true"
        />
      </button>
    </h3>

    <div
      :id="contentId"
      :aria-labelledby="triggerId"
      :class="{ 'm-expandable-card__body--expanded': isExpanded }"
      class="m-expandable-card__body body-md"
      role="region"
    >
      <div class="m-expandable-card__body-inner">
        <div class="m-expandable-card__body-content">
          <slot :expanded="isExpanded" name="body">
            {{ props.body }}
          </slot>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.m-expandable-card {
  width: 100%;
  min-inline-size: 0;
  overflow: hidden;
  border-radius: 24px;
  background: var(--color-surface);
  color: var(--color-ink-muted);
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
  cursor: pointer;
  transition: background-color 160ms ease;
}

.m-expandable-card__trigger:hover {
  background: rgb(var(--primary-soft-color) / 35%);
}

.m-expandable-card__trigger:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: -2px;
}

.m-expandable-card__title {
  min-inline-size: 0;
  overflow: hidden;
  color: var(--color-ink-muted);
  text-align: start;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.m-expandable-card__indicator {
  flex: none;
  margin-inline-start: auto;
  color: var(--color-ink-muted);
  transition: transform 200ms cubic-bezier(0.2, 0, 0, 1);
}

.m-expandable-card__indicator--expanded {
  transform: rotate(180deg);
}

.m-expandable-card__body {
  display: grid;
  grid-template-rows: 0fr;
  visibility: hidden;
  opacity: 0;
  pointer-events: none;
  color: var(--color-ink-muted);
  text-align: start;
  white-space: pre-line;

  transition:
    grid-template-rows 240ms cubic-bezier(0.2, 0, 0, 1),
    opacity 180ms ease,
    visibility 0s linear 240ms;
}

.m-expandable-card__body--expanded {
  grid-template-rows: 1fr;
  visibility: visible;
  opacity: 1;
  pointer-events: auto;

  transition:
    grid-template-rows 240ms cubic-bezier(0.2, 0, 0, 1),
    opacity 180ms ease,
    visibility 0s;
}

.m-expandable-card__body-inner {
  min-block-size: 0;
  overflow: hidden;
}

.m-expandable-card__body-content {
  display: grid;
  gap: 16px;
  padding-block: 0 20px;
  padding-inline: 20px;
}

@media (prefers-reduced-motion: reduce) {
  .m-expandable-card__trigger,
  .m-expandable-card__indicator,
  .m-expandable-card__body {
    transition: none;
  }
}
</style>
