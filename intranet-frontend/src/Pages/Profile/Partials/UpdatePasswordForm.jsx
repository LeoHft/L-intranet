import InputLabel from "@/Components/Utils/InputLabel";
import PrimaryButton from "@/Components/Utils/PrimaryButton";
import InputError from "@/Components/Utils/InputError";
import { AUTH_TOKEN_KEY } from "@/api/apiClient";
import { updateCurrentUserPassword } from "@/api/modules/users";

import { useState } from "react";
import notifyErrors from "@/utils/notifyErrors";

export default function UpdatePasswordForm() {
  const emptyForm = {
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  };
  const [data, setData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [saved, setSaved] = useState(false);

  const updatePassword = async (e) => {
    e.preventDefault();
    setErrors({});
    setSaved(false);
    setProcessing(true);

    const handleSuccess = (response) => {
      localStorage.setItem(AUTH_TOKEN_KEY, response.data); // Les anciens tokens sont révoqués.
      setData(emptyForm);
      setProcessing(false);
      setSaved(true);
    };

    notifyErrors(updateCurrentUserPassword(data), {
      success: handleSuccess,
      error: (error) => {
        setProcessing(false);
        setErrors(error.errors ?? {});
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
              value={data.current_password}
              onChange={(e) =>
                setData({ ...data, current_password: e.target.value })
              }
              type="password"
              className="w-full input input-bordered focus:input-primary"
              autoComplete="current-password"
            />
            <InputError message={errors.current_password?.[0]} className="mt-2" />
          </div>

          <div className="form-control">
            <InputLabel htmlFor="password" value="Nouveau mot de passe (12 caractères minimum)" />
            <input
              id="password"
              value={data.new_password}
              onChange={(e) =>
                setData({ ...data, new_password: e.target.value })
              }
              type="password"
              className="w-full input input-bordered focus:input-primary"
              autoComplete="new-password"
            />
            <InputError message={errors.new_password?.[0]} className="mt-2" />
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
            {saved && <span role="status" className="text-sm text-success">Enregistré</span>}
          </div>
        </form>
      </div>
    </section>
  );
}
