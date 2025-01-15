<template>
    <q-layout view="lHh LpR lFf">
        <!-- Opcional: Header, si es necesario -->
        <q-header class="bg-primary text-white">
            <q-toolbar>
                <q-toolbar-title>Facultad de Ciencias y Tecnología</q-toolbar-title>
            </q-toolbar>
        </q-header>

        <!-- Contenido principal con QPage -->
        <q-page-container>
            <q-page class="login-page flex flex-center">
                <q-card class="login-card q-pa-lg" style="width: 400px">
                    <q-card-section class="text-center">
                        <q-avatar size="100px" class="q-mb-md">
                            <q-img src="../../images/logo.png" />
                        </q-avatar>
                        <div class="text-h5 text-weight-bold text-primary">
                            Programas de Posgrado
                        </div>
                        <div class="text-subtitle2 text-grey-7 q-mt-sm">
                            Sistema de Autenticación
                        </div>
                    </q-card-section>

                    <q-card-section>
                        <q-form @submit.prevent="handleLogin" class="q-gutter-md">
                            <q-input 
                                v-model="username" 
                                label="Usuario" 
                                outlined 
                                dense 
                                class="input-field"
                                :rules="[val => !!val || 'El usuario es requerido']"
                            >
                                <template v-slot:prepend>
                                    <q-icon name="person" color="primary"/>
                                </template>
                            </q-input>

                            <q-input 
                                v-model="password" 
                                label="Contraseña" 
                                :type="isPwd ? 'password' : 'text'" 
                                outlined
                                dense 
                                class="input-field"
                                :rules="[val => !!val || 'La contraseña es requerida']"
                            >
                                <template v-slot:prepend>
                                    <q-icon name="lock" color="primary"/>
                                </template>
                                <template v-slot:append>
                                    <q-icon 
                                        :name="isPwd ? 'visibility_off' : 'visibility'" 
                                        class="cursor-pointer"
                                        color="grey-7"
                                        @click="isPwd = !isPwd" 
                                    />
                                </template>
                            </q-input>

                            <q-btn 
                                type="submit" 
                                label="Iniciar Sesión" 
                                color="primary" 
                                class="full-width q-mt-lg login-btn"
                                :loading="loading" 
                            >
                                <template v-slot:loading>
                                    <q-spinner-facebook />
                                </template>
                            </q-btn>
                        </q-form>
                    </q-card-section>

                    <q-card-section v-if="error" class="text-center">
                        <q-banner class="bg-red-1 text-red q-pa-sm" rounded>
                            <template v-slot:avatar>
                                <q-icon name="error" color="red"/>
                            </template>
                            {{ error }}
                        </q-banner>
                    </q-card-section>
                </q-card>
            </q-page>
        </q-page-container>
    </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { LoginService } from '../services/login';

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
        const authUser = await LoginService.obtenerCredenciales({
            username: username.value,
            password: password.value,
        });

        localStorage.setItem('authToken', authUser.access_token);
        localStorage.setItem('authUser', JSON.stringify(authUser.usuario));

        if (authUser.usuario.rol === 'ADMIN') {
            router.push('/');
        // } else if (authUser.usuario.rol === 'USUARIO_RECINTO') {
        //     router.push('/formulario');
        // } else if (authUser.usuario.rol === 'TRANSCRIPTOR') {
        //     router.push('/');
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
.login-page {
    background: url('../../images/facultad.jpg') center center / cover no-repeat fixed;
    min-height: 100vh;
    position: relative;
}

.login-page::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(25, 118, 210, 0.7) 0%, rgba(13, 71, 161, 0.65) 100%);
    backdrop-filter: blur(2px);
}

.login-card {
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    border-radius: 16px;
    backdrop-filter: blur(10px);
    position: relative;
    z-index: 1;
}

.input-field {
    transition: all 0.3s ease;
}

.input-field:focus-within {
    transform: scale(1.02);
}

.login-btn {
    border-radius: 8px;
    height: 45px;
    font-weight: bold;
    letter-spacing: 1px;
    transition: all 0.3s ease;
}

.login-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Animaciones */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.login-card {
    animation: fadeIn 0.6s ease-out;
}
</style>