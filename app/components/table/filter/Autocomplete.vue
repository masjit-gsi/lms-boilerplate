<script setup lang="ts">
interface Option {
  label?: string
  value: string | number
  [key: string]: any
}

interface FilterField {
  name: string
  label?: string
  placeholder?: string
  valueKey?: string
  textKey?: string
}

interface Props {
  modelValue?: string | number | null
  field: FilterField
  items?: Option[]
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  clearable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  items: () => [],
  disabled: false,
  size: 'md',
  clearable: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null]
  'apply': []
}>()

const valueKey = computed(() => props.field.valueKey || 'value')
const textKey = computed(() => props.field.textKey || 'label')

// Transform items to UiSelect format (label, value)
const transformedOptions = computed(() => {
  return props.items.map(item => ({
    label: String(item[textKey.value] || item.label || ''),
    value: item[valueKey.value] ?? item.value,
  }))
})

const handleChange = (option: { label: string; value: string | number } | null) => {
  emit('apply')
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
    
    <UiSelect
      :model-value="modelValue"
      :options="transformedOptions"
      :placeholder="field.placeholder || 'Pilih...'"
      :disabled="disabled"
      :size="size"
      :clearable="clearable"
      searchable
      @update:model-value="emit('update:modelValue', $event)"
      @change="handleChange"
    />
  </div>
</template>
