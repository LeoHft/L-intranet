import InputError from "@/Components/Utils/InputError";
import InputLabel from "@/Components/Utils/InputLabel";
import { AUTH_TOKEN_KEY } from "@/api/apiClient";
import { logout, updateCurrentUserFirstLogin } from "@/api/modules/users";
import { useAuthAttributes } from "@/context/AuthAttributsContext";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// Affichée à la place de toute l'application tant que le mot de passe provisoire n'est pas changé.
export default function FirstLogin() {
  const authContext = useAuthAttributes();
  const user = authContext.userAttributes;
  const [data, setData] = useState({
    name: user.name ?? "",
    email: user.email ?? "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = "Première connexion - Intranet";
  }, []);

  const save = async () => {
    const response = await updateCurrentUserFirstLogin(data);
    localStorage.setItem(AUTH_TOKEN_KEY, response.data); // Les anciens tokens sont révoqués.
    await authContext.FetchUserAttributes();
    return response.message;
  };

  const submit = (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);
    toast.promise(
      save().finally(() => setIsLoading(false)),
      {
        loading: "Enregistrement ...",
        success: (message) => message,
        error: (error) => {
          setErrors(error.errors ?? {});
          return error.message;
        },
      }
    );
  };

  const handleLogout = async () => {
    await logout().catch(() => {});
    await authContext.FetchUserAttributes();
  };

  const field = (name, label, props) => (
    <div className="form-control">
      <InputLabel htmlFor={name} value={label} />
      <span className="text-error">*</span>
      <input
        id={name}
        name={name}
        value={data[name]}
        className="w-full input input-bordered focus:input-primary"
        onChange={(e) => setData({ ...data, [name]: e.target.value })}
        required
        {...props}
      />
      <InputError message={errors[name]?.[0]} className="mt-2" />
    </div>
  );

  return (
    <div className="hero min-h-screen py-6">
      <form onSubmit={submit} className="card bg-base-100 shadow-xl max-w-lg w-full">
        <div className="card-body space-y-4">
          <h1 className="font-bold text-lg">Configurez votre compte</h1>
          <p className="opacity-70">
            Votre mot de passe actuel est provisoire. Choisissez-en un nouveau, d'au moins 12 caractères,
            pour accéder à l'intranet.
          </p>
          {field("name", "Nom", { autoComplete: "name" })}
          {field("email", "Email", { type: "email", autoComplete: "username" })}
          {field("password", "Nouveau mot de passe", { type: "password", autoComplete: "new-password", minLength: 12, autoFocus: true })}
          {field("password_confirmation", "Confirmer le mot de passe", { type: "password", autoComplete: "new-password" })}
          <div className="flex justify-between">
            <button type="button" className="btn btn-ghost" onClick={handleLogout}>
              Déconnexion
            </button>
            <button type="submit" className="btn btn-primary btn-gradient" disabled={isLoading}>
              {isLoading ? "Enregistrement..." : "Valider"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
