<template>
  <i 
    v-if="type === 'mdi'"
    :class="['mdi', name, sizeClass]"
    :style="colorStyle"
  />
  <component
    v-else-if="type === 'tabler' && tablerComponent"
    :is="tablerComponent"
    :class="sizeClass"
    :style="colorStyle"
    :stroke-width="strokeWidth"
  />
  <span v-else :class="sizeClass" :style="colorStyle">
    {{ name }}
  </span>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'

interface Props {
  name: string           // e.g., "mdi-home" or "home" for tabler
  type?: 'mdi' | 'tabler'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  color?: string
  strokeWidth?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'mdi',
  size: 'md',
  strokeWidth: 2,
})

// Size mapping
const sizeClass = computed(() => {
  const sizes: Record<string, string> = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
  }
  return sizes[props.size] || 'text-base'
})

// Color style
const colorStyle = computed(() => {
  if (!props.color) return {}
  
  // Semantic color mapping
  const colorMap: Record<string, string> = {
    primary: '#3b82f6',
    secondary: '#64748b',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    danger: '#ef4444',
    info: '#06b6d4',
    white: '#ffffff',
    black: '#000000',
  }
  
  const colorValue = colorMap[props.color] || props.color
  return { color: colorValue }
})

// Tabler icon component (lazy loaded)
const tablerComponent = computed(() => {
  if (props.type !== 'tabler') return null
  
  try {
    return defineAsyncComponent(() => 
      import('@tabler/icons-vue').then(module => {
        const icons = module as Record<string, any>
        return icons[props.name]
      })
    )
  } catch {
    return null
  }
})
</script>
