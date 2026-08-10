<script setup lang="ts">
const props = defineProps<{ error: { statusCode?: number } }>()
const { t } = useI18n()
const notFound = computed(() => props.error.statusCode === 404)
useSeoMeta({
  title: () => (notFound.value ? t('state.notFoundTitle') : t('state.errorTitle')),
  robots: 'noindex,nofollow'
})
</script>

<template>
  <div class="grid min-h-screen place-items-center bg-canvas p-4">
    <NotFound v-if="notFound" /><StatePanel
      v-else
      :title="t('state.errorTitle')"
      :body="t('state.errorBody')"
      :action="t('state.home')"
      @action="clearError({ redirect: '/product' })"
    />
  </div>
</template>
