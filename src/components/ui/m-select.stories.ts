import { ref } from 'vue'
import { expect, userEvent, within } from 'storybook/test'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MSelect from './m-select.vue'

const categoryOptions = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'jewelery', label: 'Jewelery' },
  { value: "men's clothing", label: "Men's clothing" },
  { value: "women's clothing", label: "Women's clothing", disabled: true }
]

type SelectStoryArgs = InstanceType<typeof MSelect>['$props'] & {
  'aria-label'?: string
}

const meta = {
  title: 'UI/MSelect',
  component: MSelect,
  tags: ['autodocs', 'test'],
  parameters: {
    docs: {
      description: {
        component:
          'An accessible listbox select for one or many values. It forwards ARIA and native form attributes, supports keyboard navigation, and keeps a visually hidden native select for form submission.'
      }
    }
  },
  argTypes: {
    multiple: { control: 'boolean' },
    inline: { control: 'boolean' },
    clearable: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' }
  },
  render: (args) => ({
    components: { MSelect },
    setup: () => ({ args, selected: ref(args.modelValue) }),
    template: '<MSelect v-bind="args" v-model="selected" />'
  })
} satisfies Meta<SelectStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Single: Story = {
  args: {
    label: 'Category',
    modelValue: null,
    name: 'category',
    options: categoryOptions,
    placeholder: 'Choose a category'
  }
}

export const Multiple: Story = {
  args: {
    clearable: true,
    label: 'Categories',
    modelValue: ['electronics', 'jewelery'],
    multiple: true,
    name: 'category',
    options: categoryOptions,
    placeholder: 'Choose categories'
  }
}

export const InlineMultiple: Story = {
  args: {
    'aria-label': 'Categories',
    inline: true,
    modelValue: ['electronics'],
    multiple: true,
    name: 'category',
    options: categoryOptions
  }
}

export const RTL: Story = {
  args: {
    label: 'دسته‌بندی',
    modelValue: ['electronics'],
    multiple: true,
    options: categoryOptions,
    placeholder: 'دسته‌بندی‌ها را انتخاب کنید'
  },
  render: (args) => ({
    components: { MSelect },
    setup: () => ({ args, selected: ref(args.modelValue) }),
    template: '<MSelect v-bind="args" v-model="selected" dir="rtl" />'
  })
}

export const KeyboardMultiple: Story = {
  args: {
    label: 'Categories',
    modelValue: [],
    multiple: true,
    options: categoryOptions,
    placeholder: 'Choose categories'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const combobox = canvas.getByRole('combobox', { name: 'Categories' })

    await userEvent.tab()
    await expect(combobox).toHaveFocus()
    await userEvent.keyboard('{ArrowDown}')

    const listbox = canvas.getByRole('listbox')
    const electronics = within(listbox).getByRole('option', { name: 'Electronics' })
    await expect(electronics).toHaveFocus()
    await userEvent.keyboard(' ')
    await expect(electronics).toHaveAttribute('aria-selected', 'true')

    await userEvent.keyboard('{ArrowDown}')
    const jewelery = within(listbox).getByRole('option', { name: 'Jewelery' })
    await expect(jewelery).toHaveFocus()
    await userEvent.keyboard(' ')
    await expect(jewelery).toHaveAttribute('aria-selected', 'true')

    await userEvent.keyboard('{Escape}')
    await expect(combobox).toHaveFocus()
  }
}
