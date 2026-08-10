<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, useId, type StyleValue } from 'vue'
import MIcon from './m-icon.vue'

type MSelectValue = string | number
type MSelectModelValue = MSelectValue | MSelectValue[] | null

interface MSelectOption {
  value: MSelectValue
  label: string
  disabled?: boolean
}

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    /** The selected value, or selected values when multiple is true. */
    modelValue?: MSelectModelValue
    /** Options displayed in the popover listbox. */
    options: readonly MSelectOption[]
    /** Makes the listbox toggle more than one option. */
    multiple?: boolean
    /** Renders the listbox in the document flow instead of a popover. */
    inline?: boolean
    /** Visible label for the select. */
    label?: string
    /** Shown when no option is selected. */
    placeholder?: string
    id?: string
    name?: string
    disabled?: boolean
    required?: boolean
    /** Exposes a control that resets the current selection. */
    clearable?: boolean
    /** Accessible label for the clear control. */
    clearLabel?: string
    /** Text shown when the list contains no options. */
    emptyText?: string
  }>(),
  {
    modelValue: null,
    multiple: false,
    inline: false,
    label: undefined,
    placeholder: 'Select an option',
    id: undefined,
    name: undefined,
    disabled: false,
    required: false,
    clearable: false,
    clearLabel: 'Clear selection',
    emptyText: 'No options available'
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: MSelectModelValue]
  change: [value: MSelectModelValue]
  clear: []
}>()

const attrs = useAttrs()
const root = ref<HTMLElement | null>(null)
const trigger = ref<HTMLButtonElement | null>(null)
const optionElements = ref<HTMLButtonElement[]>([])
const generatedId = useId()
const selectId = computed(() => props.id ?? `m-select-${generatedId}`)
const labelId = computed(() => `${selectId.value}-label`)
const listboxId = computed(() => `${selectId.value}-listbox`)
const isOpen = ref(false)
const activeIndex = ref(-1)

const selectedValues = computed<MSelectValue[]>(() => {
  if (props.multiple) return Array.isArray(props.modelValue) ? props.modelValue : []

  return props.modelValue === null || Array.isArray(props.modelValue) ? [] : [props.modelValue]
})
const selectedOptions = computed(() => props.options.filter((option) => isSelected(option.value)))
const selectionText = computed(() => selectedOptions.value.map((option) => option.label).join(', '))
const hasSelection = computed(() => selectedValues.value.length > 0)
const direction = computed(() => (typeof attrs.dir === 'string' ? attrs.dir : undefined))
const wrapperAttrs = computed(() => ({ class: attrs.class, style: attrs.style as StyleValue }))
const triggerAttrs = computed(() => {
  const { class: _class, style: _style, form: _form, id: _id, name: _name, dir: _dir, ...nativeTriggerAttrs } = attrs

  return nativeTriggerAttrs
})
const nativeSelectAttrs = computed(() => {
  const { class: _class, style: _style, id: _id, name: _name, dir: _dir, ...nativeSelectAttrs } = attrs

  return nativeSelectAttrs
})
const providedAriaLabel = computed(() => (typeof attrs['aria-label'] === 'string' ? attrs['aria-label'] : undefined))
const providedAriaLabelledby = computed(() =>
  typeof attrs['aria-labelledby'] === 'string' ? attrs['aria-labelledby'] : undefined
)
const triggerAriaLabel = computed(() => {
  if (providedAriaLabel.value) return providedAriaLabel.value
  if (providedAriaLabelledby.value || props.label) return undefined

  return props.placeholder
})
const triggerAriaLabelledby = computed(() => {
  if (providedAriaLabel.value) return undefined

  return providedAriaLabelledby.value ?? (props.label ? labelId.value : undefined)
})
const listboxAriaLabel = computed(() => {
  if (providedAriaLabel.value) return providedAriaLabel.value
  if (props.label || providedAriaLabelledby.value) return undefined

  return props.placeholder
})
const listboxAriaLabelledby = computed(() => {
  if (providedAriaLabel.value) return undefined

  return providedAriaLabelledby.value ?? (props.label ? labelId.value : undefined)
})
const activeDescendant = computed(() =>
  activeIndex.value >= 0 ? `${selectId.value}-option-${activeIndex.value}` : undefined
)

function isSelected(value: MSelectValue) {
  return selectedValues.value.some((selectedValue) => selectedValue === value)
}

function isSelectable(index: number) {
  return Boolean(props.options[index]) && !props.options[index].disabled
}

function firstSelectableIndex() {
  return props.options.findIndex((option) => !option.disabled)
}

function lastSelectableIndex() {
  for (let index = props.options.length - 1; index >= 0; index -= 1) {
    if (isSelectable(index)) return index
  }

  return -1
}

function selectedSelectableIndex() {
  return props.options.findIndex((option) => isSelected(option.value) && !option.disabled)
}

function setInitialActiveIndex(preferLast = false) {
  const selectedIndex = selectedSelectableIndex()

  activeIndex.value = selectedIndex >= 0 ? selectedIndex : preferLast ? lastSelectableIndex() : firstSelectableIndex()
}

async function focusActiveOption() {
  await nextTick()
  optionElements.value[activeIndex.value]?.focus()
}

async function openListbox({ focusOption = false, preferLast = false } = {}) {
  if (props.disabled || !props.options.length) return

  isOpen.value = true
  setInitialActiveIndex(preferLast)

  if (focusOption) await focusActiveOption()
}

function closeListbox({ returnFocus = false } = {}) {
  isOpen.value = false
  activeIndex.value = -1

  if (returnFocus) trigger.value?.focus()
}

async function toggleListbox() {
  if (isOpen.value) {
    closeListbox()
    return
  }

  await openListbox()
}

function selectionFor(option: MSelectOption): MSelectModelValue {
  if (!props.multiple) return option.value

  if (isSelected(option.value)) return selectedValues.value.filter((value) => value !== option.value)

  return [...selectedValues.value, option.value]
}

function selectOption(index: number) {
  const option = props.options[index]
  if (!option || option.disabled) return

  const nextValue = selectionFor(option)
  emit('update:modelValue', nextValue)
  emit('change', nextValue)

  if (!props.multiple && !props.inline) closeListbox({ returnFocus: true })
}

function clearSelection() {
  if (!hasSelection.value || props.disabled) return

  const nextValue: MSelectModelValue = props.multiple ? [] : null
  emit('update:modelValue', nextValue)
  emit('change', nextValue)
  emit('clear')
  trigger.value?.focus()
}

async function moveActive(index: number, directionOffset: number = 1) {
  if (!props.options.length) return

  const optionCount = props.options.length
  let nextIndex = index

  for (let attempts = 0; attempts < optionCount; attempts += 1) {
    nextIndex = (nextIndex + directionOffset + optionCount) % optionCount
    if (isSelectable(nextIndex)) {
      activeIndex.value = nextIndex
      await focusActiveOption()
      return
    }
  }
}

async function onTriggerKeydown(event: KeyboardEvent) {
  if (props.disabled) return

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    await openListbox({ focusOption: true })
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    await openListbox({ focusOption: true, preferLast: true })
  } else if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    if (isOpen.value) closeListbox()
    else await openListbox({ focusOption: true })
  } else if (event.key === 'Escape' && isOpen.value) {
    event.preventDefault()
    closeListbox()
  }
}

async function onOptionKeydown(index: number, event: KeyboardEvent) {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    await moveActive(index, 1)
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    await moveActive(index, -1)
  } else if (event.key === 'Home') {
    event.preventDefault()
    activeIndex.value = firstSelectableIndex()
    await focusActiveOption()
  } else if (event.key === 'End') {
    event.preventDefault()
    activeIndex.value = lastSelectableIndex()
    await focusActiveOption()
  } else if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    selectOption(index)
  } else if (event.key === 'Escape' && !props.inline) {
    event.preventDefault()
    closeListbox({ returnFocus: true })
  }
}

function onDocumentPointerDown(event: PointerEvent) {
  if (!root.value?.contains(event.target as Node)) closeListbox()
}

onMounted(() => document.addEventListener('pointerdown', onDocumentPointerDown))
onBeforeUnmount(() => document.removeEventListener('pointerdown', onDocumentPointerDown))
</script>

<template>
  <div v-bind="wrapperAttrs" ref="root" class="m-select" :class="{ 'm-select--inline': props.inline }" :dir="direction">
    <label v-if="props.label" :id="labelId" :for="selectId" class="m-select__label label-md">{{ props.label }}</label>

    <div
      v-if="!props.inline"
      class="m-select__control"
      :class="{ 'm-select__control--open': isOpen, 'm-select__control--disabled': props.disabled }"
    >
      <button
        :id="selectId"
        ref="trigger"
        v-bind="triggerAttrs"
        type="button"
        class="m-select__trigger"
        role="combobox"
        :aria-controls="isOpen ? listboxId : undefined"
        :aria-expanded="isOpen"
        :aria-activedescendant="isOpen ? activeDescendant : undefined"
        :aria-haspopup="'listbox'"
        :aria-labelledby="triggerAriaLabelledby"
        :aria-label="triggerAriaLabel"
        :disabled="props.disabled"
        @click="toggleListbox"
        @keydown="onTriggerKeydown"
      >
        <span class="m-select__value body-sm" :class="{ 'm-select__value--placeholder': !hasSelection }">
          <slot name="selection" :options="selectedOptions" :text="selectionText">
            {{ selectionText || props.placeholder }}
          </slot>
        </span>
        <MIcon
          name="PhCaretDown"
          :size="20"
          class="m-select__indicator"
          :class="{ 'm-select__indicator--open': isOpen }"
          aria-hidden="true"
        />
      </button>

      <button
        v-if="props.clearable && hasSelection"
        type="button"
        class="m-select__clear"
        :disabled="props.disabled"
        :aria-label="props.clearLabel"
        @click="clearSelection"
      >
        <MIcon name="PhXCircle" :size="18" aria-hidden="true" />
      </button>
    </div>

    <select
      v-bind="nativeSelectAttrs"
      :name="props.name"
      :multiple="props.multiple"
      :required="props.required"
      :disabled="props.disabled"
      tabindex="-1"
      aria-hidden="true"
      class="m-select__native"
    >
      <option v-if="!props.multiple" value="" :selected="!hasSelection" disabled>{{ props.placeholder }}</option>
      <option
        v-for="option in props.options"
        :key="option.value"
        :value="option.value"
        :selected="isSelected(option.value)"
        :disabled="option.disabled"
      >
        {{ option.label }}
      </option>
    </select>

    <div
      v-if="isOpen || props.inline"
      :id="listboxId"
      class="m-select__popover"
      :class="{ 'm-select__popover--inline': props.inline }"
      role="presentation"
    >
      <div
        class="m-select__options"
        role="listbox"
        :aria-label="listboxAriaLabel"
        :aria-labelledby="listboxAriaLabelledby"
        :aria-multiselectable="props.multiple || undefined"
      >
        <p v-if="!props.options.length" class="m-select__empty body-sm" role="status">{{ props.emptyText }}</p>
        <template v-else>
          <button
            v-for="(option, index) in props.options"
            :id="`${selectId}-option-${index}`"
            :key="option.value"
            :ref="(element) => (optionElements[index] = element as HTMLButtonElement)"
            type="button"
            class="m-select__option body-md"
            :class="{
              'm-select__option--selected': isSelected(option.value),
              'm-select__option--disabled': option.disabled
            }"
            role="option"
            :aria-selected="isSelected(option.value)"
            :disabled="option.disabled"
            @click="selectOption(index)"
            @keydown="onOptionKeydown(index, $event)"
          >
            <span class="m-select__check" aria-hidden="true">
              <MIcon v-if="isSelected(option.value)" name="PhCheck" :size="14" weight="bold" />
            </span>
            <span class="m-select__option-content">
              <slot name="option" :option="option" :selected="isSelected(option.value)">
                <span class="m-select__option-label">{{ option.label }}</span>
              </slot>
            </span>
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.m-select {
  position: relative;
  display: grid;
  min-width: 0;
  gap: 8px;
  color: rgb(var(--color-ink));
}

.m-select__label {
  color: rgb(var(--color-ink-muted));
  text-align: start;
}

.m-select__control {
  display: flex;
  min-height: 44px;
  align-items: stretch;
  overflow: hidden;
  border: 1px solid rgb(var(--color-line));
  border-radius: 12px;
  background: rgb(var(--color-surface));
  transition:
    border-color 180ms ease,
    box-shadow 180ms ease;
}

.m-select__control:focus-within,
.m-select__control--open {
  border-color: rgb(var(--color-primary));
  box-shadow: 0 0 0 3px rgb(var(--color-primary) / 12%);
}

.m-select__control--disabled {
  cursor: not-allowed;
  background: rgb(var(--color-surface-muted));
  opacity: 0.65;
}

.m-select__trigger {
  display: flex;
  width: 100%;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border: 0;
  background: transparent;
  padding: 0 12px;
  color: inherit;
  text-align: start;
}

.m-select__trigger:disabled {
  cursor: not-allowed;
}

.m-select__value {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: start;
  white-space: nowrap;
}

.m-select__value--placeholder {
  color: rgb(var(--color-ink-muted));
}

.m-select__indicator {
  flex: none;
  color: rgb(var(--color-ink-muted));
  transition: transform 180ms ease;
}

.m-select__indicator--open {
  transform: rotate(180deg);
}

.m-select__clear {
  display: inline-grid;
  width: 40px;
  flex: none;
  place-items: center;
  border: 0;
  border-inline-start: 1px solid rgb(var(--color-line));
  background: transparent;
  color: rgb(var(--color-ink-muted));
}

.m-select__clear:hover:not(:disabled) {
  background: rgb(var(--color-primary-soft));
  color: rgb(var(--color-primary));
}

.m-select__clear:focus-visible,
.m-select__trigger:focus-visible,
.m-select__option:focus-visible {
  outline: 2px solid rgb(var(--color-primary));
  outline-offset: -2px;
}

.m-select__native {
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.m-select--inline {
  gap: 0;
}

.m-select__popover {
  position: absolute;
  z-index: 20;
  inset-block-start: calc(100% + 8px);
  inline: 0;
  max-block-size: min(20rem, 50vh);
  overflow: auto;
  border: 1px solid rgb(var(--color-line));
  border-radius: 16px;
  background: rgb(var(--color-surface));
  box-shadow: 0 12px 28px rgb(14 30 51 / 12%);
}

.m-select__popover--inline {
  position: static;
  max-block-size: none;
  overflow: visible;
  border: 0;
  border-radius: 0;
  box-shadow: none;
}

.m-select__options {
  display: grid;
  gap: 2px;
  margin: 0;
  padding: 8px;
}

.m-select__popover--inline .m-select__options {
  gap: 16px;
  padding: 4px 0 0;
}

.m-select__popover--inline .m-select__option {
  min-block-size: 24px;
  padding: 0;
  border-radius: 0;
}

.m-select__popover--inline .m-select__option:hover:not(:disabled),
.m-select__popover--inline .m-select__option--selected {
  background: transparent;
  color: rgb(var(--color-ink-muted));
}

.m-select__option {
  display: flex;
  width: 100%;
  min-height: 40px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  padding: 8px;
  color: rgb(var(--color-ink-muted));
  text-align: start;
}

.m-select__option:hover:not(:disabled),
.m-select__option--selected {
  background: rgb(var(--color-primary-soft));
  color: rgb(var(--color-ink));
}

.m-select__option--disabled {
  cursor: not-allowed;
  color: rgb(var(--color-ink-soft));
  opacity: 0.65;
}

.m-select__option-content {
  display: flex;
  min-width: 0;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.m-select__option-label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.m-select__check {
  display: grid;
  inline-size: 20px;
  block-size: 20px;
  flex: none;
  place-items: center;
  border: 1px solid rgb(var(--color-line));
  border-radius: 5px;
  color: #fff;
}

.m-select__option--selected .m-select__check {
  border-color: rgb(var(--color-primary));
  background: rgb(var(--color-primary));
}

.m-select__empty {
  padding: 12px 8px;
  color: rgb(var(--color-ink-soft));
  text-align: start;
}

@media (prefers-reduced-motion: reduce) {
  .m-select__control,
  .m-select__indicator {
    transition: none;
  }
}
</style>
