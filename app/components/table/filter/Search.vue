<script setup lang="ts">
interface FilterField {
  name: string
  label?: string
  placeholder?: string
}

interface Props {
  modelValue?: string
  field: FilterField
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'apply': []
}>()

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    emit('apply')
  }
}
</script>

<template>
  <div class="space-y-1">
    <label 
      v-if="field.label" 
      class="block text-sm font-medium text-slate-700 dark:text-slate-300"
    >
      {{ field.label }}
    </label>
    <div class="relative">
      <input
        type="text"
        :value="modelValue"
        :placeholder="field.placeholder || 'Cari...'"
        :disabled="disabled"
        class="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @keydown="handleKeydown"
      />
      <svg 
        class="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <slot name="append" />
    </div>
  </div>
</template>
