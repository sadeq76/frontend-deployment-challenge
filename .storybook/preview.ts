import type { Preview } from '@storybook/vue3-vite'
import '../src/assets/style/main.css'

export default {
  parameters: {
    a11y: {
      test: 'error'
    },
    controls: { expanded: true },
    layout: 'centered'
  }
} satisfies Preview
