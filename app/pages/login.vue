<template>
  <div class="min-h-screen flex">
    <!-- Left Side - Illustration with Blue Gradient -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-50 via-primary-100 to-primary-50 dark:from-primary-950 dark:to-slate-900 relative overflow-hidden flex-col justify-center items-center p-12">
      <!-- Decorative Circles -->
      <div class="absolute -top-20 -right-20 w-60 h-60 bg-primary-300/30 dark:bg-primary-800/20 rounded-full"></div>
      <div class="absolute -bottom-20 -left-20 w-60 h-60 bg-primary-300/30 dark:bg-primary-800/20 rounded-full"></div>
      
      <!-- Image -->
      <div class="relative z-10 mb-12">
        <img 
          src="/images/illustration-container.png" 
          alt="Learning Illustration" 
          class="w-full max-w-sm object-contain"
        />
      </div>
      
      <!-- Text Content Slider -->
      <div class="relative z-10 text-center overflow-hidden">
        <TransitionGroup
          tag="div"
          enter-active-class="transition-all duration-500 ease-out"
          enter-from-class="opacity-0 translate-x-8"
          enter-to-class="opacity-100 translate-x-0"
          leave-active-class="transition-all duration-300 ease-in absolute inset-0"
          leave-from-class="opacity-100 translate-x-0"
          leave-to-class="opacity-0 -translate-x-8"
        >
          <div v-if="currentSlide === 0" key="slide-0">
            <h1 class="text-3xl font-bold text-slate-800 dark:text-white mb-4">
              Welcome to
              <br />
              <span class="text-primary-500">Greatclass</span> LMS.
            </h1>
            <p class="text-slate-600 font-medium dark:text-slate-400">
              Platform designed to help organizations, educators, and learners manage learning activities.
            </p>
          </div>
          <div v-else-if="currentSlide === 1" key="slide-1">
            <h1 class="text-3xl font-bold text-slate-800 dark:text-white mb-4">
              Learn Anywhere,
              <br />
              <span class="text-primary-500">Anytime</span>
            </h1>
            <p class="text-slate-600 font-medium dark:text-slate-400 ">
              Akses materi pembelajaran kapan saja dan di mana saja dengan mudah.
            </p>
          </div>
          <div v-else key="slide-2">
            <h1 class="text-3xl font-bold text-slate-800 dark:text-white mb-4">
              Track Your
              <br />
              <span class="text-primary-500">Progress</span>
            </h1>
            <p class="text-slate-600 font-medium dark:text-slate-400 ">
              Pantau perkembangan belajar dengan laporan dan analitik yang lengkap.
            </p>
          </div>
        </TransitionGroup>
        
        <!-- Pagination Dots -->
        <div class="flex justify-center gap-2 mt-8">
          <button
            v-for="(_, index) in slides"
            :key="index"
            :class="[
              'h-2 rounded-full transition-all duration-300',
              currentSlide === index 
                ? 'w-8 bg-primary-500' 
                : 'w-2 bg-primary-200 dark:bg-primary-800 hover:bg-primary-300'
            ]"
            @click="goToSlide(index)"
          />
        </div>
      </div>
    </div>

    <!-- Right Side - Form -->
    <div class="w-full lg:w-1/2 flex flex-col bg-white dark:bg-slate-900">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 lg:p-8">
        <!-- Logo -->
        <div class="flex items-center gap-2">
          <div class="pl-2 w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
            <UiIcon name="mdi-school" class="w-6 h-6 text-white" />
          </div>
          <span class="text-xl font-bold text-slate-900 dark:text-white">Greatclass<sup class="text-xs text-primary-500">LMS</sup></span>
        </div>
        <!-- <a href="/" class="text-primary-500 hover:text-primary-600 text-sm font-medium underline">
          Back to Home
        </a> -->
      </div>
      
      <!-- Form Container -->
      <div class="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-16 xl:px-24 pb-12">
        <div class="max-w-md w-full mx-auto">
          <!-- Title -->
          <h2 class="text-3xl font-bold text-slate-900 dark:text-white mb-8">Sign into Your Account</h2>

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

            <div class="flex items-center justify-between">
              <label class="flex items-center gap-2 cursor-pointer">
                <UiCheckbox v-model="form.remember" />
                <span class="text-sm text-slate-600 dark:text-slate-400">Remember Me</span>
              </label>
              <a href="#" class="text-sm font-medium text-primary-500 hover:text-primary-600">
                Forgot Password?
              </a>
            </div>

            <UiButton
              type="submit"
              size="lg"
              :loading="authStore.loading"
              class="w-full !bg-primary-500 hover:!bg-primary-600 !border-primary-500"
            >
              Login
            </UiButton>
          </UiForm>

          <!-- Divider -->
          <div class="flex items-center gap-4 my-6">
            <div class="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
            <span class="text-sm text-slate-500 dark:text-slate-400">Or</span>
            <div class="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
          </div>

          <!-- Social Login -->
          <div class="grid grid-cols-2 gap-4">
            <button class="flex items-center justify-center gap-2 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <UiIcon name="mdi-google" class="w-5 h-5 text-red-500" />
              <span class="text-sm font-medium text-slate-700 dark:text-slate-300">Google</span>
            </button>
            <button class="flex items-center justify-center gap-2 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <UiIcon name="mdi-facebook" class="w-5 h-5 text-blue-600" />
              <span class="text-sm font-medium text-slate-700 dark:text-slate-300">Facebook</span>
            </button>
          </div>

          <!-- Sign Up Link -->
          <p class="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
            Don't you have an account?
            <a href="#" class="font-medium text-primary-500 hover:text-primary-600">
              Sign up
            </a>
          </p>

          <!-- Copyright -->
        <p class="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
          Copyright © 2026 by Your Company
        </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useConfigStore } from "~/stores/config";

definePageMeta({
  layout: false,
});

useHead({
  title: "Login | Greatclass LMS",
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

// Slider logic
const slides = [0, 1, 2];
const currentSlide = ref(0);
let slideInterval: ReturnType<typeof setInterval>;

const goToSlide = (index: number) => {
  currentSlide.value = index;
  resetInterval();
};

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length;
};

const resetInterval = () => {
  clearInterval(slideInterval);
  slideInterval = setInterval(nextSlide, 5000);
};

onMounted(() => {
  slideInterval = setInterval(nextSlide, 5000);
});

onUnmounted(() => {
  clearInterval(slideInterval);
});

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
