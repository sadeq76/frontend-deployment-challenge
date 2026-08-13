<script setup lang="ts">
import { computed, ref, useAttrs, useSlots } from 'vue'
import MIcon from './m-icon.vue'

defineOptions({ inheritAttrs: false })

type ButtonVariant = 'primary' | 'secondary' | 'link' | 'icon'
type NativeButtonType = 'button' | 'submit' | 'reset'

const props = withDefaults(
  defineProps<{
    /** Visual treatment from the Mini Market UI. */
    variant?: ButtonVariant
    /** Visible button label. A default slot can be used instead for richer content. */
    text?: string
    /** Phosphor icon name shown at the logical start edge. */
    prependIcon?: string
    /** Phosphor icon name shown at the logical end edge. */
    appendIcon?: string
    /** Icon size forwarded to MIcon. */
    iconSize?: number | string
    /** When supplied, the component renders a semantic anchor instead of a button. */
    href?: string
    /** Native button type. It is ignored when href renders an anchor. */
    type?: NativeButtonType
    /** Disables native buttons and makes links non-interactive. */
    disabled?: boolean
  }>(),
  {
    variant: 'primary',
    text: undefined,
    prependIcon: undefined,
    appendIcon: undefined,
    iconSize: 18,
    href: undefined,
    type: 'button',
    disabled: false
  }
)

const attrs = useAttrs()
const slots = useSlots()
const element = ref<HTMLElement | null>(null)
const isLink = computed(() => Boolean(props.href))
const tag = computed(() => (isLink.value ? 'a' : 'button'))
const hasContent = computed(() => Boolean(props.text) || Boolean(slots.default))
const classes = computed(() => [
  'm-btn',
  'body-sm',
  'inline-flex',
  'min-h-10',
  'items-center',
  'justify-center',
  'gap-2',
  `m-btn--${props.variant}`
])
const forwardedAttrs = computed(() => {
  if (!isLink.value || !props.disabled) return attrs

  return {
    ...attrs,
    'aria-disabled': 'true',
    tabindex: -1
  }
})

function preventDisabledLinkNavigation(event: MouseEvent) {
  if (isLink.value && props.disabled) {
    event.preventDefault()
    event.stopImmediatePropagation()
  }
}

defineExpose({ element })
</script>

<template>
  <component
    :is="tag"
    ref="element"
    v-bind="forwardedAttrs"
    :class="classes"
    :type="isLink ? undefined : props.type"
    :href="isLink ? props.href : undefined"
    :disabled="isLink ? undefined : props.disabled"
    @click="preventDisabledLinkNavigation"
  >
    <MIcon
      v-if="props.prependIcon"
      :name="props.prependIcon"
      :size="props.iconSize"
      class="m-btn__icon"
      aria-hidden="true"
    />
    <span v-if="hasContent" class="m-btn__label"
      ><slot>{{ props.text }}</slot></span
    >
    <MIcon
      v-if="props.appendIcon"
      :name="props.appendIcon"
      :size="props.iconSize"
      class="m-btn__icon"
      aria-hidden="true"
    />
  </component>
</template>

<style scoped>
.m-btn {
  border: 1px solid transparent;
  border-radius: 16px;
  padding: 8px 16px;
  color: rgb(var(--primary-ink-color));
  font-weight: 700;
  text-align: center;
  text-decoration: none;
  transition:
    background-color 180ms ease,
    border-color 180ms ease,
    color 180ms ease,
    opacity 180ms ease;
}

.m-btn--primary {
  background: rgb(var(--primary-color));
  color: #fff;
}

.m-btn--primary:hover {
  background: rgb(var(--primary-hover-color));
}

.m-btn--secondary {
  border-color: rgb(var(--line-color));
  background: rgb(var(--surface-color));
}

.m-btn--secondary:hover {
  border-color: rgb(var(--primary-color));
  background: rgb(var(--primary-soft-color));
}

.m-btn--link {
  min-height: auto;
  padding: 0;
  border-color: transparent;
  background: transparent;
  border-radius: 6px;
}

.m-btn--link:hover {
  color: rgb(var(--primary-ink-color));
  text-decoration: underline;
  text-underline-offset: 3px;
}

.m-btn--icon {
  width: 40px;
  min-width: 40px;
  padding-inline: 0;
  border-color: rgb(var(--line-color));
  background: rgb(var(--surface-color));
}

.m-btn--icon:hover {
  border-color: rgb(var(--primary-color));
  background: rgb(var(--primary-soft-color));
}

.m-btn:is(:disabled, [aria-disabled='true']) {
  cursor: not-allowed;
  opacity: 0.6;
}

.m-btn[aria-disabled='true'] {
  pointer-events: none;
}

.m-btn__icon {
  flex: none;
}

.m-btn__label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
