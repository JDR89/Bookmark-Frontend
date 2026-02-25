import axios from 'axios';
import { useBookmarksStore } from '@/store/bookmarks-store';

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3008/api',
});

// Interceptor de peticiones (EXISTENTE)
api.interceptors.request.use(
    (config) => {
        const state = useBookmarksStore.getState();
        const token = state.token;
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Variables para evitar bucles infinitos si fallan múltiples peticiones a la vez
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Interceptor de respuestas [NUEVO Sistema Auto-Retry]
api.interceptors.response.use(
    (response) => {
        return response; // Si la petición fue exitosa (200, 201), no tocamos nada.
    },
    async (error) => {
        const originalRequest = error.config;

        // Si es 401, NO es una ruta de auth (para evitar refresh infinito al hacer login), y no la habíamos reintentado ya:
        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/')) {

            // Si ya hay alguien haciendo refresh, nos sumamos a la cola de espera
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject })
                }).then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const store = useBookmarksStore.getState();

                // 1. Pedimos un token fresco (Sin usar api para que no lo intercepte de nuevo, usamos axios directo)
                const { data } = await axios.get(`${api.defaults.baseURL}/auth/check-status`, {
                    headers: { 'Authorization': `Bearer ${store.token}` }
                });

                // 2. Guardamos el nuevo token
                store.login(data.token);

                // 3. Procesamos a todos los que estaban en la cola esperando y les damos el nuevo token
                processQueue(null, data.token);

                // 4. Reintentamos nuestra petición original que había fallado, ahora con el token nuevo fresquito
                originalRequest.headers['Authorization'] = `Bearer ${data.token}`;
                return api(originalRequest);

            } catch (refreshError) {
                // Si el refresh en sí mismo falló (por ej, estabas bloqueado de verdad por tiempo)
                processQueue(refreshError, null);

                console.warn("⚠️ Sesión expirada irremediablemente. Cerrando sesión...");
                const logout = useBookmarksStore.getState().logout;
                logout();

                if (typeof window !== "undefined" && window.location.pathname !== "/") {
                    window.location.href = '/';
                }
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // Seguimos propagando el error general
        return Promise.reject(error);
    }
);
