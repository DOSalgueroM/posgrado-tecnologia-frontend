
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

  export enum Modalidad {
    PRESENCIAL = 'PRESENCIAL',
    VIRTUAL = 'VIRTUAL',
    SEMIPRESENCIAL = 'SEMIPRESENCIAL',
  }

export interface Programa {
    id?: number;
    nombre: string;
    descripcion: string;
    tipo: TipoPrograma;
    duracion_meses: string;
    modalidad: Modalidad;
    area: Area;
    imagen_url: string;
    gestion: number;
    fecha_inicio: Date;
    sede: string,
    sigla: string
  }