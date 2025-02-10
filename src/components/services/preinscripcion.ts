import axiosInstance from './axiosInstance';

const BASE_URL = '/preinscripcion';

interface PreinscripcionDto {
    nombreCompleto: string;
    carrera: string;
    cu: string;
    celular: string;
    email: string;
    programaId: number;
}

interface PreinscripcionResponse {
    id: number;
    nombreCompleto: string;
    carrera: string;
    cu: string;
    celular: string;
    email: string;
    programaId: number;
    programa: {
        id: number;
        nombre: string;
        tipo: string;
    };
    fechaRegistro: string;
    fechaActualizacion: string;
    fechaEliminacion: string;
    usuarioCreacion: string;
    usuarioActualizacion: string;
    usuarioEliminacion: string;
}

export const PreinscripcionService = {
    async crear(data: PreinscripcionDto) {
        const response = await axiosInstance.post(BASE_URL, data);
        return response.data;
    },

    async actualizar(id: number, data: Partial<PreinscripcionDto>) {
        const response = await axiosInstance.patch(`${BASE_URL}/${id}`, data);
        return response.data;
    },

    async getPreinscripcionesByPrograma(programaId: number): Promise<PreinscripcionResponse[]> {
        const response = await axiosInstance.get(`${BASE_URL}?programa_id=${programaId}`);
        return response.data;
    },

    async eliminar(id: number): Promise<void> {
        await axiosInstance.delete(`${BASE_URL}/${id}`);
    }
};
