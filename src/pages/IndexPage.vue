<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <!-- Welcome Section -->
      <div class="col-12">
        <q-card class="welcome-card q-pa-md">
          <div class="row items-center">
            <div class="col-12 col-md-8">
              <h4 class="text-h4 q-mb-md">Bienvenido al Sistema de Posgrado</h4>
              <p class="text-body1">Facultad de Ciencias y Tecnología - Universidad San Francisco Xavier</p>
            </div>
            <div class="col-12 col-md-4 text-center">
              <q-img
                :src="logoFac"
                style="max-width: 150px"
              />
            </div>
          </div>
        </q-card>
      </div>

      <!-- Stats Cards -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h6">Diplomados</div>
                <div class="text-h4 text-primary">24</div>
              </div>
              <div class="col-auto">
                <q-icon name="workspace_premium" size="3.5em" color="primary" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h6">Maestrías</div>
                <div class="text-h4 text-secondary">12</div>
              </div>
              <div class="col-auto">
                <q-icon name="psychology" size="3.5em" color="secondary" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h6">Especialidades</div>
                <div class="text-h4 text-accent">8</div>
              </div>
              <div class="col-auto">
                <q-icon name="badge" size="3.5em" color="accent" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h6">Doctorados</div>
                <div class="text-h4 text-purple">4</div>
              </div>
              <div class="col-auto">
                <q-icon name="school" size="3.5em" color="purple" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Recent Activities -->
      <div class="col-12 col-md-8">
        <q-card>
          <q-card-section>
            <div class="text-h6">Actividades Recientes</div>
          </q-card-section>
          <q-separator />
          <q-list>
            <q-item v-for="activity in recentActivities" :key="activity.id">
              <q-item-section avatar>
                <q-avatar :color="activity.color" text-color="white">
                  <q-icon :name="activity.icon" />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ activity.title }}</q-item-label>
                <q-item-label caption>{{ activity.description }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                {{ activity.time }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>

      <!-- Notifications -->
      <div class="col-12 col-md-4">
        <q-card>
          <q-card-section>
            <div class="text-h6">Notificaciones</div>
          </q-card-section>
          <q-separator />
          <q-list>
            <q-item v-for="notification in notifications" :key="notification.id">
              <q-item-section avatar>
                <q-icon :name="notification.icon" :color="notification.color" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ notification.message }}</q-item-label>
                <q-item-label caption>{{ notification.time }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import logoFac from '../images/logo fac.png';

const recentActivities = ref([
  {
    id: 1,
    title: 'Nuevo Diplomado',
    description: 'Se ha creado un nuevo diplomado en Ingeniería de Software',
    icon: 'workspace_premium',
    color: 'primary',
    time: 'Hace 2 horas'
  },
  {
    id: 2,
    title: 'Actualización de Maestría',
    description: 'Se actualizó el plan de estudios de la Maestría en Ciencias de la Computación',
    icon: 'psychology',
    color: 'secondary',
    time: 'Hace 4 horas'
  },
  {
    id: 3,
    title: 'Nueva Inscripción',
    description: 'Nuevo estudiante inscrito en el Doctorado en Ciencias de la Computación',
    icon: 'person_add',
    color: 'positive',
    time: 'Hace 1 día'
  }
]);

const notifications = ref([
  {
    id: 1,
    message: 'Reunión de coordinación programada',
    icon: 'event',
    color: 'primary',
    time: '10:00 AM'
  },
  {
    id: 2,
    message: 'Nuevo mensaje del director',
    icon: 'mail',
    color: 'secondary',
    time: 'Hace 30 min'
  },
  {
    id: 3,
    message: 'Actualización del sistema',
    icon: 'system_update',
    color: 'info',
    time: 'Hace 1 hora'
  }
]);
</script>

<style lang="scss">
.welcome-card {
  background: linear-gradient(135deg, #1976D2 0%, #64B5F6 100%);
  color: white;
}

.dashboard-card {
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-5px);
  }
}

.q-card {
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
