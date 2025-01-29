import publicAxiosInstance from './publicAxiosInstance';

const BASE_URL = '/preinscripcion';

interface PreinscripcionDto {
    nombreCompleto: string;
    carrera: string;
    cu: string;
    celular: string;
    email: string;
    programaId: number;
}

export const PreinscripcionService = {
    async crear(data: PreinscripcionDto) {
        const response = await publicAxiosInstance.post(BASE_URL, data);
        return response.data;
    }
};
