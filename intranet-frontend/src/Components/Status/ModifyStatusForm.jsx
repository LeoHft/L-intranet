import Modal from "@/Components/Utils/Modal";
import InputLabel from "@/Components/Utils/InputLabel";
import TextInput from "@/Components/Utils/TextInput";

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
      loading: "Modification du status en cours ...",
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
        <h1 className="text-lg font-medium">Modifier un status</h1>
        <div className="form-control">
          <InputLabel htmlFor="name" value="Nom du status*" />
          <TextInput
            id="name"
            ref={name}
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            type="text"
            className="w-full"
            placeholder="Nom du status"
            required
          />
        </div>
        <div className="form-control">
          <InputLabel htmlFor="description" value="Description max: 255" />
          <TextInput
            id="description"
            ref={description}
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            type="text"
            className="w-full"
            placeholder="Description du status"
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
