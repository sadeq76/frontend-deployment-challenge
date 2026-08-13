<script setup lang="ts">
import { computed, ref } from 'vue'

const { t } = useI18n()

const menuOpen = ref(false)
const menuCloseButton = ref<{ element: HTMLElement | null } | null>(null)
const menuPanel = ref<HTMLElement | null>(null)
const menuCloseButtonElement = computed(() => menuCloseButton.value?.element ?? null)

function closeMenu() {
  menuOpen.value = false
}

const { onKeydown } = useOverlayAccessibility({
  open: menuOpen,
  container: menuPanel,
  initialFocus: menuCloseButtonElement,
  onClose: closeMenu
})

const navLinks: { title: string; to: string; icon: string }[] = [
  { title: t('nav.productList'), to: 'product', icon: 'PhSquaresFour' },
  { title: t('nav.consultation'), to: '', icon: 'PhBookOpen' },
  { title: t('nav.faq'), to: '', icon: 'PhQuestion' },
  { title: t('nav.contact'), to: '', icon: 'PhPhone' }
]
</script>

<template>
  <header class="bg-surface sticky top-0 z-10 rounded-b-[32px] shadow-[0_2px_2px_rgb(0_0_0_/_8%)]">
    <div class="shell h-[72px] lg:h-[120px]">
      <!-- Mobile -->
      <div class="flex h-full w-full items-center justify-between lg:hidden">
        <MBtn
          variant="icon"
          prepend-icon="PhList"
          :aria-label="t('nav.menu')"
          :aria-expanded="menuOpen"
          aria-controls="mobile-navigation-menu"
          aria-haspopup="dialog"
          @click="menuOpen = true"
        />

        <MBtn variant="icon" href="mailto:hi@sadeqshahmoradi.com" prepend-icon="PhPhone" />
      </div>

      <Teleport to="body">
        <Transition name="mobile-menu" appear>
          <div v-if="menuOpen" class="bg-ink/30 fixed inset-0 z-20" @click.self="closeMenu">
            <aside
              id="mobile-navigation-menu"
              ref="menuPanel"
              tabindex="-1"
              role="dialog"
              aria-modal="true"
              :aria-label="t('nav.navigationMenu')"
              class="bg-surface shadow-floating mr-auto flex h-full w-[min(86vw,320px)] flex-col rounded-r-[24px] p-4"
              @keydown="onKeydown"
            >
              <nav class="text-ink-soft text-base font-bold">
                <NuxtLink
                  v-for="({ title, to, icon }, key) in navLinks"
                  :key
                  :to
                  class="hover:bg-primary-soft flex items-center gap-2 rounded-xl px-4 py-3"
                  active-class="bg-primary-soft text-primary"
                  @click="closeMenu"
                >
                  <MIcon :name="icon" :size="24" class="text-primary" aria-hidden="true" />

                  {{ title }}
                </NuxtLink>
              </nav>
            </aside>
          </div>
        </Transition>
      </Teleport>

      <!-- Desktop -->
      <div class="hidden h-full items-center lg:flex">
        <div class="grid w-full" style="grid-template-columns: 1fr 3fr 1fr">
          <!-- Later maybe there was logo -->
          <div />

          <nav
            class="text-ink-soft flex items-center gap-6 text-[13px] leading-5 font-medium whitespace-nowrap"
            :aria-label="t('nav.navigationMenu')"
          >
            <NuxtLink
              v-for="({ title, to, icon }, key) in navLinks"
              :key
              :to
              class="hover:text-primary focus-visible:text-primary relative inline-flex gap-2 transition-colors"
              active-class="active text-primary"
            >
              <MIcon :name="icon" :size="16" weight="bold" aria-hidden="true" />

              <span class="text-body-md font-semibold">{{ title }}</span>
            </NuxtLink>
          </nav>

          <div class="flex justify-end">
            <MBtn
              variant="primary"
              :text="t('nav.contact')"
              href="mailto:hi@sadeqshahmoradi.com"
              prepend-icon="PhPhone"
            />
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-primary);
  width: 5px;
  height: 5px;
  border-radius: 50%;
}
</style>
