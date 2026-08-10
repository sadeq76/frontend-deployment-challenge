<script setup lang="ts">
import { findRouteSuggestion } from '~/lib/route-registry'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const query = ref(route.path.replace(/^\//, ''))
const suggestion = computed(() => {
  const match = findRouteSuggestion(`/${query.value}`)
  return match && match.score >= 0.45 ? match : null
})

async function search() {
  if (suggestion.value) await router.push(suggestion.value.path)
}
</script>

<template>
  <section class="surface-card mx-auto max-w-xl p-8 text-center">
    <h1 class="text-xl font-bold text-ink">{{ t('notFound.title') }}</h1>
    <p class="mt-3 text-sm leading-7 text-ink-muted">{{ t('notFound.body') }}</p>
    <form class="mt-6 flex gap-2" @submit.prevent="search">
      <MTextField v-model="query" class="flex-1 text-left" :label="t('notFound.searchLabel')" />
      <MButton type="submit" :disabled="!suggestion">{{ t('notFound.search') }}</MButton>
    </form>
    <p v-if="suggestion" class="mt-5 text-sm text-ink-muted">
      {{ t('notFound.suggestionBefore') }}
      <NuxtLink :to="suggestion.path" class="font-bold text-brand">{{ t(suggestion.labelKey) }}</NuxtLink>
      {{ t('notFound.suggestionAfter') }}
    </p>
    <NuxtLink to="/product" class="secondary-button mt-6">{{ t('notFound.viewProducts') }}</NuxtLink>
  </section>
</template>
