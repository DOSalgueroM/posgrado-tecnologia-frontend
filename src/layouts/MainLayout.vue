<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round @click="toggleLeftDrawer" icon="menu" aria-label="Menu" />
        <q-toolbar-title>Programa de Posgrado de Facultad de Tecnologia</q-toolbar-title>
        <q-space />
        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn round dense flat :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
            @click="$q.fullscreen.toggle()" v-if="$q.screen.gt.sm" />
          <q-btn round dense flat icon="logout" @click="logout" />

        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-primary text-white">
      <q-list>
        <q-item to="/" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>
            <q-item-label>General</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/Dashboard3" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="done" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Usuarios</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/diplomados" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="done" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Diplomados</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/maestrias" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="done" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Maestrías</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/especialidades" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="done" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Especialidades</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/doctorados" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="done" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Doctorados</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/Dashboard3" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="done" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Notificaciones</q-item-label>
          </q-item-section>
        </q-item>
        <!-- Más ítems aquí -->
      </q-list>
    </q-drawer>

    <q-page-container class="bg-grey-2">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const leftDrawerOpen = ref(false);
const $q = useQuasar();
const router = useRouter();

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const logout = () => {
  // Elimina el usuario autenticado del almacenamiento local
  localStorage.removeItem('authUser');

  // Redirige al usuario a la página de inicio de sesión
  router.push('/login');
};

</script>

<style>
/* FONT AWESOME GENERIC BEAT */
.fa-beat {
  animation: fa-beat 5s ease infinite;
}

@keyframes fa-beat {
  0% {
    transform: scale(1);
  }

  5% {
    transform: scale(1.25);
  }

  20% {
    transform: scale(1);
  }

  30% {
    transform: scale(1);
  }

  35% {
    transform: scale(1.25);
  }

  50% {
    transform: scale(1);
  }

  55% {
    transform: scale(1.25);
  }

  70% {
    transform: scale(1);
  }
}
</style>
