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


export const getUsers = async () => {
  console.log("Récupération des utilisateurs en cours ...");
  try {
    const response = await apiClient.get('/getUsers', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      }
    });
    return response.data;

  } catch (error) {
    const message = error.response?.data?.message || "Erreur lors de la récupération des utilisateurs";
    console.error(error.response?.data?.error);
    throw new Error(message);
  }
}


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


export const addUser = async (userData) => {
  console.log("Ajout d'un utilisateur en cours ...");
  try {
    const response = await apiClient.post("/storeUser", userData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      }
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Erreur lors de l'ajout de l'utilisateur";
    console.error(error.response?.data?.error);
    throw new Error(message);
  }
}


export const updateUser = async (userData, userId) => {
  console.log("Modification de l\'utilisateur en cours ...");
  try {
    const response = await apiClient.put(`/updateUser/${userId}`, userData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      }
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Erreur lors de la modification de l'utilisateur";
    console.error(error.response?.data?.error);
    throw new Error(message);
  }
}


export const deleteUser = async (userId) => {
  console.log("Suppression de l'utilisateur en cours ...");
  try {
    const response = await apiClient.delete(`/deleteUser/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      }
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Erreur lors de la suppression de l'utilisateur";
    console.error(error.response?.data?.error);
    throw new Error(message);
  }
}


export const logout = async () => {
  console.log("Déconnexion en cours ...");
  try {
    const response = await apiClient.post('/logout', {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      }
    });
    
    localStorage.removeItem("auth_token");
    
    return response.data;
  } catch (error) {
    localStorage.removeItem("auth_token");
    
    const message = error.response?.data?.message || "Erreur lors de la déconnexion";
    console.error(error.response?.data?.error);
    throw new Error(message);
  }
};