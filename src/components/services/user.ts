import axiosInstance from './axiosInstance';

const BASE_URL = '/usuarios';

interface PaginationDto {

    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}

interface FilterUsuariosDto {
    searchText?: string;
}

interface UpdatePasswordDto {
    oldPassword: string;
    newPassword: string;
}

const crearUsuario = async (data: any) => {
    try {
        const response = await axiosInstance.post(BASE_URL, data);
        return response.data;
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        throw error;
    }
};

const obtenerUsuariosPaginados = async (paginationDto: PaginationDto, filterDto: FilterUsuariosDto) => {
    try {
        const params = { ...paginationDto, ...filterDto };
        const response = await axiosInstance.get(BASE_URL, { params });
        return response.data;
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        throw error;
    }
};

const obtenerUsuarioPorId = async (id: number) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        throw error;
    }
};

const actualizarUsuario = async (id: number, data: any) => {
    try {
        const response = await axiosInstance.patch(`${BASE_URL}/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        throw error;
    }
};

const eliminarUsuario = async (id: number) => {
    try {
        const response = await axiosInstance.delete(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        throw error;
    }
};

const actualizarPassword = async (id: number, data: UpdatePasswordDto) => {
    try {
        const response = await axiosInstance.patch(`${BASE_URL}/${id}/password`, data);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar la contraseña:', error);
        throw error;
    }
};

export const UserService = {
    crearUsuario,
    obtenerUsuariosPaginados,
    obtenerUsuarioPorId,
    actualizarUsuario,
    eliminarUsuario,
    actualizarPassword
};