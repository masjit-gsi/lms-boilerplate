<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

definePageMeta({
  layout: "default",
});

useHead({
  title: "Users | Admin Dashboard",
});

const showModal = ref(false);
const isEditing = ref(false);
const loading = ref(false);
const editingId = ref<number | undefined>(undefined);

// Define Zod Schema
const userSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, "Full Name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    role: z.string().min(1, "Role is required"),
    status: z.string().optional(),
  })
);

// Setup form with vee-validate
const { handleSubmit, defineField, resetForm, errors } = useForm({
  validationSchema: userSchema,
});

// Define fields with props for v-model
const [name, nameProps] = defineField("name");
const [email, emailProps] = defineField("email");
const [role, roleProps] = defineField("role");
const [status, statusProps] = defineField("status");

const filters = reactive({
  search: "",
  role: null,
  status: null,
  date: null
});

const handleAddUser = () => {
  isEditing.value = false;
  editingId.value = undefined;
  resetForm({
    values: {
      name: "",
      email: "",
      role: null, // Select needs null to show placeholder
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
      email: user.email,
      role: user.role,
      status: user.status,
    },
  });
  showModal.value = true;
};

const onSubmit = handleSubmit(async (values) => {
  loading.value = true;
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (isEditing.value && editingId.value !== undefined) {
    const index = users.value.findIndex((u) => u.id === editingId.value);
    if (index !== -1) {
      users.value[index] = {
        ...users.value[index]!,
        ...values,
        id: editingId.value,
        role: values.role!,
        status: values.status || "active",
      };
    }
  } else {
    users.value.push({
      ...values,
      id: users.value.length + 1,
      role: values.role!,
      status: values.status || "active",
      avatar: null,
    });
  }

  loading.value = false;
  showModal.value = false;
});


const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role", width: "120px" },
  { key: "status", label: "Status", width: "100px" },
  { key: "actions", label: "", width: "80px" },
];

const users = ref([
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "active", avatar: null },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Editor", status: "active", avatar: null },
  { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "User", status: "inactive", avatar: null },
  { id: 4, name: "Sarah Williams", email: "sarah@example.com", role: "Editor", status: "active", avatar: null },
  { id: 5, name: "Tom Brown", email: "tom@example.com", role: "User", status: "pending", avatar: null },
]);

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

const handleAction = (action: string, row: any) => {
  if (action === "edit") {
    handleEditUser(row);
  } else if (action === "delete") {
    users.value = users.value.filter(u => u.id !== row.id);
  }
};
</script>

<template>
  <div class="w-full space-y-6 animate-fade-in">
    <!-- Page header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <LayoutBreadcrumb
          :items="[
            { label: 'Dashboard', to: '/' },
            { label: 'Users' },
          ]"
        />
        <h1 class="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Users</h1>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage your team members and their permissions.
        </p>
      </div>
      <UiButton variant="primary" @click="handleAddUser">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
        Add User
      </UiButton>
    </div>

    <!-- Filters -->
    <UiCard>
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <UiInput v-model="filters.search" placeholder="Search users..." type="search">
            <template #prefix>
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </template>
          </UiInput>
        </div>
        <div class="flex flex-wrap gap-3">
          <UiDatePicker
            v-model="filters.date"
            class="w-80"
            placeholder="Join Date"
            mode="date"
          />
          <UiSelect 
              v-model="filters.role"
              placeholder="All Roles" 
              class="w-40" 
              :options="roleOptions"
          />
          <UiSelect 
              v-model="filters.status"
              placeholder="All Status" 
              class="w-40" 
              :options="statusOptions"
          />
        </div>
      </div>
    </UiCard>

    <!-- Users table -->
    <UiTable :columns="columns" :data="users">
      <template #cell-name="{ row }">
        <div class="flex items-center gap-3">
          <UiAvatar :name="row.name as string" size="sm" />
          <span class="font-medium text-slate-900 dark:text-white">{{ row.name }}</span>
        </div>
      </template>
      <template #cell-email="{ value }">
        <span class="text-slate-600 dark:text-slate-400">{{ value }}</span>
      </template>
      <template #cell-role="{ value }">
        <UiBadge variant="default">{{ value }}</UiBadge>
      </template>
      <template #cell-status="{ value }">
        <UiBadge :variant="getStatusVariant(value as string)" dot>
          {{ value }}
        </UiBadge>
      </template>
      <template #cell-actions="{ row }">
        <UiDropdown :items="actionItems" align="right" @select="(item: any) => handleAction(item.value, row)">
          <template #trigger>
            <button class="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
              <svg class="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </template>
        </UiDropdown>
      </template>
    </UiTable>

    <!-- Pagination -->
    <div class="flex items-center justify-between">
      <p class="text-sm text-slate-500 dark:text-slate-400">
        Showing <span class="font-medium">1</span> to <span class="font-medium">5</span> of <span class="font-medium">5</span> results
      </p>
      <div class="flex gap-2">
        <UiButton variant="secondary" size="sm" disabled>Previous</UiButton>
        <UiButton variant="secondary" size="sm" disabled>Next</UiButton>
      </div>
    </div>

    <!-- Add/Edit User Modal -->
    <UiModal v-model="showModal" :title="isEditing ? 'Edit User' : 'Add New User'" size="md">
      <div class="space-y-4">
        <UiInput 
          v-model="name"
          v-bind="nameProps"
          label="Full Name" 
          placeholder="Enter full name" 
          required 
          :error="errors.name"
        />
        
        <UiInput 
          v-model="email"
          v-bind="emailProps"
          label="Email Address" 
          type="email" 
          placeholder="Enter email" 
          required 
          :error="errors.email"
        />
        
        <UiSelect 
            v-model="role"
            v-bind="roleProps"
            label="Role" 
            placeholder="Select a role" 
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
            placeholder="Select status" 
            :options="statusOptions"
        />
      </div>
      <template #footer>
        <UiButton variant="secondary" @click="showModal = false">Cancel</UiButton>
        <UiButton variant="primary" :loading="loading" @click="onSubmit">
          {{ isEditing ? 'Save Changes' : 'Add User' }}
        </UiButton>
      </template>
    </UiModal>
  </div>
</template>
