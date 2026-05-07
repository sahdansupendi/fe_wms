import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const authStore = useAuthStore();

    if (authStore.token) {
        config.headers.Authorization = `Bearer ${authStore.token}`;
    }

    return config;
});

// Refresh Token
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error){
            prom.reject.error();
        }else {
            prom.resolve(token)
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Kalau 401 dan belum pernah di-retry
        if (error.response?.status === 401 && originalRequest._retry){
            // Kalau request yang gagal adalah refresh itu sendiri → logout
            if (originalRequest.url?.includes("/auth/refresh")) {
                const authStore = useAuthStore();
                authStore.clearAuth();
                window.location.href = "/";
                return Promise.reject(error);
            }
            if (isRefreshing) {
                // Kalau lagi refresh, antrekan request yang gagal
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }
            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const authStore = useAuthStore();
                const response = await refreshApi(authStore.refreshToken);
                const newToken = response.data.data.token;
                const newRefreshToken = response.data.data.refreshToken;

                // Update store & localStorage
                authStore.token = newToken;
                authStore.refreshToken = newRefreshToken;
                localStorage.setItem("token", newToken);
                localStorage.setItem("refreshToken", newRefreshToken);

                processQueue(null, newToken);

                // Retry request original
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                const authStore = useAuthStore();
                authStore.clearAuth();
                window.location.href = "/";
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;