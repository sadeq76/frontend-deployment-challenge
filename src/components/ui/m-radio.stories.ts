import { ref } from 'vue'
import { expect, userEvent, within } from 'storybook/test'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MRadio from './m-radio.vue'

type RadioStoryArgs = InstanceType<typeof MRadio>['$props'] & {
  disabled?: boolean
}

const meta = {
  title: 'UI/MRadio',
  component: MRadio,
  tags: ['autodocs', 'test'],
  parameters: {
    docs: {
      description: {
        component:
          'A native radio control with a label. Use MRadioGroup to coordinate a set of options; all native input attributes, such as form and aria-describedby, are forwarded.'
      }
    }
  },
  argTypes: {
    disabled: { control: 'boolean' },
    required: { control: 'boolean' }
  },
  render: (args) => ({
    components: { MRadio },
    setup: () => ({ args, value: ref(args.modelValue) }),
    template: '<MRadio v-bind="args" v-model="value" />'
  })
} satisfies Meta<RadioStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { label: 'Standard delivery', modelValue: 'standard', value: 'standard' }
}

export const Unselected: Story = {
  args: { label: 'Express delivery', modelValue: 'standard', value: 'express' }
}

export const Disabled: Story = {
  args: { disabled: true, label: 'Unavailable delivery', modelValue: 'unavailable', value: 'unavailable' }
}

export const Selectable: Story = {
  args: { label: 'Express delivery', modelValue: 'standard', value: 'express' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const radio = canvas.getByRole('radio', { name: 'Express delivery' })

    await userEvent.tab()
    await expect(radio).toHaveFocus()
    await userEvent.keyboard(' ')
    await expect(radio).toBeChecked()
  }
}
