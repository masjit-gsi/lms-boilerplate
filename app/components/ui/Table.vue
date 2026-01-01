<script setup lang="ts">
interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
}

interface Props {
  columns: Column[];
  data: Record<string, unknown>[];
  loading?: boolean;
  emptyMessage?: string;
}

withDefaults(defineProps<Props>(), {
  loading: false,
  emptyMessage: "No data available",
});

const emit = defineEmits<{
  rowClick: [row: Record<string, unknown>];
}>();
</script>

<template>
  <div class="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
            <th
              v-for="column in columns"
              :key="column.key"
              :style="{ width: column.width }"
              class="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider"
            >
              <slot :name="`header-${column.key}`" :column="column">
                {{ column.label }}
              </slot>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-800">
          <template v-if="loading">
            <tr v-for="i in 5" :key="i">
              <td v-for="column in columns" :key="column.key" class="px-6 py-4">
                <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              </td>
            </tr>
          </template>
          <template v-else-if="data.length === 0">
            <tr>
              <td :colspan="columns.length" class="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                {{ emptyMessage }}
              </td>
            </tr>
          </template>
          <template v-else>
            <tr
              v-for="(row, index) in data"
              :key="index"
              class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
              @click="emit('rowClick', row)"
            >
              <td
                v-for="column in columns"
                :key="column.key"
                class="px-6 py-4 text-sm text-slate-700 dark:text-slate-300"
              >
                <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
                  {{ row[column.key] }}
                </slot>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>
