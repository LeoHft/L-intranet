import Modal from "@/Components/Utils/Modal";
import InputLabel from "@/Components/Utils/InputLabel";
import CustomSelect from "@/Components/Utils/Select";
import useSelectOptions from "@/hooks/useSelectOptions";
import { getAllStatus } from "@/api/modules/status";
import { getAllCategory } from "@/api/modules/category";
import { getUsers } from "@/api/modules/users";
import { editService, storeService } from "@/api/modules/services";

import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { Camera } from "lucide-react";

const toOptions = (items) => items?.map((item) => ({ value: item.id, label: item.name })) ?? [];

// Formulaire de création, ou de modification si "service" est fourni.
export default function ServiceFormModal({ service, onClose, onSuccess }) {
  const isEditing = !!service;
  const [data, setData] = useState({
    name: service?.name ?? "",
    description: service?.description ?? "",
    internal_url: service?.internal_url ?? "",
    external_url: service?.external_url ?? "",
  });
  const [selectedCategories, setSelectedCategories] = useState(toOptions(service?.categories));
  const [selectedUsers, setSelectedUsers] = useState(toOptions(service?.users));
  const [selectedStatus, setSelectedStatus] = useState(service?.status ? toOptions([service.status])[0] : null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(service?.image_url ?? null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef();

  const categories = useSelectOptions(getAllCategory);
  const status = useSelectOptions(getAllStatus);
  const users = useSelectOptions(getUsers);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedUsers.length === 0) {
      toast.error("Veuillez sélectionner au moins un utilisateur");
      return;
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => formData.append(key, value));
    if (imageFile) {
      formData.append("image", imageFile);
    }
    selectedCategories.forEach((category) => formData.append("category_id[]", category.value));
    selectedUsers.forEach((user) => formData.append("user_id[]", user.value));
    if (selectedStatus?.value) {
      formData.append("status_id", selectedStatus.value);
    }

    setIsLoading(true);
    toast.promise(isEditing ? editService(formData, service.id) : storeService(formData), {
      loading: isEditing ? "Modification du service en cours ..." : "Ajout du service en cours ...",
      success: (response) => {
        setIsLoading(false);
        onClose();
        onSuccess?.();
        return response.message;
      },
      error: (error) => {
        setIsLoading(false);
        return error.message;
      },
    });
  };

  return (
    <Modal show={true} onClose={onClose}>
      <div className="max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h1 className="text-lg font-medium">{isEditing ? "Modifier un service" : "Ajouter un service"}</h1>
          <div className="flex flex-row items-center gap-4">
            <button type="button" aria-label="Choisir une image" className="cursor-pointer" onClick={() => fileInputRef.current.click()}>
              <div className="bg-neutral text-neutral-content rounded-full w-24 h-24 hover:opacity-80 transition-opacity flex items-center justify-center">
                {imagePreview ? (
                  <img src={imagePreview} alt="Aperçu" className="rounded-full w-full h-full avatar" />
                ) : (
                  <Camera size={48} />
                )}
              </div>
            </button>
            <input
              ref={fileInputRef}
              id="image"
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp,image/x-icon"
              className="hidden"
              onChange={handleImageChange}
            />

            <div className="form-control flex-1">
              <InputLabel htmlFor="name" value="Nom du service" />
              <span className="text-error">*</span>
              <input
                type="text"
                id="name"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                className="w-full input input-bordered focus:input-primary"
                placeholder="Nom du service"
                maxLength={255}
                required
              />
            </div>
          </div>
          <div className="form-control">
            <InputLabel htmlFor="description" value="Description" />
            <textarea
              id="description"
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              maxLength={255}
              className="textarea textarea-bordered w-full focus:textarea-primary"
              placeholder="Description du service"
            />
          </div>
          <div className="form-control">
            <InputLabel htmlFor="internal_url" value="URL interne" />
            <input
              type="url"
              id="internal_url"
              value={data.internal_url}
              onChange={(e) => setData({ ...data, internal_url: e.target.value })}
              className="w-full input input-bordered focus:input-primary"
              placeholder="http://192.168.1.10:8080"
              maxLength={255}
            />
          </div>
          <div className="form-control">
            <InputLabel htmlFor="external_url" value="URL externe" />
            <input
              type="url"
              id="external_url"
              value={data.external_url}
              onChange={(e) => setData({ ...data, external_url: e.target.value })}
              className="w-full input input-bordered focus:input-primary"
              placeholder="https://service.example.com"
              maxLength={255}
            />
          </div>
          <CustomSelect
            options={categories}
            name="Catégories"
            placeholder="Sélectionnez une ou plusieurs catégories..."
            selectedOption={selectedCategories}
            setSelectedOption={setSelectedCategories}
          />
          <CustomSelect
            options={status}
            name="Statut"
            placeholder="Sélectionnez un statut..."
            isMulti={false}
            selectedOption={selectedStatus}
            setSelectedOption={setSelectedStatus}
          />
          <CustomSelect
            options={users}
            required
            name="Utilisateurs"
            placeholder="Sélectionnez un ou plusieurs utilisateurs..."
            selectedOption={selectedUsers}
            setSelectedOption={setSelectedUsers}
          />
          <div className="modal-action">
            <button
              type="submit"
              disabled={isLoading}
              className={`btn ${isLoading ? "btn-disabled" : "btn-primary"}`}
            >
              {isLoading ? "Enregistrement..." : "Valider"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
