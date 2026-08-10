import { expect, within } from 'storybook/test'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MDataTable from './m-data-table.vue'

const rows = [
  { key: 'price', label: 'Price', value: '28,000,000 تومان' },
  {
    key: 'description',
    label: 'Description',
    value: 'Includes obstacle sensors and an emergency stop button.\nDesigned for daily use.'
  },
  { key: 'category', label: 'Category', value: 'Appliance' },
  { key: 'rating', label: 'Rating', value: 5 }
]

const meta = {
  title: 'UI/MDataTable',
  component: MDataTable,
  tags: ['autodocs', 'test'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A responsive key/value list for API data. Pass labelled rows or a plain data object; use the `key` and `value` slots for custom rendering.'
      }
    }
  }
} satisfies Meta<typeof MDataTable>

export default meta
type Story = StoryObj<typeof meta>

export const Rows: Story = {
  args: { label: 'Technical specifications', rows },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Price')).toBeVisible()
    await expect(canvas.getByText(/28,000,000/)).toBeVisible()
  }
}

export const ObjectData: Story = {
  args: {
    label: 'Product data',
    data: { title: 'Mini Market product', inStock: true, quantity: 5, price: 28000000 }
  }
}

export const CustomValue: Story = {
  args: { label: 'Inventory', rows: [{ key: 'stock', label: 'Availability', value: true }] },
  render: (args) => ({
    components: { MDataTable },
    setup: () => ({ args }),
    template: `
      <MDataTable v-bind="args">
        <template #value="{ value }">
          <span :class="value ? 'text-emerald-700' : 'text-red-700'">{{ value ? 'Available' : 'Unavailable' }}</span>
        </template>
      </MDataTable>
    `
  })
}
