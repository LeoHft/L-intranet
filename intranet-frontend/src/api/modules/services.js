import { apiClient } from '@/api/apiClient';


export const getAllServices = async () => {
  console.log("Récupération des services en cours ...");
  try {
    const response = await apiClient.get('/getServices', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      }
    });
    return response.data;

  } catch (error) {
    const message = error.response?.data?.message || "Erreur cliente lors de la récupération des services";
    console.error(error.response?.data?.error);
    throw new Error(message);
  }
}

export const getUserServices = async () => {
  console.log("Récupération des services de l'utilisateur en cours ...");
  try {
    const response = await apiClient.get('/getUserServices', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      }
    });
    return response.data;

  } catch (error) {
    const message = error.response?.data?.message || "Erreur cliente lors de la récupération des services de l'utilisateur";
    console.error(error.response?.data?.error);
    throw new Error(message);
  }
}


export const storeService = async (serviceData) => {
  console.log("Ajout du service en cours ...");
  try {
    const response = await apiClient.post('/storeService', serviceData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      }
    });
    return response.data;

  } catch (error) {
    const message = error.response?.data?.message || "Erreur cliente lors de l\'ajout du service";
    console.error(error.response?.data?.error);
    throw new Error(message);
  }
}


export const editService = async (serviceData, serviceId) => {
  console.log("Modification du service en cours ...");
  console.log(serviceId);
  console.log(serviceData);
  try {   
    const response = await apiClient.post(`/updateService/${serviceId}`, serviceData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      }
    });
    return response.data;

  } catch (error) {
    const message = error.response?.data?.message || "Erreur cliente lors de la modification du service";
    console.error(error.response?.data?.error);
    throw new Error(message);
  }
}


export const deleteService = async (serviceId) => {
  console.log("Suppression du service en cours ...");
  try {
    const response = await apiClient.delete(`/deleteService/${serviceId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      }
    });
    return response.data;

  } catch (error) {
    const message = error.response?.data?.message || "Erreur cliente lors de la suppression du service";
    console.error(error.response?.data?.error);
    throw new Error(message);
  }
}


export const updateNumberServiceClick = async (service_id, isInternalUrl, userId) => {
  console.log("Mise à jour du nombre de clics en cours ...");
  console.log("Service ID :", service_id, "isInternalUrl :", isInternalUrl, "User ID :", userId);
  try {
    const response = await apiClient.post(`/updateNumberClick/${service_id}`, { isInternalUrl, userId }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      }
    });
    return response.data;

  } catch (error) {
    const message = error.response?.data?.message || "Erreur cliente lors de la mise à jour du nombre de clics";
    console.error(error.response?.data?.error);
    throw new Error(message);
  }
}