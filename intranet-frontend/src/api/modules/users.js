import { apiClient } from '@/api/apiClient';


// Vérification de l'authentication de l'utilisateur actuel
export const getCurrentUserInfo = async () => {
  console.log("Récupération des informations de l'utilisateur ...");
  try {
    const response = await apiClient.get('/getCurrentUserInfo', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      }
    });
    return response.data;

  } catch (error) {
    const message = error.response?.data?.message || "Erreur lors de la récupération de l'utilisateur";
    console.error(error.response?.data?.error);
    throw new Error(message);
  }
};


export const login = async (loginData) => {
  console.log("Connexion en cours ...");
  try {
    const response = await apiClient.post('/login', loginData)
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Erreur lors de la connexion de l'utilisateur";
    console.error(error.response?.data?.error);
    throw new Error(message);
  }
}