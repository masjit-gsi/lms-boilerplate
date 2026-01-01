import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware((to) => {
    // Skip middleware on server-side to avoid hydration issues
    // Pinia persistence only works on client-side
    if (import.meta.server) {
        return;
    }

    const authStore = useAuthStore();

    // Public routes that don't require authentication
    const publicRoutes = ["/login", "/register", "/forgot-password"];

    // Check if route requires authentication
    if (!publicRoutes.includes(to.path)) {
        // Check if user is authenticated (use isAuthenticated state or isLoggedIn getter)
        const isAuthenticated = authStore.isAuthenticated && !!authStore.token;

        if (!isAuthenticated) {
            // Redirect to login page
            return navigateTo("/login");
        }
    }

    // If user is authenticated and trying to access login page, redirect to dashboard
    const isAuthenticated = authStore.isAuthenticated && !!authStore.token;
    if (isAuthenticated && to.path === "/login") {
        return navigateTo("/");
    }
});
