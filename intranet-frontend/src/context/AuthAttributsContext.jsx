import IntranetLoader from "@/Components/Utils/IntranetLoader";

import { AUTH_TOKEN_KEY } from "@/api/apiClient";
import { getCurrentUserInfo } from "@/api/modules/users";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const AuthAttributesContext = createContext(null);

export const AuthAttributesProvider = ({ children }) => {
  const [userAttributes, setUserAttributes] = useState(null);
  const [hasError, setHasError] = useState(false);

  // Les rafraîchissements se font en arrière-plan : la page en cours n'est pas démontée.
  const FetchUserAttributes = useCallback(async () => {
    try {
      const response = await getCurrentUserInfo();
      if (!response.connected) {
        localStorage.removeItem(AUTH_TOKEN_KEY);
      }
      setUserAttributes(response);
      setHasError(false);
    } catch {
      setHasError(true);
    }
  }, []);

  useEffect(() => {
    FetchUserAttributes();
  }, [FetchUserAttributes]);

  if (!userAttributes && hasError) {
    return (
      <div className="hero min-h-screen">
        <div className="hero-content text-center">
          <div className="max-w-md space-y-4">
            <h1 className="text-2xl font-bold">Serveur injoignable</h1>
            <p className="opacity-70">
              L'application démarre peut-être encore. Réessayez dans quelques instants.
            </p>
            <button type="button" className="btn btn-primary" onClick={FetchUserAttributes}>
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!userAttributes) {
    return <IntranetLoader />;
  }

  return (
    <AuthAttributesContext.Provider value={{ userAttributes, FetchUserAttributes, hasError }}>
      {children}
    </AuthAttributesContext.Provider>
  );
};

export const useAuthAttributes = () => useContext(AuthAttributesContext);
