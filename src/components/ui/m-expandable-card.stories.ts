import { ref } from 'vue'
import { expect, userEvent, within } from 'storybook/test'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MExpandableCard from './m-expandable-card.vue'
import MIcon from './m-icon.vue'

type ExpandableCardStoryArgs = InstanceType<typeof MExpandableCard>['$props']

const categories = [
  { count: '12', label: 'لوازم خانگی', value: 'home' },
  { count: '8', label: 'کالای دیجیتال', value: 'digital' },
  { count: '4', label: 'مد و پوشاک', value: 'fashion' }
]

const meta = {
  title: 'UI/MExpandableCard',
  component: MExpandableCard,
  tags: ['autodocs', 'test'],
  decorators: [
    () => ({
      template: '<div style="width: min(270px, calc(100vw - 32px))"><story /></div>'
    })
  ],
  parameters: {
    docs: {
      description: {
        component:
          'A compact, RTL-first disclosure card. Use `v-model` for controlled expansion or `default-expanded` for local state; pass selection rows through the `body` slot.'
      }
    }
  },
  argTypes: {
    defaultExpanded: { control: 'boolean' },
    modelValue: { control: 'boolean' },
    toggleLabel: { control: 'text' }
  }
} satisfies Meta<ExpandableCardStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Collapsed: Story = {
  args: {
    body: 'برای مشاهدهٔ گزینه‌ها کارت را باز کنید.',
    defaultExpanded: false,
    title: 'دسته‌بندی محصولات'
  }
}

export const Expanded: Story = {
  args: {
    body: 'برای مشاهدهٔ گزینه‌ها کارت را باز کنید.',
    defaultExpanded: true,
    title: 'دسته‌بندی محصولات'
  }
}

export const SelectionRows: Story = {
  args: {
    defaultExpanded: true,
    title: 'دسته‌بندی محصولات'
  },
  render: (args) => ({
    components: { MExpandableCard, MIcon },
    setup: () => ({ args, categories, selected: ref(['digital']) }),
    template: `
      <MExpandableCard v-bind="args">
        <template #body>
          <label v-for="category in categories" :key="category.value" class="flex min-h-6 items-center gap-3">
            <input v-model="selected" :value="category.value" type="checkbox" class="peer sr-only" />
            <span
              class="grid size-5 shrink-0 place-items-center rounded-[6px] border border-[#b6c6d7] bg-white text-white peer-checked:border-brand peer-checked:bg-brand peer-focus-visible:ring-2 peer-focus-visible:ring-brand peer-focus-visible:ring-offset-2"
              aria-hidden="true"
            >
              <MIcon name="PhCheck" :size="14" weight="bold" class="hidden peer-checked:block" />
            </span>
            <span class="label-md text-ink-muted">{{ category.label }}</span>
            <span
              class="ms-auto inline-flex min-h-6 min-w-[25px] items-center justify-center rounded-[6px] bg-[#141928] px-1 text-xs font-semibold leading-4 text-white"
              :class="{ 'bg-brand': selected.includes(category.value) }"
            >
              {{ category.count }}
            </span>
          </label>
        </template>
      </MExpandableCard>
    `
  })
}

export const Controlled: Story = {
  args: { title: 'دسته‌بندی محصولات' },
  render: (args) => ({
    components: { MExpandableCard },
    setup: () => ({ args, expanded: ref(false) }),
    template: `
      <MExpandableCard v-bind="args" v-model="expanded">
        <template #body>این محتوا با v-model کنترل می‌شود.</template>
      </MExpandableCard>
    `
  })
}

export const KeyboardToggle: Story = {
  args: {
    body: 'این محتوا با کلیدهای Enter و Space باز و بسته می‌شود.',
    defaultExpanded: false,
    title: 'دسته‌بندی محصولات'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'دسته‌بندی محصولات' })

    trigger.focus()
    await expect(trigger).toHaveFocus()
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await userEvent.keyboard('{Enter}')
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(canvas.getByText('این محتوا با کلیدهای Enter و Space باز و بسته می‌شود.')).toBeVisible()

    await userEvent.keyboard(' ')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  }
}
