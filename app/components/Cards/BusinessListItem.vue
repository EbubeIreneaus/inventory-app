<template>
  <NuxtLink to="/">
    <u-card  class="dark:bg-surface-dark bg-surface-light hover:ring-4">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-xl font-bold capitalize">St Angela Medical health care</p>
        <p class="font-semibold text-secondary">Medicine / Health care</p>
      </div>
      <div class="hidden md:block">
        <p class="text-secondary">Owner: <span class="font-bold">Angela Ngozi</span></p>
        <p class="text-secondary">location: <span class="font-bold">Lagos Nigeria</span></p>
      </div>
      <div class="flex items-center gap-x-3">
        <u-button icon="lucide:star" variant="ghost" />
        <u-icon name="lucide:chevron-right" size="28" />
      </div>
    </div>
  </u-card>
  </NuxtLink>
</template>

<script lang="ts" setup>

</script>

<style>

</style>