<template>
  <div class="w-full space-y-4 animate-fade-in">
    <LayoutBreadcrumb :items="breadcrumbs" />

    <!-- Main Card -->
    <div class="bg-white dark:bg-slate-800 rounded-sm shadow-sm overflow-hidden">
      <!-- Header Bar -->
      <div :class="['flex flex-wrap items-center justify-between gap-3 px-5 py-2.5', headerClass]">
        <h2 class="text-lg font-semibold text-white">Data Menu</h2>
      </div>

      <div class="px-3">
        <!-- Tabs -->
        <UiTabs v-model="activeTab" :tabs="tabs">
          <!-- Menu Tab -->
          <template #menu>
            <PagesMenuList />
          </template>

          <!-- Permission Tab (Hak Akses) -->
          <template #permission>
            <PagesMenuPermission />
          </template>
        </UiTabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "default",
  permission: "MENU.VIEW",
});

useHead({
  title: "Permission | Admin Dashboard",
});

const headerThemeClasses: Record<string, string> = {
  red: 'bg-gradient-to-r from-red-500 to-red-400',
  blue: 'bg-gradient-to-r from-blue-500 to-blue-400',
  green: 'bg-gradient-to-r from-green-500 to-green-400',
  purple: 'bg-gradient-to-r from-purple-500 to-purple-400',
  orange: 'bg-gradient-to-r from-orange-500 to-orange-400',
  slate: 'bg-gradient-to-r from-slate-600 to-slate-500',
  primary: 'bg-gradient-to-r from-primary-500 to-primary-400',
}

const headerClass = computed(() => {
  return headerThemeClasses['primary'] || headerThemeClasses.primary
})

const activeTab = ref('menu');
const tabs = [
  { id: 'menu', name: 'Menu' },
  { id: 'permission', name: 'Hak Akses' },
];
const breadcrumbs = ref([
  { label: 'Dashboard', to: '/' },
  { label: 'Settings' },
  { label: 'Permission' },
]);
</script>
