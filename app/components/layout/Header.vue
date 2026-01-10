<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useConfigStore } from "~/stores/config";

const { toggle, openMobile } = useSidebar();
const authStore = useAuthStore();
const configStore = useConfigStore();

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

// Language switcher
const languages = [
  { code: 'id', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
];
const currentLang = ref('id');
const showLangDropdown = ref(false);

const setLanguage = (code: string) => {
  currentLang.value = code;
  showLangDropdown.value = false;
  // TODO: Implement actual i18n logic here
};

const currentLanguage = computed(() => languages.find(l => l.code === currentLang.value));

// Notifications
const showNotifications = ref(false);
const notifications = ref([
  { id: 1, title: 'Tugas baru tersedia', message: 'Matematika - Bab 5 telah ditambahkan', time: '5 menit lalu', read: false },
  { id: 2, title: 'Pengumuman', message: 'Ujian semester akan dimulai minggu depan', time: '1 jam lalu', read: false },
  { id: 3, title: 'Nilai diperbarui', message: 'Nilai quiz Bahasa Indonesia telah dirilis', time: '2 jam lalu', read: true },
]);

const unreadCount = computed(() => notifications.value.filter(n => !n.read).length);

const markAsRead = (id: number) => {
  const notif = notifications.value.find(n => n.id === id);
  if (notif) notif.read = true;
};

const markAllAsRead = () => {
  notifications.value.forEach(n => n.read = true);
};

// User menu
const userMenuItems = [
  { label: "Profile", value: "profile" },
  { label: "Settings", value: "settings" },
  { divider: true, label: "" },
  { label: "Logout", value: "logout", danger: true },
];

const handleUserMenuSelect = (item: { value?: string }) => {
  if (item.value === "logout") {
    authStore.logout();
    navigateTo("/login");
  } else if (item.value) {
    navigateTo(`/${item.value}`);
  }
};

// Close dropdowns when clicking outside
const closeDropdowns = () => {
  showLangDropdown.value = false;
  showNotifications.value = false;
};

// Handle click outside to close dropdowns
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  // Check if click is outside language dropdown
  if (!target.closest('.lang-dropdown-container')) {
    showLangDropdown.value = false;
  }
  // Check if click is outside notification dropdown
  if (!target.closest('.notification-dropdown-container')) {
    showNotifications.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <header
    :class="[
      'fixed top-0 z-30 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg transition-all duration-300',
      sidebarLayout === 'horizontal' 
        ? 'left-0 right-0' 
        : sidebarCollapsed ? 'left-0 lg:left-20 right-0' : 'left-0 lg:left-64 right-0',
    ]"
    style="box-shadow: rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px;"
  >
    <div class="flex items-center justify-between h-full px-4 lg:px-6">
      <!-- Left section -->
      <div class="flex items-center gap-4">
        <!-- Logo (only for horizontal layout on desktop) -->
        <UiAppLogo v-if="sidebarLayout === 'horizontal'" class="hidden lg:flex mr-4" />

        <!-- Mobile menu button (for both layouts on mobile) -->
        <button
          class="lg:hidden p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          @click="openMobile"
        >
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <!-- Collapse toggle (desktop, vertical only) -->
        <button
          v-if="sidebarLayout === 'vertical'"
          class="hidden lg:flex p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          @click="configStore.toggleSidebar()"
        >
          <svg
            class="w-5 h-5 transition-transform"
            :class="{ 'rotate-180': sidebarCollapsed }"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>

        <!-- Horizontal Navigation (desktop only) -->
        <LayoutHorizontalNav v-if="sidebarLayout === 'horizontal'" />

        <!-- Search (only show when vertical layout on desktop) -->
        <div v-if="sidebarLayout === 'vertical'" class="hidden md:block relative">
          <svg
            class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            class="w-64 pl-10 pr-4 py-2 text-sm bg-slate-100 dark:bg-slate-800 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-900 dark:text-white placeholder:text-slate-400"
          />
        </div>
      </div>

      <!-- Right section -->
      <div class="flex items-center gap-2">
        <!-- Search for horizontal layout on desktop -->
        <div v-if="sidebarLayout === 'horizontal'" class="hidden lg:block relative">
          <svg
            class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            class="w-48 pl-10 pr-4 py-2 text-sm bg-slate-100 dark:bg-slate-800 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-900 dark:text-white placeholder:text-slate-400"
          />
        </div>

        <!-- Language Switcher -->
        <div class="relative lang-dropdown-container">
          <button
            class="flex items-center gap-1.5 px-2.5 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            @click="showLangDropdown = !showLangDropdown"
          >
            <span class="text-lg">{{ currentLanguage?.flag }}</span>
            <!-- <span class="hidden sm:inline text-sm font-medium">{{ currentLanguage?.code.toUpperCase() }}</span> -->
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <!-- Language Dropdown -->
          <Transition
            enter-active-class="transition-all duration-200 ease-out"
            enter-from-class="opacity-0 scale-95 -translate-y-2"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition-all duration-150 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="showLangDropdown"
              class="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50"
            >
              <button
                v-for="lang in languages"
                :key="lang.code"
                class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                :class="{ 'bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400': currentLang === lang.code }"
                @click="setLanguage(lang.code)"
              >
                <span class="text-lg">{{ lang.flag }}</span>
                <span>{{ lang.name }}</span>
              </button>
            </div>
          </Transition>
        </div>

        <!-- Theme toggle - ClientOnly to prevent hydration mismatch -->
        <ClientOnly>
          <button
            class="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            @click="configStore.toggleTheme()"
          >
            <svg v-if="configStore.isDarkTheme" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>
          <template #fallback>
            <div class="p-2">
              <div class="w-5 h-5 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
            </div>
          </template>
        </ClientOnly>

        <!-- Notifications -->
        <div class="relative notification-dropdown-container">
          <button
            class="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors relative"
            @click="showNotifications = !showNotifications"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span v-if="unreadCount > 0" class="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-medium">
              {{ unreadCount }}
            </span>
          </button>
          <!-- Notifications Dropdown -->
          <Transition
            enter-active-class="transition-all duration-200 ease-out"
            enter-from-class="opacity-0 scale-95 -translate-y-2"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition-all duration-150 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="showNotifications"
              class="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 z-50 overflow-hidden"
            >
              <!-- Header -->
              <div class="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                <h3 class="font-semibold text-slate-900 dark:text-white">Notifikasi</h3>
                <button
                  v-if="unreadCount > 0"
                  class="text-xs text-primary-500 hover:text-primary-600 font-medium"
                  @click="markAllAsRead"
                >
                  Tandai semua dibaca
                </button>
              </div>
              <!-- Notification List -->
              <div class="max-h-80 overflow-y-auto">
                <div
                  v-for="notif in notifications"
                  :key="notif.id"
                  class="px-4 py-3 border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer"
                  :class="{ 'bg-primary-50/50 dark:bg-primary-950/30': !notif.read }"
                  @click="markAsRead(notif.id)"
                >
                  <div class="flex items-start gap-3">
                    <div class="w-2 h-2 mt-2 rounded-full flex-shrink-0" :class="notif.read ? 'bg-transparent' : 'bg-primary-500'"></div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-slate-900 dark:text-white truncate">{{ notif.title }}</p>
                      <p class="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{{ notif.message }}</p>
                      <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">{{ notif.time }}</p>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Footer -->
              <div class="px-4 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <button class="w-full text-sm text-primary-500 hover:text-primary-600 font-medium">
                  Lihat semua notifikasi
                </button>
              </div>
            </div>
          </Transition>
        </div>

        <!-- User menu - ClientOnly to prevent hydration mismatch -->
        <ClientOnly>
          <UiDropdown :items="userMenuItems" @select="handleUserMenuSelect">
            <template #trigger>
              <button class="flex items-center gap-3 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                <UiAvatar :name="authStore.user?.name || 'User'" size="sm" />
                <div class="hidden md:block text-left">
                  <p class="text-sm font-medium text-slate-900 dark:text-white">{{ authStore.user?.name || 'User' }}</p>
                  <p class="text-xs text-slate-500 dark:text-slate-400">{{ typeof authStore.user?.role === 'object' ? authStore.user?.role?.name : authStore.user?.role || 'Guest' }}</p>
                </div>
                <svg class="hidden md:block w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </template>
          </UiDropdown>
          <template #fallback>
            <div class="flex items-center gap-3 p-1.5">
              <div class="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
              <div class="hidden md:block space-y-1">
                <div class="w-20 h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                <div class="w-12 h-2 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              </div>
            </div>
          </template>
        </ClientOnly>
      </div>
    </div>
  </header>
</template>
