import axios from "axios";


export const apiClient = axios.create({
    baseURL: 'https://localhost:8443/api', // Remplacer par .env
    timeout: 5000,
});