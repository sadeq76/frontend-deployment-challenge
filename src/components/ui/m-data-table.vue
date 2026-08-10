<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ inheritAttrs: false })

type DataRow = {
  key: string
  label?: string
  value: unknown
  multiline?: boolean
}

const props = withDefaults(
  defineProps<{
    rows?: readonly DataRow[]
    data?: Record<string, unknown>
    label?: string
    labelWidth?: string
    emptyText?: string
  }>(),
  {
    rows: undefined,
    data: undefined,
    label: 'Details',
    labelWidth: '10.75rem',
    emptyText: 'No data available'
  }
)

const resolvedRows = computed<DataRow[]>(() => {
  if (props.rows) return [...props.rows]

  return Object.entries(props.data ?? {}).map(([key, value]) => ({ key, value }))
})

function displayLabel(row: DataRow) {
  return row.label ?? row.key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[-_]/g, ' ')
}

function displayValue(value: unknown) {
  if (value === null || value === undefined || value === '') return '—'
  if (Array.isArray(value)) return value.join(', ')
  if (typeof value === 'object') return JSON.stringify(value)

  return String(value)
}
</script>

<template>
  <dl
    v-bind="$attrs"
    class="m-data-table"
    :style="{ '--m-data-table-label-width': props.labelWidth }"
    :aria-label="props.label"
  >
    <div
      v-for="row in resolvedRows"
      :key="row.key"
      class="m-data-table__row"
      :class="{ 'm-data-table__row--multiline': row.multiline }"
    >
      <dt class="m-data-table__key label-md">
        <slot name="key" :row="row" :label="displayLabel(row)">{{ displayLabel(row) }}</slot>
      </dt>
      <dd class="m-data-table__value body-md" dir="auto">
        <slot name="value" :row="row" :value="row.value">{{ displayValue(row.value) }}</slot>
      </dd>
    </div>

    <div v-if="!resolvedRows.length" class="m-data-table__empty body-md">{{ props.emptyText }}</div>
  </dl>
</template>

<style scoped>
.m-data-table {
  display: grid;
  gap: 12px;
  margin: 0;
}

.m-data-table__row {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 4px;
}

.m-data-table__key,
.m-data-table__value,
.m-data-table__empty {
  display: flex;
  min-height: 48px;
  align-items: center;
  margin: 0;
  padding: 12px 16px;
  border-radius: 16px;
  background: rgb(var(--color-surface-muted));
  text-align: start;
}

.m-data-table__key {
  color: rgb(var(--color-ink-muted));
}

.m-data-table__value {
  align-items: flex-start;
  color: rgb(var(--color-ink));
  font-weight: 700;
  white-space: pre-line;
}

.m-data-table__row--multiline .m-data-table__key,
.m-data-table__row--multiline .m-data-table__value {
  min-height: 146px;
}

.m-data-table__empty {
  justify-content: center;
  color: rgb(var(--color-ink-muted));
}

@media (min-width: 480px) {
  .m-data-table__row {
    grid-template-columns: minmax(7rem, var(--m-data-table-label-width)) minmax(0, 1fr);
    gap: 12px;
  }
}
</style>
