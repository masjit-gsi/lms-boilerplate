import { defineStore } from "pinia";

export interface AppConfig {
    // Theme settings
    theme: "light" | "dark" | "system";
    primaryColorHue: string;

    // Sidebar settings
    sidebarLayout: "vertical" | "horizontal";
    sidebarCollapsed: boolean;

    // App settings
    language: string;
    pageSize: number;
    dateFormat: string;

    // Notification settings
    emailNotifications: boolean;
    pushNotifications: boolean;
}

const defaultConfig: AppConfig = {
    theme: "system",
    primaryColorHue: "250",
    sidebarLayout: "vertical",
    sidebarCollapsed: false,
    language: "id",
    pageSize: 10,
    dateFormat: "DD/MM/YYYY",
    emailNotifications: true,
    pushNotifications: true,
};

export const useConfigStore = defineStore("config", {
    state: (): AppConfig => ({ ...defaultConfig }),

    getters: {
        isDarkTheme: (state) => {
            if (state.theme === "system") {
                if (typeof window !== "undefined") {
                    return window.matchMedia("(prefers-color-scheme: dark)").matches;
                }
                return false;
            }
            return state.theme === "dark";
        },
    },

    actions: {
        setTheme(theme: "light" | "dark" | "system") {
            this.theme = theme;
            this.applyTheme();
        },

        toggleTheme() {
            if (this.theme === "light") {
                this.setTheme("dark");
            } else if (this.theme === "dark") {
                this.setTheme("light");
            } else {
                // If system, toggle based on current dark state
                const isDark = this.isDarkTheme;
                this.setTheme(isDark ? "light" : "dark");
            }
        },

        applyTheme() {
            if (typeof window === "undefined") return;

            let isDark = false;
            if (this.theme === "system") {
                isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            } else {
                isDark = this.theme === "dark";
            }

            if (isDark) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        },

        setPrimaryColor(hue: string) {
            this.primaryColorHue = hue;
            this.applyPrimaryColor();
        },

        applyPrimaryColor() {
            if (typeof window === "undefined") return;

            const hue = this.primaryColorHue;
            const root = document.documentElement;
            root.style.setProperty("--color-primary-50", `oklch(0.97 0.02 ${hue})`);
            root.style.setProperty("--color-primary-100", `oklch(0.93 0.04 ${hue})`);
            root.style.setProperty("--color-primary-200", `oklch(0.87 0.08 ${hue})`);
            root.style.setProperty("--color-primary-300", `oklch(0.78 0.12 ${hue})`);
            root.style.setProperty("--color-primary-400", `oklch(0.67 0.16 ${hue})`);
            root.style.setProperty("--color-primary-500", `oklch(0.55 0.2 ${hue})`);
            root.style.setProperty("--color-primary-600", `oklch(0.48 0.2 ${hue})`);
            root.style.setProperty("--color-primary-700", `oklch(0.4 0.18 ${hue})`);
            root.style.setProperty("--color-primary-800", `oklch(0.33 0.14 ${hue})`);
            root.style.setProperty("--color-primary-900", `oklch(0.27 0.1 ${hue})`);
            root.style.setProperty("--color-primary-950", `oklch(0.2 0.08 ${hue})`);
        },

        setSidebarLayout(layout: "vertical" | "horizontal") {
            this.sidebarLayout = layout;
        },

        setSidebarCollapsed(collapsed: boolean) {
            this.sidebarCollapsed = collapsed;
        },

        toggleSidebar() {
            this.sidebarCollapsed = !this.sidebarCollapsed;
        },

        setLanguage(lang: string) {
            this.language = lang;
        },

        setPageSize(size: number) {
            this.pageSize = size;
        },

        setDateFormat(format: string) {
            this.dateFormat = format;
        },

        setEmailNotifications(enabled: boolean) {
            this.emailNotifications = enabled;
        },

        setPushNotifications(enabled: boolean) {
            this.pushNotifications = enabled;
        },

        resetToDefaults() {
            Object.assign(this, defaultConfig);
            this.applyTheme();
            this.applyPrimaryColor();
        },

        // Initialize store - apply saved settings
        initConfig() {
            this.applyTheme();
            this.applyPrimaryColor();
        },
    },

    // Persist entire config to localStorage
    persist: {
        key: "app-config",
        storage: typeof window !== "undefined" ? localStorage : undefined,
    },
});
