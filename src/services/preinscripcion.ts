import axiosInstance from '../components/services/axiosInstance';

export interface PreinscripcionResponse {
  id: number;
  nombreCompleto: string;
  carrera: string;
  cu: string;
  celular: string;
  email: string;
  programaId: number;
  programa: {
    id: number;
    nombre: string;
    tipo: string;
  };
  fechaRegistro: string;
  fechaActualizacion: string;
  fechaEliminacion: string;
  usuarioCreacion: string;
  usuarioActualizacion: string;
  usuarioEliminacion: string;
}

export const PreinscripcionService = {
  async getPreinscripcionesByPrograma(programaId: number) {
    const response = await axiosInstance.get<PreinscripcionResponse[]>(`/preinscripcion`, {
      params: {
        programa_id: programaId
      }
    });
    return response.data;
  },

  async eliminar(id: number): Promise<void> {
    await axiosInstance.delete(`/preinscripcion/${id}`);
  }
};
