import axios from 'axios';
import { useBookmarksStore } from '@/store/bookmarks-store';

// 1. Instancia base de axios
export const api = axios.create({
    // Asegurate de que esta sea la URL y el puerto de tu NestJS
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3008/api',
});

// 2. Interceptor de Peticiones (Request Interceptor)
api.interceptors.request.use(
    (config) => {
        // Leemos el estado actual de Zustand (no usamos hooks acá porque no estamos en un componente de React)
        const state = useBookmarksStore.getState();
        const token = state.token;

        // Si hay token, lo inyectamos en el Header
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
