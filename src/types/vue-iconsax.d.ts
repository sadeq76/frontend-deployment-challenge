declare module 'vue-iconsax/dist/components/icons/*.vue.js' {
  import type { DefineComponent } from 'vue'

  const Icon: DefineComponent<{
    color?: string
    size?: string | number
    type?: string
  }>
  export default Icon
}
