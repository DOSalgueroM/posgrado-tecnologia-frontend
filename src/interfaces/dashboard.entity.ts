export interface VotosPorCandidatoEntity {
    candidato: {
        id: number
        nombre: string
        color: string
    }
    votos: number
}

interface VotosPorMunicipioEntity {
    municipio: {
      id: number
      descripcion: string
    }
    votos: number
}
  
export interface VotosPoCandidatoYMunicipioEntity {
    candidato: {
        id: number
        nombre: string
        color: string
    }
    data: VotosPorMunicipioEntity[]
}