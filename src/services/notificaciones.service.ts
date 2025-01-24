import axiosInstance from '../components/services/axiosInstance';

const BASE_URL = '/notificaciones';

// Interfaces para los DTOs
interface SendNotificationDto {
    area: string;
    tipo: string;
    nivelEstudio: string;
    subject: string;
    message: string;
}

interface SendSingleEmailDto {
    email: string;
    subject: string;
    message: string;
}

const enviarNotificacion = async (data: SendNotificationDto) => {
    try {
        const response = await axiosInstance.post(`${BASE_URL}/send`, data);
        return response.data;
    } catch (error) {
        console.error('Error al enviar notificación:', error);
        throw error;
    }
};

const enviarNotificacionSimple = async (data: SendSingleEmailDto) => {
    try {
        const response = await axiosInstance.post(`${BASE_URL}/envio-simple`, data);
        return response.data;
    } catch (error) {
        console.error('Error al enviar notificación simple:', error);
        throw error;
    }
};

export const NotificacionesService = {
    enviarNotificacion,
    enviarNotificacionSimple
};
