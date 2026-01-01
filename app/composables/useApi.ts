import { useAuthStore } from "~/stores/auth";

export function useApi() {
    const authStore = useAuthStore();
    const router = useRouter();
    const toast = useToast();

    const api = $fetch.create({
        baseURL: "/api",
        headers: {
            Accept: "application/json",
        },
        onRequest({ options }) {
            const headers = new Headers(options.headers);
            if (authStore.token) {
                headers.set("Authorization", `Bearer ${authStore.token}`);
            }

            options.headers = headers;
        },
        async onResponseError({ response }) {
            const status = response.status;
            const error = response._data?.message || "An error occurred";

            if (status === 401) {
                authStore.logout();
                toast.error("Session Expired", "Please login again.");
                router.push("/login");
            } else if (status === 403) {
                toast.error("Access Denied", "You don't have permission.");
            } else if (status === 422) {
                toast.warning("Validation Error", error);
            } else if (status >= 500) {
                toast.error("Server Error", "Please try again later.");
            } else {
                toast.error("Error", error);
            }
        },
    });

    return {
        get: <T>(url: string, opts?: any) => api<T>(url, { method: "GET", ...opts }),
        post: <T>(url: string, body?: any, opts?: any) => api<T>(url, { method: "POST", body, ...opts }),
        put: <T>(url: string, body?: any, opts?: any) => api<T>(url, { method: "PUT", body, ...opts }),
        delete: <T>(url: string, opts?: any) => api<T>(url, { method: "DELETE", ...opts }),
        // Expose raw fetch if needed
        fetch: api
    };
}

export function useApiFetch<T>(endpoint: string) {
    // Keep this wrapper for SSR data fetching if needed, simpler version
    const authStore = useAuthStore();
    return useFetch<T>(endpoint, {
        baseURL: "/api",
        onRequest({ options }) {
            if (authStore.token) {
                options.headers.set("Authorization", `Bearer ${authStore.token}`);
            }
        }
    });
}
