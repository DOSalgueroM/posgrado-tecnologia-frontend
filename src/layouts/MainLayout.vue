<template>
  <q-layout view="lHh LpR lFf">
    <q-header elevated class="bg-primary">
      <q-toolbar>
        <q-btn flat dense round @click="toggleLeftDrawer" icon="menu" aria-label="Menu" />
        <q-toolbar-title>Facultad de Ciencias y Tecnología</q-toolbar-title>
        <q-space />
        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn round dense flat :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
            @click="$q.fullscreen.toggle()" v-if="$q.screen.gt.sm">
            <q-tooltip>{{ $q.fullscreen.isActive ? 'Salir de Pantalla Completa' : 'Pantalla Completa' }}</q-tooltip>
          </q-btn>
          <q-btn
            flat
            dense
            round
            :icon="isDark ? 'dark_mode' : 'light_mode'"
            @click="toggleDarkMode"
            class="q-mr-sm"
          >
            <q-tooltip>{{ isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro' }}</q-tooltip>
          </q-btn>
          <q-btn round dense flat icon="logout" @click="logout" />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :class="$q.dark.isActive ? 'bg-dark text-white' : 'bg-primary text-white'"
      bordered
    >
      <q-list>
        <q-item to="/" active-class="q-item-no-link-highlighting" >
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
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const leftDrawerOpen = ref(false);
const isDark = ref(false);
const $q = useQuasar();
const router = useRouter();

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const toggleDarkMode = () => {
  isDark.value = !isDark.value;
  $q.dark.set(isDark.value);
  localStorage.setItem('darkMode', isDark.value.toString());
};

onMounted(() => {
  // Recuperar la preferencia de modo oscuro
  const savedDarkMode = localStorage.getItem('darkMode');
  if (savedDarkMode !== null) {
    isDark.value = savedDarkMode === 'true';
    $q.dark.set(isDark.value);
  }
});

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
