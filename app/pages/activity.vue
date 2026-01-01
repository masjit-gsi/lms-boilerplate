<script setup lang="ts">
definePageMeta({
  layout: "default",
});

useHead({
  title: "Activity | Admin Dashboard",
});
</script>

<template>
  <div class="w-full space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Activity</h1>
      <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
        View all recent activity and logs.
      </p>
    </div>

    <UiCard>
      <div class="text-center py-12">
        <svg class="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-slate-500 dark:text-slate-400">Activity page coming soon</p>
      </div>
    </UiCard>
  </div>
</template>
