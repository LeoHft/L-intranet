import { apiClient } from '@/api/apiClient';


export const storeStatus = async (statusData) => {
    const response = await apiClient.post('/storeStatus', statusData);
    return response.data;
}

export const getAllStatus = async () => {
    const response = await apiClient.get('/getAllStatus');
    return response.data;
}

export const deleteStatus = async (statusId) => {
    const response = await apiClient.delete(`/deleteStatus/${statusId}`);
    return response.data;
}

export const updateStatus = async (statusData, statusId) => {
    const response = await apiClient.put(`/updateStatus/${statusId}`, statusData);
    return response.data;
}