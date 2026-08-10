import { ref } from 'vue'
import { expect, fn, userEvent, within } from 'storybook/test'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MText from './m-text.vue'

type TextStoryArgs = InstanceType<typeof MText>['$props'] & {
  'aria-describedby'?: string
  'aria-invalid'?: string
  onClear?: () => void
}

const meta = {
  title: 'UI/MText',
  component: MText,
  tags: ['autodocs', 'test'],
  parameters: {
    docs: {
      description: {
        component:
          'A labelled v-model input. Native input attributes and ARIA attributes are forwarded to the input, while component classes style the field wrapper.'
      }
    }
  },
  argTypes: {
    type: { control: 'select', options: ['text', 'search', 'email', 'password'] },
    clearable: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    prependIcon: { control: 'text' },
    appendIcon: { control: 'text' }
  },
  render: (args) => ({
    components: { MText },
    setup: () => ({ args, value: ref(args.modelValue ?? '') }),
    template: '<MText v-bind="args" v-model="value" />'
  })
} satisfies Meta<TextStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { label: 'Product name', modelValue: '', placeholder: 'Enter a product name' }
}
export const Search: Story = {
  args: {
    clearable: true,
    label: 'Search products',
    modelValue: 'Camera',
    placeholder: 'Search products',
    prependIcon: 'PhMagnifyingGlass',
    type: 'search'
  }
}
export const WithAppendIcon: Story = {
  args: { appendIcon: 'PhCaretDown', label: 'Category', modelValue: '', placeholder: 'Choose a category' }
}
export const Disabled: Story = {
  args: { disabled: true, label: 'Product name', modelValue: 'Compact camera', placeholder: 'Enter a product name' }
}
export const RTL: Story = {
  args: {
    clearable: true,
    label: 'جستجوی محصول',
    modelValue: 'دوربین',
    placeholder: 'نام محصول را جستجو کنید',
    prependIcon: 'PhMagnifyingGlass'
  },
  render: (args) => ({
    components: { MText },
    setup: () => ({ args, value: ref(args.modelValue ?? '') }),
    template: '<MText v-bind="args" v-model="value" dir="rtl" />'
  })
}
export const WithNativeInputAttributes: Story = {
  args: { label: 'Search products', modelValue: '', placeholder: 'Search by product name', type: 'search' },
  render: (args) => ({
    components: { MText },
    setup: () => ({ args, value: ref(args.modelValue ?? '') }),
    template: `
      <div class="grid max-w-sm gap-2">
        <MText
          v-bind="args"
          v-model="value"
          autocomplete="off"
          required
          aria-describedby="product-search-help"
        />
        <p id="product-search-help" class="text-sm text-ink-muted">Enter at least two characters.</p>
      </div>
    `
  })
}
export const Clearable: Story = {
  args: { clearable: true, label: 'Product name', modelValue: 'Compact camera', onClear: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Product name' })
    const clearButton = canvas.getByRole('button', { name: 'Clear input' })

    await userEvent.tab()
    await expect(input).toHaveFocus()
    await userEvent.tab()
    await expect(clearButton).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await expect(input).toHaveValue('')
    await expect(args.onClear).toHaveBeenCalledTimes(1)
  }
}
export const AcceptsInput: Story = {
  args: { label: 'Product name', modelValue: '', placeholder: 'Enter a product name' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Product name' })
    await userEvent.type(input, 'Compact camera')
    await expect(input).toHaveValue('Compact camera')
  }
}
