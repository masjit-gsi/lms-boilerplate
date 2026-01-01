<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import userService from "~/services/user.service";

definePageMeta({
  layout: "default",
});

useHead({
  title: "Users | Admin Dashboard",
});

const route = useRoute();
const isLoading: any = ref(false);
const itemPerPage = ref(10);
const showModal = ref(false);
const isEditing = ref(false);
const loading = ref(false);
const editingId = ref<any>(undefined);
const users = ref<any[]>([]);
const tableData: any = ref({
  items: [],
  meta: {
    totalItems: 0,
  },
});

// Service instance
const service = userService();

// Define Zod Schema
const userSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, "Full Name is required"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal('')),
    role: z.string().min(1, "Role is required"),
    status: z.string().optional(),
  }).refine((data) => {
    // Password required for new users
    if (!editingId.value && (!data.password || data.password.length < 6)) {
      return false;
    }
    return true;
  }, {
    message: "Password is required for new users",
    path: ["password"],
  })
);

// Setup form with vee-validate
const { handleSubmit, defineField, resetForm, errors } = useForm({
  validationSchema: userSchema,
});

// Define fields with props for v-model
const [name, nameProps] = defineField("name");
const [username, usernameProps] = defineField("username");
const [email, emailProps] = defineField("email");
const [password, passwordProps] = defineField("password");
const [role, roleProps] = defineField("role");
const [status, statusProps] = defineField("status");

const filters = reactive({
  search: "",
  role: null,
  status: null,
  date: null
});

async function loadAll() {
  const { pageNumber, pageSize, q, sortBy, sortType, idRole} = route.query;
  isLoading.value = true;
  await service.retrieve({
      q: q,
      pageSize: pageSize ? pageSize : itemPerPage.value,
      pageNumber: pageNumber ? pageNumber : 1,
      sortBy: sortBy,
      sortType: sortType,
      roleId: idRole,
    })
    .then((res: any) => {
      isLoading.value = false;
      tableData.value = {
        items: res.data != null ? res.data.items : [],
        meta: res.data.meta,
      };
    });
}

onMounted(() => {
    loadAll();
});

watch(filters, () => {
    loadAll();
}, { deep: true });

const handleAddUser = () => {
  isEditing.value = false;
  editingId.value = undefined;
  resetForm({
    values: {
      name: "",
      username: "",
      email: "",
      password: "",
      role: null, 
      status: "active",
    },
  });
  showModal.value = true;
};

const handleEditUser = (user: any) => {
  isEditing.value = true;
  editingId.value = user.id;
  resetForm({
    values: {
      name: user.name,
      username: user.username,
      email: user.email,
      password: "", // Leave empty for edit unless changing
      role: user.roleId || user.role, // Map roleId
      status: user.status,
    },
  });
  showModal.value = true;
};

const onSubmit = handleSubmit(async (values) => {
  loading.value = true;
  
  try {
      const payload = {
          ...values,
          id: editingId.value,
          roleId: values.role, // Map role to roleId
          active: values.status === 'active', // Map status to active boolean
          // Only send password if provided
          ...(values.password ? { password: values.password } : {}),
      };

      await service.save(payload);
      
      await loadAll(); // Refresh list
      showModal.value = false;
  } catch (error) {
      console.error("Failed to save user", error);
  } finally {
      loading.value = false;
  }
});


const columns = [
  { key: "name", label: "Name" },
  { key: "username", label: "Username" }, // Added username column
  { key: "email", label: "Email" },
  { key: "role", label: "Role", width: "120px" },
  { key: "status", label: "Status", width: "100px" },
  { key: "actions", label: "", width: "80px" },
];

const roleOptions = [
  { label: "Administrator", value: "Admin" },
  { label: "Content Editor", value: "Editor" },
  { label: "Standard User", value: "User" },
];

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Pending", value: "pending" },
];

const getStatusVariant = (status: string) => {
  const variants: Record<string, "success" | "danger" | "warning"> = {
    active: "success",
    inactive: "danger",
    pending: "warning",
  };
  return variants[status] || "default";
};

const actionItems = [
  { label: "Edit", value: "edit" },
  { label: "View Profile", value: "view" },
  { divider: true, label: "" },
  { label: "Delete", value: "delete", danger: true },
];

const handleAction = async (action: string, row: any) => {
  if (action === "edit") {
    handleEditUser(row);
  } else if (action === "delete") {
    if (confirm("Are you sure you want to delete this user?")) {
        try {
            await service.destroy(row.id);
            await loadAll();
        } catch (error) {
            console.error("Failed to delete user", error);
        }
    }
  }
};

const headers = [
  { key: 'name', title: 'Nama', sortable: true },
  { key: 'email', title: 'Email' },
  { key: 'status', title: 'Status' },
]
const filterSchema = [
  { name: 'q', type: 'search', placeholder: 'Cari...', colMd: 4 },
  { name: 'status', type: 'select', label: 'Status', items: 'statusList', colMd: 2 },
]
const actions = [
  { key: 'edit', icon: '✏️', color: '#f59e0b', tooltip: 'Edit', emit: 'editItem' },
  { key: 'delete', icon: '🗑️', color: '#ef4444', tooltip: 'Hapus', emit: 'deleteItem' },
]
</script>

<template>
  <div class="w-full space-y-4 animate-fade-in">
  <TableList
    title="Data User"
    :headers="headers"
    :tableData="tableData"
    :loading="isLoading"
    :filterSchema="filterSchema"
    :filterList="{}"
    :actions="actions"
    @fetchData="loadAll"
    @editItem="handleEditUser"
    @deleteItem="handleDelete"
  >
    <template #item.status="{ value }">
      <UiBadge :variant="getStatusVariant(value)">{{ value }}</UiBadge>
    </template>
  </TableList>




    <!-- Breadcrumb -->
    <LayoutBreadcrumb
      :items="[
        { label: 'Dashboard', to: '/' },
        { label: 'Master Data' },
        { label: 'Users' },
      ]"
    />

    <!-- Red Header Bar -->
    <div class="bg-gradient-to-r from-red-500 to-red-400 rounded-lg px-6 py-4 flex items-center justify-between shadow-lg">
      <h1 class="text-xl font-semibold text-white">Data User</h1>
      <button 
        @click="loadAll" 
        class="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
        title="Refresh"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>

    <!-- Search and Add Button Row -->
    <div class="flex items-center justify-end gap-3">
      <div class="relative">
        <input 
          v-model="filters.search"
          type="text"
          placeholder="Cari (Tekan Enter)"
          class="w-64 px-4 py-2 pr-10 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
          @keyup.enter="loadAll"
        />
        <svg class="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <button 
        @click="handleAddUser"
        class="w-10 h-10 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-colors"
        title="Tambah User"
      >
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>

    <!-- Data Table -->
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="border-b border-slate-200 dark:border-slate-700">
            <th class="px-4 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-300 w-16">No</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">Username</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">Nama</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">Email</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-300 w-32">Role</th>
            <th class="px-4 py-3 text-center text-sm font-semibold text-slate-600 dark:text-slate-300 w-24">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <!-- Loading State -->
          <tr v-if="isLoading">
            <td colspan="6" class="px-4 py-8 text-center text-slate-500">
              <div class="flex items-center justify-center gap-2">
                <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memuat data...
              </div>
            </td>
          </tr>
          <!-- Empty State -->
          <tr v-else-if="tableData.items.length === 0">
            <td colspan="6" class="px-4 py-8 text-center text-slate-500">
              Tidak ada data
            </td>
          </tr>
          <!-- Data Rows -->
          <tr 
            v-else
            v-for="(item, index) in tableData.items" 
            :key="item.id"
            class="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <td class="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{{ index + 1 }}.</td>
            <td class="px-4 py-3 text-sm text-slate-900 dark:text-white font-medium">{{ item.username }}</td>
            <td class="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{{ item.name }}</td>
            <td class="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{{ item.email }}</td>
            <td class="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
              {{ typeof item.role === 'object' ? item.role?.name : item.role }}
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center justify-center gap-2">
                <!-- Edit Button -->
                <button 
                  @click="handleEditUser(item)"
                  class="w-8 h-8 flex items-center justify-center bg-amber-400 hover:bg-amber-500 text-white rounded transition-colors"
                  title="Edit"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <!-- Delete Button -->
                <button 
                  @click="handleAction('delete', item)"
                  class="w-8 h-8 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                  title="Hapus"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
        <span>Tampilkan</span>
        <select 
          v-model="itemPerPage"
          @change="loadAll"
          class="px-2 py-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
        >
          <option :value="10">10</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
        </select>
        <span>Dari {{ tableData.meta?.totalItems || 0 }} data</span>
      </div>
      <div class="flex items-center gap-1">
        <button 
          class="px-3 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled
        >
          «
        </button>
        <button 
          class="px-3 py-1 text-sm bg-blue-500 text-white rounded"
        >
          1
        </button>
        <button 
          class="px-3 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled
        >
          »
        </button>
      </div>
    </div>

    <!-- Add/Edit User Modal -->
    <UiModal v-model="showModal" :title="isEditing ? 'Edit User' : 'Tambah User Baru'" size="md">
      <div class="space-y-4">
        <UiInput 
          v-model="name"
          v-bind="nameProps"
          label="Nama Lengkap" 
          placeholder="Masukkan nama lengkap" 
          required 
          :error="errors.name"
        />

        <UiInput 
          v-model="username"
          v-bind="usernameProps"
          label="Username" 
          placeholder="Masukkan username" 
          required 
          :error="errors.username"
        />
        
        <UiInput 
          v-model="email"
          v-bind="emailProps"
          label="Email" 
          type="email" 
          placeholder="Masukkan email" 
          required 
          :error="errors.email"
        />

        <UiInput 
          v-model="password"
          v-bind="passwordProps"
          label="Password" 
          type="password" 
          placeholder="Masukkan password" 
          :required="!isEditing"
          :error="errors.password"
        />
        
        <UiSelect 
            v-model="role"
            v-bind="roleProps"
            label="Role" 
            placeholder="Pilih role" 
            :options="roleOptions"
            required
            searchable
            :error="errors.role"
        />

        <UiSelect 
            v-if="isEditing"
            v-model="status" 
            v-bind="statusProps"
            label="Status" 
            placeholder="Pilih status" 
            :options="statusOptions"
        />
      </div>
      <template #footer>
        <UiButton variant="secondary" @click="showModal = false">Batal</UiButton>
        <UiButton variant="primary" :loading="loading" @click="onSubmit">
          {{ isEditing ? 'Simpan Perubahan' : 'Tambah User' }}
        </UiButton>
      </template>
    </UiModal>
  </div>
</template>
