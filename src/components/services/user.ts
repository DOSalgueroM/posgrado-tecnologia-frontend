import axiosInstance from './axiosInstance';

const BASE_URL = '/usuarios';

const crearUsuario = async (data:any) => {
    try {
        const response = await axiosInstance.post(BASE_URL, data);
        return response.data;
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        throw error;
    }
}

export const UserService = {
    crearUsuario
};