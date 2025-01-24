import axiosInstance from './axiosInstance';

const BASE_URL = '/usuarios'; // Quitamos el /api porque axiosInstance ya lo incluye

interface UpdatePasswordDto {
    password_actual: string;
    nuevo_password: string;
    confirmacion_password: string;
}

const updatePassword = async (id: number, data: UpdatePasswordDto) => {
    try {
        const response = await axiosInstance.patch(`${BASE_URL}/${id}/password`, data);
        return response.data;
    } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        throw error;
    }
};

export const usuarioService = {
    updatePassword,
};
