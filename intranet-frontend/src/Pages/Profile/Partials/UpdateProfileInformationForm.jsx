import InputError from "@/Components/Utils/InputError";
import InputLabel from "@/Components/Utils/InputLabel";
import PrimaryButton from "@/Components/Utils/PrimaryButton";
import TextInput from "@/Components/Utils/TextInput";

import { useAuthAttributes } from "@/context/AuthAttributsContext";
import { updateCurrentUser } from "@/api/modules/users";

import { Transition } from "@headlessui/react";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function UpdateProfileInformation() {
  const authContext = useAuthAttributes();
  const user = authContext?.userAttributes;

  const [data, setData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [processing, setProcessing] = useState(false);

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
    setProcessing(true);

    const handleSuccess = (response) => {
      authContext.FetchUserAttributes(); // Met à jour les attributs de l'utilisateur dans le contexte
      setProcessing(false);
      return response.message;
    };

    toast.promise(updateCurrentUser(data), {
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
          <h2 className="card-title text-lg">Informations personnelles</h2>

          <p className="text-sm opacity-70">
            Mettez à jour les informations de profile et l'adresse e-mail de
            votre compte.
          </p>
        </header>

        <form onSubmit={submit} className="space-y-6">
          <div className="form-control">
            <InputLabel htmlFor="name" value="Nom" />

            <TextInput
              id="name"
              className="w-full"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              required
              isFocused
              autoComplete="name"
            />
          </div>

          <div className="form-control">
            <InputLabel htmlFor="email" value="E-mail" />

            <TextInput
              id="email"
              type="email"
              className="w-full"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              required
              autoComplete="username"
            />
          </div>

          <div className="flex items-center gap-4">
            <PrimaryButton disabled={processing}>Enregistrer</PrimaryButton>
          </div>
        </form>
      </div>
    </section>
  );
}
