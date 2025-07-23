import axios from "axios";

// Utiliser la variable d'environnement ou une valeur par défaut
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:8443/api';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 5000,
});