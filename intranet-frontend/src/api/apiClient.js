import axios from "axios";

export const AUTH_TOKEN_KEY = "auth_token";

// Le frontend et l'API sont servis sur la même origine par nginx.
export const apiClient = axios.create({
  baseURL: "/api",
  timeout: 30000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const getErrorMessage = (error) => {
  const { response } = error;
  if (!response) {
    return "Le serveur est injoignable. Réessayez dans quelques instants.";
  }
  if (response.status >= 500) {
    return "Le serveur a rencontré une erreur. Réessayez dans quelques instants.";
  }
  const firstValidationError = response.data?.errors && Object.values(response.data.errors)[0]?.[0];
  return firstValidationError || response.data?.message || response.data?.error || "Une erreur inattendue est survenue.";
};

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Session expirée ou révoquée. Le 401 de /login signale seulement de mauvais identifiants.
    if (error.response?.status === 401 && error.config?.url !== "/login" && localStorage.getItem(AUTH_TOKEN_KEY)) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      window.location.assign("/login");
    }

    const apiError = new Error(getErrorMessage(error));
    apiError.status = error.response?.status;
    apiError.errors = error.response?.data?.errors ?? {}; // Erreurs de validation, par champ
    return Promise.reject(apiError);
  }
);
