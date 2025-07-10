import { apiClient } from '../apiClient';



export const getCurrentUserInfo = async () => {
  console.log("Récupération des informations de l'utilisateur connecté...");
  try {
    const response = await apiClient.get('/getCurrentUserInfo', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      }
    });
    return response.data;

  } catch (error) {
    const message = error.response?.data?.message || "Erreur lors de la récupération de l'utilisateur";
    console.error("Erreur getUser:", message);
    throw new Error(message);
  }
};
