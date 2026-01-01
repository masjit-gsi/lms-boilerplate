<script setup lang="ts">
definePageMeta({
  layout: "default",
});

useHead({
  title: "Profile | Admin Dashboard",
});
</script>

<template>
  <div class="w-full space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Profile</h1>
      <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Manage your account settings and profile information.
      </p>
    </div>

    <UiCard>
      <div class="text-center py-12">
        <svg class="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <p class="text-slate-500 dark:text-slate-400">Profile page coming soon</p>
      </div>
    </UiCard>
  </div>
</template>
