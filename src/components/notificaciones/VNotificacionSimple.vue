<template>
  <div class="q-pa-md">
    <q-card :class="$q.dark.isActive ? 'bg-dark text-white' : ''" flat bordered>
      <q-card-section>
        <q-form @submit="enviarNotificacion" class="q-gutter-md">
          <!-- Selector de programa -->
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
              label="Enviar Notificación"
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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { NotificacionesService } from '../../services/notificaciones.service';
import type { IPrograma } from '../interfaces/IPrograma';
import { ProgramaService } from '../services/programa';

const $q = useQuasar();
const isLoading = ref(false);
const selectedPrograma = ref<IPrograma | null>(null);
const programas = ref<IPrograma[]>([]);

const notificacion = ref({
  email: '',
  subject: '',
  message: ''
});

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
Universidad San Francisco Xavier de Chuquisaca`;
};

const enviarNotificacion = async () => {
  try {
    isLoading.value = true;
    await NotificacionesService.enviarNotificacionSimple({
      email: notificacion.value.email,
      subject: notificacion.value.subject,
      message: notificacion.value.message
    });

    $q.notify({
      color: 'positive',
      message: 'Notificación enviada exitosamente',
      icon: 'check'
    });

    // Limpiar formulario
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

onMounted(() => {
  fetchProgramas();
});
</script>
