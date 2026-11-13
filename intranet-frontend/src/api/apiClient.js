import axios from "axios";

// La session tient dans un cookie httpOnly posé par l'API : le navigateur l'envoie seul, et ce code
// ne peut pas le lire. Les anciennes versions gardaient le token ici : on l'efface.
localStorage.removeItem("auth_token");

// Le frontend et l'API sont servis sur la même origine par nginx.
export const apiClient = axios.create({
  baseURL: "/api",
  timeout: 30000,
  // Exigé par l'API pour toute modification : un autre site ne peut pas l'ajouter (protection CSRF).
  headers: { "X-Requested-With": "XMLHttpRequest" },
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
    if (error.response?.status === 401 && error.config?.url !== "/login" && window.location.pathname !== "/login") {
      window.location.assign("/login");
    }

    const apiError = new Error(getErrorMessage(error));
    apiError.status = error.response?.status;
    apiError.errors = error.response?.data?.errors ?? {}; // Erreurs de validation, par champ
    return Promise.reject(apiError);
  }
);
