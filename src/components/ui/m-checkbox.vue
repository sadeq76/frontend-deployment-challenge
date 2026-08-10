<script setup lang="ts">
import { computed, type StyleValue, useAttrs, useId } from 'vue'

type CheckboxValue = string | number
type CheckboxModel = boolean | CheckboxValue[]

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    /** Boolean state or an array of selected values. */
    modelValue: CheckboxModel
    /** Value used when modelValue is an array. */
    value?: CheckboxValue
    /** Visible label for the checkbox. A default slot can be used instead. */
    label?: string
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
const isChecked = computed(() =>
  Array.isArray(props.modelValue) ? props.modelValue.includes(props.value) : props.modelValue
)
const wrapperAttrs = computed(() => ({ class: attrs.class, style: attrs.style as StyleValue }))
const inputAttrs = computed(() => {
  const { class: _class, style: _style, id: _id, ...nativeInputAttrs } = attrs

  return nativeInputAttrs
})

function updateValue(event: Event) {
  const checked = (event.target as HTMLInputElement).checked

  if (Array.isArray(props.modelValue)) {
    const values = checked
      ? [...new Set([...props.modelValue, props.value])]
      : props.modelValue.filter((value) => value !== props.value)

    emit('update:modelValue', values)
  } else {
    emit('update:modelValue', checked)
  }

  emit('change', event)
}
</script>

<template>
  <label v-bind="wrapperAttrs" class="m-checkbox body-md" :class="{ 'm-checkbox--disabled': props.disabled }">
    <input
      v-bind="inputAttrs"
      :id="checkboxId"
      class="m-checkbox__input"
      type="checkbox"
      :value="props.value"
      :checked="isChecked"
      :disabled="props.disabled"
      :required="props.required"
      :indeterminate="props.indeterminate"
      @change="updateValue"
    />
    <span v-if="props.label || $slots.default" class="m-checkbox__label"
      ><slot>{{ props.label }}</slot></span
    >
  </label>
</template>

<style scoped>
.m-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: rgb(var(--color-ink));
  cursor: pointer;
}

.m-checkbox--disabled {
  cursor: not-allowed;
  color: rgb(var(--color-ink-soft));
}

.m-checkbox__input {
  display: grid;
  inline-size: 1.25rem;
  block-size: 1.25rem;
  flex: none;
  margin: 0;
  appearance: none;
  place-content: center;
  border: 1px solid rgb(var(--color-line));
  border-radius: 0.375rem;
  background: rgb(var(--color-surface));
  cursor: inherit;
}

.m-checkbox__input::before {
  inline-size: 0.625rem;
  block-size: 0.375rem;
  content: '';
  transform: translateY(-0.0625rem) rotate(-45deg) scale(0);
  border-block-end: 2px solid #fff;
  border-inline-start: 2px solid #fff;
  transition: transform 150ms ease;
}

.m-checkbox__input:checked,
.m-checkbox__input:indeterminate {
  border-color: rgb(var(--color-primary));
  background: rgb(var(--color-primary));
}

.m-checkbox__input:checked::before {
  transform: translateY(-0.0625rem) rotate(-45deg) scale(1);
}

.m-checkbox__input:indeterminate::before {
  inline-size: 0.5625rem;
  block-size: 2px;
  transform: scale(1);
  border: 0;
  background: #fff;
}

.m-checkbox__input:focus-visible {
  outline: 2px solid rgb(var(--color-primary));
  outline-offset: 2px;
}

.m-checkbox__input:disabled {
  border-color: rgb(var(--color-line));
  background: rgb(var(--color-surface-muted));
}

.m-checkbox__input:disabled::before {
  border-color: rgb(var(--color-ink-soft));
  background: rgb(var(--color-ink-soft));
}
</style>
