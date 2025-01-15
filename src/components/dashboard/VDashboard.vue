<template>
    <q-page>
        <q-tabs v-model="activeTab" class="text-primary" align="left">
            <q-tab name="actas" label="Actas" />
            <q-tab name="observados" label="Observados" />
            <q-space />
            <div class="button-container">
                <q-btn label="Crear Acta" color="primary" style="width: 180px; margin-right: 20px;"
                    @click="crearActa" />
            </div>
            <div class="button-container" v-if="admin">
                <q-btn label="Crear Usuarios" color="primary" style="width: 180px; margin-right: 20px;"
                    @click="crearUsers" />
            </div>
            <q-input outlined dense debounce="400" v-model="searchMunicipio" placeholder="Buscar por municipio"
                class="q-ml-md" style="margin-right: 20px;">
                <template v-slot:prepend>
                    <q-icon name="search" />
                </template>
            </q-input>

            <q-input outlined dense debounce="400" v-model="searchRecinto" placeholder="Buscar por recinto"
                class="q-ml-md" style="margin-right: 20px;">
                <template v-slot:prepend>
                    <q-icon name="search" />
                </template>
            </q-input>

        </q-tabs>

        <q-table :rows="filteredRows" :columns="columns" row-key="id" virtual-scroll flat dense separator="horizontal"
            style="height: calc(100vh - 8.6rem)" class="q-mt-md">
            <template v-slot:body-cell-estado="props">
                <q-td :props="props" :class="getEstadoClass(props.row.estado)">
                    {{ props.row.estado }}
                </q-td>
            </template>
            <template v-slot:body-cell-actions="props">
                <q-td class="text-center">

                    <q-btn dense flat round icon="visibility" color="primary" @click="viewDocument(props.row)" />
                    <q-btn dense flat round icon="edit" color="secondary" @click="editRow(props.row)" />
                    <q-btn dense flat round icon="delete" color="negative" @click="deleteRow(props.row)" />
                    <!-- </div> -->

                </q-td>
            </template>

        </q-table>
    </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { ActasService } from '../services/actas';
import { useRouter } from 'vue-router';
import { QDialog, useQuasar } from 'quasar';
import { jsPDF } from "jspdf";


const $q = useQuasar();
const route = useRouter();
const activeTab = ref('actas');
const search = ref('');
const admin = ref(false);
interface Row {
    id: number;
    municipio: string;
    recinto: string;
    mesa: string;
    observado: string;
}

const props = defineProps<{
    registrado: boolean;
}>();

const rows = ref<Row[]>([]);
const searchMunicipio = ref('');
const searchRecinto = ref('');


const crearActa = () => {
    route.push('/formulario');
};

const crearUsers = () => {
    route.push('/usuarios');
};

const getEstadoClass = (estado: string) => {
    console.log('estado', estado);
    return estado === 'PENDIENTE' ? 'row-pending' : 'row-registered';
};
const columns = [
    { name: 'index', label: 'N°', align: 'left' as const, field: 'index', style: 'width: 100px; padding-left: 20px' },
    { name: 'municipio', label: 'Municipio', align: 'left' as const, field: 'municipio', style: 'width: 300px' },
    { name: 'recinto', label: 'Recinto', align: 'left' as const, field: 'recinto' },
    { name: 'mesa', label: 'Mesa', align: 'center' as const, field: 'mesa', style: 'width: 300px' },
    { name: 'observado', label: 'Observado', align: 'center' as const, field: 'observado', style: 'width: 300px' },
    { name: 'estado', label: 'Estado', align: 'center' as const, field: 'estado' },
    { name: 'actions', label: 'Acciones', align: 'center' as const, field: (row: any) => row.actions },
];

onMounted(async () => {
    const usuario = JSON.parse(localStorage.getItem('authUser') || '{}');
    if (usuario.rol === 'ADMINISTRADOR') {
        admin.value = true;
    }
    try {
        const response = await ActasService.obtenerActas();

        if (props.registrado) {
            rows.value = response.data
                .filter((item: any) => item.estado === 'REGISTRADO')
                .sort((a: any, b: any) => {

                    if (a.mesa.recinto.municipio.descripcion < b.mesa.recinto.municipio.descripcion) {
                        return -1;
                    }
                    if (a.mesa.recinto.municipio.descripcion > b.mesa.recinto.municipio.descripcion) {
                        return 1;
                    }

                    if (a.mesa.recinto.descripcion < b.mesa.recinto.descripcion) {
                        return -1;
                    }
                    if (a.mesa.recinto.descripcion > b.mesa.recinto.descripcion) {
                        return 1;
                    }
                    return a.mesa.nro_mesa - b.mesa.nro_mesa;
                })
                .map((item: any, index: number) => ({
                    index: index + 1,
                    id: item.id,
                    mesa: `Mesa ${item.mesa.nro_mesa}`,
                    municipio: item.mesa.recinto.municipio.descripcion,
                    recinto: item.mesa.recinto.descripcion,
                    observado: item.observado ? 'Sí' : 'No',
                    estado: item.estado,
                }));
        } else {
            rows.value = response.data
                .map((item: any, index: number) => ({
                    index: index + 1,
                    id: item.id,
                    mesa: `Mesa ${item.mesa.nro_mesa}`,
                    municipio: item.mesa.recinto.municipio.descripcion,
                    recinto: item.mesa.recinto.descripcion,
                    observado: item.observado ? 'Sí' : 'No',
                    estado: item.estado,
                }));
            console.log('rows', rows.value);
        }
    } catch (error: any) {
        console.error('Error al obtener actas:', error);
    }
});


const filteredRows = computed(() => {
    let filtered = rows.value;

    if (activeTab.value === 'observados') {
        filtered = filtered.filter(row => row.observado === 'Sí');
    }

    return filtered;
});


watch([searchMunicipio, searchRecinto], async () => {
    await fetchActas();
    console.log('searchMunicipio', searchMunicipio.value);
    if (searchMunicipio.value === '' && searchRecinto.value === '') {
        fetchActas();
    }
});

const fetchActas = async () => {

    try {
        // declarar variable response
        let response;
        if (searchMunicipio.value !== '' && searchRecinto.value !== '') {
            response = await ActasService.obtener({
                municipio: searchMunicipio.value,
                recinto: searchRecinto.value,
                page: 1,
                limit: 50,
            });
        }
        else if (searchMunicipio.value !== '') {
            response = await ActasService.obtener({
                municipio: searchMunicipio.value,
                page: 1,
                limit: 50,
            });
        }
        else if (searchRecinto.value !== '') {
            response = await ActasService.obtener({
                recinto: searchRecinto.value,
                page: 1,
                limit: 50,
            });
        }
        else {
            response = await ActasService.obtenerActas();
        }

        rows.value = response.data.map((item: any, index: number) => ({
            index: index + 1,
            id: item.id,
            mesa: `Mesa ${item.mesa.nro_mesa}`,
            municipio: item.mesa.recinto.municipio.descripcion,
            recinto: item.mesa.recinto.descripcion,
            observado: item.observado ? 'Sí' : 'No',
            estado: item.estado,
        }));
    } catch (error) {
        console.error('Error al obtener actas:', error);
    }
};



const viewDocument = async (row: any) => {
    try {
        const acta = await ActasService.obtenerActaById(row.id);

        if (acta.imagen) {

            const pdf = new jsPDF();
            const imgWidth = 210;
            const imgHeight = (210 * 3) / 4;

            pdf.addImage(`data:image/png;base64,${acta.imagen}`, 'PNG', 0, 10, imgWidth, imgHeight);
            const pdfBlob = pdf.output('blob');
            const pdfUrl = URL.createObjectURL(pdfBlob);
            window.open(pdfUrl, '_blank');
        } else {
            alert('No hay documento disponible para esta acta.');
        }
    } catch (error) {
        console.error('Error al cargar el documento:', error);
        alert('Error al cargar el documento.');
    }
};



const editRow = (row: any) => {

    window.location.href = `/formulario?id=${row.id}`;
};

const deleteRow = async (row: any) => {
    const confirmResponse = confirm('¿Está seguro de eliminar el acta?');
    if (confirmResponse) {
        try {
            const response = await ActasService.eliminarActa(row.id);
            rows.value = rows.value.filter((item: any) => item.id !== row.id);
            alert(response.message);
        } catch (error) {
            console.error('Error al eliminar acta:', error);
            alert('Error al eliminar el acta');
        }
    }
};


</script>

<style scoped>
.q-tabs {
    margin-bottom: 16px;
}

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

.row-pending {
    padding: 10px;
    background-clip: content-box;
    /* <---- */
    box-shadow: inset 0 0 0 10px white;
    background-color: #f8d7da;
    /* <-- 10px spread radius */
}

.row-registered {
    background-color: #ccffcc;
    padding: 10px;
    background-clip: content-box;
    /* <---- */
    box-shadow: inset 0 0 0 10px white;
}
</style>
