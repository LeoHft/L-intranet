import { apiClient } from '@/api/apiClient';


export const storeCategory = async (categoryData) => {
    const response = await apiClient.post('/storeCategory', categoryData);
    return response.data; 
}

export const getAllCategory = async () => {
    const response = await apiClient.get('/getAllCategory');
    return response.data;
}

export const deleteCategory = async (categoryId) => {
    const response = await apiClient.delete(`/deleteCategory/${categoryId}`);
    return response.data;
}

export const updateCategory = async (categoryData, categoryId) => {
    const response = await apiClient.put(`/updateCategory/${categoryId}`, categoryData);
    return response.data;
}