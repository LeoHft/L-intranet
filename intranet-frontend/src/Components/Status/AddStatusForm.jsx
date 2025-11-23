import PrimaryButton from "@/Components/Utils/PrimaryButton";
import Modal from "@/Components/Utils/Modal";
import InputLabel from "@/Components/Utils/InputLabel";

import { storeStatus } from "@/api/modules/status";

import toast, { Toaster } from "react-hot-toast";
import { useState, useRef } from "react";

export default function AddStatusForm({ onStatusAdded }) {
  const [showingAddStatusModal, setShowingAddStatusModal] = useState(false);
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
    setShowingAddStatusModal(false);
  };

  const AddStatus = () => {
    setShowingAddStatusModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    toast.promise(storeStatus(data), {
      loading: "Ajout du statut en cours ...",
      success: (response) => {
        reset();
        setIsLoading(false);
        setShowingAddStatusModal(false);
        onStatusAdded();
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
      <PrimaryButton onClick={AddStatus}> Ajouter un statut </PrimaryButton>

      <Modal
        show={showingAddStatusModal}
        onClose={() => setShowingAddStatusModal(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <h1 className="text-lg font-medium">Ajouter un statut</h1>
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
              onChange={(e) =>
                setData({ ...data, description: e.target.value })
              }
              maxLength={255}
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
              {isLoading ? "Ajout en cours..." : "Valider"}
            </button>
          </div>
        </form>
      </Modal>
      <Toaster />
    </section>
  );
}
