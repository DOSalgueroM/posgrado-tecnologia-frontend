import axios from 'axios';
import type ILogin from "../interfaces/ILogin";

const BASE_URL = import.meta.env.VITE_API_URL;

const ENDPOINT = {
    obtenerCredenciales: () => `${BASE_URL}/auth/login`
};

const obtenerCredenciales = async (data: ILogin) => {
    try {
        const response = await axios.post(ENDPOINT.obtenerCredenciales(), data);
        console.log('Respuesta del servidor:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error en el servicio de login:', error);
        throw error;
    }
};

export const LoginService = {
    obtenerCredenciales
};
