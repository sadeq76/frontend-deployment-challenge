<script setup lang="ts">
const { localeProperties } = useI18n()
</script>

<template>
  <Html :lang="localeProperties.language" :dir="localeProperties.dir">
    <Body>
      <NuxtLayout><NuxtPage /></NuxtLayout>
    </Body>
  </Html>
</template>
