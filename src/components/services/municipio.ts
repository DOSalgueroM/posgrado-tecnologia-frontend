import axiosInstance from './axiosInstance';

const ENDPOINT = Object.freeze({
    RESOURCES: 'municipios',
    obtenerMunicipios() {
        return `/municipios/list/`;
    },
});

const obtenerMunicipios = async () => {
    const response = await axiosInstance.get(ENDPOINT.obtenerMunicipios());
    return response.data;
};

export const MunicipiosService = {
    obtenerMunicipios,
};
