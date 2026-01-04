<template>
  <div class="bg-white dark:bg-slate-800 rounded-sm shadow-sm overflow-hidden">
    <!-- Header Bar -->
    <div :class="['flex flex-wrap items-center justify-between gap-3 px-5 py-1', headerClass]">
      <h2 class="text-lg font-semibold text-white">{{ title }}</h2>
      <div class="flex items-center gap-1">
        <template v-for="action in validActions(actionToolbars, {})" :key="action.key">
          <UiIconButton
            :icon="action.icon || 'mdi-help'"
            :tooltip="action.tooltip"
            :color="action.color"
            :loading="actionLoading[action.key]"
            variant="ghost"
            size="lg"
            @click="$emit(action.emit as any)"
          />
        </template>
        <UiIconButton
          icon="mdi-refresh"
          tooltip="Refresh"
          color="white"
          variant="ghost"
          size="lg"
          @click="handleRefreshItems"
        />
      </div>
    </div>

    <div class="p-6">
      <!-- Filters -->
      <div v-if="filterSchema.length > 0" class="grid grid-cols-12 gap-4 mb-6">
        <template v-for="f in filterSchema" :key="f.name">
          <div 
            class="col-span-12"
            :style="{ 
              gridColumn: `span ${f.colMd || 2} / span ${f.colMd || 2}` 
            }"
            :class="{ 'md:col-span-2': !f.colMd }"
          >
            <!-- Search filter with add button beside it -->
            <div v-if="f.type === 'search' && addAction" class="flex items-center gap-2">
              <div class="flex-1">
                <component
                  :is="componentResolver(f.type)"
                  v-model="filterLocal[f.name]"
                  :field="f"
                  :disabled="isDisabled(f)"
                  :items="getList(f.items)"
                  @apply="handleApplyFilterField(f)"
                />
              </div>
              <button
                class="w-10 h-10 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors shrink-0"
                @click="$emit(addAction.emit as any)"
                :title="addAction.tooltip"
              >
                <UiIcon name="mdi-plus" size="xl" />
              </button>
            </div>
            
            <!-- Other filters -->
            <component
              v-else
              :is="componentResolver(f.type)"
              v-model="filterLocal[f.name]"
              :field="f"
              :disabled="isDisabled(f)"
              :items="getList(f.items)"
              @apply="handleApplyFilterField(f)"
            >
              <template v-if="f.type === 'custom' && f.slotKey" #default>
                <slot :name="f.slotKey" />
              </template>
            </component>
          </div>
        </template>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto border border-slate-200 dark:border-slate-700">
        <table class="w-full">
          <thead>
            <tr class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
              <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider w-16 border-r border-slate-200 dark:border-slate-700">
                No
              </th>
              <th
                v-for="header in headers"
                :key="header.key"
                :style="{ width: header.width }"
                :class="[
                  'px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider border-r border-slate-200 dark:border-slate-700',
                  header.sortable ? 'cursor-pointer hover:text-slate-900 dark:hover:text-white' : ''
                ]"
                @click="handleSort(header.key)"
              >
                <div class="flex items-center gap-1">
                  {{ header.title }}
                  <template v-if="header.sortable">
                    <svg 
                      v-if="sortBy[0]?.key === header.key" 
                      class="w-4 h-4" 
                      :class="{ 'rotate-180': sortBy[0]?.order === 'asc' }"
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                    <svg v-else class="w-4 h-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </template>
                </div>
              </th>
              <th v-if="actions.length > 0" class="px-4 py-3 text-center text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider w-24">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-800">
            <!-- Loading State -->
            <template v-if="loading">
              <tr v-for="i in 5" :key="i">
                <td class="px-4 py-4 border-r border-slate-200 dark:border-slate-700">
                  <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-8" />
                </td>
                <td v-for="header in headers" :key="header.key" class="px-4 py-4 border-r border-slate-200 dark:border-slate-700">
                  <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                </td>
                <td v-if="actions.length > 0" class="px-4 py-4">
                  <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-16 mx-auto" />
                </td>
              </tr>
            </template>

            <!-- Empty State -->
            <tr v-else-if="tableData.items.length === 0">
              <td :colspan="headers.length + (actions.length > 0 ? 2 : 1)" class="px-4 py-3 text-center text-slate-500 dark:text-slate-400">
                Data tidak ditemukan
              </td>
            </tr>

            <!-- Data Rows -->
            <tr
              v-else
              v-for="(item, index) in tableData.items"
              :key="item.id || index"
              :class="getRowClass({ item })"
              @click="handleRowClick(item)"
            >
              <td class="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 border-r border-slate-200 dark:border-slate-700">
                {{ numberInc + index + 1 }}.
              </td>
              <td
                v-for="header in headers"
                :key="header.key"
                class="px-4 py-3 text-sm text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700"
              >
                <slot :name="`item.${header.key}`" :item="item" :value="item[header.key]">
                  {{ header.formatter ? header.formatter(item[header.key]) : item[header.key] }}
                </slot>
              </td>
              <td v-if="actions.length > 0" class="px-4 py-3">
                <div class="flex items-center justify-center gap-2">
                  <template v-for="action in validActions(actions, item)" :key="action.key">
                    <UiIconButton
                      :icon="action.icon || 'mdi-help'"
                      :tooltip="action.tooltip"
                      :color="action.color"
                      size="sm"
                      rounded="md"
                      @click="$emit(action.emit as any, item)"
                    />
                  </template>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex flex-wrap items-center justify-between gap-4 mt-4">
        <div class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <span>Tampilkan</span>
          <select
            v-model="filterLocal.pageSize"
            @change="getItemPerPage(filterLocal.pageSize)"
            class="px-2 py-1 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
          >
            <option v-for="opt in itemsPerPageOptions" :key="opt.value" :value="opt.value">
              {{ opt.title }}
            </option>
          </select>
          <span>Dari {{ tableData.meta.totalItems }} data</span>
        </div>
        <TablePagination
          :current-page="Number(filterLocal.pageNumber) || 1"
          :total-items="tableData.meta.totalItems"
          :items-per-page="itemsPerPage"
          @update:current-page="handlePageChanged"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Types
interface Header {
  key: string
  title: string
  width?: string
  sortable?: boolean
  translate?: boolean
  formatter?: (value: any) => string
}

interface FilterField {
  name: string
  label?: string
  type: 'date' | 'autocomplete' | 'search' | 'select' | 'number' | 'text' | 'custom'
  items?: string
  valueKey?: string
  textKey?: string
  emits?: string
  colMd?: number
  disabled?: boolean | ((item: any) => boolean)
  default?: any
  resetOnSelect?: Record<string, any>
  slotKey?: string
  placeholder?: string
}

interface Action {
  key: string
  icon?: string
  color?: string
  tooltip?: string
  show?: (item: any) => boolean
  emit: string
  type?: 'default'
}

interface TableMeta {
  totalItems: number
  currentPage?: number
  pageSize?: number
}

interface TableData {
  items: any[]
  meta: TableMeta
}

interface Props {
  title?: string
  loading?: boolean
  headers: Header[]
  tableData: TableData
  filterSchema?: FilterField[]
  actions?: Action[]
  actionToolbars?: Action[]
  filterList?: Record<string, any[]>
  actionLoading?: Record<string, boolean>
  rowClass?: (row: { item: any }) => Record<string, any>
  rowClick?: (item: any) => void
  defaultSortBy?: string
  headerTheme?: 'red' | 'blue' | 'green' | 'purple' | 'orange' | 'slate' | 'primary'
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  loading: false,
  headers: () => [],
  tableData: () => ({ items: [], meta: { totalItems: 0 } }),
  filterSchema: () => [],
  actions: () => [],
  actionToolbars: () => [],
  filterList: () => ({}),
  actionLoading: () => ({}),
  defaultSortBy: '',
  headerTheme: 'primary',
})

// Header theme classes
const headerThemeClasses: Record<string, string> = {
  red: 'bg-gradient-to-r from-red-500 to-red-400',
  blue: 'bg-gradient-to-r from-blue-500 to-blue-400',
  green: 'bg-gradient-to-r from-green-500 to-green-400',
  purple: 'bg-gradient-to-r from-purple-500 to-purple-400',
  orange: 'bg-gradient-to-r from-orange-500 to-orange-400',
  slate: 'bg-gradient-to-r from-slate-600 to-slate-500',
  primary: 'bg-gradient-to-r from-primary-500 to-primary-400',
}

const headerClass = computed(() => {
  return headerThemeClasses[props.headerTheme] || headerThemeClasses.primary
})

const emit = defineEmits<{
  fetchData: []
  [key: string]: any
}>()

const route = useRoute()
const router = useRouter()
const slots = useSlots()

// State
const itemsPerPage = ref(10)
const itemsPerPageOptions = [
  { value: 10, title: '10' },
  { value: 20, title: '20' },
  { value: 40, title: '40' },
  { value: 50, title: '50' },
]
const sortBy = ref<{ key: string; order: 'asc' | 'desc' }[]>([
  { key: props.defaultSortBy, order: 'desc' }
])
const filterLocal = ref<Record<string, any>>({})

// Computed
const numberInc = computed(() => {
  const number = parseInt(String(filterLocal.value.pageNumber - 1)) * itemsPerPage.value || 0
  return number
})

const slottedHeaders = computed(() => {
  return props.headers.filter((h) => !!slots[`item.${h.key}`])
})

const addAction = computed(() => {
  return props.actionToolbars?.find((a) => a.type === 'default' && a.show?.({}) !== false)
})

// Methods
const validActions = (arr: Action[], item: any) => {
  return arr.filter((a) => {
    if (a.type === 'default') return false
    if (typeof a.show === 'function') return a.show(item)
    return true
  })
}

// Color mapping for action colors (semantic colors to hex)
const colorMap: Record<string, string> = {
  primary: '#3b82f6',
  secondary: '#64748b',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  danger: '#ef4444',
  info: '#06b6d4',
}

// Get color value (supports hex, semantic names, or fallback)
const getActionColor = (color?: string): string => {
  if (!color) return '#64748b'
  if (color.startsWith('#') || color.startsWith('rgb')) return color
  return colorMap[color] || color
}

const resetFilterFromSchema = () => {
  const base: Record<string, any> = {
    q: '',
    pageSize: itemsPerPage.value,
    pageNumber: 1,
    sortBy: props.defaultSortBy,
    sortType: 'desc',
    t: Date.now(),
  }
  
  props.filterSchema.forEach((f) => {
    if (!f?.name) return
    base[f.name] = f.hasOwnProperty('default')
      ? f.default
      : f.type === 'date'
        ? new Date().toISOString().substring(0, 10)
        : null
  })
  
  filterLocal.value = base
}

const componentResolver = (type: string) => {
  switch (type) {
    case 'date':
      return resolveComponent('TableFilterDate')
    case 'autocomplete':
      return resolveComponent('TableFilterAutocomplete')
    case 'search':
      return resolveComponent('TableFilterSearch')
    case 'select':
      return resolveComponent('TableFilterSelect')
    case 'number':
      return resolveComponent('TableFilterNumber')
    case 'text':
    default:
      return resolveComponent('TableFilterText')
  }
}

const isDisabled = (field: FilterField) => {
  if (typeof field.disabled === 'function') {
    return field.disabled(filterLocal.value)
  }
  return !!field.disabled
}

const handleApplyFilterField = (field: FilterField) => {
  if (field.resetOnSelect && typeof field.resetOnSelect === 'object') {
    Object.keys(field.resetOnSelect).forEach((k) => {
      filterLocal.value[k] = field.resetOnSelect![k]
    })
  }

  if (field.emits) {
    emit(field.emits as any, { [field.name]: filterLocal.value[field.name] })
  }

  filterLocal.value.pageNumber = 1
  filterLocal.value.t = Date.now()
  router.replace({ path: route.path, query: filterLocal.value })
}

const handleRefreshItems = () => {
  filterLocal.value.q = ''
  filterLocal.value.pageNumber = 1
  filterLocal.value.t = Date.now()
  router.replace({ path: route.path, query: filterLocal.value })
}

const handlePageChanged = (page: number) => {
  filterLocal.value.pageNumber = page
  router.replace({ path: route.path, query: filterLocal.value })
}

const getItemPerPage = (val: number) => {
  itemsPerPage.value = +val
  filterLocal.value.pageSize = itemsPerPage.value
  router.replace({ path: route.path, query: filterLocal.value })
}

const handleSort = (headerKey: string) => {
  const header = props.headers.find(h => h.key === headerKey)
  if (!header?.sortable) return
  
  const currentSort = sortBy.value[0]
  if (currentSort && currentSort.key === headerKey) {
    currentSort.order = currentSort.order === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = [{ key: headerKey, order: 'desc' }]
  }
  
  const sort = sortBy.value[0]
  if (sort) {
    filterLocal.value.sortBy = sort.key
    filterLocal.value.sortType = sort.order
    router.replace({ path: route.path, query: filterLocal.value })
  }
}

const getList = (name?: string) => {
  if (!name) return []
  const listRef = props.filterList[name]
  return Array.isArray(listRef) ? listRef : []
}

const getRowClass = (row: { item: any }) => {
  const base = props.rowClass ? props.rowClass(row) : {}
  const isClickable = typeof props.rowClick === 'function'
  return {
    ...base,
    'hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors': true,
    'cursor-pointer': isClickable,
  }
}

const handleRowClick = (item: any) => {
  if (typeof props.rowClick === 'function') {
    props.rowClick(item)
  }
}

// Watchers
watch(() => route.query, () => {
  emit('fetchData')
}, { immediate: true })

watch(sortBy, () => {
  const sort = sortBy.value[0]
  if (sort) {
    filterLocal.value.sortBy = sort.key
    filterLocal.value.sortType = sort.order
    router.replace({ path: route.path, query: filterLocal.value })
  }
})

watch(() => props.filterSchema, () => {
  resetFilterFromSchema()
}, { immediate: true })

// Lifecycle
onMounted(() => {
  resetFilterFromSchema()
  
  if (route.query && Object.keys(route.query).length) {
    const q = route.query
    Object.keys(q).forEach((k) => {
      if (k in filterLocal.value) {
        const schemaField = props.filterSchema.find((f) => f.name === k)
        if (schemaField?.type === 'number') {
          filterLocal.value[k] = Number(q[k])
        } else {
          filterLocal.value[k] = q[k]
        }
      }
    })
  }
})
</script>