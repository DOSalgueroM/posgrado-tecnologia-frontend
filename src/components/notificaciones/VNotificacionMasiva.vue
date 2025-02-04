<template>
  <div class="q-pa-md">
    <!-- <div class="text-h6 q-mb-md">Enviar Notificación Masiva</div> -->
    
    <q-form @submit="enviarNotificacion" class="q-gutter-md">
      <div class="row q-col-gutter-md">
        <!-- Área -->
        <div class="col-12 col-md-4">
          <q-select
            v-model="notificacionMasiva.area"
            :options="areas"
            label="Área *"
            outlined
            :dark="$q.dark.isActive"
            :rules="[val => !!val || 'El área es requerida']"
            class="full-width"
            emit-value
            map-options
          >
            <template v-slot:prepend>
              <q-icon name="category" />
            </template>
          </q-select>
        </div>

        <!-- Tipo de Persona -->
        <div class="col-12 col-md-4">
          <q-select
            v-model="notificacionMasiva.tipo"
            :options="tiposPersona"
            label="Grado Académico *"
            outlined
            :dark="$q.dark.isActive"
            :rules="[val => !!val || 'El tipo de persona es requerido']"
            class="full-width"
            emit-value
            map-options
          >
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-select>
        </div>

        <!-- Nivel de Estudio -->
        <div class="col-12 col-md-4">
          <q-select
            v-model="notificacionMasiva.nivelEstudio"
            :options="nivelesEstudioDisponibles"
            label="Tipo de Programa *"
            outlined
            :dark="$q.dark.isActive"
            :rules="[val => !!val || 'El nivel de estudio es requerido']"
            class="full-width"
            emit-value
            map-options
            :readonly="soloDiplomados"
          >
            <template v-slot:prepend>
              <q-icon name="school" />
            </template>
            <template v-slot:hint v-if="soloDiplomados">
              {{ notificacionMasiva.tipo === 'NO_PROFESIONAL' ? 'No profesionales solo tienen acceso a diplomados' : 'El área técnica solo tiene acceso a diplomados' }}
            </template>
          </q-select>
        </div>
      </div>

      <!-- Programa -->
      <div class="row q-col-gutter-md">
        <div class="col-12">
          <q-select
            v-model="selectedPrograma"
            :options="programasFiltrados"
            label="Programa *"
            outlined
            :dark="$q.dark.isActive"
            option-label="nombre"
            :rules="[val => !!val || 'Debe seleccionar un programa']"
            :loading="isLoading"
            use-input
            @filter="filterProgramas"
            @update:model-value="actualizarMensaje"
            :disable="!camposHabilitados"
          >
            <template v-slot:prepend>
              <q-icon name="school" />
            </template>
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No hay programas disponibles para los criterios seleccionados
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>{{ scope.opt.nombre }}</q-item-label>
                  <q-item-label caption>
                    {{ scope.opt.sigla }} - {{ scope.opt.tipo }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
      </div>

      <!-- Asunto y Mensaje -->
      <div class="row q-col-gutter-md">
        <div class="col-12">
          <q-input
            v-model="notificacionMasiva.subject"
            label="Asunto *"
            outlined
            :dark="$q.dark.isActive"
            :rules="[val => !!val || 'El asunto es requerido']"
            :disable="!selectedPrograma"
          >
            <template v-slot:prepend>
              <q-icon name="title" />
            </template>
          </q-input>
        </div>
        <div class="col-12">
          <q-input
            v-model="notificacionMasiva.message"
            label="Mensaje *"
            type="textarea"
            outlined
            :dark="$q.dark.isActive"
            :rules="[val => !!val || 'El mensaje es requerido']"
            :disable="!selectedPrograma"
            rows="6"
          >
            <template v-slot:prepend>
              <q-icon name="message" />
            </template>
          </q-input>
        </div>
      </div>

      <!-- Botón de envío -->
      <div class="row justify-end">
        <q-btn
          type="submit"
          color="primary"
          :loading="isLoading"
          :disable="!camposHabilitados || !selectedPrograma"
          label="Enviar Notificación"
        />
      </div>
    </q-form>
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6">Información de Destinatarios</div>
          </q-card-section>
          <q-card-section>
            {{ infoDestinatarios }}
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useQuasar } from 'quasar';
import { NotificacionesService } from '../../services/notificaciones.service';
import { ProgramaService } from '../services/programa';
import { PersonaService } from '../../services/persona.service';
import type { IPrograma } from '../interfaces/IPrograma';
import { Area, TipoPersona } from '../interfaces/IPrograma';

interface NotificacionMasiva {
  area: Area | null;
  tipo: string | null;
  nivelEstudio: string | null;
  subject: string;
  message: string;
}

const $q = useQuasar();
const isLoading = ref(false);
const selectedPrograma = ref<IPrograma | null>(null);
const programas = ref<IPrograma[]>([]);
const searchQuery = ref('');

// Variables para manejar destinatarios
const destinatarios = ref<any[]>([]);
const destinatariosLoading = ref(false);

// Estado inicial
const notificacionMasiva = ref<NotificacionMasiva>({
  area: null,
  tipo: null,
  nivelEstudio: null,
  subject: '',
  message: ''
});

// Opciones para los selectores
const areas = ref([
  { label: 'Químicas', value: Area.QUIMICAS },
  { label: 'Técnicos', value: Area.TECNICOS },
  { label: 'Sistemas', value: Area.SISTEMAS }
]);

const tiposPersona = ref([
  { label: 'Profesional', value: TipoPersona.TITULADO },
  { label: 'No Profesional', value: TipoPersona.NO_TITULADO }
]);

// Computed para controlar acceso solo a diplomados
const soloDiplomados = computed(() => {
  return notificacionMasiva.value.tipo === 'NO_PROFESIONAL' || 
         notificacionMasiva.value.area === Area.TECNICOS;
});

// Watch para forzar diplomado cuando es necesario
watch(
  [() => notificacionMasiva.value.tipo, () => notificacionMasiva.value.area],
  ([newTipo, newArea], [oldTipo, oldArea]) => {
    if (newTipo !== oldTipo || newArea !== oldArea) {
      // Resetear programa seleccionado al cambiar tipo o área
      selectedPrograma.value = null;
      notificacionMasiva.value.subject = '';
      notificacionMasiva.value.message = '';
      
      if (newTipo === 'NO_PROFESIONAL' || newArea === Area.TECNICOS) {
        notificacionMasiva.value.nivelEstudio = 'DIPLOMADO';
      }
    }
  }
);

// Computed para las opciones de nivel de estudio
const nivelesEstudioDisponibles = computed(() => {
  if (soloDiplomados.value) {
    return [{ label: 'Diplomado', value: 'DIPLOMADO' }];
  }
  
  return [
    { label: 'Diplomado', value: 'DIPLOMADO' },
    { label: 'Maestría', value: 'MAESTRIA' },
    { label: 'Doctorado', value: 'DOCTORADO' },
    { label: 'Especialidad', value: 'ESPECIALIDAD' }
  ];
});

// Watch para nivel de estudio
watch(() => notificacionMasiva.value.nivelEstudio, (newNivel) => {
  // Resetear programa seleccionado al cambiar nivel
  selectedPrograma.value = null;
  notificacionMasiva.value.subject = '';
  notificacionMasiva.value.message = '';
});

// Computed para habilitar/deshabilitar campos
const camposHabilitados = computed(() => {
  return !!notificacionMasiva.value.area && 
         !!notificacionMasiva.value.tipo && 
         !!notificacionMasiva.value.nivelEstudio;
});

// Computed para filtrar programas
const programasFiltrados = computed(() => {
  if (!camposHabilitados.value) {
    return [];
  }

  let filtrados = programas.value;

  // Filtrar por área
  filtrados = filtrados.filter(p => p.areas.includes(notificacionMasiva.value.area as Area));

  // Filtrar por nivel de estudio
  if (soloDiplomados.value) {
    filtrados = filtrados.filter(p => p.tipo === 'DIPLOMADO');
  } else {
    filtrados = filtrados.filter(p => p.tipo === notificacionMasiva.value.nivelEstudio);
  }

  // Filtrar por texto de búsqueda
  if (searchQuery.value) {
    const needle = searchQuery.value.toLowerCase();
    filtrados = filtrados.filter(v => v.nombre.toLowerCase().includes(needle));
  }

  return filtrados;
});

// Computed para mostrar información de destinatarios
const infoDestinatarios = computed(() => {
  if (!destinatarios.value.length) return '';
  
  const totalDestinatarios = destinatarios.value.length;
  const emailsValidos = destinatarios.value.filter(d => d.email && d.email.includes('@')).length;
  
  return `${emailsValidos} destinatarios válidos de un total de ${totalDestinatarios}`;
});

// Watch para cargar destinatarios cuando cambien los criterios
watch(
  [
    () => notificacionMasiva.value.area,
    () => notificacionMasiva.value.tipo,
    () => notificacionMasiva.value.nivelEstudio
  ],
  async ([newArea, newTipo, newNivel], [oldArea, oldTipo, oldNivel]) => {
    if (newArea && newTipo && newNivel &&
        (newArea !== oldArea || newTipo !== oldTipo || newNivel !== oldNivel)) {
      await cargarDestinatarios();
    } else {
      destinatarios.value = [];
    }
  }
);

// Función para cargar destinatarios
const cargarDestinatarios = async () => {
  try {
    destinatariosLoading.value = true;
    destinatarios.value = [];

    if (!notificacionMasiva.value.area || 
        !notificacionMasiva.value.tipo || 
        !notificacionMasiva.value.nivelEstudio) {
      return;
    }

    const response = await PersonaService.findByAreaAndTipo(
      notificacionMasiva.value.area.toString(),
      notificacionMasiva.value.tipo,
      notificacionMasiva.value.nivelEstudio
    );

    destinatarios.value = response;
    console.log(destinatarios.value);

  } catch (error: any) {
    $q.notify({
      type: 'warning',
      message: error.response?.data?.message || 'Error al cargar destinatarios',
      position: 'top'
    });
  } finally {
    destinatariosLoading.value = false;
  }
};

// Función para cargar programas
const fetchProgramas = async () => {
  try {
    isLoading.value = true;
    const response = await ProgramaService.obtenerProgramas();
    programas.value = response;
  } catch (error) {
    console.error('Error al cargar programas:', error);
  } finally {
    isLoading.value = false;
  }
};

// Función para filtrar programas en el select
const filterProgramas = (val: string, update: (fn: () => void) => void) => {
  searchQuery.value = val;
  update(() => {
    // La actualización ocurrirá automáticamente a través del computed
  });
};

// Función para actualizar mensaje
const actualizarMensaje = () => {
  if (selectedPrograma.value) {
    const programa = selectedPrograma.value;
    notificacionMasiva.value.subject = `¡Inscríbete en nuestro ${programa.tipo.toLowerCase()}: ${programa.nombre}!`;
    notificacionMasiva.value.message = generarMensajePrograma(programa);
  }
};

// Función para generar mensaje de programa
const generarMensajePrograma = (programa: IPrograma) => {
  const areasCapitalizadas = programa.areas.map(area => {
    const areaLower = area.toLowerCase();
    if (areaLower.includes('tecnic')) {
      return 'Técnico Superior';
    }
    return area.charAt(0).toUpperCase() + area.slice(1).toLowerCase();
  });

  const tipoFormateado = programa.tipo.toLowerCase() === 'tecnico' ? 'Técnico Superior' : programa.tipo;
  
  // Formatear la fecha
  const fecha = new Date(programa.fecha_inicio);
  const fechaFormateada = fecha.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return `🎓 ¡Saludos cordiales! 🌟

📢 ¡GRAN OPORTUNIDAD ACADÉMICA! 
En la Facultad de Ciencias y Tecnología - USFX te presentamos:

✨ ${programa.nombre} ✨
📋 ${programa.sigla}

📌 DETALLES DEL PROGRAMA:
🔸 Tipo: ${tipoFormateado}
🔸 Duración: ${programa.duracion_meses} meses
🔸 Modalidad: ${programa.modalidad}
🔸 Sede: ${programa.sede}
🔸 Gestión: ${programa.gestion}
🔸 Fecha de inicio: ${fechaFormateada}

📝 DESCRIPCIÓN:
${programa.descripcion}

🎯 ÁREAS DE ESTUDIO:
${areasCapitalizadas.join(', ')} y ramas afines

🚀 ¡No pierdas esta oportunidad de desarrollo profesional! 
✅ Las inscripciones están abiertas.

📍 Para más información y proceso de inscripción:
🏢 Visítanos: Posgrado, Bloque F último piso, aulas F304 y F307
📞 Contáctanos para más detalles al 73355497 - 68622233

Atentamente,
🏛️ Facultad de Tecnología
Dirección: Regimiento Campos #180
Universidad San Francisco Xavier de Chuquisaca`;
};

// Función para enviar la notificación
const enviarNotificacion = async () => {
  try {
    // Validar que todos los campos requeridos estén llenos
    if (!notificacionMasiva.value.area || 
        !notificacionMasiva.value.tipo || 
        !notificacionMasiva.value.nivelEstudio || 
        !selectedPrograma.value ||
        !notificacionMasiva.value.subject ||
        !notificacionMasiva.value.message) {
      throw new Error('Por favor complete todos los campos requeridos');
    }

    // Validar que haya destinatarios
    if (!destinatarios.value.length) {
      throw new Error('No hay destinatarios para enviar la notificación');
    }

    // Filtrar y mostrar correos válidos
    const emailsValidos = destinatarios.value
      .filter(d => 
        d.email && 
        d.email.includes('@') && 
        d.email.includes('.') && 
        !d.email.toLowerCase().includes('ninguno')
      )
      .map(d => d.email);

    console.log('Destinatarios encontrados:', destinatarios.value.length);
    console.log('Correos válidos:', emailsValidos.length);
    console.log('Lista de correos válidos:', emailsValidos);
    
    // Validar que haya correos válidos
    if (!emailsValidos.length) {
      throw new Error('No hay correos electrónicos válidos para enviar la notificación');
    }

    isLoading.value = true;

    // Preparar los datos para enviar
    const notificacionData = {
      area: notificacionMasiva.value.area.toString(),
      tipo: notificacionMasiva.value.tipo,
      nivelEstudio: notificacionMasiva.value.nivelEstudio,
      subject: notificacionMasiva.value.subject,
      message: notificacionMasiva.value.message
    };

    console.log('Enviando notificación con los siguientes datos:', {
      ...notificacionData,
      totalDestinatarios: destinatarios.value.length,
      emailsValidos: emailsValidos.length
    });

    // Enviar la notificación usando el servicio
    const response = await NotificacionesService.enviarNotificacion(notificacionData);

    // Mostrar mensaje de éxito
    $q.notify({
      type: 'positive',
      message: `Notificación enviada exitosamente a ${response.emailsSent} destinatarios`,
      position: 'top'
    });

    // Limpiar el formulario
    notificacionMasiva.value = {
      area: null,
      tipo: null,
      nivelEstudio: null,
      subject: '',
      message: ''
    };
    selectedPrograma.value = null;
    searchQuery.value = '';
    destinatarios.value = [];

  } catch (error: any) {
    console.error('Error al enviar notificación:', error);
    // Mostrar mensaje de error
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || error.message || 'Error al enviar la notificación',
      position: 'top'
    });
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await fetchProgramas();
});
</script>

<style scoped>
.full-width {
  width: 100%;
}

.q-form {
  max-width: 1200px;
  margin: 0 auto;
}

.q-select {
  margin-bottom: 0;
}
</style>
