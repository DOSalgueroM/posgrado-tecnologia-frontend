import axiosInstance from '../components/services/axiosInstance';

const BASE_URL = '/personas';

interface Persona {
    id: number;
    nombre: string;
    email: string;
    tipo: string;
    carrera: string;
}

const findByAreaAndTipo = async (area: string, tipo: string, nivelEstudio: string) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/area/${area}/tipo/${tipo}`, {
            params: { nivelEstudio }
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener personas:', error);
        throw error;
    }
};

export const PersonaService = {
    findByAreaAndTipo
};
