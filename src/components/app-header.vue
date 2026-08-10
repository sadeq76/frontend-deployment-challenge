<script setup lang="ts">
const { t } = useI18n()
const logoSrc = '/figma-logo.svg'
const menuOpen = ref(false)
const menuButton = ref<HTMLButtonElement>()
const menuPanel = ref<HTMLElement>()

function closeMenu() { menuOpen.value = false; menuButton.value?.focus() }
watch(menuOpen, async (open: boolean) => {
  document.body.style.overflow = open ? 'hidden' : ''
  if (open) { await nextTick(); menuPanel.value?.focus() }
})
onBeforeUnmount(() => { document.body.style.overflow = '' })
</script>

<template>
  <header class="sticky top-0 z-30 rounded-b-[2rem] bg-white/95 shadow-card backdrop-blur">
    <div class="shell flex h-[72px] items-center justify-between md:h-[120px]">
      <nav class="hidden items-center gap-7 text-sm font-medium md:flex" :aria-label="t('nav.menu')">
        <NuxtLink to="/product" class="text-ink transition hover:text-brand">{{ t('nav.products') }}</NuxtLink>
        <a href="#contact" class="text-ink transition hover:text-brand">{{ t('nav.contact') }}</a>
      </nav>
      <a href="mailto:hello@example.com" class="hidden rounded-control bg-brand px-4 py-3 text-sm font-bold text-white md:inline-flex">{{ t('nav.contact') }}</a>
      <button ref="menuButton" type="button" class="grid size-10 place-items-center rounded-lg border border-brand text-brand md:hidden" :aria-label="t('nav.menu')" :aria-expanded="menuOpen" @click="menuOpen = true">☰</button>
    </div>
    <Teleport to="body">
      <div v-if="menuOpen" class="fixed inset-0 z-50 bg-ink/30" @click.self="closeMenu">
        <aside ref="menuPanel" tabindex="-1" class="mr-auto flex h-full w-[min(86vw,320px)] flex-col bg-white p-6 shadow-floating" :aria-label="t('nav.menu')" @keydown.esc="closeMenu">
          <div class="flex items-center justify-between"><img :src="logoSrc" alt="نوبتینو" class="h-7 w-auto"><button type="button" class="grid size-10 place-items-center rounded-lg border border-line text-xl" :aria-label="t('nav.closeMenu')" @click="closeMenu">×</button></div>
          <nav class="mt-10 grid gap-3 text-base font-bold">
            <NuxtLink to="/product" class="rounded-control px-4 py-3 hover:bg-brand-soft" @click="closeMenu">{{ t('nav.products') }}</NuxtLink>
            <a href="#contact" class="rounded-control px-4 py-3 hover:bg-brand-soft" @click="closeMenu">{{ t('nav.contact') }}</a>
          </nav>
        </aside>
      </div>
    </Teleport>
  </header>
</template>
