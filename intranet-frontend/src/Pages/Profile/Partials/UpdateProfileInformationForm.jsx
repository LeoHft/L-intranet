import InputError from "@/Components/Utils/InputError";
import InputLabel from "@/Components/Utils/InputLabel";
import PrimaryButton from "@/Components/Utils/PrimaryButton";
import { useAuthAttributes } from "@/context/AuthAttributsContext";
import { updateCurrentUser } from "@/api/modules/users";
import { useState, useEffect } from "react";
import notifyErrors from "@/utils/notifyErrors";

export default function UpdateProfileInformation() {
  const authContext = useAuthAttributes();
  const user = authContext?.userAttributes;

  const [data, setData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [saved, setSaved] = useState(false);

  // Mettre à jour les données si l'utilisateur change
  useEffect(() => {
    if (user) {
      setData({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const submit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSaved(false);
    setProcessing(true);

    const handleSuccess = () => {
      authContext.FetchUserAttributes(); // Met à jour les attributs de l'utilisateur dans le contexte
      setProcessing(false);
      setSaved(true);
    };

    notifyErrors(updateCurrentUser(data), {
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
          <h2 className="card-title text-lg">Informations personnelles</h2>

          <p className="text-sm opacity-70">
            Mettez à jour les informations de profile et l'adresse e-mail de
            votre compte.
          </p>
        </header>

        <form onSubmit={submit} className="space-y-6">
          <div className="form-control">
            <InputLabel htmlFor="name" value="Nom" />
            <input
              type="text"
              id="name"
              className="w-full input input-bordered focus:input-primary"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              required
              autoComplete="name"
            />
            <InputError message={errors.name?.[0]} className="mt-2" />
          </div>

          <div className="form-control">
            <InputLabel htmlFor="email" value="E-mail" />
            <input
              id="email"
              type="email"
              className="w-full input input-bordered focus:input-primary"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              required
              autoComplete="username"
            />
            <InputError message={errors.email?.[0]} className="mt-2" />
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
