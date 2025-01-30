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

      <div class="col-12 col-sm-4 col-md-3 q-pr-sm">
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

      <div class="col-12 col-sm-12 col-md-3 q-gutter-x-sm">
        <q-btn
          color="primary"
          icon="print"
          label="Imprimir"
          @click="printTable"
          :disable="!filteredPreinscripciones.length"
        />
        <q-btn
          color="negative"
          icon="picture_as_pdf"
          label="PDF"
          @click="exportToPDF"
          :disable="!filteredPreinscripciones.length"
        />
      </div>
    </div>

    <q-table
      ref="tableRef"
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

      <template v-slot:body-cell-fechaRegistro="props">
        <q-td :props="props" class="text-left">
          {{ formatDate(props.value) }}
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
import html2pdf from 'html2pdf.js';

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
  { name: 'index', label: 'N°', field: 'index', align: 'center' as const },
  { name: 'nombreCompleto', label: 'Nombre', field: 'nombreCompleto', align: 'left' as const },
  { name: 'email', label: 'Email', field: 'email', align: 'left' as const },
  { name: 'celular', label: 'Teléfono', field: 'celular', align: 'left' as const },
  { 
    name: 'fechaRegistro', 
    label: 'Fecha', 
    field: 'fechaRegistro', 
    align: 'left' as const, 
    sortable: true,
    format: (val: string) => formatDate(val)
  },
  { name: 'actions', label: 'Acciones', field: 'actions', align: 'center' as const, sortable: false }
];

const tableRef = ref();

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

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  try {
    // Asumiendo que la fecha viene en formato ISO (YYYY-MM-DDTHH:mm:ss.sssZ)
    const fecha = new Date(dateString);
    if (isNaN(fecha.getTime())) return dateString; // Si la fecha no es válida, retorna el string original
    
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'UTC' // Asegurarnos de que la fecha se muestre en la zona horaria correcta
    });
  } catch (error) {
    console.error('Error al formatear la fecha:', error);
    return dateString; // En caso de error, retorna el string original
  }
};

const exportToPDF = () => {
  const element = document.createElement('div');
  const currentDate = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  
  element.innerHTML = `
    <div style="padding: 40px; font-family: Arial, sans-serif; font-size: 12pt; max-width: 800px; margin: 0 auto;">
      <!-- Encabezado -->
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #2196F3; padding-bottom: 20px;">
        <h1 style="color: #1976D2; font-size: 24pt; margin: 0; padding: 0;">Universidad San Francisco Xavier</h1>
        <h2 style="color: #424242; font-size: 18pt; margin: 10px 0;">Dirección de Posgrado</h2>
        <h3 style="color: #616161; font-size: 16pt; margin: 10px 0; font-weight: normal;">Lista de Preinscripciones</h3>
      </div>

      <!-- Información del Programa -->
      <div style="margin-bottom: 20px; background-color: #F5F5F5; padding: 15px; border-radius: 5px;">
        <p style="margin: 0; color: #424242;">
          <strong>Programa:</strong> ${selectedPrograma.value ? programas.value.find(p => p.value === selectedPrograma.value)?.label : 'Todos los programas'}
        </p>
        <p style="margin: 5px 0 0 0; color: #616161;">
          <strong>Fecha de emisión:</strong> ${currentDate}
        </p>
      </div>

      <!-- Tabla -->
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12pt; background-color: white; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">
        <thead>
          <tr style="background-color: #1976D2; color: white;">
            <th style="padding: 12px 15px; text-align: left; font-family: Arial, sans-serif; border: 1px solid #E0E0E0;">N°</th>
            <th style="padding: 12px 15px; text-align: left; font-family: Arial, sans-serif; border: 1px solid #E0E0E0;">Nombre</th>
            <th style="padding: 12px 15px; text-align: left; font-family: Arial, sans-serif; border: 1px solid #E0E0E0;">Email</th>
            <th style="padding: 12px 15px; text-align: left; font-family: Arial, sans-serif; border: 1px solid #E0E0E0;">Teléfono</th>
            <th style="padding: 12px 15px; text-align: left; font-family: Arial, sans-serif; border: 1px solid #E0E0E0;">Fecha</th>
          </tr>
        </thead>
        <tbody>
          ${filteredPreinscripciones.value.map((item, index) => `
            <tr style="background-color: ${index % 2 === 0 ? '#FFFFFF' : '#F5F5F5'}">
              <td style="padding: 12px 15px; font-family: Arial, sans-serif; border: 1px solid #E0E0E0;">${index + 1}</td>
              <td style="padding: 12px 15px; font-family: Arial, sans-serif; border: 1px solid #E0E0E0;">${item.nombreCompleto}</td>
              <td style="padding: 12px 15px; font-family: Arial, sans-serif; border: 1px solid #E0E0E0;">${item.email}</td>
              <td style="padding: 12px 15px; font-family: Arial, sans-serif; border: 1px solid #E0E0E0;">${item.celular}</td>
              <td style="padding: 12px 15px; font-family: Arial, sans-serif; border: 1px solid #E0E0E0;">${formatDate(item.fechaRegistro)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <!-- Pie de página -->
      <div style="margin-top: 30px; text-align: center; color: #757575; font-size: 10pt; border-top: 1px solid #E0E0E0; padding-top: 20px;">
        <p style="margin: 0;">Este documento fue generado automáticamente por el sistema de posgrado.</p>
        <p style="margin: 5px 0 0 0;">Universidad San Francisco Xavier ${new Date().getFullYear()}</p>
      </div>
    </div>
  `;

  const opt = {
    margin: 0.5,
    filename: `preinscripciones_${new Date().toISOString().split('T')[0]}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { 
      unit: 'in',
      format: 'letter', 
      orientation: 'portrait'
    }
  } as const;

  html2pdf().set(opt).from(element).save().catch((error: unknown) => {
    console.error('Error al exportar a PDF:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al exportar a PDF'
    });
  });
};

const printTable = () => {
  const currentDate = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const printContent = document.createElement('div');
  printContent.innerHTML = `
    <div style="padding: 40px; font-family: Arial, sans-serif; font-size: 12pt; max-width: 800px; margin: 0 auto;">
      <!-- Encabezado -->
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #2196F3; padding-bottom: 20px;">
        <h1 style="color: #1976D2; font-size: 24pt; margin: 0; padding: 0;">Universidad San Francisco Xavier</h1>
        <h2 style="color: #424242; font-size: 18pt; margin: 10px 0;">Dirección de Posgrado de la Facultad de Ciencias y Tecnología</h2>
        <h3 style="color: #616161; font-size: 16pt; margin: 10px 0; font-weight: normal;">Lista de Preinscripciones</h3>
      </div>

      <!-- Información del Programa -->
      <div style="margin-bottom: 20px; background-color: #F5F5F5; padding: 15px; border-radius: 5px;">
        <p style="margin: 0; color: #424242;">
          <strong>Programa:</strong> ${selectedPrograma.value ? programas.value.find(p => p.value === selectedPrograma.value)?.label : 'Todos los programas'}
        </p>
        <p style="margin: 5px 0 0 0; color: #616161;">
          <strong>Fecha de emisión:</strong> ${currentDate}
        </p>
      </div>

      <!-- Tabla -->
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12pt; background-color: white; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">
        <thead>
          <tr style="background-color: #1976D2; color: white;">
            <th style="padding: 12px 15px; text-align: left; font-family: Arial, sans-serif; border: 1px solid #E0E0E0;">N°</th>
            <th style="padding: 12px 15px; text-align: left; font-family: Arial, sans-serif; border: 1px solid #E0E0E0;">Nombre</th>
            <th style="padding: 12px 15px; text-align: left; font-family: Arial, sans-serif; border: 1px solid #E0E0E0;">Email</th>
            <th style="padding: 12px 15px; text-align: left; font-family: Arial, sans-serif; border: 1px solid #E0E0E0;">Teléfono</th>
            <th style="padding: 12px 15px; text-align: left; font-family: Arial, sans-serif; border: 1px solid #E0E0E0;">Fecha</th>
          </tr>
        </thead>
        <tbody>
          ${filteredPreinscripciones.value.map((item, index) => `
            <tr style="background-color: ${index % 2 === 0 ? '#FFFFFF' : '#F5F5F5'}">
              <td style="padding: 12px 15px; font-family: Arial, sans-serif; border: 1px solid #E0E0E0;">${index + 1}</td>
              <td style="padding: 12px 15px; font-family: Arial, sans-serif; border: 1px solid #E0E0E0;">${item.nombreCompleto}</td>
              <td style="padding: 12px 15px; font-family: Arial, sans-serif; border: 1px solid #E0E0E0;">${item.email}</td>
              <td style="padding: 12px 15px; font-family: Arial, sans-serif; border: 1px solid #E0E0E0;">${item.celular}</td>
              <td style="padding: 12px 15px; font-family: Arial, sans-serif; border: 1px solid #E0E0E0;">${formatDate(item.fechaRegistro)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <!-- Pie de página -->
      <div style="margin-top: 30px; text-align: center; color: #757575; font-size: 10pt; border-top: 1px solid #E0E0E0; padding-top: 20px;">
        <p style="margin: 0;">Este documento fue generado automáticamente por el sistema de posgrado.</p>
        <p style="margin: 5px 0 0 0;">Universidad San Francisco Xavier ${new Date().getFullYear()}</p>
      </div>
    </div>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(printContent.innerHTML);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  } else {
    $q.notify({
      type: 'negative',
      message: 'Por favor, permita las ventanas emergentes para imprimir'
    });
  }
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
