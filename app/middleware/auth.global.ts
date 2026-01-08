import { useAuthStore, TOKEN_COOKIE_NAME } from "~/stores/auth";

// Track if menus have been loaded in this session
let menusLoadedThisSession = false;

export default defineNuxtRouteMiddleware(async (to) => {
    // Skip middleware on server-side to avoid hydration issues
    // Pinia persistence only works on client-side
    if (import.meta.server) {
        return;
    }

    const authStore = useAuthStore();

    // Use Nuxt's useCookie for SSR support
    const tokenCookie = useCookie(TOKEN_COOKIE_NAME);

    // Sync token from cookies to store if not already synced
    if (tokenCookie.value && !authStore.token) {
        authStore.token = tokenCookie.value;
        authStore.isAuthenticated = true;
    }

    // Public routes that don't require authentication
    const publicRoutes = ["/login", "/register", "/forgot-password"];

    // Check if route requires authentication
    if (!publicRoutes.includes(to.path)) {
        // Check if user is authenticated (check both store and cookie)
        const hasToken = !!authStore.token || !!tokenCookie.value;
        const isAuthenticated = authStore.isAuthenticated && hasToken;

        if (!isAuthenticated) {
            // Redirect to login page
            menusLoadedThisSession = false;
            return navigateTo("/login");
        }

        // Load menus on first navigation of this session (after page refresh)
        // This ensures menus are always fresh from API
        if (authStore.user?.roleId && !menusLoadedThisSession) {
            await authStore.loadAuthMenu({
                roleId: authStore.user.roleId,
            });
            menusLoadedThisSession = true;
        }
    }

    // If user is authenticated and trying to access login page, redirect to dashboard
    const hasToken = !!authStore.token || !!tokenCookie.value;
    const isAuthenticated = authStore.isAuthenticated && hasToken;
    if (isAuthenticated && to.path === "/login") {
        return navigateTo("/");
    }
});
