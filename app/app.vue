<template>
  <div>
    <u-app>
      <nuxt-layout>
        <nuxt-loading-indicator />
        <nuxt-page />
      </nuxt-layout>
    </u-app>
    <loading v-if="isLoading" />
  </div>
</template>

<script setup lang="ts">
const isLoading = ref(true);

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 2000); // tiny delay for smoothness, optional
});
</script>
