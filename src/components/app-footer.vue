<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <footer id="contact" class="mt-16 bg-white pt-10 shadow-[0_-2px_2px_rgb(0_0_0_/_4%)]">
    <div class="shell grid gap-8 pb-10 text-sm md:grid-cols-3">
      <section><h2 class="text-lg font-bold text-ink">{{ t('footer.title') }}</h2><ul class="mt-5 space-y-3 text-ink-muted"><li><NuxtLink to="/product">{{ t('nav.products') }}</NuxtLink></li><li><a href="mailto:hello@example.com">{{ t('nav.contact') }}</a></li></ul></section>
      <section><h2 class="text-lg font-bold text-ink">{{ t('footer.support') }}</h2><p class="mt-5 leading-7 text-ink-muted">برای پرسش‌های مربوط به این نمونه، از طریق ایمیل با ما در تماس باشید.</p></section>
      <section class="md:text-left"><a href="mailto:hello@example.com" class="brand-button">{{ t('nav.contact') }}</a></section>
    </div>
    <div class="bg-[#f8f9fc] py-6 text-center text-xs text-ink-muted">{{ t('footer.rights') }}</div>
  </footer>
</template>
