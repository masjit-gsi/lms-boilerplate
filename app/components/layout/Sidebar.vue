<script setup lang="ts">
import { useConfigStore } from "~/stores/config";

interface NavItem {
  label: string;
  to?: string;
  icon: string;
  badge?: string | number;
  children?: NavItem[];
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

const { isMobileOpen, closeMobile } = useSidebar();
const configStore = useConfigStore();
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

const navigation: NavSection[] = [
  {
    items: [
      { label: "Dashboard", to: "/", icon: "home" },
      { 
        label: "User Management", 
        icon: "users",
        children: [
          { label: "Students", to: "/users/students", icon: "academic-cap" },
          { label: "Instructors", to: "/users/instructors", icon: "user-group" },
          { label: "Admins", to: "/users", icon: "shield" },
        ]
      },
      { 
        label: "Course Management", 
        icon: "book-open",
        children: [
          { label: "All Courses", to: "/courses", icon: "book-open" },
          { label: "Create Course", to: "/courses/create", icon: "plus-circle" },
          { label: "Assignments", to: "/courses/assignments", icon: "clipboard-check" },
          { label: "Quizzes", to: "/courses/quizzes", icon: "puzzle" },
        ]
      },
      {
        label: "Learning",
        icon: "academic-cap",
        children: [
          { label: "Enrollments", to: "/learning/enrollments", icon: "users" },
          { label: "Progress", to: "/learning/progress", icon: "chart-bar" },
        ]
      },
    ],
  },
  {
    title: "Communication",
    items: [
      { label: "Discussions", to: "/communication/discussions", icon: "chat-alt" },
      { label: "Announcements", to: "/communication/announcements", icon: "speakerphone" },
    ],
  },
  {
    title: "Settings",
    items: [
      { label: "Profile", to: "/profile", icon: "user" },
      { label: "System Settings", to: "/settings", icon: "settings" },
    ],
  },
];

const isActive = (path?: string) => {
  if (!path) return false;
  if (path === "/") {
    return route.path === "/";
  }
  return route.path.startsWith(path);
};

const isParentActive = (item: NavItem) => {
  if (item.children) {
    return item.children.some(child => isActive(child.to));
  }
  return isActive(item.to);
};

// Icons SVG paths
const icons: Record<string, string> = {
  home: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  users: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
  "user-group": "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  shield: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  "book-open": "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  "academic-cap": "M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222",
  "plus-circle": "M12 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z",
  "clipboard-check": "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
  "puzzle": "M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V7a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 00-1.447.894v8.721l4-2V7a1 1 0 00-.553-.894l-2 .447z",
  "chat-alt": "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z",
  "speakerphone": "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z",
  "chart-bar": "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  user: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  settings: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  chevronDown: "M19 9l-7 7-7-7",
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
      <div v-for="(section, sIndex) in navigation" :key="sIndex" class="mb-6">
        <p
          v-if="section.title && (!sidebarCollapsed || !showOnDesktop)"
          class="px-4 mb-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider"
        >
          {{ section.title }}
        </p>
        <div class="space-y-1">
          <template v-for="item in section.items" :key="item.label">
            <!-- Item with children (dropdown) -->
            <div v-if="item.children">
              <button
                :class="[
                  isParentActive(item) ? 'nav-item-active' : 'nav-item',
                  sidebarCollapsed && showOnDesktop ? 'justify-center px-3' : '',
                  'w-full'
                ]"
                @click="toggleDropdown(item.label)"
              >
                <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" :d="icons[item.icon]" />
                </svg>
                <span v-if="!sidebarCollapsed || !showOnDesktop" class="truncate flex-1 text-left">{{ item.label }}</span>
                <svg 
                  v-if="!sidebarCollapsed || !showOnDesktop"
                  :class="[
                    'w-4 h-4 transition-transform duration-200',
                    isDropdownOpen(item.label) ? 'rotate-180' : ''
                  ]"
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  stroke-width="2"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" :d="icons.chevronDown" />
                </svg>
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
                  v-if="isDropdownOpen(item.label) && (!sidebarCollapsed || !showOnDesktop)" 
                  class="mt-1 ml-4 pl-4 border-l-2 border-slate-200 dark:border-slate-700 space-y-1 overflow-hidden"
                >
                  <NuxtLink
                    v-for="child in item.children"
                    :key="child.to"
                    :to="child.to"
                    :class="[
                      isActive(child.to) ? 'nav-item-active' : 'nav-item',
                      'py-2'
                    ]"
                    @click="closeMobile"
                  >
                    <svg class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" :d="icons[child.icon]" />
                    </svg>
                    <span class="truncate text-sm">{{ child.label }}</span>
                  </NuxtLink>
                </div>
              </Transition>
            </div>

            <!-- Single item (no children) -->
            <NuxtLink
              v-else
              :to="item.to"
              :class="[
                isActive(item.to) ? 'nav-item-active' : 'nav-item',
                sidebarCollapsed && showOnDesktop ? 'justify-center px-3' : '',
              ]"
              @click="closeMobile"
            >
              <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" :d="icons[item.icon]" />
              </svg>
              <span v-if="!sidebarCollapsed || !showOnDesktop" class="truncate">{{ item.label }}</span>
              <span
                v-if="item.badge && (!sidebarCollapsed || !showOnDesktop)"
                class="ml-auto badge-primary text-xs"
              >
                {{ item.badge }}
              </span>
            </NuxtLink>
          </template>
        </div>
      </div>
    </nav>
  </aside>
</template>
