<template>
  <q-page :class="$q.dark.isActive ? 'bg-dark' : 'bg-grey-2'" padding>
    <div class="row justify-center">
      <div class="col-12 col-md-8 col-lg-6">
        <q-card :class="$q.dark.isActive ? 'bg-dark text-white' : ''" class="q-pa-md" flat bordered>
          <q-card-section>
            <div class="text-h6">{{ isEdit ? 'Editar Usuario' : 'Nuevo Usuario' }}</div>
          </q-card-section>

          <q-card-section>
            <q-form @submit="onSubmit" class="q-gutter-md">
              <q-input
                v-model="form.nombre_apellido"
                label="Nombre Completo"
                :rules="[val => !!val || 'El nombre completo es requerido']"
                outlined
                :dark="$q.dark.isActive"
              />

              <q-input
                v-model="form.username"
                label="Usuario"
                :rules="[val => !!val || 'El usuario es requerido']"
                outlined
                :dark="$q.dark.isActive"
              />

              <q-input
                v-model="form.password"
                label="Contraseña"
                :type="showPassword ? 'text' : 'password'"
                :rules="passwordRules"
                outlined
                :dark="$q.dark.isActive"
              >
                <template v-slot:append>
                  <q-icon
                    :name="showPassword ? 'visibility' : 'visibility_off'"
                    class="cursor-pointer"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </q-input>

              <q-input
                v-model="form.confirmPassword"
                label="Confirmar Contraseña"
                :type="showConfirmPassword ? 'text' : 'password'"
                :rules="[
                  val => !!val || 'La confirmación de contraseña es requerida',
                  val => val === form.password || 'Las contraseñas no coinciden'
                ]"
                outlined
                :dark="$q.dark.isActive"
              >
                <template v-slot:append>
                  <q-icon
                    :name="showConfirmPassword ? 'visibility' : 'visibility_off'"
                    class="cursor-pointer"
                    @click="showConfirmPassword = !showConfirmPassword"
                  />
                </template>
              </q-input>

              <q-select
                v-model="form.rol"
                :options="roles"
                label="Rol"
                :rules="[val => !!val || 'El rol es requerido']"
                outlined
                :dark="$q.dark.isActive"
              />

              <div class="row justify-end q-gutter-sm">
                <q-btn
                  label="Cancelar"
                  color="negative"
                  flat
                  @click="$router.push('/usuarios')"
                />
                <q-btn
                  type="submit"
                  label="Guardar"
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
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { UserService } from '../../components/services/user';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const router = useRouter();
const route = useRoute();

const isEdit = computed(() => !!route.params.id);
const loading = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const form = ref({
  nombre_apellido: '',
  username: '',
  password: '',
  confirmPassword: '',
  rol: null as string | null,
});

const roles = ['ADMIN', 'USUARIO'];

const passwordRules = [
  (val: string) => !!val || 'La contraseña es requerida',
  (val: string) => val.length >= 6 || 'La contraseña debe tener al menos 6 caracteres'
];

const onSubmit = async () => {
  loading.value = true;
  try {
    const userData = {
      nombre_apellido: form.value.nombre_apellido,
      username: form.value.username,
      password: form.value.password,
      rol: form.value.rol
    };

    await UserService.crearUsuario(userData);
    
    $q.notify({
      type: 'positive',
      message: 'Usuario creado exitosamente'
    });
    
    router.push('/usuarios');
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: 'Error al crear el usuario: ' + error.message
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
:deep(.q-field__control) {
  background: v-bind('$q.dark.isActive ? "rgba(255, 255, 255, 0.03)" : "white"') !important;
}

:deep(.q-field__label) {
  color: v-bind('$q.dark.isActive ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)"');
}
</style>
