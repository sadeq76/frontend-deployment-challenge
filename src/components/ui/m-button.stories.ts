import { expect, fn, userEvent, within } from 'storybook/test'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MButton from './m-button.vue'

type ButtonStoryArgs = InstanceType<typeof MButton>['$props'] & {
  disabled?: boolean
  onClick?: () => void
}

const meta = {
  title: 'UI/MButton',
  component: MButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A semantic button with primary and secondary visual treatments. Native button attributes are forwarded to the underlying element.'
      }
    }
  },
  argTypes: {
    variant: { control: 'radio', options: ['primary', 'secondary'] },
    type: { control: 'select', options: ['button', 'submit', 'reset'] },
    disabled: { control: 'boolean' }
  },
  render: (args) => ({
    components: { MButton },
    setup: () => ({ args }),
    template: '<MButton v-bind="args">Save changes</MButton>'
  })
} satisfies Meta<ButtonStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = { args: { variant: 'primary', type: 'button' } }
export const Secondary: Story = { args: { variant: 'secondary', type: 'button' } }
export const Disabled: Story = { args: { disabled: true, variant: 'primary' } }
export const Clickable: Story = {
  args: { onClick: fn(), variant: 'primary' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Save changes' }))
    await expect(args.onClick).toHaveBeenCalledTimes(1)
  }
}
