export enum TipoPrograma {
    DIPLOMADO = 'DIPLOMADO',
    MAESTRIA = 'MAESTRIA',
    DOCTORADO = 'DOCTORADO',
    ESPECIALIDAD = 'ESPECIALIDAD'
}

export interface Programa {
    id: number;
    tipo: TipoPrograma;
    nombre: string;
    descripcion: string;
    duracion_meses: number;
    fecha_inicio: string;
}
