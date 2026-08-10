import { expect, fn, userEvent, within } from 'storybook/test'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MBtn from './m-btn.vue'

type ButtonStoryArgs = InstanceType<typeof MBtn>['$props'] & {
  'aria-label'?: string
  onClick?: () => void
}

const meta = {
  title: 'UI/MBtn',
  component: MBtn,
  tags: ['autodocs', 'test'],
  parameters: {
    docs: {
      description: {
        component:
          'A typed button or anchor primitive. Supply href for a semantic link, or use the primary, secondary, link, and icon variants for the Mini Market UI.'
      }
    }
  },
  argTypes: {
    variant: { control: 'radio', options: ['primary', 'secondary', 'link', 'icon'] },
    type: { control: 'select', options: ['button', 'submit', 'reset'] },
    disabled: { control: 'boolean' },
    href: { control: 'text' },
    prependIcon: { control: 'text' },
    appendIcon: { control: 'text' }
  },
  render: (args) => ({
    components: { MBtn },
    setup: () => ({ args }),
    template: '<MBtn v-bind="args" />'
  })
} satisfies Meta<ButtonStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = { args: { text: 'Save changes', variant: 'primary' } }
export const Secondary: Story = { args: { text: 'View products', variant: 'secondary' } }
export const Link: Story = { args: { text: 'Read our guide', variant: 'link', href: '#guide' } }
export const Icon: Story = {
  args: { 'aria-label': 'Open filters', prependIcon: 'PhFunnel', variant: 'icon' }
}
export const WithIcons: Story = {
  args: { appendIcon: 'PhArrowLeft', prependIcon: 'PhFunnel', text: 'Apply filters', variant: 'primary' }
}
export const Disabled: Story = { args: { disabled: true, text: 'Unavailable', variant: 'primary' } }
export const RTL: Story = {
  args: { appendIcon: 'PhArrowLeft', prependIcon: 'PhFunnel', text: 'اعمال فیلتر', variant: 'secondary' },
  render: (args) => ({
    components: { MBtn },
    setup: () => ({ args }),
    template: '<MBtn v-bind="args" dir="rtl" />'
  })
}
export const Clickable: Story = {
  args: { onClick: fn(), text: 'Save changes', variant: 'primary' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: 'Save changes' })

    await userEvent.tab()
    await expect(button).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await expect(args.onClick).toHaveBeenCalledTimes(1)
  }
}
