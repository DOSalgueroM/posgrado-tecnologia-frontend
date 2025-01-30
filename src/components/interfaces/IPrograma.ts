export enum TipoPrograma {
    DIPLOMADO = 'DIPLOMADO',
    MAESTRIA = 'MAESTRIA',
    DOCTORADO = 'DOCTORADO',
    ESPECIALIDAD = 'ESPECIALIDAD'
}

export enum Area {
    QUIMICAS = 'QUIMICAS',
    TECNICOS = 'TECNICOS',
    SISTEMAS = 'SISTEMAS',
}
export enum TipoPersona {
    TITULADO = 'titulado',
    EGRESADO = 'egresado',
    ESTUDIANTE = 'estudiante',
    NO_TITULADO = 'no_titulado'
}



  export enum Modalidad {
    PRESENCIAL = 'PRESENCIAL',
    VIRTUAL = 'VIRTUAL',
    SEMIPRESENCIAL = 'SEMIPRESENCIAL',
  }

export interface IPrograma {
    id?: number;
    nombre: string;
    descripcion: string;
    sigla: string;
    tipo: TipoPrograma;
    duracion_meses: string;
    modalidad: Modalidad;
    areas: Area[];
    imagen_url: string;
    gestion: number;
    fecha_inicio: Date;
    sede: string;
}