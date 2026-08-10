import { expect, fn, userEvent, within } from 'storybook/test'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MChip from './m-chip.vue'

type ChipStoryArgs = InstanceType<typeof MChip>['$props'] & {
  onClose?: () => void
}

const meta = {
  title: 'UI/MChip',
  component: MChip,
  tags: ['autodocs', 'test'],
  parameters: {
    docs: {
      description: {
        component:
          'A compact token for a selected filter or category. It starts with an optional icon and can expose a close control with the closable prop.'
      }
    }
  },
  argTypes: {
    closable: { control: 'boolean' },
    close: { control: 'boolean', description: 'Alias for closable.' }
  }
} satisfies Meta<ChipStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { text: 'Electronics' }
}

export const WithIcon: Story = {
  args: { icon: 'PhTag', text: 'Electronics' }
}

export const Closable: Story = {
  args: { closable: true, onClose: fn(), text: 'Electronics' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const closeButton = canvas.getByRole('button', { name: 'Remove Electronics' })

    await userEvent.tab()
    await expect(closeButton).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await expect(args.onClose).toHaveBeenCalledTimes(1)
  }
}
