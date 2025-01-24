<template>
    <q-page :class="$q.dark.isActive ? 'bg-dark' : 'bg-grey-2'">
        <div class="row items-center q-pa-md">
            <div class="text-h6" :class="$q.dark.isActive ? 'text-white' : ''">
                <q-icon name="mail" size="32px" class="q-mr-sm" />
                Enviar Notificación
            </div>
        </div>

        <!-- Formulario de notificación -->
        <div class="q-pa-md full-width">
            <q-card :class="$q.dark.isActive ? 'bg-dark text-white' : ''" style="width: 100%;">
                <q-card-section class="bg-primary text-white">
                    <div class="text-h6">
                        <q-icon name="campaign" class="q-mr-sm" />
                        Promocionar Programa
                    </div>
                    <div class="text-caption">Envía información sobre nuestros programas a potenciales estudiantes</div>
                </q-card-section>

                <q-card-section>
                    <q-form @submit="enviarNotificacion" class="q-gutter-md">
                        <!-- Selector de programa -->
                        <div class="row q-col-gutter-md">
                            <div class="col-12 col-md-6">
                                <q-select
                                    v-model="selectedPrograma"
                                    :options="programas"
                                    option-label="nombre"
                                    label="Seleccionar Programa"
                                    outlined
                                    :dark="$q.dark.isActive"
                                    use-input
                                    @filter="filterProgramas"
                                    @update:model-value="actualizarMensaje"
                                    :rules="[val => !!val || 'Debe seleccionar un programa']"
                                >
                                    <template v-slot:prepend>
                                        <q-icon name="school" />
                                    </template>
                                    <template v-slot:option="scope">
                                        <q-item v-bind="scope.itemProps">
                                            <q-item-section>
                                                <q-item-label>{{ scope.opt.nombre }}</q-item-label>
                                                <q-item-label caption>{{ scope.opt.sigla }} - {{ scope.opt.tipo }}</q-item-label>
                                            </q-item-section>
                                        </q-item>
                                    </template>
                                </q-select>
                            </div>
                            <div class="col-12 col-md-6">
                                <q-input
                                    v-model="notificacion.email"
                                    label="Correo Electrónico"
                                    type="email"
                                    outlined
                                    :dark="$q.dark.isActive"
                                    :rules="[
                                        val => !!val || 'El correo es requerido',
                                        val => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(val) || 'Correo inválido'
                                    ]"
                                >
                                    <template v-slot:prepend>
                                        <q-icon name="email" />
                                    </template>
                                </q-input>
                            </div>
                        </div>

                        <q-input
                            v-model="notificacion.subject"
                            label="Asunto"
                            outlined
                            :dark="$q.dark.isActive"
                            :rules="[val => !!val || 'El asunto es requerido']"
                        >
                            <template v-slot:prepend>
                                <q-icon name="subject" />
                            </template>
                        </q-input>

                        <q-input
                            v-model="notificacion.message"
                            label="Mensaje"
                            type="textarea"
                            outlined
                            :dark="$q.dark.isActive"
                            :rules="[val => !!val || 'El mensaje es requerido']"
                            rows="12"
                        >
                            <template v-slot:prepend>
                                <q-icon name="message" />
                            </template>
                        </q-input>

                        <div class="row justify-end q-mt-md">
                            <q-btn
                                label="Enviar"
                                type="submit"
                                color="primary"
                                :loading="isLoading"
                                icon="send"
                            />
                        </div>
                    </q-form>
                </q-card-section>
            </q-card>
        </div>
    </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { ProgramaService } from '../services/programa';
import type { IPrograma } from '../interfaces/IPrograma';
import { NotificacionesService } from 'src/services/notificaciones.service';

const $q = useQuasar();
const isLoading = ref(false);
const selectedPrograma = ref<IPrograma | null>(null);
const programas = ref<IPrograma[]>([]);

const notificacion = ref({
    email: '',
    subject: '',
    message: ''
});

// Cargar programas
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

// Filtrar programas
const filterProgramas = (val: string, update: (fn: () => void) => void) => {
    if (val === '') {
        update(() => {
            programas.value = [...programas.value];
        });
        return;
    }

    update(() => {
        const needle = val.toLowerCase();
        programas.value = programas.value.filter(
            v => v.nombre.toLowerCase().indexOf(needle) > -1
        );
    });
};

// Generar mensaje predeterminado
const actualizarMensaje = () => {
    if (selectedPrograma.value) {
        const programa = selectedPrograma.value;
        notificacion.value.subject = `¡Inscríbete en nuestro ${programa.tipo.toLowerCase()}: ${programa.nombre}!`;
        notificacion.value.message = generarMensajePrograma(programa);
    }
};

const generarMensajePrograma = (programa: IPrograma) => {
    return `🎓 ¡Saludos cordiales! 🌟

📢 ¡GRAN OPORTUNIDAD ACADÉMICA! 
En la Facultad de Ciencias y Tecnología - USFX te presentamos:

✨ ${programa.nombre} ✨
📋 ${programa.sigla}

📌 DETALLES DEL PROGRAMA:
🔸 Tipo: ${programa.tipo}
🔸 Duración: ${programa.duracion_meses} meses
🔸 Modalidad: ${programa.modalidad}
🔸 Sede: ${programa.sede}
🔸 Gestión: ${programa.gestion}

📝 DESCRIPCIÓN:
${programa.descripcion}

🎯 ÁREAS DE ESTUDIO:
${programa.areas.join(' • ')}

🚀 ¡No pierdas esta oportunidad de desarrollo profesional! 
✅ Las inscripciones están abiertas.

📍 Para más información y proceso de inscripción:
🏢 Visítanos: Posgrado, Bloque F último piso
📞 Contáctanos para más detalles

Atentamente,
🏛️ Facultad de Tecnología
🎯 Universidad San Francisco Xavier de Chuquisaca`;
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
        await NotificacionesService.enviarNotificacionSimple(notificacion.value);
        
        $q.notify({
            color: 'positive',
            message: 'Notificación enviada exitosamente',
            icon: 'check'
        });
        
        // Limpiar el formulario
        notificacion.value = {
            email: '',
            subject: '',
            message: ''
        };
        selectedPrograma.value = null;
    } catch (error: any) {
        console.error('Error al enviar notificación:', error);
        $q.notify({
            color: 'negative',
            message: error.response?.data?.message || 'Error al enviar la notificación',
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
.q-card {
    border-radius: 8px;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
}

.full-width {
    width: 100%;
}
</style>
