<template>
  <q-page :class="$q.dark.isActive ? 'bg-dark' : 'bg-grey-2'">
    <div class="row items-center q-pa-md">
      <div class="text-h6" :class="$q.dark.isActive ? 'text-white' : ''">
        <q-icon name="mail" size="32px" class="q-mr-sm" />
        Notificaciones
      </div>
    </div>

    <!-- Menú desplegable de tipos de notificación -->
    <q-tabs
      v-model="tipoNotificacion"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab name="simple" label="Notificación Simple" icon="person" />
      <q-tab name="masiva" label="Notificación Masiva" icon="groups" />
    </q-tabs>

    <q-separator />

    <!-- Contenido según el tipo seleccionado -->
    <q-tab-panels v-model="tipoNotificacion" animated>
      <q-tab-panel name="simple">
        <div class="text-h6 q-mb-md">
          <q-icon name="person" class="q-mr-sm" />
          Enviar Notificación Simple
        </div>
        <VNotificacionSimple />
      </q-tab-panel>

      <q-tab-panel name="masiva">
        <div class="text-h6 q-mb-md">
          <q-icon name="groups" class="q-mr-sm" />
          Enviar Notificación Masiva
        </div>
        <VNotificacionMasiva />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import VNotificacionSimple from './VNotificacionSimple.vue';
import VNotificacionMasiva from './VNotificacionMasiva.vue';

const tipoNotificacion = ref('simple');
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
