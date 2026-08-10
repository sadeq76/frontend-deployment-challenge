import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{vue,ts}', './server/**/*.{ts,vue}'],
  theme: {
    extend: {
      colors: {
        canvas: '#e9edf5',
        ink: '#0a2a51',
        'ink-muted': '#445a74',
        'ink-soft': '#647e9a',
        brand: '#e20054',
        'brand-soft': '#fce5ee',
        surface: '#ffffff',
        'surface-muted': '#f5f7fa',
        line: '#d1dbe8'
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
