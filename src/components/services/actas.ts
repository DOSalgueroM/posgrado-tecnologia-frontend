import axiosInstance from './axiosInstance';

const BASE_URL = '/actas';
const obtenerActas = async () => {
    const response = await axiosInstance.get('/actas', {params:{limit: 50, orderBy: 'id', sortOrder:'DESC'}});
    return response.data;
};

const obtener = async (params:any) => {
    const response = await axiosInstance.get('/actas', {params});
    return response.data;
};

const crearActa = async (formData: FormData) => {
    try {
        const response = await axiosInstance.post(BASE_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error al crear el acta:', error);
        throw error;
    }
};

const obtenerActaById = async (id: number) => {
    const response = await axiosInstance.get(`${BASE_URL}/${id}`);
    return response.data;
}

const actualizarActa = async (id: number, formData: FormData) => {
    try {
        const response = await axiosInstance.put(`${BASE_URL}/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error al actualizar el acta:', error);
        throw error;
    }
}

const obtenerActasRegistradas = async () => {
    const response = await axiosInstance.get(`${BASE_URL}/registradas`);
    return response.data;
}

const eliminarActa = async (id: number) => {
    try {
        const response = await axiosInstance.delete(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar el acta:', error);
        throw error;
    }
};


export const ActasService = {
    obtenerActas,
    crearActa,
    obtenerActaById,
    actualizarActa,
    obtenerActasRegistradas,
    eliminarActa,
    obtener
};
