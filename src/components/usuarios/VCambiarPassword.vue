<template>
  <q-dialog v-model="dialogVisible" persistent>
    <q-card style="min-width: 350px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Cambiar Contraseña</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            v-model="form.password_actual"
            filled
            :type="showCurrentPassword ? 'text' : 'password'"
            label="Contraseña Actual"
            :rules="[val => val && val.length > 0 || 'La contraseña actual es requerida']"
          >
            <template v-slot:append>
              <q-icon
                :name="showCurrentPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showCurrentPassword = !showCurrentPassword"
              />
            </template>
          </q-input>

          <q-input
            v-model="form.nuevo_password"
            filled
            :type="showNewPassword ? 'text' : 'password'"
            label="Nueva Contraseña"
            :rules="[
              val => val && val.length > 0 || 'La nueva contraseña es requerida',
              val => val && val.length >= 6 || 'La contraseña debe tener al menos 6 caracteres'
            ]"
          >
            <template v-slot:append>
              <q-icon
                :name="showNewPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showNewPassword = !showNewPassword"
              />
            </template>
          </q-input>

          <q-input
            v-model="form.confirmacion_password"
            filled
            :type="showConfirmPassword ? 'text' : 'password'"
            label="Confirmar Nueva Contraseña"
            :rules="[
              val => val && val.length > 0 || 'Debe confirmar la nueva contraseña',
              val => val === form.nuevo_password || 'Las contraseñas no coinciden'
            ]"
          >
            <template v-slot:append>
              <q-icon
                :name="showConfirmPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showConfirmPassword = !showConfirmPassword"
              />
            </template>
          </q-input>

          <div class="row justify-end q-mt-md">
            <q-btn label="Cancelar" color="grey-7" flat v-close-popup class="q-mr-sm" />
            <q-btn label="Cambiar Contraseña" type="submit" color="primary" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useQuasar } from 'quasar';
import { usuarioService } from '../services/usuario.service';

const $q = useQuasar();
const dialogVisible = ref(false);
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

const form = reactive({
  password_actual: '',
  nuevo_password: '',
  confirmacion_password: ''
});

const onSubmit = async () => {
  try {
    // Obtener el ID del usuario del localStorage
    const authUserStr = localStorage.getItem('authUser');
    if (!authUserStr) {
      throw new Error('No se encontró información del usuario');
    }
    const authUser = JSON.parse(authUserStr);
    const userId = authUser.id;

    await usuarioService.updatePassword(userId, form);

    $q.notify({
      type: 'positive',
      message: 'Contraseña actualizada exitosamente'
    });

    dialogVisible.value = false;
    form.password_actual = '';
    form.nuevo_password = '';
    form.confirmacion_password = '';
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Error al cambiar la contraseña'
    });
  }
};

const open = () => {
  dialogVisible.value = true;
};

defineExpose({
  open
});
</script>
