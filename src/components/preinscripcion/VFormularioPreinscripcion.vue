<template>
    <q-page class="q-pa-md">
        <div class="row justify-center">
            <div class="col-12 col-md-8 col-lg-6">
                <q-card class="q-pa-lg" flat bordered>
                    <q-card-section class="text-center q-pa-none">
                        <div class="text-h5 text-weight-bold text-primary">
                            Preinscripción a Programa de Posgrado
                        </div>
                        <div class="text-subtitle2 text-grey-7 q-mt-sm">
                            Facultad de Ciencias y Tecnología
                        </div>
                    </q-card-section>

                    <q-card-section>
                        <q-form @submit="onSubmit" class="q-gutter-md">
                            <q-input 
                                v-model="formData.nombreCompleto"
                                label="Nombre Completo *"
                                outlined
                                dense
                                :rules="[val => !!val || 'El nombre completo es requerido']"
                            />

                            <q-input 
                                v-model="formData.carrera"
                                label="Carrera *"
                                outlined
                                dense
                                :rules="[val => !!val || 'La carrera es requerida']"
                            />

                            <q-input 
                                v-model="formData.cu"
                                label="CU *"
                                outlined
                                dense
                                :rules="[val => !!val || 'El CU es requerido']"
                            />

                            <q-input 
                                v-model="formData.celular"
                                label="Celular *"
                                outlined
                                dense
                                :rules="[
                                    val => !!val || 'El número de celular es requerido',
                                    val => /^\d+$/.test(val) || 'El número de celular solo debe contener dígitos',
                                    val => val.length === 8 || 'El número de celular debe tener exactamente 8 dígitos'
                                ]"
                            />

                            <q-input 
                                v-model="formData.email"
                                label="Correo Electrónico *"
                                outlined
                                dense
                                :rules="[
                                    val => !!val || 'El correo electrónico es requerido',
                                    val => /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/.test(val) || 'Correo electrónico inválido'
                                ]"
                            />

                            <q-select
                                v-model="selectedTipoPrograma"
                                :options="tiposPrograma"
                                label="Tipo de Programa *"
                                outlined
                                dense
                                emit-value
                                map-options
                                :rules="[val => !!val || 'El tipo de programa es requerido']"
                            />

                            <q-select
                                v-model="formData.programaId"
                                :options="programasDisponibles"
                                label="Programa *"
                                outlined
                                dense
                                option-value="id"
                                option-label="nombre"
                                :rules="[val => val !== null || 'El programa es requerido']"
                                :disable="!selectedTipoPrograma"
                                emit-value
                                map-options
                            >
                                <template v-slot:option="{ itemProps, opt }">
                                    <q-item v-bind="itemProps">
                                        <q-item-section>
                                            <q-item-label>{{ opt.nombre }}</q-item-label>
                                            <q-item-label caption>{{ opt.descripcion }}</q-item-label>
                                        </q-item-section>
                                    </q-item>
                                </template>
                            </q-select>

                            <div class="row justify-end q-gutter-sm">
                                <q-btn
                                    label="Cancelar"
                                    color="negative"
                                    flat
                                    @click="$router.push('/')"
                                />
                                <q-btn
                                    type="submit"
                                    label="Preinscribirse"
                                    color="primary"
                                    :loading="loading"
                                />
                            </div>
                        </q-form>
                    </q-card-section>
                </q-card>
            </div>
        </div>
    </q-page>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { PreinscripcionService } from '../services/preinscripcion'
import publicAxiosInstance from '../services/publicAxiosInstance'
import { TipoPrograma } from '../../types/programa.types'

const $q = useQuasar()
const router = useRouter()

const loading = ref(false)
const selectedTipoPrograma = ref(null)
const programasDisponibles = ref([])

const formData = ref({
    nombreCompleto: '',
    carrera: '',
    cu: '',
    celular: '',
    email: '',
    programaId: 0
})

const tiposPrograma = [
    { label: 'Diplomado', value: TipoPrograma.DIPLOMADO },
    { label: 'Maestría', value: TipoPrograma.MAESTRIA },
    { label: 'Doctorado', value: TipoPrograma.DOCTORADO },
    { label: 'Especialidad', value: TipoPrograma.ESPECIALIDAD }
]

const cargarProgramas = async () => {
    try {
        let url = '/programas';
        if (selectedTipoPrograma.value) {
            url = `/programas/por-tipo?tipo=${selectedTipoPrograma.value}`;
        }
        const response = await publicAxiosInstance.get(url)
        programasDisponibles.value = response.data
    } catch (error) {
        console.error('Error al cargar programas:', error)
        $q.notify({
            type: 'negative',
            message: 'Error al cargar los programas disponibles'
        })
    }
}

watch(selectedTipoPrograma, () => {
    cargarProgramas()
})

cargarProgramas()

const resetForm = () => {
    formData.value = {
        nombreCompleto: '',
        carrera: '',
        cu: '',
        celular: '',
        email: '',
        programaId: 0
    }
    selectedTipoPrograma.value = null
}

const onSubmit = async () => {
    try {
        if (!formData.value.programaId) {
            $q.notify({
                type: 'negative',
                message: 'Por favor seleccione un programa'
            })
            return
        }

        loading.value = true
        const preinscripcionData = {
            ...formData.value,
            programaId: Number(formData.value.programaId)
        }
        await PreinscripcionService.crear(preinscripcionData)
        
        $q.notify({
            type: 'positive',
            message: 'Preinscripción realizada exitosamente',
            position: 'top',
            timeout: 5000
        })

        resetForm()
    } catch (error: any) {
        console.error('Error al realizar la preinscripción:', error)
        $q.notify({
            type: 'negative',
            message: error.response?.data?.message || 'Error al realizar la preinscripción',
            position: 'top',
            timeout: 5000
        })
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.q-card {
    background: v-bind('$q.dark.isActive ? "rgba(255, 255, 255, 0.03)" : "white"');
}

.text-primary {
    color: v-bind('$q.dark.isActive ? "white" : "#1976d2"') !important;
}
</style>
