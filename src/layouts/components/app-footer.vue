<script setup lang="ts">
const { t } = useI18n()

const socialLinks = [
  { name: 'telegram', icon: '/images/figma/telegram.svg', href: 'https://t.me/', labelKey: 'footer.social.telegram' },
  {
    name: 'instagram',
    icon: '/images/figma/instagram.svg',
    href: 'https://www.instagram.com/',
    labelKey: 'footer.social.instagram'
  },
  { name: 'twitter', icon: '/images/figma/twitter.svg', href: 'https://x.com/', labelKey: 'footer.social.twitter' },
  {
    name: 'youtube',
    icon: '/images/figma/youtube.svg',
    href: 'https://www.youtube.com/',
    labelKey: 'footer.social.youtube'
  },
  {
    name: 'linkedin',
    icon: '/images/figma/linkedin.svg',
    href: 'https://www.linkedin.com/',
    labelKey: 'footer.social.linkedin'
  }
] as const

const footerSocialLinks = [socialLinks[0], socialLinks[1], socialLinks[4]]
const enamadSrc = '/images/figma/enamad.png'
const samandehiSrc = '/images/figma/samandehi.png'
</script>

<template>
  <footer id="contact" class="mt-[120px] rounded-t-[16px] bg-white text-[#253343]">
    <div class="shell py-10 lg:h-[264px] lg:py-10">
      <div
        dir="ltr"
        class="grid gap-10 sm:grid-cols-2 lg:h-full lg:grid-cols-3 lg:items-start lg:gap-x-12 lg:gap-y-0 xl:grid-cols-[200px_200px_180px] xl:justify-start xl:gap-x-[100px] xl:px-9"
      >
        <section
          dir="rtl"
          class="order-3 sm:col-span-2 lg:order-none lg:col-span-1"
          aria-labelledby="footer-social-title"
        >
          <h2 id="footer-social-title" class="text-right text-xl font-bold leading-7">{{ t('footer.followUs') }}</h2>
          <ul class="mt-6 grid gap-3" :aria-label="t('footer.followUs')">
            <li v-for="social in footerSocialLinks" :key="social.name">
              <a
                :href="social.href"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center justify-end gap-3 text-[13px] font-medium leading-6 text-[#4b4b4d] transition-colors hover:text-brand"
                :aria-label="t(social.labelKey)"
              >
                <span>{{ t(social.labelKey) }}</span>
                <img :src="social.icon" alt="" width="24" height="24" class="size-6" aria-hidden="true" />
              </a>
            </li>
          </ul>
          <p class="mt-3 whitespace-nowrap text-right text-[13px] font-medium leading-6 text-[#4b4b4d]">
            {{ t('footer.supportHours') }}
          </p>
        </section>

        <nav dir="rtl" class="order-2 text-right lg:order-none" aria-labelledby="footer-guide-title">
          <h2 id="footer-guide-title" class="text-xl font-bold leading-7">{{ t('footer.guide') }}</h2>
          <ul class="mt-6 grid gap-3 text-[13px] font-medium leading-6 text-[#4b4b4d]">
            <li>
              <a href="#contact" class="transition-colors hover:text-brand">{{ t('footer.terms') }}</a>
            </li>
            <li>
              <a href="#contact" class="transition-colors hover:text-brand">{{ t('footer.consultation') }}</a>
            </li>
            <li>
              <a href="#contact" class="transition-colors hover:text-brand">{{ t('footer.feedback') }}</a>
            </li>
          </ul>
        </nav>

        <nav dir="rtl" class="order-1 text-right lg:order-none" aria-labelledby="footer-quick-title">
          <h2 id="footer-quick-title" class="text-xl font-bold leading-7">{{ t('footer.title') }}</h2>
          <ul class="mt-6 grid gap-3 text-[13px] font-medium leading-6 text-[#4b4b4d]">
            <li>
              <a href="#contact" class="text-brand transition-colors hover:text-brand-hover">{{ t('footer.about') }}</a>
            </li>
            <li>
              <a href="#contact" class="transition-colors hover:text-brand">{{ t('footer.blog') }}</a>
            </li>
            <li>
              <a href="mailto:hello@example.com" class="transition-colors hover:text-brand">{{ t('nav.contact') }}</a>
            </li>
            <li>
              <a href="#contact" class="transition-colors hover:text-brand">{{ t('footer.afterSales') }}</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div class="bg-[#f8f9fc]">
      <div
        class="shell flex min-h-[220px] flex-col items-center justify-center gap-6 py-8 lg:relative lg:h-[152px] lg:min-h-0 lg:py-6"
      >
        <div class="flex items-center gap-16 lg:absolute lg:left-1">
          <a href="https://enamad.ir/" target="_blank" rel="noopener noreferrer" :aria-label="t('footer.enamad')">
            <img :src="enamadSrc" :alt="t('footer.enamad')" width="72" height="72" class="size-[72px] object-contain" />
          </a>
          <a href="https://samandehi.ir/" target="_blank" rel="noopener noreferrer" :aria-label="t('footer.samandehi')">
            <img
              :src="samandehiSrc"
              :alt="t('footer.samandehi')"
              width="72"
              height="72"
              class="size-[72px] object-contain"
            />
          </a>
        </div>
        <div
          class="flex max-w-[320px] flex-col items-center gap-4 text-center lg:absolute lg:left-1/2 lg:-translate-x-1/2"
        >
          <ul class="flex items-center gap-4" :aria-label="t('footer.followUs')">
            <li v-for="social in socialLinks" :key="social.name">
              <a
                :href="social.href"
                target="_blank"
                rel="noopener noreferrer"
                class="grid size-6 place-items-center rounded-sm transition-opacity hover:opacity-75"
                :aria-label="t(social.labelKey)"
              >
                <img :src="social.icon" alt="" width="24" height="24" class="size-6" aria-hidden="true" />
              </a>
            </li>
          </ul>
          <p class="text-[13px] font-medium leading-6 text-[#4b4b4d]">{{ t('footer.rights') }}</p>
        </div>
      </div>
    </div>
  </footer>
</template>
