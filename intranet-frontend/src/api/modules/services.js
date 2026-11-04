import { apiClient } from '@/api/apiClient';

// Les images peuvent peser jusqu'à 32 Mo.
const UPLOAD_OPTIONS = { timeout: 120000 };


export const getAllServices = async () => {
    const response = await apiClient.get('/getServices');
    return response.data;
}

export const getUserServices = async () => {
    const response = await apiClient.get('/getUserServices');
    return response.data;
}

export const storeService = async (serviceData) => {
    const response = await apiClient.post('/storeService', serviceData, UPLOAD_OPTIONS);
    return response.data;
}

export const editService = async (serviceData, serviceId) => {
    const response = await apiClient.post(`/updateService/${serviceId}`, serviceData, UPLOAD_OPTIONS);
    return response.data;
}

export const deleteService = async (serviceId) => {
    const response = await apiClient.delete(`/deleteService/${serviceId}`);
    return response.data;
}

export const updateNumberServiceClick = async (serviceId, isInternalUrl) => {
    const response = await apiClient.post(`/updateNumberClick/${serviceId}`, { isInternalUrl });
    return response.data;
}