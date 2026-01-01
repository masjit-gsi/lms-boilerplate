<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";

definePageMeta({
  layout: "auth",
});

useHead({
  title: "Login | Admin Dashboard",
});

const authStore = useAuthStore();

const form = reactive({
  email: "",
  password: "",
  remember: false,
});

const error = ref("");

const handleSubmit = async () => {
  error.value = "";
  const result = await authStore.login(form.email, form.password);
  
  if (result.success) {
    navigateTo("/");
  } else {
    error.value = result.error || "Login failed. Please try again.";
  }
};
</script>

<template>
  <div class="animate-scale-in">
    <UiCard class="backdrop-blur-xl bg-white/90 dark:bg-slate-900/90">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30">
          <span class="text-white font-bold text-2xl">A</span>
        </div>
        <h1 class="mt-6 text-2xl font-bold text-slate-900 dark:text-white">Welcome back</h1>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Sign in to your account to continue
        </p>
      </div>

      <!-- Error message -->
      <div v-if="error" class="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
        <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
      </div>

      <!-- Form -->
      <form class="space-y-5" @submit.prevent="handleSubmit">
        <UiInput
          v-model="form.email"
          type="email"
          label="Email address"
          placeholder="you@example.com"
          required
        >
          <template #prefix>
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </template>
        </UiInput>

        <UiInput
          v-model="form.password"
          type="password"
          label="Password"
          placeholder="••••••••"
          required
        >
          <template #prefix>
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </template>
        </UiInput>

        <div class="flex items-center justify-between">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="form.remember"
              type="checkbox"
              class="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-primary-600 focus:ring-primary-500 focus:ring-offset-0 dark:bg-slate-700"
            />
            <span class="text-sm text-slate-600 dark:text-slate-400">Remember me</span>
          </label>
          <a href="#" class="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
            Forgot password?
          </a>
        </div>

        <UiButton
          type="submit"
          variant="primary"
          size="lg"
          :loading="authStore.loading"
          class="w-full"
        >
          Sign in
        </UiButton>
      </form>

      <!-- Footer -->
      <div class="mt-6 text-center">
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Don't have an account?
          <a href="#" class="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
            Sign up
          </a>
        </p>
      </div>

      <!-- Demo credentials -->
      <div class="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
        <p class="text-xs text-center text-slate-400 dark:text-slate-500 mb-2">Demo: use any email & password</p>
      </div>
    </UiCard>
  </div>
</template>
