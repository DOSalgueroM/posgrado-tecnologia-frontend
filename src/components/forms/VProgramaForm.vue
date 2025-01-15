<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-input
          v-model="formData.nombre"
          label="Nombre del Programa *"
          :rules="[val => !!val || 'El nombre es requerido']"
          outlined
        />
      </div>

      <div class="col-12 col-md-6">
        <q-input
          v-model="formData.sigla"
          label="Sigla *"
          :rules="[val => !!val || 'La sigla es requerida']"
          outlined
        />
      </div>

      <div class="col-12">
        <q-input
          v-model="formData.descripcion"
          type="textarea"
          label="Descripción *"
          :rules="[val => !!val || 'La descripción es requerida']"
          outlined
        />
      </div>


      <div class="col-12 col-md-6">
        <q-select
          v-model="formData.area"
          :options="Object.values(Area)"
          label="Área *"
          :rules="[val => !!val || 'El área es requerida']"
          outlined
        />
      </div>


      <div class="col-12 col-md-6">
        <q-input
          v-model.number="formData.duracion_meses"
          type="number"
          label="Duración (meses) *"
          :rules="[
            val => !!val || 'La duración es requerida',
            val => val > 0 || 'La duración debe ser mayor a 0'
          ]"
          outlined
        />
      </div>

      <div class="col-12 col-md-6">
        <q-select
          v-model="formData.modalidad"
          :options="Object.values(Modalidad)"
          label="Modalidad *"
          :rules="[val => !!val || 'La modalidad es requerida']"
          outlined
        />
      </div>

      <div class="col-12 col-md-6">
        <q-input
          v-model.number="formData.gestion"
          type="number"
          label="Gestión *"
          :rules="[
            val => !!val || 'La gestión es requerida',
            val => val >= 2024 || 'La gestión debe ser 2024 o posterior'
          ]"
          outlined
        />
      </div>

      <div class="col-12 col-md-6">
        <q-input
          v-model="formData.fecha_inicio"
          type="date"
          label="Fecha de Inicio *"
          :rules="[val => !!val || 'La fecha de inicio es requerida']"
          outlined
        />
      </div>

      <div class="col-12 col-md-6">
        <q-select
          v-model="formData.sede"
          :options="municipios"
          label="Sede *"
          :rules="[val => !!val || 'La sede es requerida']"
          outlined
        />
      </div>
      <div class="col-12">
        <q-file
          v-model="formData.imagen_url"
          label="Imagen del Programa"
          accept=".jpg,.png,.jpeg,.gif"
          outlined
        >
          <template v-slot:prepend>
            <q-icon name="attach_file" />
          </template>
        </q-file>
        <div v-if="formData.imagen_url" class="q-mt-sm">
          <img
            :src="previewImage"
            style="max-width: 200px; max-height: 200px"
            class="q-mt-sm"
          />
        </div>
      </div>
    </div>

    <!-- Botones -->
    <div class="row justify-end q-mt-md">
      <q-btn
        label="Cancelar"
        color="negative"
        flat
        class="q-mr-sm"
        @click="$router.back()"
      />
      <q-btn
        label="Guardar"
        type="submit"
        color="primary"
      />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { Area, Modalidad, TipoPrograma } from '../interfaces/IPrograma';
import { ProgramaService } from '../services/programa';

const props = defineProps<{
  tipo: number;
}>();

const $q = useQuasar();
const router = useRouter();

const municipios = [
  'Sucre',
  'Yotala',
  'Poroma',
  'Azurduy',
  'Tarvita',
  'Zudáñez',
  'Presto',
  'Mojocoya',
  'Icla',
  'Padilla',
  'Tomina',
  'Sopachuy',
  'Villa Alcalá',
  'El Villar',
  'Monteagudo',
  'Huacareta',
  'Tarabuco',
  'Yamparáez',
  'Camargo',
  'San Lucas',
  'Incahuasi',
  'Villa Serrano',
  'Culpina',
  'Las Carreras',
  'Villa Vaca Guzmán',
  'Villa Abecia',
  'Huacaya',
  'Macharetí'
];

const getTipoPrograma = computed(() => {
  switch (props.tipo) {
    case 1:
      return TipoPrograma.DIPLOMADO;
    case 2:
      return TipoPrograma.MAESTRIA;
    case 3:
      return TipoPrograma.ESPECIALIDAD;
    case 4:
      return TipoPrograma.DOCTORADO;
    default:
      return TipoPrograma.DIPLOMADO;
  }
});

const formData = ref({
  nombre: '',
  sigla: '',
  descripcion: '',
  area: null as Area | null,
  duracion_meses: null as number | null,
  modalidad: null as Modalidad | null,
  gestion: new Date().getFullYear(),
  fecha_inicio: '',
  sede: '',
  imagen_url: null as File | null,
  tipo: getTipoPrograma.value
});

const previewImage = computed(() => {
  if (formData.value.imagen_url) {
    return URL.createObjectURL(formData.value.imagen_url);
  }
  return '';
});

const onSubmit = async () => {
  try {
    const formDataToSend = new FormData();
    
    if (formData.value.imagen_url) {
      formDataToSend.append('imagen_url', formData.value.imagen_url);
    }

    formDataToSend.append('nombre', formData.value.nombre);
    formDataToSend.append('sigla', formData.value.sigla);
    formDataToSend.append('descripcion', formData.value.descripcion);
    formDataToSend.append('area', formData.value.area as string);
    formDataToSend.append('duracion_meses', formData.value.duracion_meses?.toString() || '');
    formDataToSend.append('modalidad', formData.value.modalidad as string);
    formDataToSend.append('gestion', formData.value.gestion.toString());
    formDataToSend.append('fecha_inicio', formData.value.fecha_inicio);
    formDataToSend.append('sede', formData.value.sede);
    formDataToSend.append('tipo', formData.value.tipo);

    await ProgramaService.crearPrograma(formDataToSend);
    
    $q.notify({
      type: 'positive',
      message: 'Programa creado exitosamente'
    });
    switch (props.tipo) {
      case 1:
        router.push('/diplomados');
        break;
      case 2:
        router.push('/maestrias');
        break;
      case 3:
        router.push('/especialidades');
        break;
      case 4:
        router.push('/doctorados');
        break;
    }
  } catch (error) {
    console.error('Error al crear el programa:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al crear el programa'
    });
  }
};
</script>

<style scoped>
.q-form {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>
