import type { Config } from 'tailwindcss'

const themeColor = (name: string) => `rgb(var(--color-${name}) / <alpha-value>)`

export default {
  content: ['./src/**/*.{vue,ts}', './server/**/*.{ts,vue}'],
  theme: {
    extend: {
      colors: {
        canvas: themeColor('canvas'),
        ink: themeColor('ink'),
        'ink-muted': themeColor('ink-muted'),
        'ink-soft': themeColor('ink-soft'),
        brand: themeColor('primary'),
        'brand-hover': themeColor('primary-hover'),
        'brand-soft': themeColor('primary-soft'),
        media: themeColor('media'),
        surface: themeColor('surface'),
        'surface-muted': themeColor('surface-muted'),
        line: themeColor('line')
      },
      borderRadius: { card: '1.5rem', control: '1rem' },
      boxShadow: {
        card: '0 2px 3px rgb(0 0 0 / 3%)',
        floating: '0 10px 40px rgb(0 0 0 / 5%)'
      },
      fontFamily: {
        sans: ['Yekan Bakh', 'Tahoma', 'Arial', 'sans-serif']
      }
    }
  },
  plugins: []
} satisfies Config
