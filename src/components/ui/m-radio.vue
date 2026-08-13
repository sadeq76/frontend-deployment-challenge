<script setup lang="ts">
import { computed, inject, type StyleValue, useAttrs, useId } from 'vue'
import { radioGroupKey, type RadioValue } from './m-radio-group-context'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    /** The value selected by this radio. */
    value: RadioValue
    /** The selected value when MRadio is used outside an MRadioGroup. */
    modelValue?: RadioValue
    /** Visible label for the radio. A default slot can be used instead. */
    label?: string
    id?: string
    name?: string
    disabled?: boolean
    required?: boolean
  }>(),
  {
    modelValue: undefined,
    label: undefined,
    id: undefined,
    name: undefined,
    disabled: false,
    required: false
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: RadioValue]
  change: [event: Event]
}>()
const attrs = useAttrs()
const generatedId = useId()
const group = inject(radioGroupKey, null)

const radioId = computed(() => props.id ?? `m-radio-${generatedId}`)
const isChecked = computed(() => (group ? group.modelValue.value === props.value : props.modelValue === props.value))
const isDisabled = computed(() => props.disabled || group?.disabled.value === true)
const isRequired = computed(() => props.required || group?.required.value === true)
const radioName = computed(() => group?.name.value ?? props.name)
const wrapperAttrs = computed(() => ({ class: attrs.class, style: attrs.style as StyleValue }))
const inputAttrs = computed(() => {
  const { class: _class, style: _style, id: _id, ...nativeInputAttrs } = attrs

  return nativeInputAttrs
})

function select(event: Event) {
  if ((event.target as HTMLInputElement).checked) {
    if (group) {
      group.update(props.value)
    } else {
      emit('update:modelValue', props.value)
    }
  }

  emit('change', event)
}
</script>

<template>
  <label v-bind="wrapperAttrs" class="m-radio body-md" :class="{ 'm-radio--disabled': isDisabled }">
    <input
      v-bind="inputAttrs"
      :id="radioId"
      class="m-radio__input"
      type="radio"
      :name="radioName"
      :value="props.value"
      :checked="isChecked"
      :disabled="isDisabled"
      :required="isRequired"
      @change="select"
    />
    <span v-if="props.label || $slots.default" class="m-radio__label"
      ><slot>{{ props.label }}</slot></span
    >
  </label>
</template>

<style scoped>
.m-radio {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: rgb(var(--ink-color));
  cursor: pointer;
}

.m-radio--disabled {
  cursor: not-allowed;
  color: rgb(var(--ink-soft-color));
}

.m-radio__input {
  display: grid;
  inline-size: 1.125rem;
  block-size: 1.125rem;
  flex: none;
  margin: 0;
  appearance: none;
  place-content: center;
  border: 1px solid rgb(var(--line-color));
  border-radius: 999px;
  background: rgb(var(--surface-color));
  cursor: inherit;
}

.m-radio__input::before {
  inline-size: 0.5625rem;
  block-size: 0.5625rem;
  content: '';
  transform: scale(0);
  border-radius: inherit;
  background: rgb(var(--primary-color));
  transition: transform 150ms ease;
}

.m-radio__input:checked {
  border-color: rgb(var(--primary-color));
}

.m-radio__input:checked::before {
  transform: scale(1);
}

.m-radio__input:focus-visible {
  outline: 2px solid rgb(var(--primary-color));
  outline-offset: 2px;
}

.m-radio__input:disabled {
  border-color: rgb(var(--line-color));
  background: rgb(var(--surface-muted-color));
}

.m-radio__input:disabled::before {
  background: rgb(var(--ink-soft-color));
}
</style>
