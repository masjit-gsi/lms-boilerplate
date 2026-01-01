import { defineStore } from "pinia";

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar?: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
}

export const useAuthStore = defineStore("auth", {
    state: (): AuthState => ({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
    }),

    getters: {
        getUser: (state) => state.user,
        getToken: (state) => state.token,
        isLoggedIn: (state) => state.isAuthenticated && !!state.token,
        getUserRole: (state) => state.user?.role || "guest",
    },

    actions: {
        async login(email: string, password: string) {
            this.loading = true;
            try {
                // Simulate API call - replace with actual API
                await new Promise((resolve) => setTimeout(resolve, 1000));

                // Mock successful login
                if (email && password) {
                    this.user = {
                        id: 1,
                        name: "John Doe",
                        email: email,
                        role: "admin",
                    };
                    this.token = "mock-jwt-token-" + Date.now();
                    this.isAuthenticated = true;
                    return { success: true };
                }
                throw new Error("Invalid credentials");
            } catch (error) {
                this.logout();
                return { success: false, error: (error as Error).message };
            } finally {
                this.loading = false;
            }
        },

        logout() {
            this.user = null;
            this.token = null;
            this.isAuthenticated = false;
        },

        setUser(user: User) {
            this.user = user;
        },

        setToken(token: string) {
            this.token = token;
            this.isAuthenticated = true;
        },

        // Check if session is still valid
        async checkAuth() {
            if (!this.token) {
                return false;
            }
            // In real app, validate token with API
            return this.isAuthenticated;
        },
    },

    // Persist state to localStorage
    persist: {
        key: "auth",
        storage: typeof window !== "undefined" ? localStorage : undefined,
        pick: ["user", "token", "isAuthenticated"],
    },
});
