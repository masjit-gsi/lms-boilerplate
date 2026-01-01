<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useConfigStore } from "~/stores/config";

const authStore = useAuthStore();
const configStore = useConfigStore();
const { isCollapsed, isMobileOpen, closeMobile, toggle } = useSidebar();

// Use local refs that sync with store after mount to avoid hydration issues
const sidebarLayout = ref<"vertical" | "horizontal">("vertical");
const sidebarCollapsed = ref(false);

// Initialize config on mount (client-side only)
onMounted(() => {
  configStore.initConfig();
  // Sync local refs with store after hydration
  sidebarLayout.value = configStore.sidebarLayout;
  sidebarCollapsed.value = configStore.sidebarCollapsed;
  
  // Watch store changes
  watch(() => configStore.sidebarLayout, (val) => {
    sidebarLayout.value = val;
  });
  watch(() => configStore.sidebarCollapsed, (val) => {
    sidebarCollapsed.value = val;
  });
});

// Handle logout
const handleLogout = () => {
  authStore.logout();
  closeMobile();
  navigateTo("/login");
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950">
    <!-- Sidebar -->
    <LayoutSidebar />

    <!-- Header -->
    <LayoutHeader />

    <!-- Settings Panel (FAB + Panel) -->
    <LayoutSettingsPanel />

    <!-- Toast Notifications -->
    <UiToast />

    <!-- Main content -->
    <main
      :class="[
        'pt-16 min-h-screen transition-all duration-300 w-full',
        sidebarLayout === 'vertical' 
          ? (sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64')
          : '',
      ]"
    >
      <div class="p-4 lg:p-6">
        <slot />
      </div>
    </main>
  </div>
</template>
