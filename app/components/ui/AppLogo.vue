<template>
  <div :class="containerClass">
    <div class="pl-2 w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
      <UiIcon name="mdi-school" class="w-6 h-6 text-white" />
    </div>
    <span v-if="!collapsed" class="text-xl font-bold text-slate-900 dark:text-white whitespace-nowrap">
      Greatclass<sup class="text-xs text-primary-500">LMS</sup>
    </span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  position?: 'default' | 'absolute-top-left'
  collapsed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  position: 'default',
  collapsed: false
})

const containerClass = computed(() => {
  const baseClass = 'flex items-center gap-2'
  
  if (props.position === 'absolute-top-left') {
    return `${baseClass} absolute top-6 left-6 lg:top-8 lg:left-8 z-20`
  }
  
  return baseClass
})
</script>
