import { apiClient } from '@/api/apiClient';


export const getUserShortcuts = async () => {
  console.log("Récupération des shortcuts de l'utilisateur en cours ...");
  try {
    const response = await apiClient.get('/getUserShortcuts', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      }
    });
    return response.data;

  } catch (error) {
    const message = error.response?.data?.message || "Erreur cliente lors de la récupération des shortcuts";
    console.error(error.response?.data?.error);
    throw new Error(message);
  }
}

export const addShortcut = async (shortcutData) => {
  console.log("Ajout d'un shortcut en cours ...");
  try {
    const response = await apiClient.post('/addShortcut', shortcutData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      }
    });
    return response.data;

  } catch (error) {
    const message = error.response?.data?.message || "Erreur cliente lors de l'ajout du shortcut";
    console.error(error.response?.data?.error);
    throw new Error(message);
  }
}

export const deleteShortcut = async (id) => {
  console.log("Suppression du shortcut en cours ...");
  try {
    const response = await apiClient.delete(`/deleteShortcut/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      }
    });
    return response.data;

  } catch (error) {
    const message = error.response?.data?.message || "Erreur cliente lors de la suppression du shortcut";
    console.error(error.response?.data?.error);
    throw new Error(message);
  }
}