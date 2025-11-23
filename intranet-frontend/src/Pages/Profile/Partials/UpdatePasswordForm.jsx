import InputLabel from "@/Components/Utils/InputLabel";
import PrimaryButton from "@/Components/Utils/PrimaryButton";
import { useAuthAttributes } from "@/context/AuthAttributsContext";
import { updateCurrentUserPassword } from "@/api/modules/users";

import { useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function UpdatePasswordForm() {
  const authContext = useAuthAttributes();
  const passwordInput = useRef();
  const currentPasswordInput = useRef();

  const [data, setData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [processing, setProcessing] = useState(false);

  const updatePassword = async (e) => {
    e.preventDefault();
    setProcessing(true);

    const handleSuccess = (response) => {
      authContext.FetchUserAttributes(); // Met à jour les attributs de l'utilisateur dans le contexte
      setProcessing(false);
      return response.message;
    };

    toast.promise(updateCurrentUserPassword(data), {
      loading: "Modification de votre profil en cours",
      success: handleSuccess,
      error: (error) => {
        setProcessing(false);
        return error.message;
      },
    });
  };

  return (
    <section className="card bg-base-100 shadow-xl border border-base-300">
      <div className="card-body">
        <header>
          <h2 className="card-title text-lg">Mettre à jour le mot de passe</h2>

          <p className="text-sm opacity-70">
            Assurez-vous que votre compte utilise un mot de passe long et
            aléatoire pour rester sécurisé.
          </p>
        </header>
        <form onSubmit={updatePassword} className="space-y-6">
          <div className="form-control">
            <InputLabel
              htmlFor="current_password"
              value="Mot de passe actuel"
            />
            <input
              id="current_password"
              ref={currentPasswordInput}
              value={data.current_password}
              onChange={(e) =>
                setData({ ...data, current_password: e.target.value })
              }
              type="password"
              className="w-full input input-bordered focus:input-primary"
              autoComplete="current-password"
            />
          </div>

          <div className="form-control">
            <InputLabel htmlFor="password" value="Nouveau mot de passe" />
            <input
              id="password"
              ref={passwordInput}
              value={data.new_password}
              onChange={(e) =>
                setData({ ...data, new_password: e.target.value })
              }
              type="password"
              className="w-full input input-bordered focus:input-primary"
              autoComplete="new-password"
            />
          </div>

          <div className="form-control">
            <InputLabel
              htmlFor="password_confirmation"
              value="Confirmer le mot de passe"
            />
            <input
              id="password_confirmation"
              value={data.new_password_confirmation}
              onChange={(e) =>
                setData({ ...data, new_password_confirmation: e.target.value })
              }
              type="password"
              className="w-full input input-bordered focus:input-primary"
              autoComplete="new-password"
            />
          </div>

          <div className="flex items-center gap-4">
            <PrimaryButton disabled={processing}>Enregistrer</PrimaryButton>
          </div>
        </form>
      </div>
      <Toaster />
    </section>
  );
}
