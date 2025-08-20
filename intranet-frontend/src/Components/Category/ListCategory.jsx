import SecondaryButton from '@/Components/Utils/SecondaryButton';
import DangerButton from '@/Components/Utils/DangerButton';
import Modal from '@/Components/Utils/Modal';

import ModifyCategoryForm from '@/Components/Category/ModifyCategoryForm';
import { getAllCategory, deleteCategory } from '@/api/modules/category';

import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import toast, { Toaster } from 'react-hot-toast';


export default function ListCategory({ refreshTrigger }) {
    const [categoriesList, setCategoriesList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showModalModifyCategory, setShowModalModifyCategory] = useState(false);
    const [showModalDeleteCategory, setShowModalDeleteCategory] = useState(false);


    useEffect(() => {
        setIsLoading(true);
        fetchCategories()
    }, [refreshTrigger]);

    const fetchCategories = () => {
        toast.promise(
            getAllCategory(),
            {
                loading: 'Chargement des catégories...',
                success: (response) => {
                    setCategoriesList(response.data);
                    setIsLoading(false);
                    return response.message;
                },
                error: (error) => {
                    setIsLoading(false);
                    return error.message;
                }
            }
        );
    }

    const ModifyCategory = (category) => {
        setSelectedCategory(category);
        setShowModalModifyCategory(true); 
    }

    const DeleteCategoryShow = (category) => {
        setSelectedCategory(category);
        setShowModalDeleteCategory(true);
    }

    const DeleteCategory = (e) => {
        e.preventDefault();
        
        toast.promise(
            deleteCategory(selectedCategory.id),
            {
                loading: 'Suppression en cours...',
                success: (response) => {
                    setCategoriesList(categoriesList.filter(cat => cat.id !== selectedCategory.id));
                    setShowModalDeleteCategory(false);
                    return response.message;
                },
                error: (error) => {
                    return error.message;
                }
            }
        );
    }

    return (
        <>
        <table className="table table-zebra w-full">
            <thead>
                <tr>
                    <th>Nom</th>
                    <th>Description</th>
                    <th>Date d'ajout</th>
                    <th>Date de modification</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {categoriesList.length > 0 ? (
                    categoriesList.map(category => (
                        <tr key={category.id}>
                            <td>{category.name}</td>
                            <td>{category.description}</td>
                            <td>{dayjs(category.created_at).format('DD/MM/YYYY HH:mm')}</td>
                            <td>{dayjs(category.updated_at).format('DD/MM/YYYY HH:mm')}</td>
                            <td className="flex gap-2 content-center items-center justify-center py-1">
                                <SecondaryButton onClick={() => ModifyCategory(category)}>Modifier</SecondaryButton>
                                <DangerButton onClick={() => DeleteCategoryShow(category)}>Supprimer</DangerButton>
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

        {showModalModifyCategory && (
            <ModifyCategoryForm
                category={selectedCategory}
                onClose={() => setShowModalModifyCategory(false)}
                onSuccess={() => fetchCategories()}
            />
        )}

        <Modal show={showModalDeleteCategory} onClose={() => setShowModalDeleteCategory(false)}>
            <form onSubmit={DeleteCategory} className="space-y-6">
                <h1 className="text-lg font-medium">
                    Supprimer une catégorie
                </h1>
                <p>Êtes-vous sûr de vouloir supprimer la catégorie "{selectedCategory?.name}" ?</p>
                <div className="flex gap-2 justify-end">
                    <SecondaryButton onClick={() => setShowModalDeleteCategory(false)}>Annuler</SecondaryButton>
                    <DangerButton type="submit">Supprimer</DangerButton>
                </div>
            </form>
        </Modal>
        <Toaster />
        </>
    );
}
