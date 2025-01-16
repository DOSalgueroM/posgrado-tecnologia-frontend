<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <div class="q-pa-md">
      <div class="text-h6 q-mb-md" :class="$q.dark.isActive ? 'text-white' : ''">
        {{ isEditing ? 'Editar' : 'Crear' }} {{ getTipoPrograma }}
      </div>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <q-input
            v-model="formData.nombre"
            label="Nombre del Programa *"
            :rules="[val => !!val || 'El nombre es requerido']"
            outlined
            :dark="$q.dark.isActive"
          />
        </div>

        <div class="col-12 col-md-6">
          <q-input
            v-model="formData.sigla"
            label="Sigla *"
            :rules="[val => !!val || 'La sigla es requerida']"
            outlined
            :dark="$q.dark.isActive"
          />
        </div>

        <div class="col-12">
          <q-input
            v-model="formData.descripcion"
            type="textarea"
            label="Descripción *"
            :rules="[
              val => !!val || 'La descripción es requerida',
              val => val.length >= 10 || 'La descripción debe tener al menos 10 caracteres'
            ]"
            outlined
            :dark="$q.dark.isActive"
          />
        </div>

        <div class="col-12 col-md-6">
          <q-select
            v-model="formData.areas"
            :options="areaOptions"
            label="Áreas *"
            multiple
            use-chips
            stack-label
            :rules="[val => val && val.length > 0 || 'Debe seleccionar al menos un área']"
            outlined
            :dark="$q.dark.isActive"
          >
            <template v-slot:selected-item="scope">
              <q-chip
                removable
                @remove="scope.removeAtIndex(scope.index)"
                :tabindex="scope.tabindex"
                color="primary"
                text-color="white"
              >
                {{ scope.opt }}
              </q-chip>
            </template>
          </q-select>
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
            :dark="$q.dark.isActive"
          />
        </div>

        <div class="col-12 col-md-6">
          <q-select
            v-model="formData.modalidad"
            :options="Object.values(Modalidad)"
            label="Modalidad *"
            :rules="[val => !!val || 'La modalidad es requerida']"
            outlined
            :dark="$q.dark.isActive"
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
            :dark="$q.dark.isActive"
          />
        </div>

        <div class="col-12 col-md-6">
          <q-input
            v-model="formData.fecha_inicio"
            type="date"
            label="Fecha de Inicio *"
            :rules="[val => !!val || 'La fecha de inicio es requerida']"
            outlined
            :dark="$q.dark.isActive"
          />
        </div>

        <div class="col-12 col-md-6">
          <q-select
            v-model="formData.sede"
            :options="municipios"
            label="Sede *"
            :rules="[val => !!val || 'La sede es requerida']"
            outlined
            :dark="$q.dark.isActive"
          />
        </div>

        <div class="col-12">
          <q-file
            v-model="formData.imagen_url"
            label="Imagen del Programa"
            accept=".jpg,.png,.jpeg,.gif"
            outlined
            :dark="$q.dark.isActive"
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
    </div>

    <!-- Botones -->
    <div class="row justify-end q-mt-md">
      <q-btn
        label="Cancelar"
        :color="$q.dark.isActive ? 'red-3' : 'negative'"
        flat
        class="q-mr-sm"
        @click="$router.back()"
      />
      <q-btn
        label="Guardar"
        type="submit"
        :color="$q.dark.isActive ? 'primary' : 'primary'"
      />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { Area, Modalidad, TipoPrograma } from '../interfaces/IPrograma';
import { ProgramaService } from '../services/programa';

const props = defineProps<{
  tipo: number;
  id?: number;
}>();

const $q = useQuasar();
const router = useRouter();

const isEditing = computed(() => !!props.id);

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

const tipoMap = {
  1: TipoPrograma.DIPLOMADO,
  2: TipoPrograma.MAESTRIA,
  3: TipoPrograma.ESPECIALIDAD,
  4: TipoPrograma.DOCTORADO
};

const areaOptions = Object.values(Area);

const formData = ref({
  nombre: '',
  sigla: '',
  descripcion: '',
  areas: [] as Area[],
  duracion_meses: null as number | null,
  modalidad: null as Modalidad | null,
  gestion: new Date().getFullYear(),
  fecha_inicio: '',
  sede: '',
  imagen_url: null as File | null,
  tipo: computed(() => tipoMap[props.tipo as keyof typeof tipoMap])
});

const previewImage = computed(() => {
  if (formData.value.imagen_url instanceof File) {
    return URL.createObjectURL(formData.value.imagen_url);
  } else if (typeof formData.value.imagen_url === 'string') {
    return formData.value.imagen_url;
  }
  return '';
});

onMounted(async () => {
  if (props.id) {
    try {
      const programa = await ProgramaService.obtenerProgramaPorId(props.id);
      formData.value = {
        ...programa,
        areas: programa.areas || [],
        imagen_url: programa.imagen_url || null,
        fecha_inicio: programa.fecha_inicio ? new Date(programa.fecha_inicio).toISOString().split('T')[0] : '',
      };
    } catch (error) {
      console.error('Error al obtener el programa:', error);
      $q.notify({
        type: 'negative',
        message: 'Error al cargar los datos del programa'
      });
    }
  }
});

const onSubmit = async () => {
  try {
    const formDataToSend = new FormData();
    
    const dataToSend = {
      nombre: formData.value.nombre,
      sigla: formData.value.sigla,
      descripcion: formData.value.descripcion,
      areas: formData.value.areas,
      duracion_meses: formData.value.duracion_meses,
      modalidad: formData.value.modalidad,
      gestion: formData.value.gestion,
      fecha_inicio: formData.value.fecha_inicio,
      sede: formData.value.sede,
      tipo: formData.value.tipo
    };
    
    console.log('Datos a enviar:', dataToSend);
    
    if (formData.value.imagen_url instanceof File) {
      formDataToSend.append('imagen_url', formData.value.imagen_url);
    }

    const areasArray = formData.value.areas || [];
    formDataToSend.append('areas', JSON.stringify(areasArray));

    Object.entries(dataToSend).forEach(([key, value]) => {
      if (key !== 'areas' && value !== null && value !== undefined) {
        formDataToSend.append(key, String(value));
      }
    });

    console.log('--- FormData Entries ---');
    for (const [key, value] of formDataToSend.entries()) {
      console.log(`${key}: ${value}`);
    }

    if (isEditing.value) {
      await ProgramaService.actualizarProgramaFormData(props.id!, formDataToSend);
      $q.notify({
        type: 'positive',
        message: 'Programa actualizado exitosamente'
      });
    } else {
      const response = await ProgramaService.crearPrograma(formDataToSend);
      console.log('Respuesta del servidor:', response);
      $q.notify({
        type: 'positive',
        message: 'Programa creado exitosamente'
      });
    }

    // Corregir la redirección basada en el tipo de programa
    let ruta = '/';
    switch (props.tipo) {
      case 1:
        ruta = '/diplomados';
        break;
      case 2:
        ruta = '/maestrias';
        break;
      case 3:
        ruta = '/especialidades';
        break;
      case 4:
        ruta = '/doctorados';
        break;
    }
    router.push(ruta);
  } catch (error: any) {
    console.error('Error completo:', error);
    if (error.response?.data) {
      console.error('Detalles del error:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });

      if (error.response.data.message) {
        if (Array.isArray(error.response.data.message)) {
          console.error('Errores de validación:');
          error.response.data.message.forEach((msg: string, index: number) => {
            console.error(`${index + 1}. ${msg}`);
          });
        } else {
          console.error('Mensaje de error:', error.response.data.message);
        }
      }
    }
    
    let errorMessage = 'Error al crear el programa';
    if (error.response?.data?.message) {
      if (Array.isArray(error.response.data.message)) {
        errorMessage = error.response.data.message[0];
      } else {
        errorMessage = error.response.data.message;
      }
    }
    
    $q.notify({
      type: 'negative',
      message: errorMessage
    });
  }
};

const getTipoPrograma = computed(() => {
  return tipoMap[props.tipo as keyof typeof tipoMap];
});
</script>

<style scoped>
.q-form {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.dark .q-input,
.dark .q-select {
  color: white;
}

.dark .q-field__native,
.dark .q-field__prefix,
.dark .q-field__suffix,
.dark .q-field__input {
  color: white;
}

.dark .q-field__label {
  color: rgba(255, 255, 255, 0.7);
}

.dark .q-field--outlined .q-field__control {
  border-color: rgba(255, 255, 255, 0.3);
}

.dark .q-field--outlined .q-field__control:hover {
  border-color: white;
}

.dark .q-btn {
  color: white;
}
</style>
