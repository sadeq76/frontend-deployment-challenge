<script lang="ts" setup>
  import { defineAsyncComponent } from 'vue';

  withDefaults(
    defineProps<{
      name: string;
      size?: number | string;
      color?: string;
      weight?: string;
    }>(),
    {
      size: 24,
      color: "currentColor",
      weight: "regular",
    }
  );
</script>

<template>
  <component
    v-bind="$attrs"
    :is="defineAsyncComponent(() => import(`@phosphor-icons/vue`).then((m: any) => m[name]))"
    :class="`text-${color}`"
    :size
    :weight
  />
</template>
