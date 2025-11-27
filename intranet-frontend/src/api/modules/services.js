import { apiClient } from '@/api/apiClient';


export const getAllServices = async () => {
    const response = await apiClient.get('/getServices');
    return response.data;
}

export const getUserServices = async () => {
    const response = await apiClient.get('/getUserServices');
    return response.data;
}

export const storeService = async (serviceData) => {
    const response = await apiClient.post('/storeService', serviceData);
    return response.data;
}

export const editService = async (serviceData, serviceId) => {
    const response = await apiClient.put(`/updateService/${serviceId}`, serviceData);
    return response.data;
}

export const deleteService = async (serviceId) => {
    console.log("Suppression du service en cours ...");
    const response = await apiClient.delete(`/deleteService/${serviceId}`);
    return response.data;
}

export const updateNumberServiceClick = async (service_id, isInternalUrl, userId) => {
    const response = await apiClient.post(`/updateNumberClick/${service_id}`, { 
        isInternalUrl, 
        userId 
    });
    return response.data;
}