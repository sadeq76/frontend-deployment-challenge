import { ref } from 'vue'
import { expect, userEvent, within } from 'storybook/test'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MCheckbox from './m-checkbox.vue'

type CheckboxStoryArgs = InstanceType<typeof MCheckbox>['$props'] & {
  disabled?: boolean
}

const meta = {
  title: 'UI/MCheckbox',
  component: MCheckbox,
  tags: ['autodocs', 'test'],
  parameters: {
    docs: {
      description: {
        component:
          'A native checkbox that supports a boolean v-model or an array of selected values. Native input attributes, including name, form, and ARIA attributes, are forwarded.'
      }
    }
  },
  argTypes: {
    disabled: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    required: { control: 'boolean' }
  },
  render: (args) => ({
    components: { MCheckbox },
    setup: () => ({ args, value: ref(args.modelValue) }),
    template: '<MCheckbox v-bind="args" v-model="value" />'
  })
} satisfies Meta<CheckboxStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { label: 'Save this address', modelValue: false }
}

export const Checked: Story = {
  args: { label: 'Save this address', modelValue: true }
}

export const Indeterminate: Story = {
  args: { indeterminate: true, label: 'Select all products', modelValue: false }
}

export const Disabled: Story = {
  args: { disabled: true, label: 'Unavailable option', modelValue: true }
}

export const ArrayModel: Story = {
  args: { modelValue: [] },
  render: () => ({
    components: { MCheckbox },
    setup: () => ({ selected: ref<string[]>(['express']) }),
    template: `
      <div class="grid gap-3">
        <MCheckbox v-model="selected" value="standard" label="Standard delivery" name="delivery" />
        <MCheckbox v-model="selected" value="express" label="Express delivery" name="delivery" />
      </div>
    `
  })
}

export const Toggleable: Story = {
  args: { label: 'Save this address', modelValue: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const checkbox = canvas.getByRole('checkbox', { name: 'Save this address' })

    await userEvent.tab()
    await expect(checkbox).toHaveFocus()
    await userEvent.keyboard(' ')
    await expect(checkbox).toBeChecked()
  }
}
