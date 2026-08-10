<script setup lang="ts">
import { computed, ref } from 'vue'

const { t } = useI18n()

const logoSrc = '/images/figma/mini-market-logo.svg'
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
</script>

<template>
  <header class="sticky top-0 z-30 rounded-b-[32px] bg-surface shadow-[0_3px_12px_rgb(75_75_77_/_4%)]">
    <div class="shell relative flex h-[72px] items-center lg:h-[120px]">
      <NuxtLink
        to="/product"
        class="absolute right-0 inline-flex h-[25px] w-[105px] items-center justify-center"
        :aria-label="t('brand.name')"
      >
        <img :src="logoSrc" :alt="t('brand.name')" class="block h-[25px] w-[105px]" />
      </NuxtLink>

      <nav
        class="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 whitespace-nowrap text-[13px] font-medium leading-5 text-[#4b4b4d] lg:flex"
        :aria-label="t('nav.navigationMenu')"
      >
        <NuxtLink
          to="/product"
          class="inline-flex items-center gap-2 transition-colors hover:text-brand focus-visible:text-brand"
        >
          <MIcon name="PhSquaresFour" :size="16" class="text-brand" aria-hidden="true" />
          {{ t('nav.productList') }}
        </NuxtLink>
        <a
          href="#contact"
          class="inline-flex items-center gap-2 transition-colors hover:text-brand focus-visible:text-brand"
        >
          <MIcon name="PhBookOpen" :size="16" class="text-brand" aria-hidden="true" />
          {{ t('nav.consultation') }}
        </a>
        <a
          href="#contact"
          class="inline-flex items-center gap-2 transition-colors hover:text-brand focus-visible:text-brand"
        >
          <MIcon name="PhQuestion" :size="16" class="text-brand" aria-hidden="true" />
          {{ t('nav.faq') }}
        </a>
        <a
          href="#contact"
          class="inline-flex items-center gap-2 transition-colors hover:text-brand focus-visible:text-brand"
        >
          <MIcon name="PhPhone" :size="16" class="text-brand" aria-hidden="true" />
          {{ t('nav.contact') }}
        </a>
      </nav>

      <MBtn
        href="mailto:hello@example.com"
        variant="primary"
        prepend-icon="PhPhone"
        :text="t('nav.contact')"
        class="absolute left-0 !hidden h-10 w-[107px] lg:!inline-flex"
      />

      <MBtn
        variant="icon"
        prepend-icon="PhList"
        class="absolute left-0 lg:!hidden"
        :aria-label="t('nav.menu')"
        :aria-expanded="menuOpen"
        aria-controls="mobile-navigation-menu"
        aria-haspopup="dialog"
        @click="menuOpen = true"
      />
    </div>

    <Teleport to="body">
      <div v-if="menuOpen" class="fixed inset-0 z-50 bg-[#4b4b4d]/30" @click.self="closeMenu">
        <aside
          id="mobile-navigation-menu"
          ref="menuPanel"
          tabindex="-1"
          role="dialog"
          aria-modal="true"
          :aria-label="t('nav.navigationMenu')"
          class="mr-auto flex h-full w-[min(86vw,320px)] flex-col rounded-r-[24px] bg-surface p-4 shadow-floating"
          @keydown="onKeydown"
        >
          <div class="flex h-10 items-center justify-between">
            <img :src="logoSrc" :alt="t('brand.name')" class="h-[25px] w-[105px]" />
            <MBtn
              ref="menuCloseButton"
              variant="icon"
              prepend-icon="PhXCircle"
              :icon-size="22"
              class="!rounded-[10px] !text-ink-muted"
              :aria-label="t('nav.closeMenu')"
              @click="closeMenu"
            />
          </div>
          <nav class="mt-10 grid gap-2 text-base font-bold text-[#4b4b4d]">
            <NuxtLink to="/product" class="rounded-xl px-4 py-3 hover:bg-brand-soft" @click="closeMenu">
              {{ t('nav.productList') }}
            </NuxtLink>
            <a href="#contact" class="rounded-xl px-4 py-3 hover:bg-brand-soft" @click="closeMenu">{{
              t('nav.consultation')
            }}</a>
            <a href="#contact" class="rounded-xl px-4 py-3 hover:bg-brand-soft" @click="closeMenu">{{
              t('nav.faq')
            }}</a>
            <a href="#contact" class="rounded-xl px-4 py-3 hover:bg-brand-soft" @click="closeMenu">{{
              t('nav.contact')
            }}</a>
          </nav>
        </aside>
      </div>
    </Teleport>
  </header>
</template>
