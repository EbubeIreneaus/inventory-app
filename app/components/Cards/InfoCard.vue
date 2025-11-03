<template>
  <u-card>
    <div
      class=""
    >
      <p class="text-theme-sm text-gray-500 dark:text-gray-400">
        {{ title }}
      </p>

      <div class="mt-3 flex items-center justify-between">
        <div>
          <h4 class="text-2xl font-bold text-gray-800 dark:text-white/90">
            24.7K
          </h4>
        </div>

        <div class="flex items-center gap-1">
          <span
            class="flex items-center gap-1 rounded-full bg-success-50 px-2 py-0.5 text-xs font-medium text-success-600 dark:bg-success-500/15 dark:text-success-500"
          >
            +20%
          </span>

          <span class="text-xs">
            today
          </span>
        </div>
      </div>
    </div>
  </u-card>
</template>

<script lang="ts" setup>
defineProps<{
  title: string
}>()
</script>

<style></style>
