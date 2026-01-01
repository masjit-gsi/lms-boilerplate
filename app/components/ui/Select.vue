<script setup lang="ts">
interface Option {
  label: string;
  value: string | number;
  [key: string]: any;
}

interface Props {
  modelValue?: string | number | null;
  options?: Option[];
  label?: string;
  placeholder?: string;
  searchable?: boolean;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  options: () => [],
  placeholder: "Select an option",
  searchable: false,
  disabled: false,
  required: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: string | number | null];
  "change": [option: Option | null];
}>();

const isOpen = ref(false);
const searchQuery = ref("");
const wrapperRef = ref<HTMLElement | null>(null);

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (wrapperRef.value && !wrapperRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

// Filtered options based on search
const filteredOptions = computed(() => {
  if (!props.searchable || !searchQuery.value) {
    return props.options;
  }
  const query = searchQuery.value.toLowerCase();
  return props.options.filter((option) =>
    option.label.toLowerCase().includes(query)
  );
});

// Selected option object
const selectedOption = computed(() => {
  return props.options.find((opt) => opt.value === props.modelValue) || null;
});

// Display text
const displayText = computed(() => {
  if (selectedOption.value) return selectedOption.value.label;
  return props.placeholder;
});

const handleSelect = (option: Option) => {
  emit("update:modelValue", option.value);
  emit("change", option);
  isOpen.value = false;
  searchQuery.value = "";
};

const toggleDropdown = () => {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
  if (isOpen.value && props.searchable) {
    // Focus search input next tick
    setTimeout(() => {
      const searchInput = wrapperRef.value?.querySelector("input");
      searchInput?.focus();
    }, 50);
  }
};
</script>

<template>
  <div ref="wrapperRef" class="space-y-2 relative">
    <label
      v-if="label"
      class="block text-sm font-medium text-slate-700 dark:text-slate-300"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <div class="relative">
      <!-- Trigger Button -->
      <button
        type="button"
        @click="toggleDropdown"
        :disabled="disabled"
        :class="[
          'w-full flex items-center justify-between px-4 py-3 rounded-xl border bg-white dark:bg-slate-800 text-left transition-all duration-200',
          error
            ? 'border-red-500 focus:ring-red-500/20'
            : 'border-slate-200 dark:border-slate-600 focus:ring-primary-500/20 focus:border-primary-500',
          disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:border-slate-300 dark:hover:border-slate-500',
          selectedOption ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500',
        ]"
      >
        <span class="truncate block">{{ displayText }}</span>
        <svg
          class="w-5 h-5 text-slate-400 transition-transform duration-200"
          :class="{ 'rotate-180': isOpen }"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <!-- Dropdown Menu -->
      <Transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <div
          v-if="isOpen"
          class="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 max-h-60 overflow-hidden flex flex-col"
        >
          <!-- Search Input -->
          <div v-if="searchable" class="p-2 border-b border-slate-100 dark:border-slate-700">
            <input
              v-model="searchQuery"
              type="text"
              class="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-slate-900 dark:text-white placeholder:text-slate-400"
              placeholder="Search..."
              @click.stop
            />
          </div>

          <!-- Options List -->
          <ul class="flex-1 overflow-y-auto py-1">
            <li v-if="filteredOptions.length === 0" class="px-4 py-3 text-sm text-slate-500 text-center">
              No options found
            </li>
            <li
              v-for="option in filteredOptions"
              :key="option.value"
            >
              <button
                type="button"
                @click="handleSelect(option)"
                :class="[
                  'w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors text-left',
                  modelValue === option.value
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50',
                ]"
              >
                <span>{{ option.label }}</span>
                <svg
                  v-if="modelValue === option.value"
                  class="w-4 h-4 text-primary-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </button>
            </li>
          </ul>
        </div>
      </Transition>
    </div>

    <!-- Error Message -->
    <p v-if="error" class="text-sm text-red-500">
      {{ error }}
    </p>
  </div>
</template>
