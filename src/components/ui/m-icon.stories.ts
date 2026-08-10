import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MIcon from './m-icon.vue'

const meta = {
  title: 'UI/MIcon',
  component: MIcon,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A decorative Vuesax icon wrapper. It is intentionally hidden from assistive technologies; pair it with visible text or an accessible label on its parent control.'
      }
    }
  },
  argTypes: {
    name: {
      control: 'select',
      options: [
        'ArrowDown2',
        'ArrowLeft',
        'Book',
        'Call',
        'Category2',
        'CloseCircle',
        'Filter',
        'Home',
        'Menu',
        'Messages',
        'MessageQuestion',
        'SearchNormal1',
        'SearchZoomIn',
        'Star'
      ]
    },
    type: { control: 'select', options: ['linear', 'outline', 'bold', 'bulk', 'broken', 'twotone'] }
  }
} satisfies Meta<typeof MIcon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { name: 'Star', size: 28, type: 'linear' } }
export const Bold: Story = { args: { name: 'Star', size: 28, type: 'bold' } }
export const AvailableIcons: Story = {
  args: { name: 'Menu' },
  render: () => ({
    components: { MIcon },
    template: `
      <div class="grid grid-cols-2 gap-4 text-ink sm:grid-cols-3">
        <span class="flex items-center gap-2"><MIcon name="ArrowDown2" :size="28" /> Arrow down</span>
        <span class="flex items-center gap-2"><MIcon name="ArrowLeft" :size="28" /> Arrow left</span>
        <span class="flex items-center gap-2"><MIcon name="Book" :size="28" /> Book</span>
        <span class="flex items-center gap-2"><MIcon name="Call" :size="28" /> Call</span>
        <span class="flex items-center gap-2"><MIcon name="Category2" :size="28" /> Category</span>
        <span class="flex items-center gap-2"><MIcon name="Menu" :size="28" /> Menu</span>
        <span class="flex items-center gap-2"><MIcon name="CloseCircle" :size="28" /> Close circle</span>
        <span class="flex items-center gap-2"><MIcon name="Filter" :size="28" /> Filter</span>
        <span class="flex items-center gap-2"><MIcon name="Home" :size="28" /> Home</span>
        <span class="flex items-center gap-2"><MIcon name="Messages" :size="28" /> Messages</span>
        <span class="flex items-center gap-2"><MIcon name="MessageQuestion" :size="28" /> Message question</span>
        <span class="flex items-center gap-2"><MIcon name="SearchNormal1" :size="28" /> Search</span>
        <span class="flex items-center gap-2"><MIcon name="SearchZoomIn" :size="28" /> Search zoom in</span>
        <span class="flex items-center gap-2"><MIcon name="Star" :size="28" /> Star</span>
      </div>
    `
  })
}
