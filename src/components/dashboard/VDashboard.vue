<template>
    <q-page>
        <div class="row items-center q-pa-md">
            <div class="text-h6">{{ getTitleByType }}</div>
            <q-space />
            <div class="button-container" v-if="admin">
                <q-btn :label="'Crear ' + getTitleByType" color="primary" style="width: 180px; margin-right: 20px;"
                    @click="crearPrograma" />
            </div>
            <q-input outlined dense debounce="400" v-model="searchMunicipio" placeholder="Buscar por nombre o descripción"
                class="q-ml-md" style="width: 300px;">
                <template v-slot:prepend>
                    <q-icon name="search" />
                </template>
            </q-input>
        </div>

        <div class="q-pa-md">
            <div class="row q-col-gutter-md">
                <div v-for="programa in filteredRows" :key="programa.id" class="col-12 col-sm-6 col-md-4">
                    <q-card class="my-card">
                        <q-img
                            :src="programa.imagen_url || 'https://cdn.quasar.dev/img/mountains.jpg'"
                            basic
                            style="height: 200px"
                        >
                            <div class="absolute-bottom text-h6 text-white">
                                {{ programa.nombre }}
                            </div>
                        </q-img>

                        <q-card-section>
                            <div class="text-subtitle2">{{ programa.sigla }}</div>
                            <div class="text-caption text-grey">
                                {{ programa.descripcion }}
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
                                <q-chip icon="location_on" color="accent" text-color="white">
                                    {{ programa.sede }}
                                </q-chip>
                            </div>
                        </q-card-section>

                        <q-separator />

                        <q-card-actions align="right">
                            <q-btn
                                flat
                                color="primary"
                                icon="edit"
                                :to="getEditRoute(programa)"
                                :disable="!programa.id"
                                label="Editar"
                            />
                            <q-btn
                                flat
                                color="negative"
                                icon="delete"
                                @click="confirmarEliminacion(programa)"
                                label="Eliminar"
                            />
                        </q-card-actions>
                    </q-card>
                </div>
            </div>

            <q-dialog v-model="dialogoConfirmacion" persistent>
                <q-card>
                    <q-card-section class="row items-center">
                        <q-avatar icon="warning" color="negative" text-color="white" />
                        <span class="q-ml-sm">¿Está seguro de eliminar este programa?</span>
                    </q-card-section>

                    <q-card-actions align="right">
                        <q-btn flat label="Cancelar" color="primary" v-close-popup />
                        <q-btn
                            flat
                            label="Eliminar"
                            color="negative"
                            @click="eliminarPrograma"
                            v-close-popup
                        />
                    </q-card-actions>
                </q-card>
            </q-dialog>
        </div>
    </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { QDialog, useQuasar } from 'quasar';
import { ProgramaService } from '../services/programa';
import { IPrograma, TipoPrograma } from '../interfaces/IPrograma';

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

        rows.value = response.map((item: any, index: number) => ({
            index: index + 1,
            id: item.id,
            nombre: item.nombre,
            descripcion: item.descripcion,
            duracion_meses: item.duracion_meses,
            modalidad: item.modalidad,
            fecha_inicio: new Date(item.fecha_inicio).toLocaleDateString(),
        }));
    } catch (error: any) {
        console.error('Error al obtener programas:', error);
        $q.notify({
            type: 'negative',
            message: 'Error al obtener los programas'
        });
    }
};

const filteredRows = computed(() => {
    let filtered = rows.value;
    if (searchMunicipio.value) {
        filtered = filtered.filter(row => 
            row.nombre.toLowerCase().includes(searchMunicipio.value.toLowerCase()) ||
            row.descripcion.toLowerCase().includes(searchMunicipio.value.toLowerCase())
        );
    }
    return filtered;
});

const viewDocument = async (row: any) => {
    // try {
    //     const acta = await ActasService.obtenerActaById(row.id);

    //     if (acta.imagen) {

    //         const pdf = new jsPDF();
    //         const imgWidth = 210;
    //         const imgHeight = (210 * 3) / 4;

    //         pdf.addImage(`data:image/png;base64,${acta.imagen}`, 'PNG', 0, 10, imgWidth, imgHeight);
    //         const pdfBlob = pdf.output('blob');
    //         const pdfUrl = URL.createObjectURL(pdfBlob);
    //         window.open(pdfUrl, '_blank');
    //     } else {
    //         alert('No hay documento disponible para esta acta.');
    //     }
    // } catch (error) {
    //     console.error('Error al cargar el documento:', error);
    //     alert('Error al cargar el documento.');
    // }
};

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
</style>
