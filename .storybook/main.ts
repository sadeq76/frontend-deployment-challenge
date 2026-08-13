import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import type { StorybookConfig } from '@storybook/vue3-vite'

export default {
  stories: ['../src/components/ui/**/*.stories.ts'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-vitest'],

  framework: {
    name: '@storybook/vue3-vite',
    options: {}
  },

  viteFinal: async (config) => ({
    ...config,

    plugins: [...(config.plugins ?? []), vue(), tailwindcss()],

    optimizeDeps: {
      ...config.optimizeDeps,
      include: [...(config.optimizeDeps?.include ?? []), '@phosphor-icons/vue']
    }
  })
} satisfies StorybookConfig
