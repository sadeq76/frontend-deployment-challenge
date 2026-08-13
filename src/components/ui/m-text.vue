<script setup lang="ts">
import { computed, nextTick, ref, useAttrs, useId, type StyleValue } from 'vue'
import MIcon from './m-icon.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    modelValue?: string | number | null
    id?: string
    label?: string
    placeholder?: string
    type?: string
    /** Phosphor icon name shown at the logical start edge. */
    prependIcon?: string
    /** Phosphor icon name shown at the logical end edge. */
    appendIcon?: string
    /** Shows a clear control at the logical end edge. */
    clearable?: boolean
    /** Accessible label for the clear control. */
    clearLabel?: string
    disabled?: boolean
    readonly?: boolean
  }>(),
  {
    modelValue: '',
    id: undefined,
    label: undefined,
    placeholder: undefined,
    type: 'text',
    prependIcon: undefined,
    appendIcon: undefined,
    clearable: false,
    clearLabel: 'Clear input',
    disabled: false,
    readonly: false
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  clear: []
}>()

const attrs = useAttrs()
const input = ref<HTMLInputElement | null>(null)
const generatedId = useId()
const inputId = computed(() => props.id ?? `m-text-${generatedId}`)
const inputValue = computed(() => (props.modelValue == null ? '' : String(props.modelValue)))
const hasValue = computed(() => inputValue.value.length > 0)
const hasTrailingContent = computed(() => Boolean(props.appendIcon) || props.clearable)
const clearDisabled = computed(() => !hasValue.value || props.disabled || props.readonly)
const direction = computed(() => (typeof attrs.dir === 'string' ? attrs.dir : undefined))
const wrapperAttrs = computed(() => ({ class: attrs.class, style: attrs.style as StyleValue }))
const inputAttrs = computed(() => {
  const { class: _class, style: _style, ...nativeInputAttrs } = attrs
  return nativeInputAttrs
})

function updateValue(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}

async function clearValue() {
  if (clearDisabled.value) return

  emit('update:modelValue', '')
  emit('clear')
  await nextTick()
  input.value?.focus()
}
</script>

<template>
  <div v-bind="wrapperAttrs" class="m-text">
    <label v-if="props.label" :for="inputId" class="m-text__label label-md">{{ props.label }}</label>
    <div
      class="m-text__control"
      :class="{ 'm-text__control--disabled': props.disabled, 'm-text__control--readonly': props.readonly }"
      :dir="direction"
    >
      <template v-if="props.prependIcon">
        <span class="m-text__adornment">
          <MIcon :name="props.prependIcon" :size="20" aria-hidden="true" />
        </span>
        <span class="m-text__divider" aria-hidden="true" />
      </template>

      <input
        v-bind="inputAttrs"
        :id="inputId"
        ref="input"
        :value="inputValue"
        :type="props.type"
        :placeholder="props.placeholder"
        :disabled="props.disabled"
        :readonly="props.readonly"
        class="m-text__input body-sm"
        @input="updateValue"
      />

      <template v-if="hasTrailingContent">
        <span class="m-text__divider" aria-hidden="true" />
        <span class="m-text__trailing">
          <MIcon v-if="props.appendIcon" :name="props.appendIcon" :size="20" aria-hidden="true" />
          <button
            v-if="props.clearable"
            type="button"
            class="m-text__clear"
            :disabled="clearDisabled"
            :aria-label="props.clearLabel"
            @mousedown.prevent
            @click="clearValue"
          >
            <MIcon name="PhXCircle" :size="18" aria-hidden="true" />
          </button>
        </span>
      </template>
    </div>
  </div>
</template>

<style scoped>
.m-text {
  display: grid;
  min-width: 0;
  gap: 8px;
}

.m-text__label {
  color: rgb(var(--ink-muted-color));
  text-align: start;
}

.m-text__control {
  display: flex;
  min-height: 44px;
  align-items: stretch;
  overflow: hidden;
  border: 1px solid rgb(var(--line-color));
  border-radius: 12px;
  background: rgb(var(--surface-color));
  color: rgb(var(--ink-color));
  transition:
    border-color 180ms ease,
    box-shadow 180ms ease;
}

.m-text__control:focus-within {
  border-color: rgb(var(--primary-color));
  box-shadow: 0 0 0 3px rgb(var(--primary-color) / 12%);
}

.m-text__control--disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.m-text__control--readonly {
  background: rgb(var(--surface-muted-color));
}

.m-text__input {
  width: 100%;
  min-width: 0;
  flex: 1 1 auto;
  border: 0;
  outline: 0;
  background: transparent;
  padding: 0 12px;
  color: inherit;
  text-align: start;
}

.m-text__input::placeholder {
  color: rgb(var(--ink-soft-color));
  opacity: 1;
}

.m-text__input:disabled {
  cursor: not-allowed;
}

.m-text__adornment,
.m-text__trailing {
  display: inline-flex;
  flex: none;
  align-items: center;
  color: rgb(var(--ink-muted-color));
}

.m-text__adornment {
  padding-inline: 12px;
}

.m-text__trailing {
  gap: 4px;
  padding-inline: 8px;
}

.m-text__divider {
  width: 1px;
  flex: none;
  margin-block: 8px;
  background: rgb(var(--line-color));
}

.m-text__clear {
  display: inline-grid;
  width: 28px;
  height: 28px;
  place-items: center;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: rgb(var(--ink-muted-color));
  transition:
    background-color 180ms ease,
    color 180ms ease;
}

.m-text__clear:hover:not(:disabled) {
  background: rgb(var(--primary-soft-color));
  color: rgb(var(--primary-color));
}

.m-text__clear:disabled {
  cursor: default;
  opacity: 0.5;
}
</style>
