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

      <!-- Form -->
      <UiForm ref="formRef" class="space-y-5" @submit="handleSubmit">
        <UiInput
          v-model="form.username"
          name="username"
          type="text"
          label="Username"
          placeholder="Username . . ."
          :rules="usernameRules"
          size="lg"
        >
          <template #prefix>
            <UiIcon name="IconUser" type="tabler" size="md" />
          </template>
        </UiInput>

        <UiInput
          v-model="form.password"
          name="password"
          :type="showPassword ? 'text' : 'password'"
          label="Password"
          placeholder="Password . . ."
          size="lg"
          :rules="passwordRules"
        >
          <template #prefix>
            <UiIcon name="IconLock" type="tabler" size="md" />
          </template>
          <template #suffix>
            <UiIconButton
              :icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              size="sm"
              variant="ghost"
              @click="showPassword = !showPassword"
            />
          </template>
        </UiInput>

        <div class="flex items-center justify-between">
          <label class="flex items-center gap-2 cursor-pointer">
            <UiCheckbox v-model="form.remember" />
            <span class="text-sm text-slate-600 dark:text-slate-400">Remember me</span>
          </label>
          <a href="#" class="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
            Forgot password?
          </a>
        </div>

        <UiButton
          type="submit"
          variant="elevated"
          color="primary"
          size="lg"
          :loading="authStore.loading"
          class="w-full"
        >
          Sign in
        </UiButton>
      </UiForm>

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
        <p class="text-xs text-center text-slate-400 dark:text-slate-500 mb-2">Demo: use any email &amp; password</p>
      </div>
    </UiCard>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";

definePageMeta({
  layout: "auth",
});

useHead({
  title: "Login | Admin Dashboard",
});

const authStore = useAuthStore();
const swal = useSwal();
const formRef = ref();
const showPassword = ref(false);

const form = reactive({
  username: "",
  password: "",
  remember: false,
});

// Validation rules
const usernameRules = [
  (v: string) => !!v || "Username wajib diisi",
];

const passwordRules = [
  (v: string) => !!v || "Password wajib diisi",
];

const handleSubmit = async () => {
  const isValid = await formRef.value?.validate();
  if (!isValid) return;

  const result = await authStore.login(form.username, form.password);
  if (result.success) {
    navigateTo("/", { external: true });
  } else {
    swal.toast(result.error || "Login gagal. Silakan coba lagi.", "error");
  }
};
</script>
