import Modal from "@/Components/Utils/Modal";
import InputLabel from "@/Components/Utils/InputLabel";
import InputError from "@/Components/Utils/InputError";

import { updateUser } from "@/api/modules/users";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

export default function ModifyUserForm({ user, onClose, onSuccess }) {
  const [errors, setErrors] = useState({});
  const [data, setData] = useState({
    name: "",
    email: "",
    is_admin: false,
    password: "",
    password_confirmation: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setData({
        name: user.name || "",
        email: user.email || "",
        is_admin: user.is_admin || false,
        password: "",
        password_confirmation: "",
      });
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);
    toast.promise(updateUser(data, user.id), {
      loading: "Modification de l'utilisateur ...",
      success: (response) => {
        setIsLoading(false);
        if (onClose) {
          onClose(); // Ferme le modal dans le parent
        }
        if (onSuccess) {
          onSuccess(); // Rafraîchit la liste
        }
        return response.message;
      },
      error: (error) => {
        setIsLoading(false);
        setErrors(error.errors ?? {});
        return error.message;
      },
    });
  };

  return (
    <Modal
      show={true}
      onClose={() => {
        onClose();
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <h1 className="text-lg font-medium">Modifier un utilisateur</h1>
        <div className="form-control">
          <InputLabel htmlFor="name" value="Nom de l'utilisateur"/><span className="text-error">*</span>
          <input
            type="text"
            id="name"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            className="w-full input input-bordered focus:input-primary"
            placeholder="Nom de l'utilisateur"
            required
          />
          <InputError message={errors.name?.[0]} className="mt-2" />
        </div>
        <div className="form-control">
          <InputLabel htmlFor="email" value="Email"/><span className="text-error">*</span>
          <input
            type="email"
            id="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            className="w-full input input-bordered focus:input-primary"
            placeholder="Email de l'utilisateur"
            required
          />
          <InputError message={errors.email?.[0]} className="mt-2" />
        </div>
        <div className="form-control">
          <label className="label cursor-pointer">
            <input
              id="is_admin"
              type="checkbox"
              name="is_admin"
              checked={data.is_admin}
              className="checkbox checkbox-primary"
              onChange={(e) => setData({ ...data, is_admin: e.target.checked })}
            />
            <span className="label-text ml-2">Administrateur</span>
          </label>
          <InputError message={errors.is_admin?.[0]} className="mt-3" />
        </div>
        <div className="form-control">
          <InputLabel htmlFor="password" value="Réinitialiser le mot de passe (facultatif, 12 caractères minimum)" />
          <input
            type="password"
            id="password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
            className="w-full input input-bordered focus:input-primary"
            placeholder="Laisser vide pour ne pas le changer"
            autoComplete="new-password"
          />
          <InputError message={errors.password?.[0]} className="mt-2" />
        </div>
        {data.password && (
          <div className="form-control">
            <InputLabel htmlFor="password_confirmation" value="Confirmer le mot de passe" />
            <input
              type="password"
              id="password_confirmation"
              value={data.password_confirmation}
              onChange={(e) => setData({ ...data, password_confirmation: e.target.value })}
              className="w-full input input-bordered focus:input-primary"
              autoComplete="new-password"
              required
            />
            <p className="text-sm opacity-70 mt-2">
              L'utilisateur sera déconnecté et devra choisir un nouveau mot de passe à sa prochaine connexion.
            </p>
          </div>
        )}
        <div className="modal-action">
          <button
            type="submit"
            disabled={isLoading}
            className={`btn ${isLoading ? "btn-disabled" : "btn-primary"}`}
          >
            {isLoading ? "Modification en cours..." : "Valider"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
