import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MIcon from './m-icon.vue'

const meta = {
  title: 'UI/MIcon',
  component: MIcon,
  tags: ['autodocs', 'test'],
  parameters: {
    docs: {
      description: {
        component:
          'A decorative, async-loaded Phosphor icon wrapper. It is intentionally hidden from assistive technologies; pair it with visible text or an accessible label on its parent control.'
      }
    }
  },
  argTypes: {
    name: {
      control: 'select',
      options: [
        'PhCaretDown',
        'PhArrowLeft',
        'PhBookOpen',
        'PhPhone',
        'PhSquaresFour',
        'PhXCircle',
        'PhFunnel',
        'PhHouse',
        'PhList',
        'PhChatsCircle',
        'PhQuestion',
        'PhMagnifyingGlass',
        'PhMagnifyingGlassPlus',
        'PhStar'
      ]
    },
    weight: { control: 'select', options: ['thin', 'light', 'regular', 'bold', 'fill', 'duotone'] }
  }
} satisfies Meta<typeof MIcon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { name: 'PhStar', size: 28, weight: 'regular' } }
export const Bold: Story = { args: { name: 'PhStar', size: 28, weight: 'bold' } }
export const AvailableIcons: Story = {
  args: { name: 'PhList' },
  render: () => ({
    components: { MIcon },
    template: `
      <div class="grid grid-cols-2 gap-4 text-ink sm:grid-cols-3">
        <span class="flex items-center gap-2"><MIcon name="PhCaretDown" :size="28" /> Arrow down</span>
        <span class="flex items-center gap-2"><MIcon name="PhArrowLeft" :size="28" /> Arrow left</span>
        <span class="flex items-center gap-2"><MIcon name="PhBookOpen" :size="28" /> Book</span>
        <span class="flex items-center gap-2"><MIcon name="PhPhone" :size="28" /> Call</span>
        <span class="flex items-center gap-2"><MIcon name="PhSquaresFour" :size="28" /> Category</span>
        <span class="flex items-center gap-2"><MIcon name="PhList" :size="28" /> Menu</span>
        <span class="flex items-center gap-2"><MIcon name="PhXCircle" :size="28" /> Close circle</span>
        <span class="flex items-center gap-2"><MIcon name="PhFunnel" :size="28" /> Filter</span>
        <span class="flex items-center gap-2"><MIcon name="PhHouse" :size="28" /> Home</span>
        <span class="flex items-center gap-2"><MIcon name="PhChatsCircle" :size="28" /> Messages</span>
        <span class="flex items-center gap-2"><MIcon name="PhQuestion" :size="28" /> Message question</span>
        <span class="flex items-center gap-2"><MIcon name="PhMagnifyingGlass" :size="28" /> Search</span>
        <span class="flex items-center gap-2"><MIcon name="PhMagnifyingGlassPlus" :size="28" /> Search zoom in</span>
        <span class="flex items-center gap-2"><MIcon name="PhStar" :size="28" /> Star</span>
      </div>
    `
  })
}
