import { apiClient } from '@/api/apiClient';



export const storeCategory = async (categoryData) => {
    console.log("Enregistrement de la catégorie ...");
    try {
        const response = await apiClient.post('/storeCategory', categoryData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
        });
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || "Erreur cliente lors de l'enregistrement de la catégorie";
        console.error(error.response?.data?.error);
        throw new Error(message);
    }
}


export const getAllCategory = async () => {
    console.log("Récupération des catégories ...");
    try {
        const response = await apiClient.get('/getAllCategory', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
        });
        return response.data
    } catch (error) {
        const message = error.response?.data?.message || "Erreur cliente lors de a récupération des catégories";
        console.error(error.response?.data?.error);
        throw new Error(message);
    }
}


export const deleteCategory = async (categoryId) => {
    console.log("Suppression de la catégorie ...");
    try {
        const response = await apiClient.delete(`/deleteCategory/${categoryId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
        });
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || "Erreur cliente lors de la suppression de la catégorie";
        console.error(error.response?.data?.error);
        throw new Error(message);
    }
}


export const updateCategory = async (categoryData, categoryId) => {
    console.log("Modification de la catégorie ...");
    try {
        const response = await apiClient.put(`/updateCategory/${categoryId}`, categoryData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
        });
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || "Erreur cliente lors de la mise à jour de la catégorie";
        console.error(error.response?.data?.error);
        throw new Error(message);
    }
}