<template>
    <q-page :class="$q.dark.isActive ? 'bg-dark' : 'bg-grey-2'">
        <div class="row items-center q-pa-md">
            <div class="text-h6" :class="$q.dark.isActive ? 'text-white' : ''">{{ getTitleByType }}</div>
            <q-space />
            <div class="button-container" v-if="admin">
                <q-btn :label="'Crear ' + getTitleByType" color="primary" style="width: 180px; margin-right: 20px;"
                    @click="crearPrograma" />
            </div>
            <q-input outlined dense debounce="400" v-model="searchMunicipio" placeholder="Buscar por nombre"
                class="q-ml-md" style="width: 300px;" :dark="$q.dark.isActive">
                <template v-slot:prepend>
                    <q-icon :name="isSearching ? 'sync' : 'search'" :class="{ 'rotate-360': isSearching }" />
                </template>
            </q-input>
        </div>

        <div class="q-pa-md">
            <div class="row q-col-gutter-md">
                <div v-for="programa in filteredRows" :key="programa.id" class="col-12 col-sm-6 col-md-4">
                    <q-card :class="$q.dark.isActive ? 'bg-dark text-white' : ''">
                        <q-img :src="programa.imagen_url || 'https://cdn.quasar.dev/img/mountains.jpg'" basic
                            style="height: 200px" @error="(e) => console.error('Error cargando imagen:', e)">
                            <div class="absolute-bottom text-h6 text-white">
                                {{ programa.nombre }}
                            </div>
                        </q-img>

                        <q-card-section>
                            <div class="text-subtitle2">{{ programa.sigla }}</div>
                            <div class="text-caption text-grey q-mb-md" :class="$q.dark.isActive ? 'text-grey-4' : 'text-grey'">
                                {{ programa.descripcion }}
                            </div>
                            <div class="row items-center q-gutter-sm">
                                <q-chip v-for="area in programa.areas" :key="area" color="primary" text-color="white">
                                    {{ area }}
                                </q-chip>
                            </div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row items-center q-gutter-sm">
                                <q-chip icon="schedule" color="primary" text-color="white">
                                    {{ programa.duracion_meses }} meses
                                </q-chip>
                                <q-chip icon="event" color="secondary" text-color="white">
                                    {{ programa.gestion }}
                                </q-chip>
                                <q-chip icon="school" color="accent" text-color="white">
                                    {{ programa.modalidad }}
                                </q-chip>
                                <q-chip icon="location_on" color="positive" text-color="white">
                                    {{ programa.sede }}
                                </q-chip>
                            </div>
                        </q-card-section>

                        <q-separator :dark="$q.dark.isActive" />

                        <q-card-actions align="right">
                            <q-btn flat :color="$q.dark.isActive ? 'blue-3' : 'primary'" icon="edit"
                                :to="getEditRoute(programa)" :disable="!programa.id" label="Editar" />
                            <q-btn flat :color="$q.dark.isActive ? 'red-3' : 'negative'" icon="delete"
                                @click="confirmarEliminacion(programa)" label="Eliminar" />
                        </q-card-actions>
                    </q-card>
                </div>
            </div>

            <q-dialog v-model="dialogoConfirmacion" persistent>
                <q-card :class="$q.dark.isActive ? 'bg-dark text-white' : ''">
                    <q-card-section class="row items-center">
                        <q-avatar icon="warning" color="negative" text-color="white" />
                        <span class="q-ml-sm">¿Está seguro de eliminar este programa?</span>
                    </q-card-section>

                    <q-card-actions align="right">
                        <q-btn flat :color="$q.dark.isActive ? 'blue-3' : 'primary'" label="Cancelar" v-close-popup />
                        <q-btn flat :color="$q.dark.isActive ? 'red-3' : 'negative'" label="Eliminar"
                            @click="eliminarPrograma" v-close-popup />
                    </q-card-actions>
                </q-card>
            </q-dialog>
        </div>
    </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { ProgramaService } from '../services/programa';
import type { IPrograma } from '../interfaces/IPrograma';
import { TipoPrograma } from '../interfaces/IPrograma';
import { useDebounceFn } from '@vueuse/core';

const $q = useQuasar();
const route = useRouter();
const activeTab = ref('programas');
const search = ref('');
const admin = ref(false);

const props = defineProps<{
    tipo: number;
}>();

const rows = ref<any[]>([]);
const searchMunicipio = ref('');
const isSearching = ref(false);

const debouncedSearch = useDebounceFn(async (value: string) => {
  if (value.length >= 3) {
    isSearching.value = true;
    try {
      rows.value = await ProgramaService.buscarProgramasPorNombre(value);
    } catch (error) {
      console.error('Error al buscar programas:', error);
      $q.notify({
        type: 'negative',
        message: 'Error al buscar programas'
      });
    } finally {
      isSearching.value = false;
    }
  } else if (value.length === 0) {
    fetchProgramas();
  }
}, 400);

watch(searchMunicipio, (newValue) => {
  debouncedSearch(newValue);
});

const getTitleByType = computed(() => {
    switch (props.tipo) {
        case 1:
            return 'Diplomado';
        case 2:
            return 'Maestría';
        case 3:
            return 'Especialidad';
        case 4:
            return 'Doctorado';
        default:
            return 'Programa';
    }
});

const crearPrograma = () => {
    switch (props.tipo) {
        case 1:
            route.push('/diplomados/crear');
            break;
        case 2:
            route.push('/maestrias/crear');
            break;
        case 3:
            route.push('/especialidades/crear');
            break;
        case 4:
            route.push('/doctorados/crear');
            break;
    }
};

const columns = [
    { name: 'index', label: 'N°', align: 'left' as const, field: 'index', style: 'width: 100px; padding-left: 20px' },
    { name: 'nombre', label: 'Nombre', align: 'left' as const, field: 'nombre', style: 'width: 300px' },
    { name: 'descripcion', label: 'Descripción', align: 'left' as const, field: 'descripcion', style: 'width: 10px' },
    { name: 'duracion_meses', label: 'Duración', align: 'center' as const, field: 'duracion_meses', style: 'width: 300px' },
    { name: 'modalidad', label: 'Modalidad', align: 'center' as const, field: 'modalidad', style: 'width: 300px' },
    { name: 'fecha_inicio', label: 'Fecha de Inicio', align: 'center' as const, field: 'fecha_inicio' },
    { name: 'actions', label: 'Acciones', align: 'center' as const, field: (row: any) => row.actions },
];

const dialogoConfirmacion = ref(false);
const programaAEliminar = ref<IPrograma | null>(null);

const getEditRoute = (programa: IPrograma) => {
    console.log(programa);
    if (!programa.tipo || !programa.id) return '/';
    
    switch (programa.tipo) {
        case TipoPrograma.DIPLOMADO:
            return `/diplomados/editar/${programa.id}`;
        case TipoPrograma.MAESTRIA:
            return `/maestrias/editar/${programa.id}`;
        case TipoPrograma.ESPECIALIDAD:
            return `/especialidades/editar/${programa.id}`;
        case TipoPrograma.DOCTORADO:
            return `/doctorados/editar/${programa.id}`;
        default:
            return '/';
    }
};

const confirmarEliminacion = (programa: IPrograma) => {
    programaAEliminar.value = programa;
    dialogoConfirmacion.value = true;
};

const eliminarPrograma = async () => {
    if (!programaAEliminar.value || !programaAEliminar.value.id) return;
  
    try {
        await ProgramaService.eliminarPrograma(programaAEliminar.value.id);
        await fetchProgramas();
        $q.notify({
            type: 'positive',
            message: 'Programa eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar el programa:', error);
        $q.notify({
            type: 'negative',
            message: 'Error al eliminar el programa'
        });
    }
    programaAEliminar.value = null;
};

onMounted(async () => {
    const usuario = JSON.parse(localStorage.getItem('authUser') || '{}');
    if (usuario.rol === 'ADMIN') {
        admin.value = true;
    }
    await fetchProgramas();
});

const fetchProgramas = async () => {
    try {
        let response;
        switch (props.tipo) {
            case 1:
                response = await ProgramaService.obtenerDiplomados();
                break;
            case 2:
                response = await ProgramaService.obtenerMaestrias();
                break;
            case 3:
                response = await ProgramaService.obtenerEspecialidades();
                break;
            case 4:
                response = await ProgramaService.obtenerDoctorados();
                break;
            default:
                response = await ProgramaService.obtenerProgramas();
        }

        console.log('Programas recibidos:', response);
        rows.value = response.map((item: any) => ({
            ...item,
            fecha_inicio: item.fecha_inicio ? new Date(item.fecha_inicio).toLocaleDateString() : '',
            areas: Array.isArray(item.areas) ? item.areas : 
                   typeof item.areas === 'string' ? JSON.parse(item.areas) : []
        }));
    } catch (error: any) {
        console.error('Error al obtener programas:', error);
        $q.notify({
            type: 'negative',
            message: 'Error al obtener los programas'
        });
    }
};

const filteredRows = computed(() => rows.value);

const editRow = (row: any) => {
    switch (props.tipo) {
        case 1:
            route.push(`/diplomados/editar/${row.id}`);
            break;
        case 2:
            route.push(`/maestrias/editar/${row.id}`);
            break;
        case 3:
            route.push(`/especialidades/editar/${row.id}`);
            break;
        case 4:
            route.push(`/doctorados/editar/${row.id}`);
            break;
    }
};

const deleteRow = async (row: any) => {
    try {
        await $q.dialog({
            title: 'Confirmar',
            message: '¿Está seguro de eliminar este programa?',
            cancel: true,
            persistent: true
        });

        await ProgramaService.eliminarPrograma(row.id);
        await fetchProgramas();
        
        $q.notify({
            type: 'positive',
            message: 'Programa eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar el programa:', error);
        $q.notify({
            type: 'negative',
            message: 'Error al eliminar el programa'
        });
    }
};
</script>

<style scoped>
.q-table {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.q-td .q-gutter-sm {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    margin-right: 10px;
}

.my-card {
    width: 100%;
    max-width: 350px;
}

.rotate-360 {
    animation: rotate-360 1s linear infinite;
}

@keyframes rotate-360 {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
</style>
