import { expect, within } from 'storybook/test'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MBadge from './m-badge.vue'

const meta = {
  title: 'UI/MBadge',
  component: MBadge,
  tags: ['autodocs', 'test'],
  parameters: {
    docs: {
      description: {
        component: 'A compact status badge. Its default background is the semantic --color-badge token (#141928).'
      }
    }
  },
  argTypes: {
    color: { control: 'color' }
  }
} satisfies Meta<typeof MBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { text: 'New' },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('New')).toBeVisible()
  }
}

export const CustomColor: Story = {
  args: { color: '#e20054', text: 'Sale' }
}
