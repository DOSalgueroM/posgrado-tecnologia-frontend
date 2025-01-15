import axiosInstance from './axiosInstance';

const ENDPOINT = Object.freeze({
    RESOURCES: '/recintos',
    obtenerRecintos(idMunicipio: number) {
        return `/recintos/municipio/${idMunicipio}`;
    },

    obtener(){
        return this.RESOURCES
    }
});

const obtener = async () => {
    const response = await axiosInstance.get(ENDPOINT.obtener());
    return response.data;
}

const obtenerByIdMunicipio = async (idMunicipio: number) => {
    const response = await axiosInstance.get(ENDPOINT.obtenerRecintos(idMunicipio));
    return response.data;
};

export const RecintosService = {
    obtenerByIdMunicipio,
    obtener
};
