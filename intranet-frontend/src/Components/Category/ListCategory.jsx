import SecondaryButton from "@/Components/Utils/SecondaryButton";
import DangerButton from "@/Components/Utils/DangerButton";
import Modal from "@/Components/Utils/Modal";

import ModifyCategoryForm from "@/Components/Category/ModifyCategoryForm";
import { getAllCategory, deleteCategory } from "@/api/modules/category";

import { useState, useEffect } from "react";
import dayjs from "dayjs";
import notifyErrors from "@/utils/notifyErrors";

export default function ListCategory({ refreshTrigger }) {
  const [categoriesList, setCategoriesList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModalModifyCategory, setShowModalModifyCategory] = useState(false);
  const [showModalDeleteCategory, setShowModalDeleteCategory] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [refreshTrigger]);

  const fetchCategories = () => {
    notifyErrors(getAllCategory(), {
      success: (response) => {
        setCategoriesList(response.data);
      },
    });
  };

  const ModifyCategory = (category) => {
    setSelectedCategory(category);
    setShowModalModifyCategory(true);
  };

  const DeleteCategoryShow = (category) => {
    setSelectedCategory(category);
    setShowModalDeleteCategory(true);
  };

  const DeleteCategory = (e) => {
    e.preventDefault();

    notifyErrors(deleteCategory(selectedCategory.id), {
      success: () => {
        setCategoriesList(
          categoriesList.filter((cat) => cat.id !== selectedCategory.id)
        );
        setShowModalDeleteCategory(false);
      },
    });
  };

  return (
    <>
      <div className="overflow-x-auto">
      <table className="table table-zebra w-full responsive-table">
        <thead>
          <tr>
            <th className="text-center">Nom</th>
            <th className="text-center">Description</th>
            <th className="text-center">Date d'ajout</th>
            <th className="text-center">Date de modification</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categoriesList.length > 0 ? (
            categoriesList.map((category) => (
              <tr key={category.id}>
                <td className="text-center">{category.name}</td>
                <td data-label="Description" className="text-center">{category.description}</td>
                <td data-label="Ajoutée le" className="text-center">{dayjs(category.created_at).format("DD/MM/YYYY HH:mm")}</td>
                <td data-label="Modifiée le" className="text-center">{dayjs(category.updated_at).format("DD/MM/YYYY HH:mm")}</td>
                <td>
                  <div className="flex gap-2 items-center justify-center ">
                  <SecondaryButton onClick={() => ModifyCategory(category)}>
                    Modifier
                  </SecondaryButton>
                  <DangerButton onClick={() => DeleteCategoryShow(category)}>
                    Supprimer
                  </DangerButton>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center text-base-content/70 py-4">
                Aucune catégorie trouvée.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>

      {showModalModifyCategory && (
        <ModifyCategoryForm
          category={selectedCategory}
          onClose={() => setShowModalModifyCategory(false)}
          onSuccess={() => fetchCategories()}
        />
      )}

      <Modal
        show={showModalDeleteCategory}
        onClose={() => setShowModalDeleteCategory(false)}
      >
        <form onSubmit={DeleteCategory} className="space-y-6">
          <h1 className="text-lg font-medium">Supprimer une catégorie</h1>
          <p>
            Êtes-vous sûr de vouloir supprimer la catégorie "
            {selectedCategory?.name}" ?
          </p>
          <div className="flex gap-2 justify-end">
            <SecondaryButton onClick={() => setShowModalDeleteCategory(false)}>
              Annuler
            </SecondaryButton>
            <DangerButton type="submit">Supprimer</DangerButton>
          </div>
        </form>
      </Modal>
    </>
  );
}
