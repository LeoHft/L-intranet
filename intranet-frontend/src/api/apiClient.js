import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 5000,
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("auth_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.warn("Session expirée, déconnexion...");
            localStorage.removeItem("auth_token");
            windows.location.href = "/login";
        }


        const errorMessage = 
            error.response?.data?.message || 
            error.response?.data?.error || 
            "Une erreur inattendue est survenue.";

        console.error("Erreur API:", errorMessage);
        return Promise.reject(new Error(errorMessage));
    }
);