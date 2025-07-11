import { apiClient } from '@/api/apiClient';



export const storeStatus = async (statusData) => {
    console.log("Enregistrement du status ...");
    try {
        const response = await apiClient.post('/storeStatus', statusData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
        });
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || "Erreur cliente lors de l'enregistrement du status";
        console.error(error.response?.data?.error);
        throw new Error(message);
    }
}


export const getAllStatus = async () => {
    console.log("Récupération des status ...");
    try {
        const response = await apiClient.get('/getAllStatus', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
        });
        return response.data
    } catch (error) {
        const message = error.response?.data?.message || "Erreur cliente lors de a récupération des status";
        console.error(error.response?.data?.error);
        throw new Error(message);
    }
}


export const deleteStatus = async (statusId) => {
    console.log("Suppression du status ...");
    try {
        const response = await apiClient.delete(`/deleteStatus/${statusId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
        });
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || "Erreur cliente lors de la suppression du status";
        console.error(error.response?.data?.error);
        throw new Error(message);
    }
}


export const updateStatus = async (statusData, statusId) => {
    console.log("Modification du status ...");
    try {
        const response = await apiClient.put(`/updateStatus/${statusId}`, statusData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
        });
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || "Erreur cliente lors de la mise à jour du status";
        console.error(error.response?.data?.error);
        throw new Error(message);
    }
}