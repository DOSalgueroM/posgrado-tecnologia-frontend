<template>
    <q-layout>
        <q-header elevated>
            <q-toolbar>
                <q-toolbar-title class="items-center">Llenado Formulario</q-toolbar-title>
                <q-space />
                <div class="q-gutter-sm items-center no-wrap" style="margin-right: 5px;">
                    <q-btn v-if="admin" round dense flat icon="arrow_back" @click="back" />
                </div>
                <div class="q-gutter-sm items-center no-wrap">
                    <q-btn round dense flat icon="logout" @click="logout" />
                </div>
            </q-toolbar>
        </q-header>
        <q-page-container>
            <q-page class="bg-grey-2 q-px-md q-py-lg">
                <q-card class="q-pa-md q-mb-lg">
                    <q-form>
                        <div class="row q-gutter-md">
                            <div class="row2">
                                <!-- <q-col cols="12" sm="6" md="4"> -->
                                <q-select v-if="desactivarMunicipio" v-model="selectedMunicipio" :options="municipios"
                                    label="Municipios" outlined option-label="descripcion" option-value="id"
                                    @update:model-value="loadRecintos"
                                    :rules="[val => !!val || 'El municipio es requerido']" use-input input-debounce="0"
                                    @filter="filterMunicipios" fill-input hide-selected />

                                <q-select v-model="selectedRecinto" :options="recintos" label="Recintos" outlined
                                    option-label="descripcion" option-value="id" @update:model-value="loadMesas"
                                    :rules="[val => !!val || 'El recinto es requerido']" use-input
                                    @filter="filterRecintos" input-debounce="0" />



                                <q-select v-model="selectedMesa" :options="mesas" label="Mesas" outlined emit-value
                                    map-options option-label="nro_mesa" option-value="id" :disable="!selectedRecinto"
                                    :rules="[val => !!val || 'La mesa es requerida']" />


                                <q-radio v-model="observado" :val="true" label="Tiene observación" />
                            </div>

                            <!-- Campo para Subir Archivo -->
                            <q-uploader label="Adjuntar Archivo" outlined dense class="col-12 col-md-4" ref="uploader"
                                @added="(file) => handleFileUpload(file[0])" :hide-upload-button="true">
                            </q-uploader>

                        </div>
                    </q-form>
                </q-card>

                <div class="cards row q-gutter-md">
                    <!-- Card Mujeres -->
                    <q-card class="q-pa-md col-12 col-lg-5">
                        <q-card-section>
                            <div class="text-h5 text-weight-medium">Mujeres</div>
                        </q-card-section>

                        <q-card-section>
                            <div class="q-gutter-md candidato-container">
                                <div class="candidato">
                                    <span class="candidato-label">Patricia Bohorquez:</span>
                                    <q-input v-model="mujeres.candidato1" label="Candidato 1" outlined dense
                                        class="candidato-input"></q-input>
                                </div>
                                <div class="candidato">
                                    <span class="candidato-label">Janethe Castro:</span>
                                    <q-input v-model="mujeres.candidato2" label="Candidato 2" outlined dense
                                        class="candidato-input"></q-input>
                                </div>
                                <div class="candidato">
                                    <span class="candidato-label">Lilian Paredes:</span>
                                    <q-input v-model="mujeres.candidato3" label="Candidato 3" outlined dense
                                        class="candidato-input"></q-input>
                                </div>
                                <div class="candidato">
                                    <span class="candidato-label">Blancos:</span>
                                    <q-input v-model="mujeres.blancos" label="Blancos" outlined dense
                                        class="candidato-input"></q-input>
                                </div>
                                <div class="candidato">
                                    <span class="candidato-label">Nulos:</span>
                                    <q-input v-model="mujeres.nulos" label="Nulos" outlined dense
                                        class="candidato-input"></q-input>
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>

                    <!-- Card Hombres -->
                    <q-card class="q-pa-md col-12 col-lg-5">
                        <q-card-section>
                            <div class="text-h5 text-weight-medium">Hombres</div>
                        </q-card-section>

                        <q-card-section>
                            <div class="q-gutter-md candidato-container">
                                <div class="candidato">
                                    <span class="candidato-label">Favio Chacolla:</span>
                                    <q-input v-model="hombres.candidato1" label="Candidato 1" outlined dense
                                        class="candidato-input"></q-input>
                                </div>
                                <div class="candidato">
                                    <span class="candidato-label">Carlos Ortega:</span>
                                    <q-input v-model="hombres.candidato2" label="Candidato 2" outlined dense
                                        class="candidato-input"></q-input>
                                </div>
                                <div class="candidato">
                                    <span class="candidato-label">Humberto Ortega:</span>
                                    <q-input v-model="hombres.candidato3" label="Candidato 3" outlined dense
                                        class="candidato-input"></q-input>
                                </div>
                                <div class="candidato">
                                    <span class="candidato-label">Blancos:</span>
                                    <q-input v-model="hombres.blancos" label="Blancos" outlined dense
                                        class="candidato-input"></q-input>
                                </div>
                                <div class="candidato">
                                    <span class="candidato-label">Nulos:</span>
                                    <q-input v-model="hombres.nulos" label="Nulos" outlined dense
                                        class="candidato-input"></q-input>
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>
                </div>

                <!-- Botón Guardar -->
                <div class="button-container">
                    <q-btn label="Guardar Acta" color="primary" style="width: 250px; margin-right: 20px;"
                        @click="guardarActa" />
                </div>
            </q-page>
        </q-page-container>
    </q-layout>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Notify } from 'quasar';
import { RecintosService } from './services/recinto';
import { MesasService } from './services/mesa';
import { MunicipiosService } from './services/municipio';
import { ActasService } from './services/actas';



const archivoSubido = ref<File | null>(null);
const router = useRouter();
const observado = ref(false);
import { QUploader } from 'quasar';
import { watch } from 'vue';

const uploader = ref<QUploader | null>(null);
const municipios = ref([]);
const recintos = ref([]);
const mesas = ref([]);

const selectedMunicipio = ref(null);
const selectedRecinto = ref(null);
interface Mesa {
    id: number;
    nro_mesa: number;
}

const selectedMesa = ref<Mesa | null>(null);
const formData = ref(new FormData());
const isLoading = ref(false);
const admin = ref(false);
const idActa = ref();
const desactivarMunicipio = ref(true);
const allResponseMunicipios = ref([])
const allResponseRecintos = ref([])


const mujeres = ref({
    candidato1: '',
    candidato2: '',
    candidato3: '',
    blancos: '',
    nulos: ''
});

const hombres = ref({
    candidato1: '',
    candidato2: '',
    candidato3: '',
    blancos: '',
    nulos: ''
});

const handleFileUpload = (file: File) => {
    archivoSubido.value = file;

    //formData.value.append('imagen', file);
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
const back = () => {
    router.push('/');
};


const loadRecintos = async (municipioId: any) => {
    try {

        const id = municipioId.id;
        recintos.value = [];
        mesas.value = [];
        selectedRecinto.value = null;
        selectedMesa.value = null;

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


const loadMesas = async (recintoId: any) => {
    try {
        const id = recintoId.id;
        console.log(recintoId)
        mesas.value = [];
        selectedMesa.value = null;

        if (id) {
            const response = await MesasService.obtenerByIdRecinto(id);

            mesas.value = response.sort((a: any, b: any) => a.nro_mesa - b.nro_mesa);
        }
    } catch (error) {
        console.error('Error al cargar mesas:', error);
        Notify.create({
            type: 'negative',
            message: 'No se pudieron cargar las mesas',
        });
    }
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

watch(selectedMesa, (newValue) => {
    if (newValue) {
        console.log(newValue)
    }
});

const datos = () => {
    if (selectedMesa.value === null || mujeres.value.candidato1 === '' || mujeres.value.candidato2 === '' || mujeres.value.candidato3 === '' || mujeres.value.blancos === '' || mujeres.value.nulos === '' || hombres.value.candidato1 === '' || hombres.value.candidato2 === '' || hombres.value.candidato3 === '' || hombres.value.blancos === '' || hombres.value.nulos === '') {
        formData.value.append('estado', 'PENDIENTE');
    }
    else {
        formData.value.append('estado', 'REGISTRADO');
    }

    formData.value.append('imagen', archivoSubido.value || '');

    const votosHombres = [
        parseInt(hombres.value.candidato1) || 0,
        parseInt(hombres.value.candidato2) || 0,
        parseInt(hombres.value.candidato3) || 0,
    ].reduce((sum, val) => sum + val, 0);

    const votosMujeres = [
        parseInt(mujeres.value.candidato1) || 0,
        parseInt(mujeres.value.candidato2) || 0,
        parseInt(mujeres.value.candidato3) || 0,
    ].reduce((sum, val) => sum + val, 0);



    if (votosMujeres > 0) {
        formData.value.append('validos_m', String(votosMujeres));
    }

    if (mujeres.value.blancos) {
        formData.value.append('blancos_m', String(mujeres.value.blancos));
    }

    if (mujeres.value.nulos) {
        formData.value.append('nulos_m', String(mujeres.value.nulos));
    }

    if (votosHombres > 0) {
        formData.value.append('validos_h', String(votosHombres));
    }

    if (hombres.value.blancos) {
        formData.value.append('blancos_h', String(hombres.value.blancos));
    }

    if (hombres.value.nulos) {
        formData.value.append('nulos_h', String(hombres.value.nulos));
    }

    formData.value.append('observado', observado.value ? 'true' : 'false');

    const votos = [
        { id_candidato: 1, votos: parseInt(mujeres.value.candidato1) || 0 },
        { id_candidato: 2, votos: parseInt(mujeres.value.candidato2) || 0 },
        { id_candidato: 3, votos: parseInt(mujeres.value.candidato3) || 0 },
        { id_candidato: 4, votos: parseInt(hombres.value.candidato1) || 0 },
        { id_candidato: 5, votos: parseInt(hombres.value.candidato2) || 0 },
        { id_candidato: 6, votos: parseInt(hombres.value.candidato3) || 0 },
    ];

    votos.forEach((voto, index) => {
        if (voto.votos > 0) {

            formData.value.append(`votos[${index}][id_candidato]`, String(voto.id_candidato));
            formData.value.append(`votos[${index}][votos]`, String(voto.votos));

        }
    });

};

const validacionRol = () => {
    const usuario = JSON.parse(localStorage.getItem('authUser') || '{}');
    if (usuario.rol === 'ADMINISTRADOR') {
        router.push('/');
    }
};

const validacionUsuario = () => {
    const usuario = JSON.parse(localStorage.getItem('authUser') || '{}');
    if (usuario.rol === 'USUARIO_RECINTO' && archivoSubido.value === null) {
        return false;
    }
    return true;
};

const guardarActa = async () => {
    try {
        isLoading.value = true;


        const formData = new FormData();
        if (selectedMesa.value === null || mujeres.value.candidato1 === '' || mujeres.value.candidato2 === '' || mujeres.value.candidato3 === '' || mujeres.value.blancos === '' || mujeres.value.nulos === '' || hombres.value.candidato1 === '' || hombres.value.candidato2 === '' || hombres.value.candidato3 === '' || hombres.value.blancos === '' || hombres.value.nulos === '') {
            formData.append('estado', 'PENDIENTE');
        }
        else {
            formData.append('estado', 'REGISTRADO');
        }
        if (selectedMesa.value) {
            if (idActa.value) {
                formData.append('id_mesa', String(selectedMesa.value.id));
            } else {
                formData.append('id_mesa', String(selectedMesa.value));
            }

        }

        const votosHombres = [
            parseInt(hombres.value.candidato1) || 0,
            parseInt(hombres.value.candidato2) || 0,
            parseInt(hombres.value.candidato3) || 0,
        ].reduce((sum, val) => sum + val, 0);

        const votosMujeres = [
            parseInt(mujeres.value.candidato1) || 0,
            parseInt(mujeres.value.candidato2) || 0,
            parseInt(mujeres.value.candidato3) || 0,
        ].reduce((sum, val) => sum + val, 0);

        if (votosMujeres > 0) {
            formData.append('validos_m', String(votosMujeres));
        }

        if (mujeres.value.blancos) {
            formData.append('blancos_m', String(mujeres.value.blancos));
        }

        if (mujeres.value.nulos) {
            formData.append('nulos_m', String(mujeres.value.nulos));
        }

        if (votosHombres > 0) {
            formData.append('validos_h', String(votosHombres));
        }

        if (hombres.value.blancos) {
            formData.append('blancos_h', String(hombres.value.blancos));
        }

        if (hombres.value.nulos) {
            formData.append('nulos_h', String(hombres.value.nulos));
        }
        formData.append('observado', observado.value ? 'true' : 'false');


        const votos = [
            { id_candidato: 1, votos: parseInt(mujeres.value.candidato1) || 0 },
            { id_candidato: 2, votos: parseInt(mujeres.value.candidato2) || 0 },
            { id_candidato: 3, votos: parseInt(mujeres.value.candidato3) || 0 },
            { id_candidato: 4, votos: parseInt(hombres.value.candidato1) || 0 },
            { id_candidato: 5, votos: parseInt(hombres.value.candidato2) || 0 },
            { id_candidato: 6, votos: parseInt(hombres.value.candidato3) || 0 },
        ];
        votos.forEach((voto, index) => {
            formData.append(`votos[${index}][id_candidato]`, String(voto.id_candidato));
            formData.append(`votos[${index}][votos]`, String(voto.votos));
        });


        if (archivoSubido.value) {
            formData.append('imagen', archivoSubido.value);
        }


        if (idActa.value) {
            // Modo edición: realizar actualizació
            await ActasService.actualizarActa(idActa.value, formData);
            Notify.create({
                type: 'positive',
                message: 'Acta actualizada con éxito',
            });
            validacionRol();
        } else {

            await ActasService.crearActa(formData);
            Notify.create({
                type: 'positive',
                message: 'Acta creada con éxito',
            });
            limpiarData();
            validacionRol();
        }
        router.push('/');
    } catch (error) {
        console.error('Error al guardar acta:', error);
        Notify.create({
            type: 'negative',
            message: 'Error al guardar el acta',
        });
    } finally {
        isLoading.value = false;
    }
};



const logout = () => {

    localStorage.removeItem('authUser');
    localStorage.removeItem('authToken');
    router.push('/login');
};

interface IRecintos {
    id: number;
    descripcion: string;
}

onMounted(async () => {
    const usuario = JSON.parse(localStorage.getItem('authUser') || '{}');
    if (usuario.rol !== 'USUARIO_RECINTO') {
        admin.value = true;
    }
    try {
        const route = useRoute();
        const id = Number(route.query.id);

        if (!isNaN(id)) {
            console.log(id)
            idActa.value = id;
            const acta = await ActasService.obtenerActaById(id);
            if (acta) {
                selectedMunicipio.value = acta.mesa.recinto.municipio
                if (selectedMunicipio.value !== null) {
                    await loadRecintos(selectedMunicipio.value);
                }

                selectedRecinto.value = acta.mesa.recinto;
                if (selectedRecinto.value !== null) {
                    await loadMesas(selectedRecinto.value);
                }

                selectedMesa.value = acta.mesa;
                console.log(selectedMesa.value)
                mujeres.value.candidato1 = acta.votos.find((v: { id_candidato: number; }) => v.id_candidato === 1)?.votos || 0;
                mujeres.value.candidato2 = acta.votos.find((v: { id_candidato: number; }) => v.id_candidato === 2)?.votos || 0;
                mujeres.value.candidato3 = acta.votos.find((v: { id_candidato: number; }) => v.id_candidato === 3)?.votos || 0;
                mujeres.value.blancos = acta.blancos_m;
                mujeres.value.nulos = acta.nulos_m;

                hombres.value.candidato1 = acta.votos.find((v: { id_candidato: number; }) => v.id_candidato === 4)?.votos || 0;
                hombres.value.candidato2 = acta.votos.find((v: { id_candidato: number; }) => v.id_candidato === 5)?.votos || 0;
                hombres.value.candidato3 = acta.votos.find((v: { id_candidato: number; }) => v.id_candidato === 6)?.votos || 0;
                hombres.value.blancos = acta.blancos_h;
                hombres.value.nulos = acta.nulos_h;
                console.log(acta.observado)
                observado.value = !!acta.observado;

                if (acta.imagen) {
                    archivoSubido.value = { name: acta.imagen } as File;
                }
            }
        } else if (usuario.usuarios_recintos.length > 0 && usuario.rol !== 'ADMINISTRADOR') {
            desactivarMunicipio.value = false;

            const recintosNuevos = usuario.usuarios_recintos.map((recinto: any) => {
                return {
                    id: recinto.recinto.id,
                    descripcion: recinto.recinto.descripcion,
                };
            });
            recintos.value = recintosNuevos;
            allResponseRecintos.value = recintosNuevos;


        }
    } catch (error) {
        console.error('Error al cargar la acta:', error);
        Notify.create({
            type: 'negative',
            message: 'Error al cargar los datos de la acta',
        });
    }

    loadMunicipios();
});


function limpiarData() {
    selectedMunicipio.value = null;
    selectedRecinto.value = null;
    selectedMesa.value = null;
    mujeres.value.candidato1 = '';
    mujeres.value.candidato2 = '';
    mujeres.value.candidato3 = '';
    mujeres.value.blancos = '';
    mujeres.value.nulos = '';
    hombres.value.candidato1 = '';
    hombres.value.candidato2 = '';
    hombres.value.candidato3 = '';
    hombres.value.blancos = '';
    hombres.value.nulos = '';
    observado.value = false;
    archivoSubido.value = null;
    formData.value = new FormData();
    if (uploader.value) {
        uploader.value.reset();
    }
}

onUnmounted(() => {
    limpiarData();
});

</script>

<style scoped>
.row {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
}

.row2 {
    display: flex;
    align-items: center;
    flex: 2;
    flex-wrap: wrap;

}

.cards {
    display: flex;
    gap: 16px;
}

.q-card {
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.q-select {
    width: 13%;
    margin: 0.3%;
}

.candidato-container {
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.candidato {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    flex-wrap: wrap;
}

.candidato-label {
    flex: 1;
    text-align: right;
    font-weight: bold;
    margin-right: 8px;
}

.candidato-input {
    flex: 2;
}

.button-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
}

@media (max-width: 768px) {
    .cards {
        flex-direction: column;
    }
}

@media (max-width: 768px) {
    .q-select {
        width: 85% !important;
    }
}
</style>
