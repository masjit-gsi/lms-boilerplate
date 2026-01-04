<script setup lang="ts">
interface Props {
  modelValue?: string | number;
  type?: string;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  size?: 'sm' | 'md' | 'lg';
  clearable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  modelValue: "",
  disabled: false,
  required: false,
  size: 'md',
  clearable: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: string | number];
  "clear": [];
}>();

// Use Vue's useId() for SSR-safe ID generation
const generatedId = useId();
const inputId = computed(() => props.id || `input-${generatedId}`);

// Size classes
const sizeClasses = computed(() => {
  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-4 py-3 text-base',
  };
  return sizes[props.size] || sizes.md;
});

// Check if value is not empty
const hasValue = computed(() => {
  return props.modelValue !== '' && props.modelValue !== null && props.modelValue !== undefined;
});

// Clear input value
const handleClear = () => {
  emit('update:modelValue', '');
  emit('clear');
};
</script>

<template>
  <div class="space-y-2">
    <label
      v-if="label"
      :for="inputId"
      class="block text-sm font-medium text-slate-700 dark:text-slate-300"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative">
      <div v-if="$slots.prefix" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
        <slot name="prefix" />
      </div>
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="[
          'w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed',
          sizeClasses,
          { 'pl-11': $slots.prefix },
          { 'pr-11': $slots.suffix && !(clearable && hasValue) },
          { 'pr-20': $slots.suffix && clearable && hasValue },
          { 'pr-10': clearable && hasValue && !$slots.suffix },
          { 'border-red-500 focus:ring-red-500/20 focus:border-red-500': error },
        ]"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      <!-- Right side icons container -->
      <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
        <!-- Clear button -->
        <button
          v-if="clearable && hasValue"
          type="button"
          class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          @click="handleClear"
        >
          <i class="mdi mdi-close text-lg" />
        </button>
        <!-- Suffix slot -->
        <div v-if="$slots.suffix" class="text-slate-400">
          <slot name="suffix" />
        </div>
      </div>
    </div>
    <p v-if="error" class="text-sm text-red-500">
      {{ error }}
    </p>
  </div>
</template>
