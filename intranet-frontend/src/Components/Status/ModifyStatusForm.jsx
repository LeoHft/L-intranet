import Modal from "@/Components/Utils/Modal";
import InputLabel from "@/Components/Utils/InputLabel";

import { updateStatus } from "@/api/modules/status";

import { useEffect, useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function ModifyStatusForm({ status, onClose, onSuccess }) {
  const name = useRef();
  const description = useRef();
  const [data, setData] = useState({
    name: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const reset = () => {
    setData({
      name: "",
      description: "",
    });
  };

  useEffect(() => {
    if (status) {
      setData({
        name: status.name || "",
        description: status.description || "",
      });
    }
  }, [status]);

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);
    toast.promise(updateStatus(data, status.id), {
      loading: "Modification du statut en cours ...",
      success: (response) => {
        setIsLoading(false);
        reset();
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
        <h1 className="text-lg font-medium">Modifier un statut</h1>
        <div className="form-control">
          <InputLabel htmlFor="name" value="Nom du statut"/><span className="text-error">*</span>
          <input
            type="text"
            id="name"
            ref={name}
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            className="w-full input input-bordered focus:input-primary"
            placeholder="Nom du statut"
            required
          />
        </div>
        <div className="form-control">
          <InputLabel htmlFor="description" value="Description" />
          <textarea
            id="description"
            ref={description}
            value={data.description}
            maxLength={255}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            className="w-full textarea textarea-bordered focus:textarea-primary"
            placeholder="Description du statut"
          />
        </div>
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
