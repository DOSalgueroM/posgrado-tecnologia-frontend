import axiosInstance from './axiosInstance';
import type { IPrograma } from '../interfaces/IPrograma';

const BASE_URL = '/programas';

const obtenerProgramas = async () => {
  const response = await axiosInstance.get(BASE_URL);
  return response.data;
};

const obtenerProgramaPorId = async (id: number) => {
  const response = await axiosInstance.get(`${BASE_URL}/${id}`);
  return response.data;
};

const crearPrograma = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post(BASE_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear el programa:', error);
    throw error;
  }
};

const actualizarPrograma = async (id: number, programa: Partial<IPrograma>) => {
  try {
    const response = await axiosInstance.patch(`${BASE_URL}/${id}`, programa);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el programa:', error);
    throw error;
  }
};

const actualizarProgramaFormData = async (id: number, formData: FormData) => {
  try {
    const response = await axiosInstance.patch(`${BASE_URL}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el programa:', error);
    throw error;
  }
};

const eliminarPrograma = async (id: number) => {
  try {
    await axiosInstance.delete(`${BASE_URL}/${id}`);
  } catch (error) {
    console.error('Error al eliminar el programa:', error);
    throw error;
  }
};

const obtenerDiplomados = async () => {
  const response = await axiosInstance.get(`${BASE_URL}/diplomados`);
  return response.data;
};

const obtenerMaestrias = async () => {
  const response = await axiosInstance.get(`${BASE_URL}/maestrias`);
  return response.data;
};

const obtenerDoctorados = async () => {
  const response = await axiosInstance.get(`${BASE_URL}/doctorados`);
  return response.data;
};

const obtenerEspecialidades = async () => {
  const response = await axiosInstance.get(`${BASE_URL}/especialidades`);
  return response.data;
};

const obtenerProgramasPorGestion = async (gestion: number) => {
  const response = await axiosInstance.get(`${BASE_URL}/gestion/${gestion}`);
  return response.data;
};

const buscarProgramasPorNombre = async (nombre: string) => {
  const response = await axiosInstance.get(`${BASE_URL}/search/${nombre}`);
  return response.data;
};

export const ProgramaService = {
  obtenerProgramas,
  obtenerProgramaPorId,
  crearPrograma,
  actualizarPrograma,
  actualizarProgramaFormData,
  eliminarPrograma,
  obtenerDiplomados,
  obtenerMaestrias,
  obtenerDoctorados,
  obtenerEspecialidades,
  obtenerProgramasPorGestion,
  buscarProgramasPorNombre
};