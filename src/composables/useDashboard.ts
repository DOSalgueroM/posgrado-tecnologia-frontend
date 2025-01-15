import { ref } from 'vue'
import io from 'socket.io-client';
//import apiClient from '../components/services/axiosInstance';
import type { VotosPorCandidatoEntity, VotosPoCandidatoYMunicipioEntity } from 'src/interfaces/dashboard.entity';

const listaVotosCandidatos = ref<VotosPorCandidatoEntity[]>([])
const listaVotosMunicipioCandidato = ref<VotosPoCandidatoYMunicipioEntity[]>([])
//const loadingListaVotosCandidatos = ref<boolean>(false)
//const loadingListaVotosMunicipioCandidato = ref<boolean>(false)
//const API_RESOURCE = '/dashboard'

export function useDashboard() {
  /*async function loadListaVotosCandidatos() {
    loadingListaVotosCandidatos.value = true
    try {
      const { data } = await apiClient.get(`${API_RESOURCE}/votos_por_candidatos`)
      listaVotosCandidatos.value = data
    } finally {
        loadingListaVotosCandidatos.value = false
    }
  }

  async function loadListaVotosMunicipiosCandidatos() {
    loadingListaVotosMunicipioCandidato.value = true
    try {
      const { data } = await apiClient.get(`${API_RESOURCE}/votos_por_municipios_y_candidatos`)
      //console.log(data)
      listaVotosMunicipioCandidato.value = data
    } finally {
        loadingListaVotosMunicipioCandidato.value = false
    }
  }*/

  function refrescarDatos() {
    const socket = io(import.meta.env.VITE_SOCKET_URL);

    socket.on('connect', () => {
      console.log('Conectado al servidor de sockets');
    });

    socket.on('actualizar_votos_por_candidatos', (data) => {
      listaVotosCandidatos.value = data;
      console.log(data);
    });

    socket.on('actualizar_votos_por_municipios_y_candidatos', (data) => {
      listaVotosMunicipioCandidato.value = data;

    });
}

  return {
    // Propiedades
    listaVotosCandidatos,
    listaVotosMunicipioCandidato,
    //loadingListaVotosCandidatos,
    //loadingListaVotosMunicipioCandidato,

    // Metodos
    //loadListaVotosCandidatos,
    //loadListaVotosMunicipiosCandidatos,
    refrescarDatos
  }
}
