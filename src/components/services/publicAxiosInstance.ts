import axios from 'axios';

const publicAxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

export default publicAxiosInstance;
