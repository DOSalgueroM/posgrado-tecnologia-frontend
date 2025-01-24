<template>
  <q-layout view="lHh LpR lFf">
    <q-header elevated class="bg-primary">
      <q-toolbar class="q-px-lg">
        <q-btn flat dense round @click="toggleLeftDrawer" icon="menu" aria-label="Menu" />
        <q-toolbar-title class="text-weight-bold">
          <div class="logo-container">
            <img :src="logoFac" alt="Logo FCYT" class="logo-img">
          </div>
          Facultad de Ciencias y Tecnología
        </q-toolbar-title>
        <q-space />
        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn round dense flat :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
            @click="$q.fullscreen.toggle()" v-if="$q.screen.gt.sm" class="q-ml-sm">
            <q-tooltip>{{ $q.fullscreen.isActive ? 'Salir de Pantalla Completa' : 'Pantalla Completa' }}</q-tooltip>
          </q-btn>
          <q-btn
            flat
            dense
            round
            :icon="isDark ? 'dark_mode' : 'light_mode'"
            @click="toggleDarkMode"
            class="q-mx-sm"
          >
            <q-tooltip>{{ isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro' }}</q-tooltip>
          </q-btn>
          
          <q-btn-dropdown flat class="profile-btn" auto-close>
            <template v-slot:label>
              <div class="row items-center no-wrap">
                <q-avatar size="26px">
                  <img src="https://cdn.quasar.dev/img/avatar.png" />
                </q-avatar>
                <div class="q-ml-sm text-subtitle2" v-if="$q.screen.gt.xs">
                  {{ userName }}
                </div>
              </div>
            </template>

            <q-list>
              <q-item clickable v-close-popup>
                <q-item-section avatar>
                  <q-icon name="person" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ userName }}</q-item-label>
                  <q-item-label caption>{{ userRole }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-separator />

              <q-item clickable v-close-popup @click="cambiarPassword">
                <q-item-section avatar>
                  <q-icon name="key" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Cambiar Contraseña</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="logout">
                <q-item-section avatar>
                  <q-icon name="logout" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Cerrar Sesión</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="240"
      :breakpoint="400"
      :class="$q.dark.isActive ? 'bg-dark' : 'bg-grey-1'"
      bordered
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item class="q-pa-md">
            <q-item-section class="text-center">
              <div class="logo-container-drawer">
                <img :src="logoFac" alt="Logo FCYT" class="logo-img">
              </div>
              <div class="text-subtitle1 q-mt-md text-weight-bold" :class="$q.dark.isActive ? 'text-blue-2' : 'text-primary'">
                Posgrado FCYT
              </div>
            </q-item-section>
          </q-item>

          <q-separator />

          <q-item to="/" active-class="menu-link" exact class="q-my-sm">
            <q-item-section avatar>
              <q-icon name="dashboard" />
            </q-item-section>
            <q-item-section>
              <q-item-label>General</q-item-label>
            </q-item-section>
          </q-item>

         
          <q-item v-if="isAdmin" to="/usuarios" active-class="menu-link" class="q-my-sm">
            <q-item-section avatar>
              <q-icon name="people" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Usuarios</q-item-label>
            </q-item-section>
          </q-item>

          <q-expansion-item
            icon="school"
            label="Programas"
            :header-class="$q.dark.isActive ? 'text-white' : 'text-black'"
          >
            <q-item to="/diplomados" active-class="menu-link" class="q-ml-md">
              <q-item-section avatar>
                <q-icon name="workspace_premium" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Diplomados</q-item-label>
              </q-item-section>
            </q-item>

            <q-item to="/maestrias" active-class="menu-link" class="q-ml-md">
              <q-item-section avatar>
                <q-icon name="psychology" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Maestrías</q-item-label>
              </q-item-section>
            </q-item>

            <q-item to="/especialidades" active-class="menu-link" class="q-ml-md">
              <q-item-section avatar>
                <q-icon name="badge" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Especialidades</q-item-label>
              </q-item-section>
            </q-item>

            <q-item to="/doctorados" active-class="menu-link" class="q-ml-md">
              <q-item-section avatar>
                <q-icon name="school" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Doctorados</q-item-label>
              </q-item-section>
            </q-item>
          </q-expansion-item>
          
          <q-item to="/notificaciones" active-class="menu-link" class="q-my-sm">
            <q-item-section avatar>
              <q-icon name="notifications" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Notificaciones</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container class="bg-grey-2">
      <router-view />
    </q-page-container>
  </q-layout>

  <VCambiarPassword ref="cambiarPasswordRef" />
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import logoFac from '../images/logo fac.png';
import VCambiarPassword from '../components/usuarios/VCambiarPassword.vue';

const $q = useQuasar();
const router = useRouter();

const leftDrawerOpen = ref(false);
const isDark = ref(false);
const cambiarPasswordRef = ref();

// Usuario autenticado
const userName = ref('');
const userRole = ref('');
const isAdmin = computed(() => userRole.value === 'ADMIN');

onMounted(() => {
  // Recuperar la preferencia de modo oscuro
  const savedDarkMode = localStorage.getItem('darkMode');
  if (savedDarkMode !== null) {
    isDark.value = savedDarkMode === 'true';
    $q.dark.set(isDark.value);
  }

  // Recuperar datos del usuario
  const authUserStr = localStorage.getItem('authUser');
  if (authUserStr) {
    const authUser = JSON.parse(authUserStr);
    userName.value = authUser.nombre || authUser.username;
    userRole.value = authUser.rol;
  }
});

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function toggleDarkMode() {
  isDark.value = !isDark.value;
  $q.dark.set(isDark.value);
  localStorage.setItem('darkMode', isDark.value.toString());
}

function cambiarPassword() {
  cambiarPasswordRef.value?.open();
}

async function logout() {
  try {
    // Limpiar el localStorage
    localStorage.clear();
    // Limpiar variables reactivas
    userName.value = '';
    userRole.value = '';
    // Redirigir al login
    await router.push('/login');
  } catch (error) {
    console.error('Error durante el cierre de sesión:', error);
    $q.notify({
      color: 'negative',
      message: 'Error al cerrar sesión',
      icon: 'error'
    });
  }
}
</script>

<style lang="scss">
body.body--dark {
  .q-drawer {
    // Estilo por defecto en modo oscuro
    .q-item__label {
      color: #fff !important;
    }
    .q-icon {
      color: #fff !important;
    }
    .q-expansion-item__toggle-icon {
      color: #fff !important;
    }

    // Estilos al hacer hover en modo oscuro
    .q-item:hover {
      background: rgba(144, 202, 249, 0.4) !important;
      
      .q-item__label,
      .q-item__section--main,
      .q-item__section--side,
      .q-expansion-item__toggle-icon,
      .q-icon {
        color: #000 !important;
      }
    }

    // Asegurar que los elementos del menú expandible también cambien
    .q-expansion-item {
      &__content {
        .q-item:hover {
          background: rgba(144, 202, 249, 0.4) !important;
          
          .q-item__label,
          .q-item__section--main,
          .q-item__section--side,
          .q-icon {
            color: #000 !important;
          }
        }
      }
    }
  }
}

.menu-link {
  color: #1976D2 !important;
  background: #E3F2FD;
  font-weight: 600;
  border-radius: 0 12px 12px 0;
  margin-right: 12px;

  .q-dark & {
    color: #90CAF9 !important;
    background: rgba(144, 202, 249, 0.1);
  }
}

.q-drawer {
  .q-item {
    border-radius: 0 12px 12px 0;
    margin-right: 12px;
    transition: all 0.3s ease;
  }
}

.logo-container {
  display: inline-block;
  width: 40px;
  height: 40px;
  margin-right: 10px;
  vertical-align: middle;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
}

.logo-container-drawer {
  width: 80px;
  height: 80px;
  margin: 0 auto;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.profile-btn {
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  border-radius: 8px;
  padding: 4px 8px;
}

.q-toolbar {
  min-height: 64px;
}

.q-header {
  .q-btn {
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }
}
</style>
