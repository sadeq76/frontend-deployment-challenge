import tailwindcss from 'tailwindcss'
import vue from '@vitejs/plugin-vue'
import type { StorybookConfig } from '@storybook/vue3-vite'

export default {
  stories: ['../src/components/ui/**/*.stories.ts'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/vue3-vite',
    options: {}
  },
  viteFinal: async (config) => ({
    ...config,
    plugins: [...(config.plugins ?? []), vue()],
    css: {
      ...config.css,
      postcss: { plugins: [tailwindcss()] }
    }
  })
} satisfies StorybookConfig
