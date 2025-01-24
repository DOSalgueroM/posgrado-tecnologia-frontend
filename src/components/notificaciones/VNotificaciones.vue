<template>
    <q-page :class="$q.dark.isActive ? 'bg-dark' : 'bg-grey-2'">
        <div class="row items-center q-pa-md">
            <div class="text-h6" :class="$q.dark.isActive ? 'text-white' : ''">Notificaciones</div>
            <q-space />
            
            <!-- Búsqueda por nombre (reutilizado del dashboard) -->
            <q-input 
                outlined 
                dense 
                debounce="400" 
                v-model="searchText" 
                placeholder="Buscar por nombre"
                class="q-ml-md" 
                style="width: 300px;" 
                :dark="$q.dark.isActive"
            >
                <template v-slot:prepend>
                    <q-icon :name="isSearching ? 'sync' : 'search'" :class="{ 'rotate-360': isSearching }" />
                </template>
            </q-input>

            <!-- Selector de programas -->
            <q-select
                v-model="selectedPrograma"
                :options="programas"
                option-label="nombre"
                option-value="id"
                label="Seleccionar Programa"
                outlined
                dense
                class="q-ml-md"
                style="width: 300px;"
                :dark="$q.dark.isActive"
                use-input
                @filter="filterProgramas"
                input-debounce="0"
            />
        </div>

        <!-- Formulario de notificación -->
        <div class="q-pa-md">
            <q-card :class="$q.dark.isActive ? 'bg-dark text-white' : ''">
                <q-card-section>
                    <div class="text-h6">Notificación General</div>
                    <div class="text-caption">Enviar a todos los estudiantes del programa</div>
                </q-card-section>

                <q-card-section>
                    <q-form @submit="enviarNotificacion" class="q-gutter-md">
                        <!-- Nombre del programa seleccionado (readonly) -->
                        <q-input
                            v-model="programaSeleccionadoNombre"
                            label="Programa"
                            readonly
                            outlined
                            :dark="$q.dark.isActive"
                        />

                        <!-- Título de la notificación -->
                        <q-input
                            v-model="notificacion.titulo"
                            label="Título"
                            :rules="[val => !!val || 'El título es requerido']"
                            outlined
                            :dark="$q.dark.isActive"
                        />

                        <!-- Mensaje de la notificación -->
                        <q-input
                            v-model="notificacion.mensaje"
                            type="textarea"
                            label="Mensaje"
                            :rules="[val => !!val || 'El mensaje es requerido']"
                            outlined
                            :dark="$q.dark.isActive"
                        />

                        <!-- Tipo de notificación -->
                        <q-select
                            v-model="notificacion.tipo"
                            :options="tiposNotificacion"
                            label="Tipo de notificación"
                            :rules="[val => !!val || 'El tipo es requerido']"
                            outlined
                            :dark="$q.dark.isActive"
                        />

                        <!-- Botón de envío -->
                        <div class="row justify-end">
                            <q-btn
                                label="Enviar Notificación"
                                type="submit"
                                color="primary"
                                :loading="isLoading"
                            />
                        </div>
                    </q-form>
                </q-card-section>
            </q-card>
        </div>
    </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { ProgramaService } from '../services/programa';
import type { IPrograma } from '../interfaces/IPrograma';

const $q = useQuasar();
const searchText = ref('');
const isSearching = ref(false);
const selectedPrograma = ref<IPrograma | null>(null);
const programas = ref<IPrograma[]>([]);
const isLoading = ref(false);

const tiposNotificacion = [
    'Información',
    'Advertencia',
    'Urgente',
    'Recordatorio'
];

const notificacion = ref({
    titulo: '',
    mensaje: '',
    tipo: null,
    programaId: null
});

// Computed property para mostrar el nombre del programa seleccionado
const programaSeleccionadoNombre = computed(() => {
    return selectedPrograma.value ? selectedPrograma.value.nombre : '';
});

// Cargar programas al montar el componente
const fetchProgramas = async () => {
    try {
        const response = await ProgramaService.obtenerProgramas();
        programas.value = response;
    } catch (error) {
        console.error('Error al cargar programas:', error);
        $q.notify({
            color: 'negative',
            message: 'Error al cargar los programas',
            icon: 'warning'
        });
    }
};

// Filtrar programas para el q-select
const filterProgramas = (val: string, update: (fn: () => void) => void) => {
    if (val === '') {
        update(() => {
            // Mostrar todos los programas cuando no hay filtro
            const allProgramas = programas.value;
            programas.value = [...allProgramas];
        });
        return;
    }

    update(() => {
        const needle = val.toLowerCase();
        const filtered = programas.value.filter(
            v => v.nombre.toLowerCase().indexOf(needle) > -1
        );
        programas.value = filtered;
    });
};

// Enviar notificación
const enviarNotificacion = async () => {
    if (!selectedPrograma.value) {
        $q.notify({
            color: 'warning',
            message: 'Debe seleccionar un programa',
            icon: 'warning'
        });
        return;
    }

    isLoading.value = true;
    try {
        // Aquí iría la lógica para enviar la notificación
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulación de envío
        
        $q.notify({
            color: 'positive',
            message: 'Notificación enviada exitosamente',
            icon: 'check'
        });
        
        // Limpiar el formulario
        notificacion.value = {
            titulo: '',
            mensaje: '',
            tipo: null,
            programaId: null
        };
        selectedPrograma.value = null;
    } catch (error) {
        console.error('Error al enviar notificación:', error);
        $q.notify({
            color: 'negative',
            message: 'Error al enviar la notificación',
            icon: 'warning'
        });
    } finally {
        isLoading.value = false;
    }
};

// Cargar programas al montar el componente
onMounted(() => {
    fetchProgramas();
});
</script>

<style scoped>
.rotate-360 {
    animation: rotate 1s linear infinite;
}

@keyframes rotate {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
</style>
