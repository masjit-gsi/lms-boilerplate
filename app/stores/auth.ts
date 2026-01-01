import { defineStore } from "pinia";

export interface Role {
    id: string;
    name: string;
    description: string;
}

export interface User {
    id: string;
    name: string;
    username: string;
    email: string;
    roleId: string;
    status: string;
    role: Role | string;
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
        getUserRole: (state) => {
            if (state.user?.role && typeof state.user.role === 'object') {
                // @ts-ignore
                return state.user.role.name || "guest";
            }
            return state.user?.role || "guest";
        },
    },

    actions: {
        async login(username: string, password: string) {
            this.loading = true;
            try {
                const api = useApi();
                const res: any = await api.post("/user/login", {
                    username,
                    password
                });

                const data = res.data || res;
                const accessToken = data.token?.AccessToken || data.token;
                const userData = data.user;

                if (accessToken && userData) {
                    this.token = accessToken;
                    this.user = userData;
                    this.isAuthenticated = true;
                    return { success: true };
                }

                throw new Error("Login failed: No token received");

            } catch (error: any) {
                this.logout();
                return {
                    success: false,
                    error: error.response?._data?.message || error.message || "Login failed"
                };
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
