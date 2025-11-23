import InputError from "@/Components/Utils/InputError";
import InputLabel from "@/Components/Utils/InputLabel";
import PrimaryButton from "@/Components/Utils/PrimaryButton";
import { useAuthAttributes } from "@/context/AuthAttributsContext";

import Layout from "@/Components/Utils/Layout";
import { login } from "@/api/modules/users";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { updateCurrentUserFirstLogin } from "@/api/modules/users";
import { getCurrentUserInfo } from "@/api/modules/users";

export default function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const authContext = useAuthAttributes();
  const [firstConnection, setFirstConnection] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  // Gestion du titre de la page
  useEffect(() => {
    document.title = "Connexion - Intranet";
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    toast.promise(login(data), {
      loading: "Connexion en cours",
      success: (response) => {
        localStorage.setItem("auth_token", response.data);
        setIsLoading(false);
        if (
          response.message.includes("connexion reussie, premiere connexion")
        ) {
          getCurrentUserInfo().then((userInfo) => {
            console.log(userInfo);
            setUpdatedData({
              name: userInfo.data.name,
              email: userInfo.data.email,
              password: "",
            });
          });
          setFirstConnection(true);
        } else {
          authContext?.FetchUserAttributes().then(() => {
            navigate("/dashboard");
            return response.message;
          });
        }
      },
      error: (error) => {
        setData((prev) => ({ ...prev, password: "" }));
        setIsLoading(false);
        return error.message;
      },
    });
  };

  const handleUpdateUserInfo = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    console.log("Données mises à jour : ", updatedData);
    toast.promise(updateCurrentUserFirstLogin(updatedData), {
      loading: "Modification de l'utilisateur ...",
      success: (response) => {
        reset();
        authContext?.FetchUserAttributes().then(() => {
          navigate("/dashboard");
        });
        return response.message;
      },
      error: (error) => {
        // Gestion des erreurs de validation
        if (error.response?.data?.errors) {
          setErrors(error.response.data.errors);
        }
        setIsLoading(false);
        return error.message;
      },
    });
  };

  const reset = () => {
    setUpdatedData({
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    });
    setErrors({});
    setFirstConnection(false);
  };

  return (
    <Layout>
      <div className="hero min-h-screen">
        <form
          onSubmit={submit}
          className="card bg-base-100/10 backdrop-blur-sm shadow-xl max-w-96 w-full"
        >
          <div className="card-body space-y-6">
            <div className="form-control">
              <InputLabel htmlFor="email" value="Email" />
              <input
                id="email"
                type="email"
                name="email"
                value={data.email}
                className="w-full input input-bordered focus:input-primary"
                autoComplete="username"
                isFocused={true}
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
              <InputError message={errors.email} className="mt-2" />
            </div>

            <div className="form-control">
              <InputLabel htmlFor="password" value="Mot de passe" />
              <input
                id="password"
                type="password"
                name="password"
                value={data.password}
                className="w-full input input-bordered focus:input-primary"
                autoComplete="current-password"
                onChange={(e) => setData({ ...data, password: e.target.value })}
              />
              <InputError message={errors.password} className="mt-2" />
            </div>
            <div className="flex items-center justify-end">
              <Link
                to="/forgot-password"
                className="link link-hover text-sm opacity-80"
              >
                Mot de passe oublié ?
              </Link>

              <PrimaryButton className="ml-4 btn-gradient" disabled={isLoading}>
                {isLoading ? "Connexion..." : "Connexion"}
              </PrimaryButton>
            </div>
          </div>
        </form>
      </div>
      <Toaster />

      {firstConnection && (
        <div className="modal modal-open">
          <div className="modal-box space-y-4">
            <h3 className="font-bold text-lg">
              Modifier les informations de votre compte
            </h3>
            <p className="text-center">
              Modifiez les informations de votre compte pour vos prochaines
              connexion.
            </p>
            <div className="form-control">
              <InputLabel htmlFor="name" value="Nom"/><span className="text-error">*</span>
              <input
                id="name"
                name="name"
                placeholder="Nom de l'utilisateur"
                value={updatedData.name}
                className="w-full input input-bordered focus:input-primary"
                autoComplete="name"
                isFocused={true}
                onChange={(e) =>
                  setUpdatedData({ ...updatedData, name: e.target.value })
                }
                required
              />
              <InputError message={errors.name} className="mt-2" />
            </div>
            <div className="form-control">
              <InputLabel htmlFor="email" value="Email"/><span className="text-error">*</span>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Email de l'utilisateur"
                value={updatedData.email}
                className="w-full input input-bordered focus:input-primary"
                autoComplete="username"
                onChange={(e) =>
                  setUpdatedData({ ...updatedData, email: e.target.value })
                }
                required
              />
              <InputError message={errors.email} className="mt-2" />
            </div>
            <div className="form-control">
              <InputLabel htmlFor="password" value="Mot de passe"/><span className="text-error">*</span>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Mot de passe de l'utilisateur"
                value={updatedData.password}
                className="w-full input input-bordered focus:input-primary"
                autoComplete="new-password"
                onChange={(e) =>
                  setUpdatedData({ ...updatedData, password: e.target.value })
                }
                required
              />
              <InputError message={errors.password} className="mt-2" />
            </div>
            <div className="form-control">
              <InputLabel
                htmlFor="password_confirmation"
                value="Confirmer le mot de passe"
              /><span className="text-error">*</span>
              <input
                id="password_confirmation"
                type="password"
                name="password_confirmation"
                placeholder="Confirmer le mot de passe"
                value={updatedData.password_confirmation}
                className="w-full input input-bordered focus:input-primary"
                autoComplete="new-password"
                onChange={(e) =>
                  setUpdatedData({
                    ...updatedData,
                    password_confirmation: e.target.value,
                  })
                }
                required
              />
              <InputError
                message={errors.password_confirmation}
                className="mt-2"
              />
            </div>
            <div className="modal-action">
              <button
                type="submit"
                className="btn btn-primary btn-gradient"
                onClick={(e) => {
                  handleUpdateUserInfo(e);
                }}
              >
                {isLoading ? "Modification en cours..." : "Valider"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
