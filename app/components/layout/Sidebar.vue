<script setup lang="ts">
import { useConfigStore } from "~/stores/config";
import { useAuthStore } from "~/stores/auth";

const { isMobileOpen, closeMobile } = useSidebar();
const configStore = useConfigStore();
const authStore = useAuthStore();
const route = useRoute();

// Use local refs that sync with store after mount to avoid hydration issues
const sidebarLayout = ref<"vertical" | "horizontal">("vertical");
const sidebarCollapsed = ref(false);

onMounted(() => {
  sidebarLayout.value = configStore.sidebarLayout;
  sidebarCollapsed.value = configStore.sidebarCollapsed;
  
  watch(() => configStore.sidebarLayout, (val) => {
    sidebarLayout.value = val;
  });
  watch(() => configStore.sidebarCollapsed, (val) => {
    sidebarCollapsed.value = val;
  });
});

// Track which dropdowns are open
const openDropdowns = ref<Set<string>>(new Set());

const toggleDropdown = (label: string) => {
  if (openDropdowns.value.has(label)) {
    openDropdowns.value.delete(label);
  } else {
    openDropdowns.value.add(label);
  }
};

const isDropdownOpen = (label: string) => openDropdowns.value.has(label);

// Get menus from auth store
const menus = computed(() => authStore.getMenus || []);

const isActive = (path?: string) => {
  if (!path) return false;
  if (path === "/") {
    return route.path === "/";
  }
  return route.path.startsWith(path);
};

const isParentActive = (item: any) => {
  if (item.children && item.children.length > 0) {
    return item.children.some((child: any) => isActive(child.link || child.path));
  }
  return isActive(item.link || item.path);
};

// Check if should show sidebar on desktop based on layout
const showOnDesktop = computed(() => sidebarLayout.value === "vertical");
</script>

<template>
  <!-- Mobile overlay - shows for both layouts on mobile -->
  <Transition
    enter-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isMobileOpen"
      class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
      @click="closeMobile"
    />
  </Transition>

  <!-- Sidebar -->
  <aside
    :class="[
      'fixed top-0 left-0 z-50 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300',
      sidebarCollapsed && showOnDesktop ? 'w-20' : 'w-64',
      // Mobile: show when isMobileOpen is true (for both layouts)
      isMobileOpen ? 'translate-x-0' : '-translate-x-full',
      // Desktop: always show for vertical, always hide for horizontal
      showOnDesktop ? 'lg:translate-x-0' : 'lg:-translate-x-full',
    ]"
  >
    <!-- Logo -->
    <div class="flex items-center h-16 px-6 border-b border-slate-200 dark:border-slate-800">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
          <span class="text-white font-bold text-sm">A</span>
        </div>
        <span
          v-if="!sidebarCollapsed || !showOnDesktop"
          class="font-bold text-lg text-slate-900 dark:text-white whitespace-nowrap"
        >
          Admin
        </span>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="p-4 h-[calc(100vh-4rem)] overflow-y-auto">
      <div class="space-y-1">
        <template v-for="item in menus" :key="item.id || item.name">
          <!-- Item with children (dropdown) -->
          <div v-if="item.children && item.children.length > 0">
            <button
              :class="[
                isParentActive(item) ? 'nav-item-active' : 'nav-item',
                sidebarCollapsed && showOnDesktop ? 'justify-center px-3' : '',
                'w-full'
              ]"
              @click="toggleDropdown(item.name)"
            >
              <UiIcon 
                :name="item.icon || 'IconFolder'" 
                type="tabler" 
                size="md" 
                class="flex-shrink-0"
              />
              <span v-if="!sidebarCollapsed || !showOnDesktop" class="truncate flex-1 text-left">{{ item.name }}</span>
              <UiIcon 
                v-if="!sidebarCollapsed || !showOnDesktop"
                name="IconChevronDown" 
                type="tabler" 
                size="sm"
                :class="[
                  'transition-transform duration-200',
                  isDropdownOpen(item.name) ? 'rotate-180' : ''
                ]"
              />
            </button>
            
            <!-- Dropdown children -->
            <Transition
              enter-active-class="transition-all duration-200 ease-out"
              enter-from-class="opacity-0 max-h-0"
              enter-to-class="opacity-100 max-h-96"
              leave-active-class="transition-all duration-150 ease-in"
              leave-from-class="opacity-100 max-h-96"
              leave-to-class="opacity-0 max-h-0"
            >
              <div 
                v-if="isDropdownOpen(item.name) && (!sidebarCollapsed || !showOnDesktop)" 
                class="mt-1 ml-4 pl-4 border-l-2 border-slate-200 dark:border-slate-700 space-y-1 overflow-hidden"
              >
                <NuxtLink
                  v-for="child in item.children"
                  :key="child.id || child.name"
                  :to="child.link || child.path || '#'"
                  :class="[
                    isActive(child.link || child.path) ? 'nav-item-active' : 'nav-item',
                    'py-2'
                  ]"
                  @click="closeMobile"
                >
                  <UiIcon 
                    :name="child.icon || 'IconPoint'" 
                    type="tabler" 
                    size="sm"
                    class="flex-shrink-0"
                  />
                  <span class="truncate text-sm">{{ child.name }}</span>
                </NuxtLink>
              </div>
            </Transition>
          </div>

          <!-- Single item (no children) -->
          <NuxtLink
            v-else
            :to="item.link || item.path || '#'"
            :class="[
              isActive(item.link || item.path) ? 'nav-item-active' : 'nav-item',
              sidebarCollapsed && showOnDesktop ? 'justify-center px-3' : '',
            ]"
            @click="closeMobile"
          >
            <UiIcon 
              :name="item.icon || 'IconCircle'" 
              type="tabler" 
              size="md"
              class="flex-shrink-0"
            />
            <span v-if="!sidebarCollapsed || !showOnDesktop" class="truncate">{{ item.name }}</span>
          </NuxtLink>
        </template>
      </div>
    </nav>
  </aside>
</template>

