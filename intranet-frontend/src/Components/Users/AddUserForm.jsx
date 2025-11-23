import InputError from "@/Components/Utils/InputError";
import InputLabel from "@/Components/Utils/InputLabel";
import PrimaryButton from "@/Components/Utils/PrimaryButton";
import Modal from "@/Components/Utils/Modal";

import { addUser } from "@/api/modules/users";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function AddUserForm({ onUserAdded }) {
  const [showingAddUserModal, setShowingAddUserModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    is_admin: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const reset = () => {
    setData({
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      is_admin: false,
    });
    setErrors({});
    setShowingAddUserModal(false);
  };

  const AddUser = () => {
    setShowingAddUserModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({}); // Reset des erreurs
    setIsLoading(true);
    toast.promise(addUser(data), {
      loading: "Ajout de l'utilisateur ...",
      success: (response) => {
        setIsLoading(false);
        reset();
        onUserAdded();
        return response.message;
      },
      error: (error) => {
        setIsLoading(false);
        return error.message;
      },
    });
  };

  return (
    <section>
      <PrimaryButton onClick={AddUser}> Ajouter un Utilisateur </PrimaryButton>

      <Modal
        show={showingAddUserModal}
        onClose={() => setShowingAddUserModal(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <h1 className="text-lg font-medium">Ajouter un utilisateur</h1>
          <div className="form-control">
            <InputLabel htmlFor="name" value="Nom"/><span className="text-error">*</span>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Nom de l'utilisateur"
              value={data.name}
              className="w-full input input-bordered focus:input-primary"
              autoComplete="name"
              isFocused={true}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              required
            />
            <InputError message={errors.name} className="mt-2" />
          </div>

          <div className="form-control">
            <InputLabel htmlFor="email" value="Email"/><span className="text-error">*</span>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email de l'utilisateur"
              value={data.email}
              className="w-full input input-bordered focus:input-primary"
              autoComplete="username"
              onChange={(e) => setData({ ...data, email: e.target.value })}
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
              value={data.password}
              className="w-full input input-bordered focus:input-primary"
              autoComplete="new-password"
              onChange={(e) => setData({ ...data, password: e.target.value })}
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
              value={data.password_confirmation}
              className="w-full input input-bordered focus:input-primary"
              autoComplete="new-password"
              onChange={(e) =>
                setData({ ...data, password_confirmation: e.target.value })
              }
              required
            />
            <InputError
              message={errors.password_confirmation}
              className="mt-2"
            />
          </div>

          <div className="form-control">
            <label className="label cursor-pointer">
              <input
                id="is_admin"
                type="checkbox"
                name="is_admin"
                checked={data.is_admin}
                className="checkbox checkbox-primary"
                onChange={(e) =>
                  setData({ ...data, is_admin: e.target.checked })
                }
              />
              <span className="label-text ml-2">Administrateur</span>
            </label>
            <InputError message={errors.is_admin} className="mt-3" />
          </div>
          <div className="modal-action">
            <button
              type="submit"
              disabled={isLoading}
              className={`btn ${isLoading ? "btn-disabled" : "btn-primary"}`}
            >
              {isLoading ? "Ajout en cours..." : "Valider"}
            </button>
          </div>
        </form>
      </Modal>
      <Toaster />
    </section>
  );
}
