<script setup lang="ts">
import { findSimilarRoute, knownRoutes } from '~/lib/fuzzy-route'

const route = useRoute()
const router = useRouter()
const query = ref(route.path.replace(/^\//, ''))
const suggestion = computed(() => {
  const match = findSimilarRoute(`/${query.value}`, knownRoutes)
  return match && match.score >= 0.45 ? match : null
})

async function search() {
  if (suggestion.value) await router.push(suggestion.value.path)
}
</script>

<template>
  <section class="surface-card mx-auto max-w-xl p-8 text-center">
    <h1 class="text-xl font-bold text-ink">Page not found</h1>
    <p class="mt-3 text-sm leading-7 text-ink-muted">The address does not match a page in this site.</p>
    <form class="mt-6 flex gap-2" @submit.prevent="search">
      <MTextField v-model="query" class="flex-1 text-left" label="Search for a page" />
      <MButton type="submit" :disabled="!suggestion">Search</MButton>
    </form>
    <p v-if="suggestion" class="mt-5 text-sm text-ink-muted">Did you mean <NuxtLink :to="suggestion.path" class="font-bold text-brand">{{ suggestion.path }}</NuxtLink>?</p>
    <NuxtLink to="/product" class="secondary-button mt-6">View products</NuxtLink>
  </section>
</template>
