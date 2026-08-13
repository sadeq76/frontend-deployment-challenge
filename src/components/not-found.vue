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
    <h1 class="text-ink text-xl font-bold">{{ t('notFound.title') }}</h1>
    <p class="text-ink-muted mt-3 text-sm leading-7">{{ t('notFound.body') }}</p>
    <form class="mt-6 flex gap-2" @submit.prevent="search">
      <MText
        v-model="query"
        class="flex-1 text-left"
        :label="t('notFound.searchLabel')"
        :placeholder="t('notFound.searchLabel')"
        prepend-icon="PhMagnifyingGlass"
        clearable
      />
      <MBtn type="submit" :text="t('notFound.search')" :disabled="!suggestion" />
    </form>
    <p v-if="suggestion" class="text-ink-muted mt-5 text-sm">
      {{ t('notFound.suggestionBefore') }}
      <NuxtLink :to="suggestion.path" class="text-primary font-bold">{{ t(suggestion.labelKey) }}</NuxtLink>
      {{ t('notFound.suggestionAfter') }}
    </p>
    <MBtn href="/product" variant="secondary" class="mt-6" :text="t('notFound.viewProducts')" />
  </section>
</template>
