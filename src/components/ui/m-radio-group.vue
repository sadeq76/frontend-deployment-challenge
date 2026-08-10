<script setup lang="ts">
import { computed, provide, type StyleValue, useAttrs, useId } from 'vue'
import { radioGroupKey, type RadioValue } from './m-radio-group-context'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    /** The selected radio value. */
    modelValue?: RadioValue
    /** Visible legend for the radio group. */
    label?: string
    /** Native radio name shared by every child MRadio. */
    name?: string
    /** Disables every child MRadio. */
    disabled?: boolean
    /** Marks every child MRadio as required. */
    required?: boolean
  }>(),
  {
    modelValue: undefined,
    label: undefined,
    name: undefined,
    disabled: false,
    required: false
  }
)

const emit = defineEmits<{ 'update:modelValue': [value: RadioValue] }>()
const attrs = useAttrs()
const generatedId = useId()
const generatedName = `m-radio-group-${generatedId}`

const groupAttrs = computed(() => {
  const { class: className, style, ...nativeFieldsetAttrs } = attrs

  return { ...nativeFieldsetAttrs, class: className, style: style as StyleValue }
})
const groupName = computed(() => props.name ?? generatedName)

provide(radioGroupKey, {
  disabled: computed(() => props.disabled),
  modelValue: computed(() => props.modelValue),
  name: groupName,
  required: computed(() => props.required),
  update: (value) => emit('update:modelValue', value)
})
</script>

<template>
  <fieldset v-bind="groupAttrs" class="m-radio-group" :disabled="props.disabled">
    <legend v-if="props.label || $slots.label" class="m-radio-group__label label-md">
      <slot name="label">{{ props.label }}</slot>
    </legend>
    <div class="m-radio-group__options">
      <slot />
    </div>
  </fieldset>
</template>

<style scoped>
.m-radio-group {
  min-inline-size: 0;
  margin: 0;
  padding: 0;
  border: 0;
}

.m-radio-group__label {
  margin-block-end: 8px;
  padding: 0;
  color: rgb(var(--color-ink));
  font-weight: 600;
}

.m-radio-group__options {
  display: grid;
  gap: 0.75rem;
}
</style>
