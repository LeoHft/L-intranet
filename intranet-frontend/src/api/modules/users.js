import { apiClient } from '@/api/apiClient';


export const getCurrentUserInfo = async () => {
  const response = await apiClient.get('/getCurrentUserInfo');
  return response.data;
};

export const getUsers = async () => {
  const response = await apiClient.get('/getUsers');
  return response.data;
}

export const login = async (loginData) => {
  const response = await apiClient.post('/login', loginData);
  return response.data;
}

export const addUser = async (userData) => {
  const response = await apiClient.post('/storeUser', userData);
  return response.data;
}

export const updateUser = async (userData, userId) => {
  const response = await apiClient.put(`/updateUser/${userId}`, userData);
  return response.data;
}

export const updateCurrentUserFirstLogin = async (userData) => {
  const response = await apiClient.put('/updateCurrentUserFirstLogin', userData);
  return response.data;
}

export const updateCurrentUser = async (userData) => {
  const response = await apiClient.put('/updateCurrentUser', userData);
  return response.data;
}

export const updateCurrentUserPassword = async (userData) => {
  const response = await apiClient.put('/updateCurrentUserPassword', userData);
  return response.data;
}

export const deleteUser = async (userId) => {
  const response = await apiClient.delete(`/deleteUser/${userId}`);
  return response.data;
}

export const logout = async () => {
  console.log("Déconnexion en cours ...");
  try {
    const response = await apiClient.post('/logout');
    return response.data;
  } finally {
    localStorage.removeItem("auth_token");
  }
};