import PrimaryButton from "@/Components/Utils/PrimaryButton";
import Modal from "@/Components/Utils/Modal";
import InputLabel from "@/Components/Utils/InputLabel";
import TextInput from "@/Components/Utils/TextInput";
import { storeService } from "@/api/modules/services";
import { getUsers } from "@/api/modules/users";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState, useRef } from "react";
import CustomSelect from "@/Components/Utils/Select";
import { getAllStatus } from "@/api/modules/status";
import { getAllCategory } from "@/api/modules/category";
import { Camera } from "lucide-react";

export default function AddServiceForm({ onServiceAdded }) {
  const [showingAddServiceModal, setShowingAddServiceModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const name = useRef();
  const description = useRef();
  const internal_url = useRef();
  const external_url = useRef();
  const image = useRef();
  const [data, setData] = useState({
    name: "",
    description: "",
    internal_url: "",
    external_url: "",
    image: "",
    categories: [],
    status: null,
    users: [],
  });
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState([]);
  const [users, setUsers] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef();
  const [isLoading, setIsLoading] = useState(false);

  const reset = () => {
    setData({
      name: "",
      description: "",
      internal_url: "",
      external_url: "",
      image: "",
      categories: [],
      status: null,
      users: [],
    });
    setSelectedCategories([]);
    setSelectedUsers([]);
    setSelectedStatus(null);
    setImagePreview(null);
  };

  useEffect(() => {
    handleStatus();
    handleCategories();
    handleUsers();
  }, []);

  const handleStatus = () => {
    try {
      getAllStatus().then((response) => {
        setStatus(
          response.data.map((status) => ({
            value: status.id,
            label: status.name,
          }))
        );
      });
    } catch (error) {
      toast.error(error.message);
    }
  };
  const handleCategories = () => {
    try {
      getAllCategory().then((response) => {
        setCategories(
          response.data.map((category) => ({
            value: category.id,
            label: category.name,
          }))
        );
      });
    } catch (error) {
      toast.error(error.message);
    }
  };
  const handleUsers = () => {
    getUsers()
      .then((response) => {
        setUsers(
          response.data.map((users) => ({
            value: users.id,
            label: users.name,
          }))
        );
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des utilisateurs:",
          error
        );
      });
  };

  const AddService = () => {
    setShowingAddServiceModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData({ ...data, image: file });
      // Créer une URL pour la prévisualisation
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation des utilisateurs obligatoires
    if (!selectedUsers || selectedUsers.length === 0) {
      toast.error("Veuillez sélectionner au moins un utilisateur");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("internal_url", data.internal_url);
    formData.append("external_url", data.external_url);
    formData.append("image", data.image);
    selectedCategories.forEach((category) => {
      formData.append("category_id[]", category.value);
    });
    selectedUsers.forEach((user) => {
      formData.append("user_id[]", user.value);
    });
    const statusValue = Array.isArray(selectedStatus)
      ? selectedStatus[0]?.value
      : selectedStatus?.value;
    if (statusValue) {
      formData.append("status_id", statusValue);
    }

    setIsLoading(true);
    toast.promise(storeService(formData), {
      loading: "Ajout du service en cours ...",
      success: (response) => {
        setIsLoading(false);
        reset();
        onServiceAdded();
        setShowingAddServiceModal(false);
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
      <PrimaryButton onClick={AddService}> Ajouter un service </PrimaryButton>

      <Modal
        show={showingAddServiceModal}
        onClose={() => setShowingAddServiceModal(false)}
      >
        <div className="max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h1 className="text-lg font-medium">Ajouter un service</h1>
            <div className="flex flex-row items-center gap-4">
              <div className="cursor-pointer" onClick={handleAvatarClick}>
                <div className="bg-neutral text-neutral-content rounded-full w-24 h-24 hover:opacity-80 transition-opacity flex items-center justify-center">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="rounded-full w-full h-full object-cover"
                    />
                  ) : (
                    <Camera size={48} />
                  )}
                </div>
              </div>
              <input
                ref={fileInputRef}
                id="image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />

              <div className="form-control flex-1">
                <InputLabel htmlFor="name" value="Nom du service*" />
                <TextInput
                  id="name"
                  ref={name}
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  type="text"
                  className="w-full"
                  placeholder="Nom du service"
                  required
                />
              </div>
            </div>
            <div className="form-control">
              <InputLabel htmlFor="description" value="Description max: 255" />
              <textarea
                id="description"
                ref={description}
                value={data.description}
                onChange={(e) =>
                  setData({ ...data, description: e.target.value })
                }
                className="textarea textarea-bordered w-full"
                placeholder="Description du service"
              />
            </div>
            <div className="form-control">
              <InputLabel htmlFor="internal_url" value="Url interne" />
              <TextInput
                id="internal_url"
                ref={internal_url}
                value={data.internal_url}
                onChange={(e) =>
                  setData({ ...data, internal_url: e.target.value })
                }
                type="text"
                className="w-full"
                placeholder="Url interne"
              />
            </div>
            <div className="form-control">
              <InputLabel htmlFor="external_url" value="Url externe" />
              <TextInput
                id="external_url"
                ref={external_url}
                value={data.external_url}
                onChange={(e) =>
                  setData({ ...data, external_url: e.target.value })
                }
                type="text"
                className="w-full"
                placeholder="Url externe"
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
              selectedOption={selectedStatus}
              setSelectedOption={setSelectedStatus}
            />
            <CustomSelect
              options={users}
              required
              name="Utilisateurs"
              placeholder="Sélectionnez une ou plusieurs utilisateurs..."
              selectedOption={selectedUsers}
              setSelectedOption={setSelectedUsers}
            />
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
        </div>
      </Modal>
      <Toaster />
    </section>
  );
}
