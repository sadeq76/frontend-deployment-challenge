<script setup lang="ts">
const { t } = useI18n()

const socialLinks = [
  {
    name: 'telegram',
    icon: '/images/figma/telegram.svg',
    href: 'https://t.me/',
    labelKey: 'footer.social.telegram'
  },
  {
    name: 'instagram',
    icon: '/images/figma/instagram.svg',
    href: 'https://www.instagram.com/',
    labelKey: 'footer.social.instagram'
  },
  {
    name: 'twitter',
    icon: '/images/figma/twitter.svg',
    href: 'https://x.com/',
    labelKey: 'footer.social.twitter'
  },
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

const trustBadges = [
  {
    name: 'enamad',
    src: '/images/figma/enamad.png',
    href: 'https://enamad.ir/',
    labelKey: 'footer.enamad'
  },
  {
    name: 'samandehi',
    src: '/images/figma/samandehi.png',
    href: 'https://samandehi.ir/',
    labelKey: 'footer.samandehi'
  }
] as const
</script>

<template>
  <footer id="contact" class="bg-surface text-ink mt-[120px] overflow-hidden rounded-t-[16px]">
    <div class="shell py-10 lg:min-h-[272px]">
      <div
        dir="ltr"
        class="grid gap-10 sm:grid-cols-2 lg:grid-cols-[200px_200px_180px_minmax(240px,1fr)] lg:gap-x-12 xl:gap-x-[80px]"
      >
        <section dir="rtl" class="text-right" aria-labelledby="footer-social-title">
          <h2 id="footer-social-title" class="text-xl leading-7 font-bold">
            {{ t('footer.followUs') }}
          </h2>

          <ul :aria-label="t('footer.followUs')" class="mt-6 grid gap-3">
            <li v-for="social in footerSocialLinks" :key="social.name">
              <a
                :href="social.href"
                :aria-label="t(social.labelKey)"
                target="_blank"
                rel="noopener noreferrer"
                class="text-ink-muted hover:text-primary flex items-center justify-end gap-3 text-[13px] leading-6 font-medium transition-colors"
              >
                <span>
                  {{ t(social.labelKey) }}
                </span>

                <img :src="social.icon" alt="" width="24" height="24" class="size-6" aria-hidden="true" />
              </a>
            </li>
          </ul>
        </section>

        <nav dir="rtl" class="text-right" aria-labelledby="footer-guide-title">
          <h2 id="footer-guide-title" class="text-xl leading-7 font-bold">
            {{ t('footer.guide') }}
          </h2>

          <ul class="text-ink-muted mt-6 grid gap-3 text-[13px] leading-6 font-medium">
            <li>
              <a href="#contact" class="hover:text-primary transition-colors">
                {{ t('footer.terms') }}
              </a>
            </li>

            <li>
              <a href="#contact" class="hover:text-primary transition-colors">
                {{ t('footer.consultation') }}
              </a>
            </li>

            <li>
              <a href="#contact" class="hover:text-primary transition-colors">
                {{ t('footer.feedback') }}
              </a>
            </li>
          </ul>
        </nav>

        <nav dir="rtl" class="text-right" aria-labelledby="footer-quick-title">
          <h2 id="footer-quick-title" class="text-xl leading-7 font-bold">
            {{ t('footer.title') }}
          </h2>

          <ul class="text-ink-muted mt-6 grid gap-3 text-[13px] leading-6 font-medium">
            <li>
              <a href="#contact" class="text-primary hover:text-primary-hover transition-colors">
                {{ t('footer.about') }}
              </a>
            </li>

            <li>
              <a href="#contact" class="hover:text-primary transition-colors">
                {{ t('footer.blog') }}
              </a>
            </li>

            <li>
              <a href="mailto:hello@example.com" class="hover:text-primary transition-colors">
                {{ t('nav.contact') }}
              </a>
            </li>

            <li>
              <a href="#contact" class="hover:text-primary transition-colors">
                {{ t('footer.afterSales') }}
              </a>
            </li>
          </ul>
        </nav>

        <div dir="rtl" class="flex items-center justify-end text-right lg:pt-[116px]">
          <p class="text-ink-muted text-[13px] leading-6 font-medium whitespace-nowrap">
            {{ t('footer.supportHours') }}
          </p>
        </div>
      </div>
    </div>

    <div class="bg-surface-muted">
      <div dir="ltr" class="shell grid min-h-[148px] items-center gap-8 py-6 lg:grid-cols-[1fr_auto_1fr]">
        <div class="flex items-center gap-4 lg:justify-self-start">
          <a
            v-for="badge in trustBadges"
            :key="badge.name"
            :href="badge.href"
            :aria-label="t(badge.labelKey)"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img :src="badge.src" :alt="t(badge.labelKey)" width="72" height="72" class="size-[72px] object-contain" />
          </a>
        </div>

        <div dir="rtl" class="flex flex-col items-center gap-4 text-center">
          <p class="text-ink-muted max-w-[440px] text-[13px] leading-6 font-medium">
            {{ t('footer.rights') }}
          </p>

          <ul :aria-label="t('footer.followUs')" class="flex items-center gap-4">
            <li v-for="social in socialLinks" :key="social.name">
              <a
                :href="social.href"
                :aria-label="t(social.labelKey)"
                target="_blank"
                rel="noopener noreferrer"
                class="grid size-6 place-items-center transition-opacity hover:opacity-75"
              >
                <img :src="social.icon" alt="" width="24" height="24" class="size-6" aria-hidden="true" />
              </a>
            </li>
          </ul>
        </div>

        <div class="hidden lg:block" aria-hidden="true" />
      </div>
    </div>
  </footer>
</template>
