import axios from 'axios';
import type ILogin from "../interfaces/ILogin";


const BASE_URL = import.meta.env.VITE_API_URL;

const ENDPOINT = Object.freeze({
    RESOURCES: '/auth',
    obtenerCredenciales() {
        return `${BASE_URL}/auth/login/`;
    }
    
});

const obtenerCredenciales = async (data:ILogin) => {
    const response = await axios.post(ENDPOINT.obtenerCredenciales(), data);
    console.log(response.data);
    return response.data;
}

export const LoginService = {
    obtenerCredenciales
}
