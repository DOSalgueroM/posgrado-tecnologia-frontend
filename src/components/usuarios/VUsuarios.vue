
<template>
  <q-page :class="$q.dark.isActive ? 'bg-dark' : 'bg-grey-2'" padding>
    <div class="row q-mb-md items-center justify-end">
      <div class="col-auto">
        <q-btn color="primary" icon="add" label="Nuevo Usuario" @click="openCreateDialog" style="margin-right: 20px;" />
      </div>

      <div class="col-12 col-sm-4 col-md-3 q-pr-sm">
        <q-input 
          v-model="searchText" 
          dense 
          outlined 
          placeholder="Buscar usuarios..."
          @update:model-value="handleSearch"
          :dark="$q.dark.isActive"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>

    <q-table 
      v-model:pagination="pagination" 
      :rows="users" 
      :columns="columns" 
      :loading="loading" 
      row-key="id"
      @request="onRequest" 
      class="my-sticky-header-table"
      :dark="$q.dark.isActive"
      style="height: calc(100vh - 170px); width: 100%"
    >

      <template v-slot:body-cell-index="props">
        <q-td :props="props" class="text-center">
          {{ getRowNumber(props.rowIndex) }}
        </q-td>
      </template>

      <template v-slot:body-cell-activo="props">
        <q-td :props="props" class="text-center">
          <q-icon :name="props.row.activo ? 'check_circle' : 'cancel'" :color="props.row.activo ? 'positive' : 'negative'"
            size="sm" />
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="text-center">
          <q-btn flat round color="primary" icon="edit" size="sm" @click="openEditDialog(props.row)">
            <q-tooltip>Editar usuario</q-tooltip>
          </q-btn>
          <q-btn flat round color="negative" icon="delete" size="sm" @click="confirmDelete(props.row)">
            <q-tooltip>Eliminar usuario</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="deleteDialog">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="negative" text-color="white" />
          <span class="q-ml-sm">¿Está seguro de eliminar este usuario?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Eliminar" color="negative" :loading="deleteLoading" @click="deleteUser" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { UserService } from '../../components/services/user';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

interface Usuario {
  id: number;
  nombre_apellido: string;
  username: string;
  activo: boolean;
}

interface PaginationDto {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

interface FilterUsuariosDto {
  searchtext?: string;
}

const $q = useQuasar();
const router = useRouter();

const users = ref<Usuario[]>([]);
const loading = ref(false);
const searchText = ref('');
const deleteDialog = ref(false);
const deleteLoading = ref(false);
const userToDelete = ref<Usuario | null>(null);

const pagination = ref({
  sortBy: '',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
});

const columns = [
  {
    name: 'index',
    label: 'Nº',
    field: 'index',
    align: 'center' as const,
  },
  {
    name: 'nombre_apellido',
    label: 'Nombre Completo',
    field: 'nombre_apellido',
    align: 'left' as const,
    sortable: true
  },
  {
    name: 'username',
    label: 'Usuario',
    field: 'username',
    align: 'left' as const,
    sortable: true
  },
  {
    name: 'activo',
    label: 'Estado',
    field: 'activo',
    align: 'center' as const,
    sortable: true
  },
  {
    name: 'actions',
    label: 'Acciones',
    field: 'actions',
    align: 'center' as const,
  }
];

const loadUsers = async (props = { pagination: pagination.value }) => {
  loading.value = true;
  try {
    const paginationDto: PaginationDto = {
      page: props.pagination.page,
      limit: props.pagination.rowsPerPage,
    };

    if (props.pagination.sortBy) {
      // Aseguramos que el campo de ordenación coincida con el nombre en la base de datos
      paginationDto.sortBy = props.pagination.sortBy;
      paginationDto.sortOrder = props.pagination.descending ? 'DESC' : 'ASC';
    }

    const filterDto: FilterUsuariosDto = {};
    if (searchText.value) {
      filterDto.searchtext = searchText.value;
    }

    const response = await UserService.obtenerUsuariosPaginados(
      paginationDto,
      filterDto
    );

    users.value = response.data.map((user: any, index: number) => ({
      ...user,
      index,
    }));

    pagination.value.rowsNumber = response.meta.total;

  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Error al cargar los usuarios',
      position: 'top'
    });
  } finally {
    loading.value = false;
  }
};

const getRowNumber = (index: number) => {
  return (pagination.value.page - 1) * pagination.value.rowsPerPage + index + 1;
};

const onRequest = (props: any) => {
  pagination.value = props.pagination;
  loadUsers(props);
};

const handleSearch = () => {
  pagination.value.page = 1;
  loadUsers();
};

const openCreateDialog = () => {
  router.push('/usuarios/nuevo');
};

const openEditDialog = (user: Usuario) => {
  router.push(`/usuarios/editar/${user.id}`);
};

const confirmDelete = (user: Usuario) => {
  userToDelete.value = user;
  deleteDialog.value = true;
};

const deleteUser = async () => {
  if (!userToDelete.value) return;

  deleteLoading.value = true;
  try {
    await UserService.eliminarUsuario(userToDelete.value.id);
    $q.notify({
      type: 'positive',
      message: 'Usuario eliminado exitosamente'
    });
    deleteDialog.value = false;
    loadUsers();
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: 'Error al eliminar el usuario: ' + error.message
    });
  } finally {
    deleteLoading.value = false;
    userToDelete.value = null;
  }
};

onMounted(() => {
  loadUsers();
});
</script>

<style lang="scss">
.my-sticky-header-table {
  height: calc(100vh - 250px);

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th {
    background-color: transparent !important;
  }

  thead tr th {
    position: sticky;
    z-index: 1;
  }

  thead tr:first-child th {
    top: 0;
  }

  .q-table__body td {
    text-align: center;
  }
}

:deep(.q-table__container) {
  background-color: transparent !important;
}

:deep(.q-table) {
  background-color: transparent !important;
}

body.body--dark {
  .my-sticky-header-table {
    color: white;
    
    .q-table__top,
    .q-table__bottom,
    thead tr:first-child th,
    tbody tr td {
      color: white !important;
      background-color: #1d1d1d !important;
    }

    tbody tr {
      background-color: #1d1d1d !important;
      
      &:hover {
        background-color: #2d2d2d !important;
      }
    }
  }

  .q-dialog {
    .q-card {
      background-color: #1d1d1d !important;
      color: white;
    }
  }
}
</style>
