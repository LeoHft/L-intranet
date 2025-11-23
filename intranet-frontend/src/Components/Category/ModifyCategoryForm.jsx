import Modal from "@/Components/Utils/Modal";
import InputLabel from "@/Components/Utils/InputLabel";
import TextInput from "@/Components/Utils/TextInput";

import { updateCategory } from "@/api/modules/category";

import { useEffect, useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function ModifyCategoryForm({ category, onClose, onSuccess }) {
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
    if (category) {
      setData({
        name: category.name || "",
        description: category.description || "",
      });
    }
  }, [category]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!data.name.trim()) {
      toast.error("Le nom de la catégorie est requis");
      return;
    }

    setIsLoading(true);
    toast.promise(updateCategory(data, category.id), {
      loading: "Modification de la catégorie en cours ...",
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
        <h1 className="text-lg font-medium">Modifier une catégorie</h1>
        <div className="form-control">
          <InputLabel htmlFor="name" value="Nom de la catégorie*" />
          <TextInput
            id="name"
            ref={name}
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            type="text"
            className="w-full"
            placeholder="Nom de la catégorie"
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
            placeholder="Description de la catégorie"
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
