import axiosInstance from './axiosInstance';

const ENDPOINT = Object.freeze({
    RESOURCES: 'mesas',
    obtenerMesas(idRecinto: number) {
        return `/mesas/recinto/${idRecinto}`;
    },
});

const obtenerByIdRecinto = async (idRecinto: number) => {
    const response = await axiosInstance.get(ENDPOINT.obtenerMesas(idRecinto));
    return response.data;
};

export const MesasService = {
    obtenerByIdRecinto,
};
