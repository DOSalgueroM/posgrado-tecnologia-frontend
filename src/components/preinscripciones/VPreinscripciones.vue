<template>
  <q-page :class="$q.dark.isActive ? 'bg-dark' : 'bg-grey-2'" padding>
    <div class="row q-mb-md items-center">
      <div class="col-12 col-sm-4 col-md-3 q-pr-sm">
        <q-select
          v-model="selectedTipo"
          :options="tiposPrograma"
          label="Tipo de Programa"
          outlined
          dense
          emit-value
          map-options
          :dark="$q.dark.isActive"
          @update:model-value="onTipoChange"
        />
      </div>

      <div class="col-12 col-sm-4 col-md-3 q-pr-sm">
        <q-select
          v-model="selectedPrograma"
          :options="programas"
          label="Programa"
          outlined
          dense
          emit-value
          map-options
          :dark="$q.dark.isActive"
          :disable="!selectedTipo"
          @update:model-value="loadPreinscripciones"
        />
      </div>

      <div class="col-12 col-sm-4 col-md-3">
        <q-input 
          v-model="searchText" 
          dense 
          outlined 
          placeholder="Buscar..."
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
      :rows="filteredPreinscripciones"
      :columns="columns"
      :loading="loading"
      row-key="id"
      @request="onRequest"
      class="my-sticky-header-table"
      :dark="$q.dark.isActive"
      style="height: calc(100vh - 170px); width: 100%"
      :no-data-label="'No hay datos disponibles'"
      :loading-label="'Cargando...'"
      :selected-rows-label="filas => '1 fila seleccionada' + (filas !== 1 ? 's' : '')"
      :pagination-label="(start, end, total) => `${start} - ${end} de ${total}`"
      :rows-per-page-label="'Registros por página'"
    >
      <template v-slot:body-cell-index="props">
        <q-td :props="props" class="text-center">
          {{ getRowNumber(props.rowIndex) }}
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="text-center">
          <q-btn flat round color="info" icon="visibility" size="sm" @click="verDetalles(props.row)">
            <q-tooltip>Ver detalles</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <!-- Modal de detalles -->
    <q-dialog v-model="showDetails" persistent>
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center">
          <div class="text-h6">Detalles de la Preinscripción</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section v-if="selectedPreinscripcion">
          <div class="q-pa-md">
            <div class="row q-mb-md">
              <div class="col-12 text-subtitle1">Información Personal</div>
              <div class="col-12 q-mt-sm">
                <strong>Nombre:</strong> {{ selectedPreinscripcion.nombreCompleto }}
              </div>
              <div class="col-12">
                <strong>Email:</strong> {{ selectedPreinscripcion.email }}
              </div>
              <div class="col-12">
                <strong>Teléfono:</strong> {{ selectedPreinscripcion.celular }}
              </div>
              <div class="col-12">
                <strong>CU:</strong> {{ selectedPreinscripcion.cu }}
              </div>
              <div class="col-12">
                <strong>Carrera:</strong> {{ selectedPreinscripcion.carrera }}
              </div>
            </div>

            <div class="row q-mb-md">
              <div class="col-12 text-subtitle1">Información Académica</div>
              <div class="col-12 q-mt-sm">
                <strong>Programa:</strong> {{ selectedPreinscripcion.programa.nombre }}
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useQuasar } from 'quasar';
import { PreinscripcionService } from 'src/services/preinscripcion';
import { ProgramaService } from 'src/services/programa';

interface Preinscripcion {
  id: number;
  nombreCompleto: string;
  carrera: string;
  cu: string;
  celular: string;
  email: string;
  programaId: number;
  programa: {
    id: number;
    nombre: string;
    tipo: string;
  };
  fechaRegistro: string;
  fechaActualizacion: string;
  fechaEliminacion: string;
  usuarioCreacion: string;
  usuarioActualizacion: string;
  usuarioEliminacion: string;
}

interface Programa {
  id: number;
  nombre: string;
  tipo: string;
}

const $q = useQuasar();

// State
const loading = ref(false);
const searchText = ref('');
const preinscripciones = ref<Preinscripcion[]>([]);
const filteredPreinscripciones = computed(() => {
  if (!searchText.value) return preinscripciones.value;
  
  const searchLower = searchText.value.toLowerCase();
  return preinscripciones.value.filter(p => 
    p.nombreCompleto.toLowerCase().includes(searchLower) ||
    p.email.toLowerCase().includes(searchLower) ||
    p.celular.includes(searchLower)
  );
});
const selectedTipo = ref<string | null>(null); 
const selectedPrograma = ref<number | null>(null);
const programas = ref<{ label: string; value: number; }[]>([]);
const showDetails = ref(false);
const selectedPreinscripcion = ref<Preinscripcion | null>(null);

const pagination = ref({
  sortBy: 'fechaRegistro',
  descending: true,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
});

const tiposPrograma = [
  { label: 'Diplomados', value: 'DIPLOMADO' },
  { label: 'Especialidades', value: 'ESPECIALIDAD' },
  { label: 'Maestrías', value: 'MAESTRIA' },
  { label: 'Doctorados', value: 'DOCTORADO' }
];

const columns = [
  { name: 'index', label: 'N°', field: 'index', align: 'center' as const, sortable: false },
  { name: 'nombreCompleto', label: 'Nombre', field: 'nombreCompleto', align: 'left' as const, sortable: true },
  { name: 'email', label: 'Email', field: 'email', align: 'left' as const, sortable: true },
  { name: 'celular', label: 'Teléfono', field: 'celular', align: 'left' as const, sortable: true },
  { name: 'programa.nombre', label: 'Programa', field: (row: Preinscripcion) => row.programa.nombre, align: 'left' as const, sortable: true },
  { name: 'fechaRegistro', label: 'Fecha', field: 'fechaRegistro', align: 'left' as const, sortable: true },
  { name: 'actions', label: 'Acciones', field: 'actions', align: 'center' as const, sortable: false }
];

const loadProgramas = async () => {
  if (!selectedTipo.value) return;
  
  try {
    loading.value = true;
    programas.value = [];
    const data = await ProgramaService.getProgramasByTipo(selectedTipo.value);
    programas.value = data.map((p: Programa) => ({
      label: p.nombre,
      value: p.id
    }));
  } catch (error) {
    console.error('Error al cargar programas:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al cargar los programas'
    });
  } finally {
    loading.value = false;
  }
};

const loadPreinscripciones = async () => {
  if (!selectedPrograma.value) {
    preinscripciones.value = [];
    return;
  }
  
  try {
    loading.value = true;
    const data = await PreinscripcionService.getPreinscripcionesByPrograma(selectedPrograma.value);
    preinscripciones.value = data;
  } catch (error) {
    console.error('Error al cargar preinscripciones:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al cargar las preinscripciones'
    });
    preinscripciones.value = [];
  } finally {
    loading.value = false;
  }
};

const onTipoChange = () => {
  selectedPrograma.value = null;
  preinscripciones.value = [];
  loadProgramas();
};

const handleSearch = () => {
  // La búsqueda se realiza automáticamente a través del computed filteredPreinscripciones
  pagination.value.page = 1; // Resetear a la primera página cuando se busca
};

const getRowNumber = (index: number) => {
  return ((pagination.value.page - 1) * pagination.value.rowsPerPage) + index + 1;
};

interface RequestProps {
  pagination: {
    page: number;
    rowsPerPage: number;
    sortBy: string;
    descending: boolean;
  }
}

const onRequest = async (props: RequestProps) => {
  const { page, rowsPerPage, sortBy, descending } = props.pagination;
  pagination.value = { ...pagination.value, page, rowsPerPage, sortBy, descending };
  await loadPreinscripciones();
};

const verDetalles = (preinscripcion: Preinscripcion) => {
  selectedPreinscripcion.value = preinscripcion;
  showDetails.value = true;
};

onMounted(() => {
  if (selectedTipo.value) {
    loadProgramas();
  }
});
</script>

<style scoped>
.my-sticky-header-table {
  /* height or max-height is important */
  height: calc(100vh - 170px);
}

.my-sticky-header-table .q-table__top,
.my-sticky-header-table .q-table__bottom,
.my-sticky-header-table thead tr:first-child th {
  background-color: var(--q-primary);
}

.my-sticky-header-table thead tr th {
  position: sticky;
  z-index: 1;
}

.my-sticky-header-table thead tr:first-child th {
  top: 0;
}

.my-sticky-header-table.q-table--loading thead tr:last-child th {
  /* height of all previous header rows */
  top: 48px;
}
</style>
