import { apiClient } from '@/api/apiClient';


export const getUserShortcuts = async () => {
    const response = await apiClient.get('/getUserShortcuts');
    return response.data;
}

export const addShortcut = async (shortcutData) => {
    const response = await apiClient.post('/addShortcut', shortcutData);
    return response.data;
}

export const deleteShortcut = async (id) => {
    const response = await apiClient.delete(`/deleteShortcut/${id}`);
    return response.data;
}