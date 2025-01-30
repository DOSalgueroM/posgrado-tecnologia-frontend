import axiosInstance from '../components/services/axiosInstance';

export interface ProgramaResponse {
  id: number;
  nombre: string;
  tipo: string;
  descripcion: string;
  sigla: string;
  estado: string;
}

export const ProgramaService = {
  async getProgramasByTipo(tipo: string) {
    const response = await axiosInstance.get<ProgramaResponse[]>(`/programas/por-tipo`, {
      params: {
        tipo
      }
    });
    return response.data;
  }
};
