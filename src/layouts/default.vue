<script setup lang="ts">
import AppFooter from './components/app-footer.vue'
import AppHeader from './components/app-header.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <AppHeader />
    <main id="main-content" class="flex-1"><slot /></main>
    <AppFooter />
  </div>
</template>
