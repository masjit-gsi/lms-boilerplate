const { API_HOST: rawApiHost, TOKEN_KEY, DOMAIN, API_KEY } = process.env
const API_HOST = rawApiHost?.replace(/\/+$/, '');
// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  // Modules
  modules: ["@pinia/nuxt", "@vee-validate/nuxt"],

  // CSS
  css: ["~/assets/css/main.css", "@vuepic/vue-datepicker/dist/main.css"],

  // Vite plugins
  vite: {
    plugins: [tailwindcss()],
  },

  // Runtime config for API
  runtimeConfig: {
    // Private keys (server-side only)
    apiSecret: "",

    // Public keys (exposed to client)
    public: {
      // Frontend calls /api/* which gets proxied to /v1/*
      apiBase: "/api",
    },
  },

  // Nitro server configuration with API proxy
  nitro: {
    // Development proxy - rewrites /api to /v1
    devProxy: {
      "/api": {
        target: `${API_HOST}/v1`,
        changeOrigin: true,
      },
    },

    // Production route rules - rewrites /api to /v1
    routeRules: {
      // /api/users → http://localhost:8080/v1/users
      "/api/**": {
        proxy: `${API_HOST}/v1/**`,
      },
    },
  },

  // Route rules for caching
  routeRules: {
    // Static pages - prerender
    "/login": { prerender: true },
  },

  // App configuration
  app: {
    head: {
      title: "Admin Dashboard",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "description", content: "Admin Dashboard - Nuxt 4 + Tailwind CSS" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
        },
      ],
      // Inline script to prevent flash of light theme
      script: [
        {
          innerHTML: `
            (function() {
              try {
                var config = JSON.parse(localStorage.getItem('app-config') || '{}');
                var theme = config.theme || 'system';
                var isDark = false;
                
                if (theme === 'dark') {
                  isDark = true;
                } else if (theme === 'system') {
                  isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                }
                
                if (isDark) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            })();
          `,
          type: 'text/javascript',
        },
      ],
    },
  },

  // TypeScript
  typescript: {
    strict: true,
    typeCheck: false,
  },
});
