<script setup lang="ts">
import { computed, useAttrs, useId } from 'vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    modelValue: string
    id?: string
    label?: string
    placeholder?: string
    type?: string
  }>(),
  {
    id: undefined,
    label: undefined,
    placeholder: undefined,
    type: 'text'
  }
)
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const attrs = useAttrs()
const generatedId = useId()
const inputId = computed(() => props.id ?? `m-text-field-${generatedId}`)
const wrapperAttrs = computed(() => ({ class: attrs.class }))
const inputAttrs = computed(() => {
  const { class: _class, ...nativeInputAttrs } = attrs
  return nativeInputAttrs
})

function updateValue(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <div v-bind="wrapperAttrs" class="grid gap-2">
    <label v-if="props.label" :for="inputId" class="text-sm text-ink-muted">{{ props.label }}</label>
    <input
      v-bind="inputAttrs"
      :id="inputId"
      :value="props.modelValue"
      :type="props.type"
      :placeholder="props.placeholder"
      class="control"
      @input="updateValue"
    />
  </div>
</template>
