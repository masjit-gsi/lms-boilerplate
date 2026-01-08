<template>
  <div class="w-full space-y-4 animate-fade-in">
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
      :filterList="{listRole, statusOptions}"
      :actions="actions"
      :actionToolbars="actionToolbars"
      @fetchData="loadAll"
      @addItem="addItem"
      @editItem="editItem"
      @deleteItem="deleteItem"
    >
      <template #item.status="{ value }">
        <UiBadge :variant="getStatusVariant(value)">{{ value }}</UiBadge>
      </template>
    </TableList>

    <UiModal 
      v-model="showModal" 
      :title="isEditing ? 'Edit User' : 'Tambah User'" 
      size="md"
    >
      <UiForm ref="formRef">
        <div class="space-y-4">
          <UiAutocomplete 
              v-model="editedItem.roleId"
              label="Role" 
              placeholder="Pilih role" 
              :options="listRole"
              item-value="id"
              item-title="name"
              required
              :rules="[v => !!v || 'Role wajib dipilih']"
          />

          <UiInput 
            v-model="editedItem.name"
            label="Nama" 
            placeholder="Masukkan nama" 
            required 
            :rules="[v => !!v || 'Nama wajib diisi']"
          />

          <UiInput 
            v-model="editedItem.username"
            label="Username" 
            placeholder="Masukkan username" 
            required 
            :rules="[
              v => !!v || 'Username wajib diisi',
              v => (v && v.length >= 3) || 'Username minimal 3 karakter'
            ]"
          />
          
          <UiInput 
            v-model="editedItem.email"
            label="Email" 
            type="email" 
            placeholder="Masukkan email" 
            required 
            :rules="[
              v => !!v || 'Email wajib diisi',
              v => /.+@.+\..+/.test(v) || 'Format email tidak valid'
            ]"
          />

          <UiInput 
            v-model="editedItem.password"
            label="Password" 
            type="password" 
            placeholder="Masukkan password" 
            :required="!isEditing"
            :rules="passwordRules"
          />
        </div>
      </UiForm>
      <template #footer>
        <UiButton color="secondary" @click="showModal = false">Batal</UiButton>
        <UiButton color="primary" :loading="loading" @click="onSubmit">
          {{ isEditing ? 'Simpan Perubahan' : 'Simpan' }}
        </UiButton>
      </template>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import userService from "~/services/user.service";
import roleService from "~/services/role.service";

definePageMeta({
  layout: "default",
});

useHead({
  title: "Users | Admin Dashboard",
});

const swal = useSwal();
const route = useRoute();
const userSvc = userService();
const roleSvc = roleService();

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
const listRole: any = ref([]);

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
  { name: 'status', 
    type: 'select' as const, 
    label: '', 
    items: 'statusOptions', 
    placeholder: 'Pilih status', 
    colMd: 2,
    valueKey: "id",
    textKey: "name",
  },
  { name: 'roleId', 
    type: 'autocomplete' as const, 
    label: '', 
    items: 'listRole', 
    placeholder: 'Pilih role', 
    colMd: 2,
    valueKey: "id",
    textKey: "name",
  },
  {
    name: '',
    type: 'text' as const,
    colMd: 4,
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
    color: "primary",
    tooltip: "Tambah",
    emit: "addItem",
    type: "default" as const,
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
];

const formRef = ref<{ validate: () => Promise<boolean>; reset: () => void; resetValidation: () => void } | null>(null);

// Default item
const defaultItem = {
  id: null,
  name: '',
  username: '',
  email: '',
  password: '',
  roleId: null,
  status: '1',
};
const editedItem:any = ref({ ...defaultItem });

const passwordRules = computed(() => {
  if (isEditing.value) {
    return [
      (v: string) => !v || v.length >= 6 || 'Password minimal 6 karakter'
    ];
  }
  return [
    (v: string) => !!v || 'Password harus diisi',
    (v: string) => (v && v.length >= 6) || 'Password minimal 6 karakter'
  ];
});

onMounted(() => {
    loadAllRole();
});

async function loadAll() {
  const { pageNumber, pageSize, q, sortBy, sortType, roleId} = route.query;
  isLoading.value = true;
  await userSvc.retrieve({
      q: q,
      pageSize: pageSize ? pageSize : itemPerPage.value,
      pageNumber: pageNumber ? pageNumber : 1,
      sortBy: sortBy,
      sortType: sortType,
      roleId: roleId,
    })
    .then((res: any) => {
      isLoading.value = false;
      tableData.value = {
        items: res.data != null ? res.data.items : [],
        meta: res.data.meta,
      };
    });
}

async function loadAllRole() {
  await roleSvc.retrieveAll({})
    .then((res: any) => {
      listRole.value = res.data;
    });
}

function addItem() {
  isEditing.value = false;
  editingId.value = undefined;
  editedItem.value = { ...defaultItem };
  formRef.value?.reset();
  showModal.value = true;
};

async function editItem(user: any) {
  formRef.value?.resetValidation();
  await userSvc.retrieveById(user.id)
    .then((res: any) => {
      if (res.data.id) {
        editedItem.value = res.data;  
        editedItem.value.password = null;
        isEditing.value = true;
        editingId.value = user.id;
        showModal.value = true;
      }
    });
};

const onSubmit = async () => {
  const isValid = await formRef.value?.validate();
  if (!isValid) return;
  
  loading.value = true;
  editedItem.value.status = "1";
  userSvc.save(editedItem.value)
  .then((res: any) => {
    swal.toast(isEditing.value ? 'Data berhasil diperbarui' : 'Data berhasil ditambahkan', 'success');
    showModal.value = false;
    loadAll();
  })
  .catch((err: any) => {
    loading.value = false;
    console.error("Failed to save user", err);
  });
};

const statusOptions = [
  { name: "Active", id: "active" },
  { name: "Inactive", id: "inactive" },
  { name: "Pending", id: "pending" },
];

const getStatusVariant = (status: string) => {
  const variants: Record<string, "success" | "danger" | "warning"> = {
    active: "success",
    inactive: "danger",
    pending: "warning",
  };
  return variants[status] || "default";
};


const deleteItem = async (row: any) => {
  const result = await swal.confirmDelete(row.name);
  if (result.isConfirmed) {
    try {
      swal.loading('Menghapus data...');
      await userSvc.destroy(row.id);
      swal.closeLoading();
      swal.toast('Data berhasil dihapus', 'success');
      await loadAll();
    } catch (error) {
      swal.closeLoading();
      swal.error('Gagal', 'Terjadi kesalahan saat menghapus data');
      console.error("Failed to delete user", error);
    }
  }
};
</script>