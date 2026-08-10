import type { InjectionKey, Ref } from 'vue'

export type RadioValue = string | number | boolean

export interface RadioGroupContext {
  disabled: Readonly<Ref<boolean>>
  modelValue: Readonly<Ref<RadioValue | undefined>>
  name: Readonly<Ref<string>>
  required: Readonly<Ref<boolean>>
  update: (value: RadioValue) => void
}

export const radioGroupKey: InjectionKey<RadioGroupContext> = Symbol('m-radio-group')
