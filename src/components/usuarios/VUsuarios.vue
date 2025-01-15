<template>
    <q-layout view="lHh LpR lFf">
        <!-- Opcional: Header, si es necesario -->
        <q-header class="bg-primary text-white">
            <q-toolbar>
                <q-toolbar-title>Cómputo Elecciones Judiciales</q-toolbar-title>
                <q-space />
                <div class="q-gutter-sm items-center no-wrap" style="margin-right: 5px;">
                    <q-btn round dense flat icon="arrow_back" @click="back" />
                </div>
            </q-toolbar>
        </q-header>

        <!-- Contenido principal con QPage -->
        <q-page-container>
            <q-page class="flex flex-center bg-grey-2">
                <q-card class="login-card q-pa-lg">
                    <q-card-section class="text-center">
                        <div class="text-h5 text-weight-bold text-primary">
                            Cómputo Elecciones Judiciales
                        </div>
                        <div class="text-subtitle2 text-grey-7 q-mt-sm">
                            Creación de Usuarios
                        </div>
                    </q-card-section>

                    <q-card-section>
                        <q-form @submit.prevent="handleLogin" class="q-gutter-md">

                            <q-input v-model="nombre" label="Nombre" outlined dense clearable
                                :rules="[val => !!val || 'El nombre es requerido']">
                                <template v-slot:prepend>
                                    <q-icon name="person" />
                                </template>
                            </q-input>
                            <q-input v-model="username" label="Usuario" outlined dense clearable
                                :rules="[val => !!val || 'El usuario es requerido']">
                                <template v-slot:prepend>
                                    <q-icon name="person" />
                                </template>
                            </q-input>

                            <q-input v-model="password" label="Contraseña" type="password" outlined dense clearable
                                :rules="[val => !!val || 'La contraseña es requerida']">
                                <template v-slot:prepend>
                                    <q-icon name="lock" />
                                </template>
                            </q-input>
                            <q-input v-model="password2" label="Confirmar contraseña"
                                :type="isPwd ? 'password' : 'text'" outlined dense clearable
                                :rules="[val => !!val || 'La contraseña es requerida']">
                                <template v-slot:append>
                                    <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" @click="isPwd = !isPwd" />
                                </template>
                            </q-input>
                            <q-select v-model="selectedMunicipio" :options="municipios" label="Municipios" outlined
                                option-label="descripcion" option-value="id" @update:model-value="loadRecintos"
                                :rules="[val => !!val || 'El municipio es requerido']" use-input input-debounce="0"
                                @filter="filterMunicipios" fill-input hide-selected />

                            <q-select v-model="selectedRecinto" :options="recintos" label="Recintos" outlined
                                option-label="descripcion" option-value="id"
                                :rules="[val => !!val || 'El recinto es requerido']" use-input @filter="filterRecintos"
                                input-debounce="0" />
                            <q-select v-model="selectedRol" :options="roles" label="Roles" outlined />
                            <q-btn type="submit" label="Guardar" color="primary" class="full-width q-mt-md"
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
import { UserService } from '../services/user';
import { Notify } from 'quasar';
import { MunicipiosService } from '../services/municipio';
import { RecintosService } from '../services/recinto';
import { UserRecintoService } from '../services/user-recinto';
import { watch } from 'vue';

// Variables reactivas
const username = ref('');
const password = ref('');
const password2 = ref('');
const loading = ref(false);
const error = ref('');
const router = useRouter();
const nombre = ref('');
const isPwd = ref(true)
const selectedRol = ref('');
const roles = [
    'ADMINISTRADOR',
    'USUARIO_RECINTO',
    'TRANSCRIPTOR',
];
const selectedMunicipio = ref(null);
const selectedRecinto = ref<{ id: number; descripcion: string } | null>(null);
const allResponseMunicipios = ref([])
const allResponseRecintos = ref([])
const municipios = ref([]);
const recintos = ref([]);
const mesas = ref([]);

const arrayidRecintos = ref<number[]>([]);


const back = () => {
    router.push('/');
};

const filterMunicipios = (val: string, update: (callback: () => void) => void) => {
    update(() => {
        const needle = val.toLowerCase();
        municipios.value = allResponseMunicipios.value.filter(
            (municipio: any) => municipio.descripcion.toLowerCase().indexOf(needle) > -1
        );
    });
};
const filterRecintos = (val: string, update: (callback: () => void) => void) => {
    update(() => {
        const needle = val.toLowerCase();
        recintos.value = allResponseRecintos.value.filter(
            (recinto: any) => recinto.descripcion.toLowerCase().indexOf(needle) > -1
        );
    });
};


const loadMunicipios = async () => {
    try {
        const response = await MunicipiosService.obtenerMunicipios();
        municipios.value = response;
        allResponseMunicipios.value = response;
    } catch (error) {
        console.error('Error al cargar municipios:', error);
        Notify.create({
            type: 'negative',
            message: 'No se pudieron cargar los municipios',
        });
    }
};

watch(selectedRecinto, (newValue) => {
    if (newValue) {
        const idRecinto = newValue.id;
        arrayidRecintos.value.push(idRecinto);
        console.log(arrayidRecintos.value);
    }
});



const loadRecintos = async (municipioId: any) => {
    try {

        const id = municipioId.id;
        recintos.value = [];
        mesas.value = [];
        selectedRecinto.value = null;

        if (id) {
            const response = await RecintosService.obtenerByIdMunicipio(id);
            response.sort((a: any, b: any) => a.descripcion.localeCompare(b.descripcion));
            recintos.value = response;
            allResponseRecintos.value = response;
        }
    } catch (error) {
        console.error('Error al cargar recintos:', error);
        Notify.create({
            type: 'negative',
            message: 'No se pudieron cargar los recintos',
        });
    }
};

const handleLogin = async () => {
    loading.value = true;
    error.value = '';

    try {

        const data = {
            nombre_apellido: nombre.value,
            username: username.value,
            password: password.value,
            password_confirmation: password2.value,
            rol: selectedRol.value.valueOf(),
            recintos: arrayidRecintos.value,
        };

        const response = await UserService.crearUsuario(data);

        if (response) {
            Notify.create({
                message: 'Usuario creado correctamente',
                color: 'positive',
                position: 'top',
                timeout: 2000,
            });

        }
        limpiarData()

    } catch (err) {
        console.error('Error', err);
        error.value = 'No se pudo crear el usuario';
    } finally {
        loading.value = false;
    }
};

function limpiarData() {
    username.value = '';
    password.value = '';
    nombre.value = '';
    selectedRol.value = '';
    arrayidRecintos.value = [];
    selectedMunicipio.value = null;
}
onMounted(() => {
    loadMunicipios();
});

</script>

<style scoped>
.login-card {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    width: 20%;
}
</style>