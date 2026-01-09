<template>
  <div class="min-h-screen flex">
    <!-- Left Side - Illustration -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-50 to-primary-50 dark:from-slate-900 dark:to-slate-800 relative overflow-hidden">
      <!-- Abstract Shapes -->
      <div class="absolute top-20 left-10 w-32 h-32 bg-primary-400/20 rounded-full blur-xl"></div>
      <div class="absolute bottom-40 left-20 w-48 h-48 bg-amber-400/20 rounded-full blur-xl"></div>
      <div class="absolute top-1/3 right-10 w-40 h-40 bg-primary-400/20 rounded-full blur-xl"></div>
      
      <!-- Dot Pattern -->
      <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(circle, #64748b 1px, transparent 1px); background-size: 24px 24px;"></div>
      
      <!-- Content -->
      <div class="relative z-10 flex flex-col justify-center items-center px-12 lg:px-16 w-full">
        <h1 class="text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white leading-tight mb-6 text-center">
          Simplify your interaction with Students online.
        </h1>
        <p class="text-lg text-slate-600 dark:text-slate-400 text-center max-w-md">
          Platform pembelajaran digital yang memudahkan interaksi antara pengajar dan siswa.
        </p>
        
        <!-- Image -->
        <!-- <div class="mt-10">
          <img 
            src="/images/login-illustration.png" 
            alt="Learning Illustration" 
            class="w-full max-w-md object-contain"
          />
        </div> -->
      </div>
    </div>

    <!-- Right Side - Form -->
    <div class="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-16 xl:px-24 py-12 bg-white dark:bg-slate-900">
      <div class="max-w-md w-full mx-auto">
        <!-- Logo -->
        <div class="flex items-center gap-3 mb-8">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
            <span class="text-white font-bold text-xl">G</span>
          </div>
          <span class="text-2xl font-bold text-slate-900 dark:text-white">Greatclass</span>
        </div>

        <!-- Title -->
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-8">Login to Greatclass</h2>

        <!-- Social Login Buttons -->
        <!-- <div class="grid grid-cols-2 gap-4 mb-6">
          <button class="flex items-center justify-center gap-3 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <UiIcon name="mdi-school" class="w-5 h-5 text-emerald-600" />
            <span class="font-medium text-slate-700 dark:text-slate-300">Siakad</span>
          </button>
          <button class="flex items-center justify-center gap-3 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <UiIcon name="mdi-google" class="w-5 h-5 text-red-500" />
            <span class="font-medium text-slate-700 dark:text-slate-300">Google</span>
          </button>
        </div> -->

        <!-- Divider -->
        <!-- <div class="flex items-center gap-4 mb-6">
          <div class="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
          <span class="text-sm text-slate-500 dark:text-slate-400">Or</span>
          <div class="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
        </div> -->

        <!-- Form -->
        <UiForm ref="formRef" class="space-y-5" @submit="handleSubmit">
          <UiInput
            v-model="form.username"
            name="username"
            type="text"
            label="Username"
            placeholder="Enter your username"
            :rules="usernameRules"
            size="lg"
          >
            <template #prefix>
              <UiIcon name="mdi-email-outline" size="md" />
            </template>
          </UiInput>

          <div>
            <UiInput
              v-model="form.password"
              name="password"
              :type="showPassword ? 'text' : 'password'"
              label="Password"
              placeholder="Enter your password"
              :rules="passwordRules"
              size="lg"
            >
              <template #prefix>
                <UiIcon name="mdi-key-outline" size="md" />
              </template>
              <template #suffix>
                <UiIconButton
                  :icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  size="sm"
                  variant="ghost"
                  @click="showPassword = !showPassword"
                />
              </template>
            </UiInput>

            <div class="flex justify-end mt-6">
              <a href="#" class="text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400">
                Forgot password
              </a>
            </div>
          </div>

          <UiButton
            type="submit"
            color="primary"
            size="lg"
            :loading="authStore.loading"
            class="w-full"
          >
            Login
          </UiButton>
        </UiForm>

        <!-- Register Link -->
        <p class="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Don't have an account?
          <a href="#" class="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400">
            Click here to register
          </a>
        </p>

        <!-- Terms -->
        <p class="mt-4 text-center text-xs text-slate-500 dark:text-slate-500">
          By using our services, you agree to the
          <a href="#" class="text-primary-600 hover:underline">Terms &amp; Conditions</a>
          and
          <a href="#" class="text-primary-600 hover:underline">Privacy Policy</a>
        </p>

        <!-- App Store Badges -->
        <div class="flex justify-center gap-4 mt-8">
          <a href="#" class="block">
            <div class="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white rounded-lg">
              <UiIcon name="mdi-apple" class="w-6 h-6 text-white dark:text-slate-900" />
              <div class="text-left">
                <div class="text-[10px] text-slate-300 dark:text-slate-600">Download on the</div>
                <div class="text-sm font-semibold text-white dark:text-slate-900">App Store</div>
              </div>
            </div>
          </a>
          <a href="#" class="block">
            <div class="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white rounded-lg">
              <UiIcon name="mdi-google-play" class="w-6 h-6 text-white dark:text-slate-900" />
              <div class="text-left">
                <div class="text-[10px] text-slate-300 dark:text-slate-600">GET IT ON</div>
                <div class="text-sm font-semibold text-white dark:text-slate-900">Google Play</div>
              </div>
            </div>
          </a>
        </div>

        <!-- Copyright -->
        <p class="mt-8 text-center text-xs text-slate-400 dark:text-slate-600">
          Copyright © 2026 by Your Company
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useConfigStore } from "~/stores/config";

definePageMeta({
  layout: false, // No layout - full custom page
});

useHead({
  title: "Login | Edlink",
});

// Init theme
const configStore = useConfigStore();
onMounted(() => {
  configStore.applyTheme();
  configStore.applyPrimaryColor();
});

const authStore = useAuthStore();
const swal = useSwal();
const formRef = ref();
const showPassword = ref(false);

const form = reactive({
  username: "",
  password: "",
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
