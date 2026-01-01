<script setup lang="ts">
interface Props {
  title: string;
  subtitle?: string;
}

defineProps<Props>();
</script>

<template>
  <UiCard>
    <template #header>
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-semibold text-slate-900 dark:text-white">{{ title }}</h3>
          <p v-if="subtitle" class="text-sm text-slate-500 dark:text-slate-400">{{ subtitle }}</p>
        </div>
        <slot name="actions" />
      </div>
    </template>
    
    <!-- Chart placeholder -->
    <div class="h-64 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-xl">
      <div class="text-center">
        <svg class="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Chart visualization area
        </p>
        <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Integrate with ApexCharts or Chart.js
        </p>
      </div>
    </div>
  </UiCard>
</template>
