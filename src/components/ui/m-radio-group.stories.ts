import { ref } from 'vue'
import { expect, userEvent, within } from 'storybook/test'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MRadio from './m-radio.vue'
import MRadioGroup from './m-radio-group.vue'

type RadioGroupStoryArgs = InstanceType<typeof MRadioGroup>['$props']

const meta = {
  title: 'UI/MRadioGroup',
  component: MRadioGroup,
  tags: ['autodocs', 'test'],
  parameters: {
    docs: {
      description: {
        component:
          'An accessible fieldset and legend that gives child MRadio controls a shared name, selected value, disabled state, and required state.'
      }
    }
  },
  argTypes: {
    disabled: { control: 'boolean' },
    required: { control: 'boolean' }
  },
  render: (args) => ({
    components: { MRadio, MRadioGroup },
    setup: () => ({ args, value: ref(args.modelValue) }),
    template: `
      <MRadioGroup v-bind="args" v-model="value">
        <MRadio value="standard" label="Standard delivery" />
        <MRadio value="express" label="Express delivery" />
        <MRadio value="pickup" label="Pick up from store" />
      </MRadioGroup>
    `
  })
} satisfies Meta<RadioGroupStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { label: 'Delivery method', modelValue: 'standard', name: 'delivery-method' }
}

export const Required: Story = {
  args: { label: 'Delivery method', modelValue: undefined, name: 'delivery-method', required: true }
}

export const Disabled: Story = {
  args: { disabled: true, label: 'Delivery method', modelValue: 'express', name: 'delivery-method' }
}

export const CoordinatesSelection: Story = {
  args: { label: 'Delivery method', modelValue: 'standard', name: 'delivery-method' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const standard = canvas.getByRole('radio', { name: 'Standard delivery' })
    const express = canvas.getByRole('radio', { name: 'Express delivery' })

    await userEvent.tab()
    await expect(standard).toHaveFocus()
    await userEvent.keyboard('{ArrowDown}')
    await expect(express).toHaveFocus()
    await expect(express).toBeChecked()
    await expect(standard).not.toBeChecked()
  }
}
