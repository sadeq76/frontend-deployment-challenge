export default defineNuxtConfig({
  srcDir: 'src/',
  serverDir: 'server',
  dir: {
    public: 'public'
  },
  ssr: true,
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/i18n', '@nuxt/image'],
  css: ['~/assets/style/main.css'],
  components: [{ path: '~/components', pathPrefix: false }],
  runtimeConfig: {
    fakeStoreBaseUrl: process.env.NUXT_FAKE_STORE_BASE_URL || 'https://fakestoreapi.com',
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    }
  },
  routeRules: {
    '/': { isr: 3600 },
    '/product/**': { isr: 3600 }
  },
  image: {
    domains: ['fakestoreapi.com']
  },
  i18n: {
    defaultLocale: 'fa',
    strategy: 'prefix_except_default',
    langDir: 'locales',
    locales: [{ code: 'fa', language: 'fa-IR', dir: 'rtl', file: 'fa.json' }],
    vueI18n: './i18n.config.ts',
    bundle: { optimizeTranslationDirective: false }
  },
  app: {
    head: {
      viewport: 'width=device-width, initial-scale=1',
      meta: [{ name: 'theme-color', content: '#e20054' }]
    }
  },
  compatibilityDate: '2025-04-24'
})
