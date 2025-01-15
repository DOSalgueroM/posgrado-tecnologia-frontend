<template>
    <q-layout view="lHh LpR lFf">
        <!-- Opcional: Header, si es necesario -->
        <q-header class="bg-primary text-white">
            <q-toolbar>
                <q-toolbar-title>Cómputo Elecciones Judiciales</q-toolbar-title>
            </q-toolbar>
        </q-header>

        <!-- Contenido principal con QPage -->
        <q-page-container>
            <q-page class="flex flex-center bg-grey-2">
                <q-card class="login-card q-pa-lg" style="width: 400px">
                    <q-card-section class="text-center">
                        <div class="text-h5 text-weight-bold text-primary">
                            Cómputo Elecciones Judiciales
                        </div>
                        <div class="text-subtitle2 text-grey-7 q-mt-sm">
                            Sistema de Autenticación
                        </div>
                    </q-card-section>

                    <q-card-section>
                        <q-form @submit.prevent="handleLogin" class="q-gutter-md">
                            <q-input v-model="username" label="Usuario" outlined dense clearable
                                :rules="[val => !!val || 'El usuario es requerido']">
                                <template v-slot:prepend>
                                    <q-icon name="person" />
                                </template>
                            </q-input>

                            <!-- input corregido -->
                            <q-input v-model="password" label="Contraseña" :type="isPwd ? 'password' : 'text'" outlined
                                dense clearable :rules="[val => !!val || 'La contraseña es requerida']">
                                <template v-slot:append>
                                    <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" @click="isPwd = !isPwd" />
                                </template>
                            </q-input>

                            <q-btn type="submit" label="Iniciar Sesión" color="primary" class="full-width q-mt-md"
                                :loading="loading" />
                        </q-form>
                    </q-card-section>

                    <q-card-section v-if="error" class="text-center text-negative">
                        {{ error }}
                    </q-card-section>
                </q-card>
            </q-page>
        </q-page-container>
    </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { LoginService } from './services/login';

// Variables reactivas
const username = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');
const router = useRouter();
const isPwd = ref(true)


// Función de login
const handleLogin = async () => {
    loading.value = true;
    error.value = '';

    try {
        // Envía las credenciales al backend
        const authUser = await LoginService.obtenerCredenciales({
            username: username.value,
            password: password.value,
        });

        // Guarda el token y los datos del usuario
        localStorage.setItem('authToken', authUser.access_token);
        localStorage.setItem('authUser', JSON.stringify(authUser.usuario));

        // Redirige según el rol del usuario
        if (authUser.usuario.rol === 'ADMINISTRADOR') {
            router.push('/');
        } else if (authUser.usuario.rol === 'USUARIO_RECINTO') {
            router.push('/formulario');
        } else if (authUser.usuario.rol === 'TRANSCRIPTOR') {
            router.push('/');
        } else {
            error.value = 'Usuario o contraseña incorrectos';
        }
    } catch (err) {
        console.error('Error al iniciar sesión:', err);
        error.value = 'Usuario o contraseña incorrectos';
    } finally {
        loading.value = false;
    }
};



onMounted(() => {
    console.log('VLogin montado');
});
</script>

<style scoped>
.login-card {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
}
</style>