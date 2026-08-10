import { nextTick, onBeforeUnmount, watch, type Ref } from 'vue'

type ElementRef = Readonly<Ref<HTMLElement | null>>

interface OverlayAccessibilityOptions {
  open: Readonly<Ref<boolean>>
  container: ElementRef
  initialFocus?: ElementRef
  onClose: () => void
}

const focusableSelector = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]:not([tabindex="-1"])'
].join(',')

let scrollLockCount = 0
let previousBodyOverflow = ''

function getFocusableElements(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter((element) => {
    return element.getAttribute('aria-hidden') !== 'true' && element.getClientRects().length > 0
  })
}

function lockBodyScroll() {
  if (typeof document === 'undefined') return

  if (scrollLockCount === 0) previousBodyOverflow = document.body.style.overflow
  scrollLockCount += 1
  document.body.style.overflow = 'hidden'
}

function unlockBodyScroll() {
  if (typeof document === 'undefined' || scrollLockCount === 0) return

  scrollLockCount -= 1
  if (scrollLockCount === 0) {
    document.body.style.overflow = previousBodyOverflow
    previousBodyOverflow = ''
  }
}

export function useOverlayAccessibility(options: OverlayAccessibilityOptions) {
  let bodyScrollLocked = false
  let previouslyFocusedElement: HTMLElement | null = null

  function focusInitialElement() {
    const container = options.container.value
    if (!container) return

    const initialFocus = options.initialFocus?.value
    ;(initialFocus ?? getFocusableElements(container)[0] ?? container).focus()
  }

  function restoreFocus() {
    if (previouslyFocusedElement?.isConnected) previouslyFocusedElement.focus()
    previouslyFocusedElement = null
  }

  function releaseBodyScroll() {
    if (!bodyScrollLocked) return

    unlockBodyScroll()
    bodyScrollLocked = false
  }

  function onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      options.onClose()
      return
    }

    if (event.key !== 'Tab') return

    const container = options.container.value
    if (!container) return

    const focusableElements = getFocusableElements(container)
    if (focusableElements.length === 0) {
      event.preventDefault()
      container.focus()
      return
    }

    const firstElement = focusableElements[0]
    const lastElement = focusableElements.at(-1)!
    const activeElement = document.activeElement

    if (event.shiftKey && (activeElement === firstElement || !container.contains(activeElement))) {
      event.preventDefault()
      lastElement.focus()
    } else if (!event.shiftKey && (activeElement === lastElement || !container.contains(activeElement))) {
      event.preventDefault()
      firstElement.focus()
    }
  }

  watch(
    options.open,
    async (isOpen) => {
      if (typeof document === 'undefined') return

      if (isOpen) {
        previouslyFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null
        if (!bodyScrollLocked) {
          lockBodyScroll()
          bodyScrollLocked = true
        }
        await nextTick()
        focusInitialElement()
        return
      }

      releaseBodyScroll()
      await nextTick()
      restoreFocus()
    },
    { immediate: true }
  )

  onBeforeUnmount(() => {
    releaseBodyScroll()
    restoreFocus()
  })

  return { onKeydown }
}
