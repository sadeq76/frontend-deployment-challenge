<script setup lang="ts">
defineProps<{ modelValue: string; label?: string; placeholder?: string; type?: string }>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <label class="grid gap-2"><span v-if="label" class="text-sm text-ink-muted">{{ label }}</span><input :value="modelValue" :type="type ?? 'text'" :placeholder="placeholder" class="control" @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"></label>
</template>
