<script setup lang="ts">
import { computed, onMounted } from 'vue';
import 'echarts'
import VueECharts from 'vue-echarts'
import { useDashboard } from '../composables/useDashboard'

const {
  listaVotosCandidatos,
  listaVotosMunicipioCandidato,
  //loadingListaVotosCandidatos,
  //loadingListaVotosMunicipioCandidato,
  //loadListaVotosCandidatos,
  //loadListaVotosMunicipiosCandidatos,
  refrescarDatos
} = useDashboard()

const arrayColor = ['#546bfa', '#3a9688', '#7cb342', '#f88c2b', '#f44336', '#1976d2', '#21BA45', '#31CCEC', '#F2C037']

function getRandomItem(array: string[]) {
  return array[Math.floor(Math.random() * array.length)]
}

onMounted(() => {
  //loadListaVotosCandidatos()
  //loadListaVotosMunicipiosCandidatos()
  refrescarDatos()
})

const optionsPieChart = computed(() => {
  // Calcula el total de votos
  const totalVotos = listaVotosCandidatos.value.reduce((sum, item) => sum + item.votos, 0);

  return {
    title: {
      text: 'Porcentaje de Votos por Candidato',
      left: 'center',
      top: 'top'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {d}%' // Muestra el nombre y el porcentaje en el tooltip
    },
    legend: {
      orient: 'horizontal',
      bottom: '0',
      left: 'center'
    },
    series: [
      {
        name: 'Votos',
        type: 'pie',
        radius: '50%',
        label: {
          show: true, // Muestra las etiquetas
          formatter: '{b}: {d}%' // Nombre del candidato y porcentaje
        },
        data: listaVotosCandidatos.value.filter(item => item.candidato.nombre !== 'Blancos' && item.candidato.nombre !== 'Nulos' && item.candidato.id === 4 || item.candidato.id === 5 || item.candidato.id === 6).map(item => ({
          value: ((item.votos / totalVotos) * 100).toFixed(2), // Calcula el porcentaje
          name: item.candidato.nombre,
          itemStyle: {
            color: item.candidato.color
          }
        })),


        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
});
const optionsPie2Chart = computed(() => {
  // Calcula el total de votos
  const totalVotos = listaVotosCandidatos.value.reduce((sum, item) => sum + item.votos, 0);

  return {
    title: {
      text: 'Porcentaje de Votos por Candidato',
      left: 'center',
      top: 'top'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {d}%' // Muestra el nombre y el porcentaje en el tooltip
    },
    legend: {
      orient: 'horizontal',
      bottom: '0',
      left: 'center'
    },
    series: [
      {
        name: 'Votos',
        type: 'pie',
        radius: '50%',
        label: {
          show: true, // Muestra las etiquetas
          formatter: '{b}: {d}%' // Nombre del candidato y porcentaje
        },
        data: listaVotosCandidatos.value.filter(item => item.candidato.nombre !== 'Blancos' && item.candidato.nombre !== 'Nulos' && item.candidato.id !== 4 && item.candidato.id !== 5 && item.candidato.id !== 6).map(item => ({
          value: ((item.votos / totalVotos) * 100).toFixed(2), // Calcula el porcentaje
          name: item.candidato.nombre,
          itemStyle: {
            color: item.candidato.color
          }
        })),


        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
});

const optionsBarChart = computed(() => {
  return {
    title: {
      text: 'Votos por Municipio y Candidato',
      left: 'center', // Centrar el título horizontalmente
      top: 'top' // Posicionar el título en la parte superior con un margen
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      top: '15%', // Mover la leyenda debajo del título
      left: 'center' // Centrar la leyenda horizontalmente
    },
    grid: {
      top: '30%', // Ajustar el grid para que no se superponga con la leyenda
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: listaVotosMunicipioCandidato.value[0]?.data.map(item => item.municipio.descripcion),
        axisLabel: {
          interval: 0, // Mostrar todas las etiquetas sin saltar
          rotate: 45, // Rotar las etiquetas 45 grados para evitar superposición
          formatter: (value: string) => {
            // Opcional: truncar las etiquetas si son demasiado largas
            return value.length > 20 ? value.slice(0, 20) + '...' : value
          }
        }
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: listaVotosMunicipioCandidato.value.map(item => ({
      name: item.candidato.nombre,
      type: 'bar',
      data: item.data.map(x => x.votos),
      color: item.candidato.color
    }))
  }
})


</script>

<template>
  <q-page padding>
    <div>
      <!--<q-spinner
                v-if="loadingListaVotosCandidatos"
                color="primary"
                size="3em"
            />-->
      <q-card>
        <q-card-section>
          <VueECharts :option="optionsPieChart" class="q-mt-md" :resizable="true" autoresize style="height: 400px;" />
        </q-card-section>
      </q-card>
    </div>
    <div>
      <!--<q-spinner
                v-if="loadingListaVotosCandidatos"
                color="primary"
                size="3em"
            />-->
      <q-card>
        <q-card-section>
          <VueECharts :option="optionsPie2Chart" class="q-mt-md" :resizable="true" autoresize style="height: 400px;" />
        </q-card-section>
      </q-card>
    </div>
    <div class="q-mt-md">
      <!--<q-spinner
                v-if="loadingListaVotosMunicipioCandidato"
                color="primary"
                size="3em"
            />-->
      <q-card>
        <q-card-section>
          <VueECharts :option="optionsBarChart" class="q-mt-md" :resizable="true" autoresize style="height: 400px;" />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>
