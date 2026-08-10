import { ref } from 'vue'
import { expect, userEvent, within } from 'storybook/test'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MTextField from './m-text-field.vue'

type TextFieldStoryArgs = InstanceType<typeof MTextField>['$props'] & {
  disabled?: boolean
  'aria-describedby'?: string
  'aria-invalid'?: string
}

const meta = {
  title: 'UI/MTextField',
  component: MTextField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A labelled input that forwards native input attributes, including autocomplete, disabled, and ARIA attributes.'
      }
    }
  },
  argTypes: {
    type: { control: 'select', options: ['text', 'search', 'email', 'password'] },
    disabled: { control: 'boolean' }
  },
  render: (args) => ({
    components: { MTextField },
    setup: () => ({ args, value: ref(args.modelValue) }),
    template: '<MTextField v-bind="args" v-model="value" />'
  })
} satisfies Meta<TextFieldStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { label: 'Product name', modelValue: '', placeholder: 'Enter a product name', type: 'text' }
}
export const Search: Story = {
  args: { label: 'Search', modelValue: '', placeholder: 'Search products', type: 'search' }
}
export const Disabled: Story = {
  args: { disabled: true, label: 'Product name', modelValue: 'Compact camera', type: 'text' }
}
export const Invalid: Story = {
  args: {
    'aria-describedby': 'product-name-help',
    'aria-invalid': 'true',
    label: 'Product name',
    modelValue: '',
    placeholder: 'Enter a product name',
    type: 'text'
  },
  render: (args) => ({
    components: { MTextField },
    setup: () => ({ args, value: ref(args.modelValue) }),
    template: `
      <div class="grid gap-2">
        <MTextField v-bind="args" v-model="value" />
        <p id="product-name-help" class="m-0 text-sm text-ink-muted">Enter at least three characters.</p>
      </div>
    `
  })
}
export const AcceptsInput: Story = {
  args: { label: 'Product name', modelValue: '', placeholder: 'Enter a product name', type: 'text' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Product name' })
    await userEvent.type(input, 'Compact camera')
    await expect(input).toHaveValue('Compact camera')
  }
}
export const WithNativeInputAttributes: Story = {
  args: { modelValue: '' },
  render: () => ({
    components: { MTextField },
    setup: () => ({ value: ref('') }),
    template: `
      <div class="grid max-w-sm gap-2">
        <MTextField
          id="product-search"
          v-model="value"
          label="Search products"
          placeholder="Search by product name"
          type="search"
          autocomplete="off"
          required
          aria-describedby="product-search-help"
        />
        <p id="product-search-help" class="text-sm text-ink-muted">Enter at least two characters.</p>
      </div>
    `
  })
}
