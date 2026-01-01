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
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  modelValue: "",
  disabled: false,
  required: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: string | number];
}>();

// Use Vue's useId() for SSR-safe ID generation
const generatedId = useId();
const inputId = computed(() => props.id || `input-${generatedId}`);
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
          'input-base',
          { 'pl-11': $slots.prefix },
          { 'pr-11': $slots.suffix },
          { 'border-red-500 focus:ring-red-500/20 focus:border-red-500': error },
        ]"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      <div v-if="$slots.suffix" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
        <slot name="suffix" />
      </div>
    </div>
    <p v-if="error" class="text-sm text-red-500">
      {{ error }}
    </p>
  </div>
</template>
