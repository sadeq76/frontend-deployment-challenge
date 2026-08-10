<script setup lang="ts">
import { computed } from 'vue'
import ArrowDown2Icon from 'vue-iconsax/dist/components/icons/ArrowDown2.vue.js'
import ArrowLeftIcon from 'vue-iconsax/dist/components/icons/ArrowLeft.vue.js'
import BookIcon from 'vue-iconsax/dist/components/icons/Book.vue.js'
import CallIcon from 'vue-iconsax/dist/components/icons/Call.vue.js'
import Category2Icon from 'vue-iconsax/dist/components/icons/Category2.vue.js'
import CloseCircleIcon from 'vue-iconsax/dist/components/icons/CloseCircle.vue.js'
import FilterIcon from 'vue-iconsax/dist/components/icons/Filter.vue.js'
import HomeIcon from 'vue-iconsax/dist/components/icons/Home.vue.js'
import MenuIcon from 'vue-iconsax/dist/components/icons/Menu.vue.js'
import MessagesIcon from 'vue-iconsax/dist/components/icons/Messages.vue.js'
import MessageQuestionIcon from 'vue-iconsax/dist/components/icons/MessageQuestion.vue.js'
import SearchNormal1Icon from 'vue-iconsax/dist/components/icons/SearchNormal1.vue.js'
import SearchZoomInIcon from 'vue-iconsax/dist/components/icons/SearchZoomIn.vue.js'
import StarIcon from 'vue-iconsax/dist/components/icons/Star.vue.js'

const props = withDefaults(
  defineProps<{
    name:
      | 'ArrowDown2'
      | 'ArrowLeft'
      | 'Book'
      | 'Call'
      | 'Category2'
      | 'CloseCircle'
      | 'Filter'
      | 'Home'
      | 'Menu'
      | 'Messages'
      | 'MessageQuestion'
      | 'SearchNormal1'
      | 'SearchZoomIn'
      | 'Star'
    size?: number | string
    type?: 'linear' | 'outline' | 'bold' | 'bulk' | 'broken' | 'twotone'
  }>(),
  { size: 20, type: 'linear' }
)

const icons = {
  ArrowDown2: ArrowDown2Icon,
  ArrowLeft: ArrowLeftIcon,
  Book: BookIcon,
  Call: CallIcon,
  Category2: Category2Icon,
  CloseCircle: CloseCircleIcon,
  Filter: FilterIcon,
  Home: HomeIcon,
  Menu: MenuIcon,
  Messages: MessagesIcon,
  MessageQuestion: MessageQuestionIcon,
  SearchNormal1: SearchNormal1Icon,
  SearchZoomIn: SearchZoomInIcon,
  Star: StarIcon
}
const icon = computed(() => icons[props.name])
</script>

<template>
  <component :is="icon" :size="size" :type="type" color="currentColor" aria-hidden="true" />
</template>
