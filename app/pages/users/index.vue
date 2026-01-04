<template>
  <div class="w-full space-y-4 animate-fade-in">
    <!-- Breadcrumb -->
    <LayoutBreadcrumb
      :items="breadcrumbs"
    />

    <TableList
      title="Data User"
      defaultSortBy="createdAt"
      searchTitle="Cari <enter>"  
      :headers="headers"
      :tableData="tableData"
      :loading="isLoading"
      :filterSchema="filterSchema"
      :filterList="{statusOptions}"
      :actions="actions"
      :actionToolbars="actionToolbars"
      @fetchData="loadAll"
      @addItem="handleAddUser"
      @editItem="handleEditUser"
      @deleteItem="handleDelete"
    >
      <template #item.status="{ value }">
        <UiBadge :variant="getStatusVariant(value)">{{ value }}</UiBadge>
      </template>
    </TableList>

    <!-- Add/Edit User Modal -->
    <UiModal 
      v-model="showModal" 
      :title="isEditing ? 'Edit User' : 'Tambah User Baru'" 
      size="md"
    >
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
          {{ isEditing ? 'Simpan Perubahan' : 'Simpan' }}
        </UiButton>
      </template>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
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
const tableData: any = ref({
  items: [],
  meta: {
    totalItems: 0,
  },
});
const breadcrumbs = ref([
  { label: 'Dashboard', to: '/' },
  { label: 'Master Data' },
  { label: 'Users' },
]);


const headers = [
  { key: 'name', title: 'Nama', sortable: true },
  { key: 'email', title: 'Email', sortable: true },
  { key: 'status', title: 'Status', align: 'center' },
  { key: 'actions', title: 'Aksi', align: 'center', width: '10%' },
]
const filterSchema = [
  { name: 'status', type: 'select' as const, label: '', items: 'statusOptions', placeholder: 'Pilih status', colMd: 2 },
  {
    name: '',
    type: 'text' as const,
    colMd: 6,
  },
  { name: 'q', type: 'search' as const, placeholder: 'Cari...', colMd: 4 },
]
const actions = [
  { key: 'edit', icon: 'mdi-pencil', color: '#f59e0b', tooltip: 'Edit', emit: 'editItem' },
  { key: 'delete', icon: 'mdi-delete', color: '#ef4444', tooltip: 'Hapus', emit: 'deleteItem' },
]
const actionToolbars = [
  {
    key: "addItem",
    icon: "mdi-plus-circle-outline",
    color: "white",
    tooltip: "Tambah",
    emit: "addItem",
    // type: "default",
  },
  {
    key: "exportPdf",
    icon: "mdi-file-pdf-box",
    color: "white",
    tooltip: "Export PDF",
    emit: "exportPdf",
  },
  {
    key: "exportExcel",
    icon: "mdi-file-excel",
    color: "white",
    tooltip: "Export Excel",
    emit: "exportExcel",
  },
  {
    key: "importPo",
    icon: "mdi-file-import",
    color: "white",
    tooltip: "Import PO",
    emit: "importItem",
  },
  {
    key: "addPo",
    icon: "mdi-plus-circle",
    color: "white",
    tooltip: "Tambah",
    emit: "addItem",
  },
];

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
    // loadAll();
});

const handleAddUser = () => {
  isEditing.value = false;
  editingId.value = undefined;
  resetForm({
    values: {
      name: "",
      username: "",
      email: "",
      password: "",
      role: "", 
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

const handleDelete = async (row: any) => {
  if (confirm("Are you sure you want to delete this user?")) {
        try {
            await service.destroy(row.id);
            await loadAll();
        } catch (error) {
            console.error("Failed to delete user", error);
        }
    }
};
</script>