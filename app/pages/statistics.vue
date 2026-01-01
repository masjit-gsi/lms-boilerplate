<script setup lang="ts">
definePageMeta({
  layout: "default",
});

useHead({
  title: "Statistics | Admin Dashboard",
});
</script>

<template>
  <div class="w-full space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Statistics</h1>
      <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
        View detailed statistics and analytics.
      </p>
    </div>

    <UiCard>
      <div class="text-center py-12">
        <svg class="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        <p class="text-slate-500 dark:text-slate-400">Statistics page coming soon</p>
      </div>
    </UiCard>
  </div>
</template>
