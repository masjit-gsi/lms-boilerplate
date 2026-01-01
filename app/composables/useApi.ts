import { useAuthStore } from "~/stores/auth";

// API Response types
export interface ApiResponse<T = unknown> {
    data: T;
    message?: string;
    success: boolean;
}

export interface ApiError {
    message: string;
    statusCode: number;
    errors?: Record<string, string[]>;
}

// Default API configuration - uses proxy in development
const API_BASE_URL = "/api";

// Create custom fetch with interceptors
export function useApi() {
    const authStore = useAuthStore();
    const router = useRouter();
    const toast = useToast();

    // Request interceptor - adds auth token and common headers
    const requestInterceptor = (options: RequestInit = {}): RequestInit => {
        const headers = new Headers(options.headers);

        // Add auth token if available
        if (authStore.token) {
            headers.set("Authorization", `Bearer ${authStore.token}`);
        }

        // Add common headers
        headers.set("Content-Type", "application/json");
        headers.set("Accept", "application/json");

        return {
            ...options,
            headers,
        };
    };

    // Response interceptor - handles common response scenarios
    const responseInterceptor = async <T>(response: Response): Promise<T> => {
        // Handle 401 Unauthorized - redirect to login
        if (response.status === 401) {
            authStore.logout();
            toast.error("Session Expired", "Please login again.");
            router.push("/login");
            throw createError({
                statusCode: 401,
                message: "Session expired. Please login again.",
            });
        }

        // Handle 403 Forbidden
        if (response.status === 403) {
            toast.error("Access Denied", "You don't have permission to perform this action.");
            throw createError({
                statusCode: 403,
                message: "You don't have permission to perform this action.",
            });
        }

        // Handle 404 Not Found
        if (response.status === 404) {
            throw createError({
                statusCode: 404,
                message: "Resource not found.",
            });
        }

        // Handle 422 Validation Error
        if (response.status === 422) {
            const errorData = await response.json();
            toast.warning("Validation Error", errorData.message || "Please check your input.");
            throw createError({
                statusCode: 422,
                message: errorData.message || "Validation error",
                data: errorData.errors,
            });
        }

        // Handle 500+ Server Errors
        if (response.status >= 500) {
            toast.error("Server Error", "Please try again later.");
            throw createError({
                statusCode: response.status,
                message: "Server error. Please try again later.",
            });
        }

        // Handle successful responses
        if (response.ok) {
            // Handle empty responses (204 No Content)
            if (response.status === 204) {
                return {} as T;
            }
            return response.json();
        }

        // Handle other errors
        const errorData = await response.json().catch(() => ({}));
        throw createError({
            statusCode: response.status,
            message: errorData.message || "An error occurred",
        });
    };

    // Error interceptor - handles network errors
    const errorInterceptor = (error: Error): never => {
        const toast = useToast();

        // Network error
        if (error.name === "TypeError" && error.message === "Failed to fetch") {
            toast.error("Network Error", "Please check your connection.");
            throw createError({
                statusCode: 0,
                message: "Network error. Please check your connection.",
            });
        }

        // Timeout error
        if (error.name === "AbortError") {
            toast.error("Request Timeout", "Please try again.");
            throw createError({
                statusCode: 0,
                message: "Request timeout. Please try again.",
            });
        }

        throw error;
    };

    // Main fetch wrapper
    const apiFetch = async <T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> => {
        const url = endpoint.startsWith("http")
            ? endpoint
            : `${API_BASE_URL}${endpoint}`;

        try {
            const response = await fetch(url, requestInterceptor(options));
            return await responseInterceptor<T>(response);
        } catch (error) {
            return errorInterceptor(error as Error);
        }
    };

    // HTTP method shortcuts
    const get = <T>(endpoint: string, options?: RequestInit) =>
        apiFetch<T>(endpoint, { ...options, method: "GET" });

    const post = <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
        apiFetch<T>(endpoint, {
            ...options,
            method: "POST",
            body: data ? JSON.stringify(data) : undefined,
        });

    const put = <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
        apiFetch<T>(endpoint, {
            ...options,
            method: "PUT",
            body: data ? JSON.stringify(data) : undefined,
        });

    const patch = <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
        apiFetch<T>(endpoint, {
            ...options,
            method: "PATCH",
            body: data ? JSON.stringify(data) : undefined,
        });

    const del = <T>(endpoint: string, options?: RequestInit) =>
        apiFetch<T>(endpoint, { ...options, method: "DELETE" });

    return {
        fetch: apiFetch,
        get,
        post,
        put,
        patch,
        delete: del,
    };
}

// Nuxt useFetch wrapper with interceptors
// For reactive data fetching with SSR support
export function useApiFetch<T>(endpoint: string) {
    const authStore = useAuthStore();
    const router = useRouter();
    const toast = useToast();

    return useFetch<T>(endpoint, {
        baseURL: API_BASE_URL,

        // Request interceptor
        onRequest({ options }) {
            // Add auth token
            if (authStore.token) {
                options.headers.set("Authorization", `Bearer ${authStore.token}`);
            }
        },

        // Error interceptor
        onResponseError({ response }) {
            const status = response.status;

            // Handle 401 - Unauthorized
            if (status === 401) {
                authStore.logout();
                toast.error("Session Expired", "Please login again.");
                router.push("/login");
            }

            // Handle 403 - Forbidden
            if (status === 403) {
                toast.error("Access Denied", "You don't have permission.");
            }

            // Handle 500+ - Server Error
            if (status >= 500) {
                toast.error("Server Error", "Please try again later.");
            }
        },
    });
}
