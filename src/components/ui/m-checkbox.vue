<script setup lang="ts">
import { computed, type StyleValue, useAttrs, useId } from 'vue'

type CheckboxValue = string | number
type CheckboxModel = boolean | CheckboxValue[]

defineOptions({
  inheritAttrs: false
})

const props = withDefaults(
  defineProps<{
    /** Boolean state or an array of selected values. */
    modelValue: CheckboxModel
    /** Value used when modelValue is an array. */
    value?: CheckboxValue
    /** Visible label for the checkbox. A default slot can be used instead. */
    label?: string
    /** Stable input ID. */
    id?: string
    disabled?: boolean
    required?: boolean
    indeterminate?: boolean
  }>(),
  {
    value: 'on',
    label: undefined,
    id: undefined,
    disabled: false,
    required: false,
    indeterminate: false
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: CheckboxModel]
  change: [event: Event]
}>()

const attrs = useAttrs()
const generatedId = useId()

const checkboxId = computed(() => props.id ?? `m-checkbox-${generatedId}`)

const isChecked = computed(() => {
  if (Array.isArray(props.modelValue)) return props.modelValue.includes(props.value)

  return props.modelValue
})

const wrapperAttrs = computed(() => ({
  class: attrs.class,
  style: attrs.style as StyleValue
}))

const inputAttrs = computed(() => {
  const { class: _class, style: _style, id: _id, ...nativeInputAttrs } = attrs

  return nativeInputAttrs
})

function updateValue(event: Event) {
  const input = event.target as HTMLInputElement

  if (Array.isArray(props.modelValue)) {
    const nextValue = input.checked
      ? [...new Set([...props.modelValue, props.value])]
      : props.modelValue.filter((value) => value !== props.value)

    emit('update:modelValue', nextValue)
  } else {
    emit('update:modelValue', input.checked)
  }

  emit('change', event)
}
</script>

<template>
  <label :class="{ 'm-checkbox--disabled': props.disabled }" v-bind="wrapperAttrs" class="m-checkbox body-md">
    <input
      :id="checkboxId"
      :value="props.value"
      :checked="isChecked"
      :disabled="props.disabled"
      :required="props.required"
      :indeterminate="props.indeterminate"
      v-bind="inputAttrs"
      type="checkbox"
      class="m-checkbox__input"
      @change="updateValue"
    />

    <span v-if="props.label || $slots.default" class="m-checkbox__label">
      <slot>
        {{ props.label }}
      </slot>
    </span>
  </label>
</template>

<style scoped>
.m-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-ink);
  cursor: pointer;
}

.m-checkbox--disabled {
  color: var(--color-ink-soft);
  cursor: not-allowed;
}

.m-checkbox__input {
  display: grid;
  inline-size: 1.25rem;
  block-size: 1.25rem;
  flex: none;
  margin: 0;
  appearance: none;
  place-content: center;
  border: 1px solid var(--color-line);
  border-radius: 0.375rem;
  background: var(--color-surface);
  cursor: inherit;
  transition:
    background-color 150ms ease,
    border-color 150ms ease;
}

.m-checkbox__input::before {
  inline-size: 0.375rem;
  block-size: 0.625rem;
  content: '';
  transform: translateY(-0.0625rem) rotate(45deg) scale(0);
  transform-origin: center;
  border-right: 2px solid #fff;
  border-bottom: 2px solid #fff;
  transition: transform 150ms ease;
}

.m-checkbox__input:checked,
.m-checkbox__input:indeterminate {
  border-color: var(--color-primary);
  background: var(--color-primary);
}

.m-checkbox__input:checked::before {
  transform: translateY(-0.0625rem) rotate(45deg) scale(1);
}

.m-checkbox__input:indeterminate::before {
  inline-size: 0.625rem;
  block-size: 2px;
  transform: scale(1);
  border: 0;
  background: #fff;
}

.m-checkbox__input:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.m-checkbox__input:disabled {
  border-color: var(--color-line);
  background: var(--color-surface-muted);
}

.m-checkbox__input:disabled::before {
  border-color: var(--color-ink-soft);
  background: var(--color-ink-soft);
}

@media (prefers-reduced-motion: reduce) {
  .m-checkbox__input,
  .m-checkbox__input::before {
    transition: none;
  }
}
</style>
